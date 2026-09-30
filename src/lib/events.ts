import { FileType, ReportReason } from "@prisma/client";

// Pure helpers for audit-log entries, shared by the writers (actions, auth hooks)
// and the admin log viewer.

/** Translated labels used to describe log entries in the viewer's locale. */
export type DescribeLabels = {
  fileType: (type: FileType) => string;
  reason: (reason: ReportReason) => string;
  anonymous: string;
  moderated: string;
};

/** Snapshot of a file's identifying details, stored in an event's metadata. */
export type FileEventMetadata = {
  fileType: FileType;
  module: string;
  academicLevel: string;
  anonymous?: boolean;
};

export function fileEventMetadata(file: {
  type: FileType;
  moduleName: string;
  academicLevel: string;
  anonymous?: boolean;
}): FileEventMetadata {
  return {
    fileType: file.type,
    module: file.moduleName,
    academicLevel: file.academicLevel,
    ...(file.anonymous ? { anonymous: true } : {}),
  };
}

const EXCERPT_LENGTH = 80;

/** Shortens text to a one-line excerpt for log entries. */
export function excerpt(text: string, max = EXCERPT_LENGTH) {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max - 1).trimEnd()}…` : oneLine;
}

/** Metadata of a comment event: the commented file plus an excerpt of the comment. */
export type CommentEventMetadata = Omit<FileEventMetadata, "anonymous"> & {
  excerpt: string;
  // Set when a moderator deleted someone else's comment.
  moderated?: boolean;
};

export function commentEventMetadata(
  file: { type: FileType; moduleName: string; academicLevel: string },
  content: string,
  { moderated = false } = {}
): CommentEventMetadata {
  return {
    fileType: file.type,
    module: file.moduleName,
    academicLevel: file.academicLevel,
    excerpt: excerpt(content),
    ...(moderated ? { moderated: true } : {}),
  };
}

/** Metadata of a report event: the reported file's snapshot plus the report reason. */
export type ReportEventMetadata = FileEventMetadata & { reason: ReportReason };

export function reportEventMetadata(fileMetadata: FileEventMetadata, reason: ReportReason): ReportEventMetadata {
  return { ...fileMetadata, reason };
}

export function isFileEventMetadata(value: unknown): value is FileEventMetadata {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.fileType === "string" && typeof v.module === "string";
}

const isOneOf = <T extends string>(values: Record<string, T>, value: unknown): value is T =>
  Object.values(values).includes(value as T);

/** One-line description of a file snapshot, e.g. "Exam · Algo · L1". */
export function describeFile(metadata: unknown, labels: Pick<DescribeLabels, "fileType">): string {
  if (!isFileEventMetadata(metadata)) return "";

  const fileType = isOneOf(FileType, metadata.fileType) ? labels.fileType(metadata.fileType) : metadata.fileType;
  return [fileType, metadata.module, metadata.academicLevel].filter(Boolean).join(" · ");
}

/** One-line human description of an event's target, or "" when there is nothing to show. */
export function describeEvent(metadata: unknown, labels: DescribeLabels): string {
  if (!isFileEventMetadata(metadata)) return "";

  const parts = [describeFile(metadata, labels)];
  if (metadata.anonymous) parts.push(labels.anonymous);

  const v = metadata as Record<string, unknown>;
  if (isOneOf(ReportReason, v.reason)) parts.push(labels.reason(v.reason));
  if (typeof v.excerpt === "string") parts.push(`« ${v.excerpt} »`);
  if (v.moderated === true) parts.push(labels.moderated);

  return parts.filter(Boolean).join(" · ");
}
