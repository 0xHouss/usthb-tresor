import "server-only";

import { requireModerator } from "@/dal/session";
import { AppError } from "@/lib/errors";
import { fileEventMetadata } from "@/lib/events";
import { prisma } from "@/lib/prisma";
import { Prisma, ReportReason, ReportStatus } from "@prisma/client";

export const REPORTS_PAGE_SIZE = 25;

/**
 * Files a problem report on a published file. Refuses a second open report
 * from the same user on the same file.
 */
export async function createReport(data: {
  fileId: string;
  reporterId: string;
  reason: ReportReason;
  details?: string;
}) {
  const file = await prisma.file.findUnique({ where: { id: data.fileId } });
  if (!file) throw new AppError("fileGone");

  const existing = await prisma.report.findFirst({
    where: { fileId: data.fileId, reporterId: data.reporterId, status: ReportStatus.Open },
    select: { id: true },
  });
  if (existing) throw new AppError("alreadyReported");

  return prisma.report.create({
    data: { ...data, fileMetadata: fileEventMetadata({ ...file, anonymous: false }) },
  });
}

/** Paginated reports, open ones first, then newest first. Moderator/Admin only. */
export async function getReports({ status, page }: { status?: ReportStatus; page: number }) {
  await requireModerator();

  const where: Prisma.ReportWhereInput = { status };

  const [reports, totalCount] = await Promise.all([
    prisma.report.findMany({
      where,
      // Postgres sorts enums in declaration order, so Open comes first.
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: REPORTS_PAGE_SIZE,
      skip: (page - 1) * REPORTS_PAGE_SIZE,
      include: {
        reporter: { select: { name: true, email: true } },
        resolvedBy: { select: { name: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return { reports, totalCount };
}

/**
 * Closes an open report as Resolved or Dismissed. Returns the report, or null
 * if it doesn't exist or was already closed.
 */
export async function closeReport(id: string, status: Exclude<ReportStatus, "Open">, handlerId: string) {
  const { count } = await prisma.report.updateMany({
    where: { id, status: ReportStatus.Open },
    data: { status, resolvedById: handlerId, resolvedAt: new Date() },
  });
  return count ? prisma.report.findUnique({ where: { id } }) : null;
}

/**
 * Deletes a published file and resolves its open reports, atomically.
 * Comments cascade; reports keep their history with a null file.
 * Returns the deleted file. The caller removes it from Drive.
 */
export function deleteReportedFile(fileId: string, handlerId: string) {
  return prisma.$transaction(async (tx) => {
    await tx.report.updateMany({
      where: { fileId, status: ReportStatus.Open },
      data: { status: ReportStatus.Resolved, resolvedById: handlerId, resolvedAt: new Date() },
    });
    return tx.file.delete({ where: { id: fileId } });
  });
}
