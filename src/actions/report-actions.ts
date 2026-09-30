"use server"

import { logEvent } from "@/dal/events"
import { closeReport as closeReportRecord, createReport, deleteReportedFile } from "@/dal/reports"
import { requireAdmin, requireModerator, requireUser } from "@/dal/session"
import { fileEventMetadata, reportEventMetadata, type FileEventMetadata } from "@/lib/events"
import { FormState, fromErrorToFormState, toFormState } from "@/lib/form-state"
import { deleteDriveFile } from "@/lib/google-drive"
import { ReportFormSchema } from "@/lib/schemas/report-schema"
import { revalidatePath } from "next/cache"

export async function reportFile(fileId: string, state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser()
    const { reason, details } = ReportFormSchema.parse({
      reason: formData.get("reason"),
      details: formData.get("details"),
    })

    const report = await createReport({ fileId, reporterId: user.id, reason, details })

    await logEvent({
      type: "ReportCreated",
      actorId: user.id,
      targetId: report.id,
      metadata: reportEventMetadata(report.fileMetadata as FileEventMetadata, reason),
    })

    revalidatePath("/admin/reports")

    return toFormState("SUCCESS", formData, {
      message: "Merci ! Votre signalement a été transmis à la modération.",
      reset: true,
    })
  } catch (error) {
    return fromErrorToFormState(error, formData)
  }
}

/** Closes an open report as Resolved or Dismissed. Moderator/Admin only. */
export async function closeReport(reportId: string, status: "Resolved" | "Dismissed") {
  const moderator = await requireModerator()

  const report = await closeReportRecord(reportId, status, moderator.id)
  if (!report) throw new Error("Report not found or already closed")

  await logEvent({
    type: status === "Resolved" ? "ReportResolved" : "ReportDismissed",
    actorId: moderator.id,
    targetId: report.id,
    metadata: reportEventMetadata(report.fileMetadata as FileEventMetadata, report.reason),
  })

  revalidatePath("/admin/reports")
}

/**
 * Deletes a reported file from the site and from Drive, resolving its open
 * reports. Admin only.
 */
export async function deleteFile(fileId: string) {
  const admin = await requireAdmin()

  const file = await deleteReportedFile(fileId, admin.id)

  await logEvent({
    type: "FileDeleted",
    actorId: admin.id,
    targetId: file.id,
    metadata: fileEventMetadata(file),
  })

  // After the DB delete, so the site never links to a missing Drive file.
  // A failure only leaves an orphan on Drive.
  try {
    await deleteDriveFile(file.driveId)
  } catch (error) {
    console.error(`Failed to delete Drive file ${file.driveId}:`, error)
  }

  revalidatePath("/admin/reports")
  revalidatePath(`/files/${file.id}`)
  revalidatePath("/browse")
  revalidatePath("/")
}
