import { ReportReason } from "@prisma/client";
import { z } from "zod";

export const REPORT_DETAILS_MAX_LENGTH = 1000;

export const ReportFormSchema = z
  .object({
    reason: z.enum(ReportReason, { message: "Veuillez choisir un motif." }),
    details: z
      .string()
      .trim()
      .max(REPORT_DETAILS_MAX_LENGTH, `Les détails ne doivent pas dépasser ${REPORT_DETAILS_MAX_LENGTH} caractères.`)
      .nullish()
      .transform(details => details || undefined),
  })
  .refine(report => report.reason !== ReportReason.Other || report.details, {
    message: "Veuillez décrire le problème.",
    path: ["details"],
  });
