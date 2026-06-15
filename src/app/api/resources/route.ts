import { NextResponse } from "next/server";
import { uploadResourceFile } from "@/lib/drive";
import { prisma } from "@/lib/prisma";
import { createResource } from "@/lib/resources";
import { getUserSession } from "@/lib/session";
import {
    ACCEPTED_MIME_TYPES,
    MAX_FILE_SIZE,
    resourceMetadataSchema,
} from "@/lib/validation";

export async function POST(req: Request) {
    const user = await getUserSession();
    if (!user?.email) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Le fichier dépasse 20 Mo" }, { status: 400 });
    }
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Format non supporté (PDF, PNG ou JPEG)" }, { status: 400 });
    }

    const fields: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
        if (key !== "file" && typeof value === "string") fields[key] = value;
    }

    const parsed = resourceMetadataSchema.safeParse(fields);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? "Données invalides" },
            { status: 400 }
        );
    }
    const meta = parsed.data;

    // Ensure the module belongs to the selected major, and the professor exists.
    const moduleRow = await prisma.module.findUnique({ where: { id: meta.moduleId } });
    if (!moduleRow || moduleRow.majorId !== meta.majorId) {
        return NextResponse.json({ error: "Module invalide" }, { status: 400 });
    }
    if (meta.professorId) {
        const professor = await prisma.professor.findUnique({ where: { id: meta.professorId } });
        if (!professor) {
            return NextResponse.json({ error: "Professeur invalide" }, { status: 400 });
        }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let driveFileId: string;
    try {
        driveFileId = await uploadResourceFile(
            buffer,
            file.name,
            file.type || "application/octet-stream"
        );
    } catch (err) {
        console.error("Drive upload failed", err);
        return NextResponse.json(
            { error: "Échec du téléversement vers le stockage" },
            { status: 502 }
        );
    }

    const resource = await createResource({
        ...meta,
        contributorEmail: user.email,
        driveFileId,
        fileName: file.name,
        mimeType: file.type || null,
        size: file.size,
    });

    return NextResponse.json({ id: resource.id }, { status: 201 });
}
