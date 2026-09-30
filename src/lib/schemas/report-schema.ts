import { ReportReason } from "@prisma/client";
import { z } from "zod";

export const REPORT_DETAILS_MAX_LENGTH = 1000;

// Messages are keys under `errors` in the message catalogues; actions translate them.
export const ReportFormSchema = z
  .object({
    reason: z.enum(ReportReason, { message: "reasonRequired" }),
    details: z
      .string()
      .trim()
      .max(REPORT_DETAILS_MAX_LENGTH, "detailsTooLong")
      .nullish()
      .transform(details => details || undefined),
  })
  .refine(report => report.reason !== ReportReason.Other || report.details, {
    message: "detailsRequired",
    path: ["details"],
  });
