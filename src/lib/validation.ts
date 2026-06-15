import { z } from "zod";
import type {
    AcademicLevel,
    ResourceType,
    Semester,
} from "@/generated/prisma/client";
import { ACADEMIC_LEVELS, RESOURCE_TYPES, SEMESTERS } from "@/lib/labels";

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
export const ACCEPTED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"];

const currentYear = new Date().getFullYear();

const optionalText = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .optional()
        .transform((v) => (v ? v : undefined));

/** Metadata fields shared by the client form and the server upload route. */
export const resourceMetadataSchema = z.object({
    type: z.enum(RESOURCE_TYPES as [ResourceType, ...ResourceType[]]),
    level: z.enum(ACADEMIC_LEVELS as [AcademicLevel, ...AcademicLevel[]]),
    semester: z.enum(SEMESTERS as [Semester, ...Semester[]]),
    majorId: z.string().min(1, "Sélectionnez une filière"),
    moduleId: z.string().min(1, "Sélectionnez un module"),
    professorId: optionalText(64),
    year: z.coerce
        .number()
        .int()
        .min(1990, "Année invalide")
        .max(currentYear + 1, "Année invalide"),
    title: optionalText(200),
    section: optionalText(50),
    group: optionalText(50),
    chapter: optionalText(100),
});

export type ResourceMetadataInput = z.input<typeof resourceMetadataSchema>;
export type ResourceMetadata = z.output<typeof resourceMetadataSchema>;
