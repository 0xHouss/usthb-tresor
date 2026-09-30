import { describe, expect, it } from "vitest";
import { MAX_FILE_SIZE } from "../utils";
import { UploadFormSchema } from "./upload-schema";

function makeFile({
  type = "application/pdf",
  size,
}: { type?: string; size?: number } = {}): File {
  const file = new File(["pdf-bytes"], "doc.pdf", { type });
  if (size !== undefined) {
    Object.defineProperty(file, "size", { value: size });
  }
  return file;
}

const validInput = () => ({
  major: "Computer Science",
  academicLevel: "L1",
  section: "A",
  group: "1",
  academicYear: "2023/2024",
  semester: "S1",
  module: "Algorithms",
  professor: "Dr. Dupont",
  type: "Exam",
  language: "French",
  file: makeFile(),
});

// Returns the fieldErrors for a given field after a failed parse.
const errorsFor = (input: unknown, field: string) => {
  const result = UploadFormSchema.safeParse(input);
  expect(result.success).toBe(false);
  if (result.success) return [];
  const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
  return fieldErrors[field] ?? [];
};

describe("UploadFormSchema", () => {
  it("accepts a fully valid submission", () => {
    expect(UploadFormSchema.safeParse(validInput()).success).toBe(true);
  });

  describe("academicYear", () => {
    it("rejects a wrong format", () => {
      expect(errorsFor({ ...validInput(), academicYear: "2023-2024" }, "academicYear")).toContain(
        "academicYearFormat"
      );
    });

    it("rejects when the second year is not first + 1", () => {
      expect(errorsFor({ ...validInput(), academicYear: "2023/2025" }, "academicYear")).toContain(
        "academicYearConsecutive"
      );
    });

    it("rejects equal years", () => {
      expect(errorsFor({ ...validInput(), academicYear: "2023/2023" }, "academicYear")).toContain(
        "academicYearConsecutive"
      );
    });
  });

  describe("file", () => {
    it("rejects a non-PDF file", () => {
      expect(errorsFor({ ...validInput(), file: makeFile({ type: "image/png" }) }, "file")).toContain(
        "pdfOnly"
      );
    });

    it("rejects an empty file", () => {
      expect(errorsFor({ ...validInput(), file: makeFile({ size: 0 }) }, "file")).toContain(
        "fileRequired"
      );
    });

    it("rejects a file over the size limit", () => {
      const tooBig = makeFile({ size: MAX_FILE_SIZE + 1 });
      expect(errorsFor({ ...validInput(), file: tooBig }, "file")).toContain(
        "fileTooLarge"
      );
    });

    it("accepts a file exactly at the size limit", () => {
      const atLimit = makeFile({ size: MAX_FILE_SIZE });
      expect(UploadFormSchema.safeParse({ ...validInput(), file: atLimit }).success).toBe(true);
    });

    it("rejects a value that is not a File", () => {
      expect(errorsFor({ ...validInput(), file: "not-a-file" }, "file").length).toBeGreaterThan(0);
    });
  });

  describe("anonymous", () => {
    it("is true when the checkbox is checked", () => {
      const result = UploadFormSchema.parse({ ...validInput(), anonymous: "on" });
      expect(result.anonymous).toBe(true);
    });

    it("is false when the checkbox is unchecked", () => {
      expect(UploadFormSchema.parse({ ...validInput(), anonymous: null }).anonymous).toBe(false);
      expect(UploadFormSchema.parse(validInput()).anonymous).toBe(false);
    });

    it("rejects any other value", () => {
      expect(errorsFor({ ...validInput(), anonymous: "yes" }, "anonymous").length).toBeGreaterThan(0);
    });
  });

  describe("enum fields", () => {
    it("rejects an empty selection", () => {
      expect(errorsFor({ ...validInput(), academicLevel: "" }, "academicLevel")).toContain(
        "selectOption"
      );
      expect(errorsFor({ ...validInput(), semester: "" }, "semester")).toContain(
        "selectOption"
      );
      expect(errorsFor({ ...validInput(), type: "" }, "type")).toContain(
        "selectOption"
      );
      expect(errorsFor({ ...validInput(), language: "" }, "language")).toContain(
        "selectOption"
      );
    });

    it("rejects an invalid enum value", () => {
      expect(errorsFor({ ...validInput(), academicLevel: "L9" }, "academicLevel").length).toBeGreaterThan(0);
      expect(errorsFor({ ...validInput(), semester: "S3" }, "semester").length).toBeGreaterThan(0);
      expect(errorsFor({ ...validInput(), type: "Essay" }, "type").length).toBeGreaterThan(0);
      expect(errorsFor({ ...validInput(), language: "Arabic" }, "language")).toContain("invalidOption");
    });
  });
});
