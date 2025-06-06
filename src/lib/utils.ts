import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export function getInitials(name: string) {
  if (!name.trim()) return "?"; // Default placeholder if the name is empty

  const words = name.split(" ").filter(word => word.length > 0);
  const initials = words.slice(0, 2).map(word => word[0].toUpperCase()).join("");

  return initials || "?";
}

export function isEnumValue<T extends Record<string, string>>(enumObj: T, value: string): value is T[keyof T] {
  return Object.values(enumObj).includes(value);
}

export const getFileUrl = (fileId: string) => `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
export const getFileDownloadUrl = (fileId: string) => `https://drive.google.com/uc?export=download&id=${fileId}`