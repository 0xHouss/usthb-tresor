import { EventType, FileType } from "@prisma/client";
import { fileTypeLabels } from "./utils";

// Pure helpers for audit-log entries, shared by the writers (actions, auth hooks)
// and the admin log viewer.

export const eventTypeLabels: { [key in EventType]: string } = {
  [EventType.UserLogin]: "Connexion",
  [EventType.FileSubmitted]: "Fichier soumis",
  [EventType.FileApproved]: "Fichier approuvé",
  [EventType.FileRejected]: "Fichier rejeté",
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
  return parts.filter(Boolean).join(" · ");
}
