"use server";

import { auth, signOut } from "@/lib/auth";
import ENV from "@/lib/env";
import { FormState, fromErrorToFormState, toFormState } from "@/lib/form-state";
import { drive } from "@/lib/google-drive";
import { prisma } from "@/lib/prisma";
import { AcademicLevel, FileType, Semester } from "@prisma/client";
import fs from "fs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const UploadFormSchema = z.object({
  major: z.string(),
  academicLevel: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(AcademicLevel, { message: 'Please select a valid option.' })),
  section: z.string(),
  group: z.string(),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Academic year must be in format YYYY/YYYY")
    .refine(y => +y.split("/")[1] === +y.split("/")[0] + 1, "The second year must be the first year plus one."),
  semester: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(Semester, { message: 'Please select a valid option.' })),
  module: z.string(),
  professor: z.string(),
  type: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(FileType, { message: 'Please select a valid option.' })),
  file: z
    .instanceof(File)
    .refine(f => f.size, 'Please provide a file.')
    .refine(file => file.type === 'application/pdf', 'Only PDF files are allowed.')
})

export async function uploadFile(state: FormState, formData: FormData): Promise<FormState> {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.email)
      throw new Error('Unauthorized access.');

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) signOut({ redirectTo: '/login' });

    const { file, ...metadata } = UploadFormSchema.parse({
      major: formData.get('major'),
      academicLevel: formData.get('academicLevel'),
      section: formData.get('section'),
      group: formData.get('group'),
      academicYear: formData.get('academicYear'),
      semester: formData.get('semester'),
      module: formData.get('module'),
      professor: formData.get('professor'),
      type: formData.get('type'),
      file: formData.get('file'),
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = `/tmp/${file.name}`;
    fs.writeFileSync(tempPath, buffer);

    // Upload file to Google Drive
    const fileUploadResponse = await drive.files.create({
      requestBody: {
        name: `${metadata.type} ${metadata.module} ${metadata.major} ${metadata.academicLevel} S-${metadata.section}${metadata.group ? `G-${metadata.group}` : ''} ${metadata.academicYear}.pdf`,
        parents: [ENV.GOOGLE_DRIVE_FOLDER_ID],
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

    await prisma.file.create({
      data: {
        driveId: fileId,
        uploadedBy: { connect: { email: user.email } },
        academicLevel: metadata.academicLevel,
        major: {
          connectOrCreate: {
            where: { name: metadata.major },
            create: { name: metadata.major },
          }
        },
        section: metadata.section,
        group: metadata.group,
        academicYear: +metadata.academicYear.split("/")[0],
        semester: metadata.semester,
        module: {
          connectOrCreate: {
            where: { name: metadata.module },
            create: { name: metadata.module },
          }
        },
        professor: {
          connectOrCreate: {
            where: { fullName: metadata.professor },
            create: { fullName: metadata.professor },
          }
        },
        type: metadata.type,
      }
    })

    fs.unlinkSync(tempPath);
    revalidatePath("/contribute");

    return toFormState('SUCCESS', formData, {
      message: 'File uploaded successfully!',
      reset: true,
    });
  } catch (error) {
    console.error("File upload error:", error);

    return fromErrorToFormState(error, formData)
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
