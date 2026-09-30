import { AcademicLevel, FileType, Language, Semester } from "@prisma/client";
import { z } from "zod";
import { MAX_FILE_SIZE } from "../utils";

// Messages are keys under `errors` in the message catalogues; actions translate them.

/** A required Select: empty means "not chosen", anything else must be a value of `values`. */
const requiredChoice = <T extends Record<string, string>>(values: T) =>
  z.string({ message: 'selectOption' }).min(1, 'selectOption').pipe(z.enum(values, { message: 'invalidOption' }))

export const UploadFormSchema = z.object({
  major: z.string(),
  academicLevel: requiredChoice(AcademicLevel),
  section: z.string(),
  group: z.string(),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, 'academicYearFormat')
    .refine(y => +y.split("/")[1] === +y.split("/")[0] + 1, 'academicYearConsecutive'),
  semester: requiredChoice(Semester),
  module: z.string(),
  professor: z.string(),
  type: requiredChoice(FileType),
  language: requiredChoice(Language),
  // Checkbox: FormData holds "on" when checked and nothing when unchecked.
  anonymous: z.literal('on').nullish().transform(v => v === 'on'),
  file: z
    .instanceof(File)
    .refine(f => f.size, 'fileRequired')
    .refine(file => file.type === 'application/pdf', 'pdfOnly')
    .refine(file => file.size <= MAX_FILE_SIZE, 'fileTooLarge')
})
