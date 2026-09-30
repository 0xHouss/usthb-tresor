import { EventType, FileType, ReportReason } from "@prisma/client";
import { reportReasonLabels } from "./reports";
import { fileTypeLabels } from "./utils";

// Pure helpers for audit-log entries, shared by the writers (actions, auth hooks)
// and the admin log viewer.

export const eventTypeLabels: { [key in EventType]: string } = {
  [EventType.UserLogin]: "Connexion",
  [EventType.FileSubmitted]: "Fichier soumis",
  [EventType.FileApproved]: "Fichier approuvé",
  [EventType.FileRejected]: "Fichier rejeté",
  [EventType.CommentCreated]: "Commentaire publié",
  [EventType.CommentDeleted]: "Commentaire supprimé",
  [EventType.ReportCreated]: "Signalement",
  [EventType.ReportResolved]: "Signalement résolu",
  [EventType.ReportDismissed]: "Signalement rejeté",
  [EventType.FileDeleted]: "Fichier supprimé",
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

/** One-line description of a file snapshot, e.g. "Exam · Algo · L1". */
export function describeFile(metadata: unknown): string {
  if (!isFileEventMetadata(metadata)) return "";

  return [fileTypeLabels[metadata.fileType] ?? metadata.fileType, metadata.module, metadata.academicLevel]
    .filter(Boolean)
    .join(" · ");
}

/** One-line human description of an event's target, or "" when there is nothing to show. */
export function describeEvent(metadata: unknown): string {
  if (!isFileEventMetadata(metadata)) return "";

  const parts = [describeFile(metadata)];
  if (metadata.anonymous) parts.push("anonyme");

  const v = metadata as Record<string, unknown>;
  if (typeof v.reason === "string" && v.reason in reportReasonLabels) {
    parts.push(reportReasonLabels[v.reason as ReportReason]);
  }
  if (typeof v.excerpt === "string") parts.push(`« ${v.excerpt} »`);
  if (v.moderated === true) parts.push("par la modération");

  return parts.filter(Boolean).join(" · ");
}
