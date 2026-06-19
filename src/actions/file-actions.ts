"use server"

import { signOut } from "@/lib/auth"
import { requireModerator, requireUser } from "@/dal/session"
import { getUserByEmail } from "@/dal/users"
import { approvePendingFile, createPendingFile, rejectPendingFile } from "@/dal/pending-files"
import { FormState, fromErrorToFormState, toFormState } from "@/lib/form-state"
import { uploadPublicFile } from "@/lib/google-drive"
import { UploadFormSchema } from "@/lib/schemas/upload-schema"
import { revalidatePath } from "next/cache"

export async function uploadFile(state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();

    const dbUser = await getUserByEmail(user.email);
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${metadata.type} ${metadata.module} ${metadata.major} ${metadata.academicLevel} S-${metadata.section}${metadata.group ? `G-${metadata.group}` : ''} ${metadata.academicYear}.pdf`;

    // Upload to Drive and make it public (the app's status flag controls listing, not access).
    const driveId = await uploadPublicFile(buffer, fileName);

    await createPendingFile({
      driveId,
      uploaderEmail: user.email,
      type: metadata.type,
      academicLevel: metadata.academicLevel,
      academicYear: +metadata.academicYear.split("/")[0],
      semester: metadata.semester,
      section: metadata.section,
      group: metadata.group,
      majorName: metadata.major,
      moduleName: metadata.module,
      professorFullName: metadata.professor,
    });

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

export async function approveFile(fileId: string) {
  await requireModerator()

  try {
    await approvePendingFile(fileId)

    revalidatePath("/submissions")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to approve file:", error)
    throw new Error("Failed to approve file")
  }
}

export async function rejectFile(fileId: string) {
  await requireModerator()

  try {
    await rejectPendingFile(fileId)

    revalidatePath("/submissions")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to reject file:", error)
    throw new Error("Failed to reject file")
  }
}
