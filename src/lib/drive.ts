import { Readable } from "node:stream";
import { google, type drive_v3 } from "googleapis";
import ENV from "@/lib/env";

const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive"];

function getDrive(): { drive: drive_v3.Drive; folderId: string } {
    if (!ENV.GOOGLE_SERVICE_ACCOUNT_JSON || !ENV.GOOGLE_DRIVE_FOLDER_ID) {
        throw new Error(
            "Google Drive is not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON and GOOGLE_DRIVE_FOLDER_ID."
        );
    }

    let credentials: Record<string, unknown>;
    try {
        credentials = JSON.parse(ENV.GOOGLE_SERVICE_ACCOUNT_JSON);
    } catch {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
    }

    const auth = new google.auth.GoogleAuth({ credentials, scopes: DRIVE_SCOPES });
    const drive = google.drive({ version: "v3", auth });
    return { drive, folderId: ENV.GOOGLE_DRIVE_FOLDER_ID };
}

/** Uploads a file buffer into the configured Drive folder and returns its file id. */
export async function uploadResourceFile(
    buffer: Buffer,
    name: string,
    mimeType: string
): Promise<string> {
    const { drive, folderId } = getDrive();
    const res = await drive.files.create({
        requestBody: { name, parents: [folderId] },
        media: { mimeType, body: Readable.from(buffer) },
        fields: "id",
    });
    if (!res.data.id) throw new Error("Drive upload failed: no file id returned.");
    return res.data.id;
}

/** Streams a Drive file's contents for proxying to the client. */
export async function getResourceFileStream(driveFileId: string): Promise<{
    stream: Readable;
    mimeType: string;
    size?: number;
}> {
    const { drive } = getDrive();
    const meta = await drive.files.get({
        fileId: driveFileId,
        fields: "mimeType,size",
    });
    const res = await drive.files.get(
        { fileId: driveFileId, alt: "media" },
        { responseType: "stream" }
    );
    return {
        stream: res.data as unknown as Readable,
        mimeType: meta.data.mimeType ?? "application/octet-stream",
        size: meta.data.size ? Number(meta.data.size) : undefined,
    };
}

/** Permanently removes a file from Drive (used when cleaning up rejected uploads). */
export async function deleteResourceFile(driveFileId: string): Promise<void> {
    const { drive } = getDrive();
    await drive.files.delete({ fileId: driveFileId });
}
