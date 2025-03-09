import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export function getInitials(name: string) {
    if (!name.trim()) return "?"; // Default placeholder if the name is empty

    const words = name.split(" ").filter(word => word.length > 0);
    const initials = words.slice(0, 2).map(word => word[0].toUpperCase()).join("");

    return initials || "?";
}