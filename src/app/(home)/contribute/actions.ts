"use server";

import { drive } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/session";
import { FormState, fromErrorToFormState, toFormState } from "@/lib/to-form-state";
import fs from "fs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UploadFormSchema = z.object({
    speciality: z.string(),
    academicYear: z.string(),
    section: z.string(),
    group: z.string(),
    schoolYear: z.string(),
    semester: z.coerce.number(),
    module: z.string(),
    professor: z.string(),
    type: z.string(),
})

export async function uploadFile(state: FormState, formData: FormData): Promise<FormState> {
    try {
        const user = await getUserSession();
        if (!user)
            throw new Error('Unauthorized access.');

        const file = formData.get('file') as File;
        if (!file)
            throw new Error('No file uploaded.');

        if (file.type !== 'application/pdf')
            throw new Error('Only PDF files are allowed.');

        const metadata = UploadFormSchema.parse({
            speciality: formData.get('speciality'),
            academicYear: formData.get('academicYear'),
            section: formData.get('section'),
            group: formData.get('group'),
            schoolYear: formData.get('schoolYear'),
            semester: formData.get('semester'),
            module: formData.get('module'),
            professor: formData.get('professor'),
            type: formData.get('type'),
        });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const tempPath = `/tmp/${file.name}`;
        fs.writeFileSync(tempPath, buffer);

        // Upload file to Google Drive
        const fileUploadResponse = await drive.files.create({
            requestBody: {
                name: `${metadata.type} - ${metadata.module} - ${metadata.speciality} - ${metadata.academicYear} - ${metadata.semester} - ${metadata.section} - ${metadata.group} - ${metadata.schoolYear}.pdf`,
                parents: ['1KYAYbyYJhCtjhTCz7j3XUr2UBG0uNuw4']
            },
            media: {
                mimeType: "application/pdf",
                body: fs.createReadStream(tempPath),
            },
            fields: "id",
        });

        // Get the uploaded file ID
        const fileId = fileUploadResponse.data.id;
        if (!fileId) throw new Error("File upload failed.");

        // Make file publicly accessible
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        const fileUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

        await prisma.file.create({
            data: {
                id: fileId,
                url: fileUrl,
                uploadedBy: { connect: { email: user.email! } },
                ...metadata,
                status: 'APPROVED', // TODO: Change to PENDING
            }
        })

        fs.unlinkSync(tempPath);
        revalidatePath("/contribute");

        return toFormState('SUCCESS', {
            message: 'File uploaded successfully!',
            reset: true,
        });
    } catch (error) {
        console.error(error);
        return fromErrorToFormState(error)
    }
}

export async function createPublicFolder(folderName: string) {
    try {
        // Create the folder
        const folder = await drive.files.create({
            requestBody: {
                name: folderName,
                mimeType: "application/vnd.google-apps.folder",
            },
            fields: "id",
        });

        const folderId = folder.data.id;
        if (!folderId) throw new Error("Failed to create folder.");

        // Make the folder public
        await drive.permissions.create({
            fileId: folderId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });

        // Get and return the folder's link
        const { data } = await drive.files.get({
            fileId: folderId,
            fields: "webViewLink",
        });

        console.log(data.webViewLink);

        return { success: "Folder created successfully!", link: data.webViewLink };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create folder." };
    }
}
