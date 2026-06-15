import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getResourceFileStream } from "@/lib/drive";
import { getResourceById } from "@/lib/resources";
import { getUserSession } from "@/lib/session";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const resource = await getResourceById(id);
    if (!resource) {
        return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    if (resource.status !== "APPROVED") {
        const user = await getUserSession();
        const canModerate = user?.role === "MODERATOR" || user?.role === "ADMIN";
        if (!canModerate) {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }
    }

    let file: Awaited<ReturnType<typeof getResourceFileStream>>;
    try {
        file = await getResourceFileStream(resource.driveFileId);
    } catch (err) {
        console.error("Drive download failed", err);
        return NextResponse.json({ error: "Fichier indisponible" }, { status: 502 });
    }

    const safeName = resource.fileName.replace(/["\\\r\n]/g, "_");
    const headers = new Headers();
    headers.set("Content-Type", resource.mimeType ?? file.mimeType);
    headers.set("Content-Disposition", `inline; filename="${safeName}"`);
    if (file.size) headers.set("Content-Length", String(file.size));

    return new Response(Readable.toWeb(file.stream) as ReadableStream, { headers });
}
