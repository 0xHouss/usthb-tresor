import "server-only";

import { requireModerator } from "@/dal/session";
import { prisma } from "@/lib/prisma";
import { type DailyCount, fillDays, lastDays, startOfDay } from "@/lib/stats";
import { FileStatus, Prisma, ReportStatus } from "@prisma/client";

// Admin dashboard figures. Moderator/Admin only. Anonymous uploads are counted
// and attributed here, since only staff see it.

export const ACTIVITY_DAYS = 30;

export async function getDashboardStats() {
  await requireModerator();

  const since = startOfDay(lastDays(ACTIVITY_DAYS)[0]);

  const [files, pendingFiles, openReports, users, recentDownloads, comments] = await Promise.all([
    prisma.file.count(),
    prisma.pendingFile.count({ where: { status: FileStatus.Pending } }),
    prisma.report.count({ where: { status: ReportStatus.Open } }),
    prisma.user.count(),
    prisma.fileDownload.count({ where: { createdAt: { gte: since } } }),
    prisma.comment.count(),
  ]);

  return { files, pendingFiles, openReports, users, recentDownloads, comments };
}

// Counts rows per Algiers calendar day since `since`. Timestamps are stored as UTC.
function countPerDay(table: "FileDownload" | "PendingFile", column: "createdAt" | "uploadedAt", since: Date) {
  const localDay = Prisma.sql`to_char((${Prisma.raw(`"${column}"`)} AT TIME ZONE 'UTC') AT TIME ZONE 'Africa/Algiers', 'YYYY-MM-DD')`;
  return prisma.$queryRaw<DailyCount[]>`
    SELECT ${localDay} AS day, count(*)::int AS count
    FROM ${Prisma.raw(`"${table}"`)}
    WHERE ${Prisma.raw(`"${column}"`)} >= ${since}
    GROUP BY day
  `;
}

/** Downloads and submissions per day over the last ACTIVITY_DAYS days, oldest first. */
export async function getDailyActivity() {
  await requireModerator();

  const days = lastDays(ACTIVITY_DAYS);
  const since = startOfDay(days[0]);

  const [downloads, submissions] = await Promise.all([
    countPerDay("FileDownload", "createdAt", since),
    countPerDay("PendingFile", "uploadedAt", since),
  ]);

  return { downloads: fillDays(days, downloads), submissions: fillDays(days, submissions) };
}

/** The most downloaded files of all time. */
export async function getTopDownloadedFiles(take = 5) {
  await requireModerator();

  const top = await prisma.fileDownload.groupBy({
    by: ["fileId"],
    _count: { fileId: true },
    orderBy: { _count: { fileId: "desc" } },
    take,
  });

  const files = await prisma.file.findMany({
    where: { id: { in: top.map(row => row.fileId) } },
    select: { id: true, type: true, moduleName: true, academicLevel: true },
  });
  const byId = new Map(files.map(file => [file.id, file]));

  return top.flatMap(row => {
    const file = byId.get(row.fileId);
    return file ? [{ ...file, downloads: row._count.fileId }] : [];
  });
}

/** Users with the most approved files, anonymous uploads included. */
export async function getTopContributors(take = 5) {
  await requireModerator();

  const top = await prisma.file.groupBy({
    by: ["uploadedByEmail"],
    _count: { uploadedByEmail: true },
    orderBy: { _count: { uploadedByEmail: "desc" } },
    take,
  });

  const users = await prisma.user.findMany({
    where: { email: { in: top.map(row => row.uploadedByEmail) } },
    select: { id: true, name: true, email: true, image: true },
  });
  const byEmail = new Map(users.map(user => [user.email, user]));

  return top.flatMap(row => {
    const user = byEmail.get(row.uploadedByEmail);
    return user ? [{ ...user, files: row._count.uploadedByEmail }] : [];
  });
}
