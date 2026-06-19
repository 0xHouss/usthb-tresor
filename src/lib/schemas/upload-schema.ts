import { AcademicLevel, FileType, Semester } from "@prisma/client";
import { z } from "zod";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "../utils";

export const UploadFormSchema = z.object({
  major: z.string(),
  academicLevel: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(AcademicLevel, { message: 'Please select a valid option.' })),
  section: z.string(),
  group: z.string(),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Academic year must be in format YYYY/YYYY")
    .refine(y => +y.split("/")[1] === +y.split("/")[0] + 1, "The second year must be the first year plus one."),
  semester: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(Semester, { message: 'Please select a valid option.' })),
  module: z.string(),
  professor: z.string(),
  type: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(FileType, { message: 'Please select a valid option.' })),
  file: z
    .instanceof(File)
    .refine(f => f.size, 'Please provide a file.')
    .refine(file => file.type === 'application/pdf', 'Only PDF files are allowed.')
    .refine(file => file.size <= MAX_FILE_SIZE, `File must be ${MAX_FILE_SIZE_MB} MB or smaller.`)
})
