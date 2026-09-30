"use server"

import { logEvent } from "@/dal/events"
import { requireModerator, requireUser } from "@/dal/session"
import { approvePendingFile, createPendingFile, rejectPendingFile } from "@/dal/pending-files"
import { fileEventMetadata } from "@/lib/events"
import { getErrorTranslator } from "@/lib/action-errors"
import { FormState, fromErrorToFormState, toFormState } from "@/lib/form-state"
import { uploadPublicFile } from "@/lib/google-drive"
import { revalidateLocalized } from "@/lib/revalidate"
import { UploadFormSchema } from "@/lib/schemas/upload-schema"
import { getTranslations } from "next-intl/server"

export async function uploadFile(state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser();

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
      language: formData.get('language'),
      anonymous: formData.get('anonymous'),
      file: formData.get('file'),
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${metadata.type} ${metadata.module} ${metadata.major} ${metadata.academicLevel} S-${metadata.section}${metadata.group ? `G-${metadata.group}` : ''} ${metadata.academicYear}.pdf`;

    // Upload to Drive and make it public (the app's status flag controls listing, not access).
    const driveId = await uploadPublicFile(buffer, fileName);

    const pendingFile = await createPendingFile({
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
      language: metadata.language,
      anonymous: metadata.anonymous,
    });

    await logEvent({
      type: "FileSubmitted",
      actorId: user.id,
      targetId: pendingFile.id,
      metadata: fileEventMetadata(pendingFile),
    });

    revalidateLocalized("/contribute");

    const t = await getTranslations("contribute");
    return toFormState('SUCCESS', formData, {
      message: t("success"),
      reset: true,
    });
  } catch (error) {
    console.error("File upload error:", error);

    return fromErrorToFormState(error, formData, await getErrorTranslator())
  }
}

export async function approveFile(fileId: string) {
  const moderator = await requireModerator()

  try {
    const file = await approvePendingFile(fileId)
    await logEvent({
      type: "FileApproved",
      actorId: moderator.id,
      targetId: file.id,
      metadata: fileEventMetadata(file),
    })

    revalidateLocalized("/submissions")
    revalidateLocalized("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to approve file:", error)
    throw new Error("Failed to approve file")
  }
}

export async function rejectFile(fileId: string) {
  const moderator = await requireModerator()

  try {
    const pendingFile = await rejectPendingFile(fileId)
    await logEvent({
      type: "FileRejected",
      actorId: moderator.id,
      targetId: pendingFile.id,
      metadata: fileEventMetadata(pendingFile),
    })

    revalidateLocalized("/submissions")
    revalidateLocalized("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to reject file:", error)
    throw new Error("Failed to reject file")
  }
}
