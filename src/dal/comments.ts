import "server-only";

import { AppError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

// Comments on published files. Reads are public; callers authorize writes.

const fileSnapshot = { select: { type: true, moduleName: true, academicLevel: true } } as const;

/** A file's comments, oldest first, with each author's public profile. */
export function getComments(fileId: string) {
  return prisma.comment.findMany({
    where: { fileId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      createdAt: true,
      authorId: true,
      author: { select: { name: true, image: true } },
    },
  });
}

export type FileComment = Awaited<ReturnType<typeof getComments>>[number];

/** Creates a comment. Returns it with a snapshot of the commented file. */
export async function createComment(data: { fileId: string; authorId: string; content: string }) {
  const file = await prisma.file.findUnique({ where: { id: data.fileId }, select: { id: true } });
  if (!file) throw new AppError("fileGone");

  return prisma.comment.create({ data, include: { file: fileSnapshot } });
}

/** A comment with a snapshot of its file, or null if it doesn't exist. */
export function getComment(id: string) {
  return prisma.comment.findUnique({ where: { id }, include: { file: fileSnapshot } });
}

export function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
