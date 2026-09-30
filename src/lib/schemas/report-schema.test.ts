import { describe, expect, it } from "vitest";
import { REPORT_DETAILS_MAX_LENGTH, ReportFormSchema } from "./report-schema";

describe("ReportFormSchema", () => {
  it("accepts a reason without details", () => {
    expect(ReportFormSchema.parse({ reason: "CorruptedFile", details: "" })).toEqual({
      reason: "CorruptedFile",
      details: undefined,
    });
    expect(ReportFormSchema.parse({ reason: "Copyright", details: null }).details).toBeUndefined();
  });

  it("trims details", () => {
    expect(ReportFormSchema.parse({ reason: "WrongMetadata", details: "  Mauvais module  " }).details).toBe(
      "Mauvais module"
    );
  });

  it("rejects a missing or unknown reason", () => {
    expect(ReportFormSchema.safeParse({ reason: null }).success).toBe(false);
    expect(ReportFormSchema.safeParse({ reason: "Spam" }).success).toBe(false);
  });

  it("requires details for the Other reason", () => {
    const result = ReportFormSchema.safeParse({ reason: "Other", details: "   " });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.details).toEqual(["detailsRequired"]);
    expect(ReportFormSchema.safeParse({ reason: "Other", details: "Pages manquantes" }).success).toBe(true);
  });

  it("enforces the details maximum length", () => {
    const details = "a".repeat(REPORT_DETAILS_MAX_LENGTH + 1);
    expect(ReportFormSchema.safeParse({ reason: "Copyright", details }).success).toBe(false);
  });
});
