import { FileType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export function getInitials(name: string) {
  if (!name.trim()) return "?"; // Default placeholder if the name is empty

  const words = name.split(" ").filter(word => word.length > 0);
  const initials = words.slice(0, 2).map(word => word[0].toUpperCase()).join("");

  return initials || "?";
}

export function isEnumValue<T extends Record<string, string>>(enumObj: T, value: string | null | undefined): value is T[keyof T] {
  return value != null && Object.values(enumObj).includes(value);
}

export const getFileUrl = (driveId: string) => `https://drive.google.com/file/d/${driveId}/view`
// `confirm=t` skips Google's "can't scan for viruses" interstitial on larger files.
export const getFileDownloadUrl = (driveId: string) =>
  `https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`

export const fileTypeLabels: { [key in FileType]: string } = {
  [FileType.Lecture]: "Lecture",
  [FileType.DW_Worksheet]: "DW Worksheet",
  [FileType.PW_Worksheet]: "PW Worksheet",
  [FileType.Interrogation]: "Interrogation",
  [FileType.Exam]: "Exam",
  [FileType.PW_Exam]: "PW Exam",
};

export function getCurrentAcademicYear() {
  const now = new Date()

  // If it's before September, the current academic year is the previous year
  return now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();
}

export const PAGE_SIZE = 24;

// Max upload size for contributed files (lectures, worksheets, exams are PDFs).
export const MAX_FILE_SIZE_MB = 25;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;