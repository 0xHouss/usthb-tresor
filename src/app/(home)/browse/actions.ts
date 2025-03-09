"use server";

import { drive } from "@/lib/google-drive";


export async function getDriveFiles() {
    try {
        const response = await drive.files.list({
            q: "'DRIVE_FOLDER_ID' in parents",
            pageSize: 50,
            fields: "files(id, name, mimeType, webViewLink, webContentLink)",
        });

        return response.data.files || [];
    } catch (error) {
        console.error("Failed to fetch files:", error);
        return [];
    }
}

