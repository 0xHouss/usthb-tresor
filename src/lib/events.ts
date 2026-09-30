import { EventType, FileType } from "@prisma/client";
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

function isFileEventMetadata(value: unknown): value is FileEventMetadata {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.fileType === "string" && typeof v.module === "string";
}

/** One-line human description of an event's target, or "" when there is nothing to show. */
export function describeEvent(metadata: unknown): string {
  if (!isFileEventMetadata(metadata)) return "";

  const parts = [
    fileTypeLabels[metadata.fileType] ?? metadata.fileType,
    metadata.module,
    metadata.academicLevel,
  ];
  if (metadata.anonymous) parts.push("anonyme");

  const v = metadata as Record<string, unknown>;
  if (typeof v.excerpt === "string") parts.push(`« ${v.excerpt} »`);
  if (v.moderated === true) parts.push("par la modération");

  return parts.filter(Boolean).join(" · ");
}
