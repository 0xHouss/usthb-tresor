import { describe, expect, it } from "vitest";
import { commentEventMetadata, describeEvent, describeFile, excerpt, fileEventMetadata, reportEventMetadata } from "./events";

describe("fileEventMetadata", () => {
  it("snapshots the file's identifying details", () => {
    expect(
      fileEventMetadata({ type: "Exam", moduleName: "Algorithmique", academicLevel: "L1" })
    ).toEqual({ fileType: "Exam", module: "Algorithmique", academicLevel: "L1" });
  });

  it("only records the anonymous flag when set", () => {
    const base = { type: "Exam", moduleName: "Algo", academicLevel: "L1" } as const;
    expect(fileEventMetadata({ ...base, anonymous: false })).not.toHaveProperty("anonymous");
    expect(fileEventMetadata({ ...base, anonymous: true })).toHaveProperty("anonymous", true);
  });
});

describe("describeEvent", () => {
  it("describes file metadata", () => {
    expect(describeEvent({ fileType: "DW_Worksheet", module: "Analyse", academicLevel: "L2" })).toBe(
      "DW Worksheet · Analyse · L2"
    );
  });

  it("flags anonymous submissions", () => {
    expect(
      describeEvent({ fileType: "Exam", module: "Algo", academicLevel: "L1", anonymous: true })
    ).toBe("Exam · Algo · L1 · anonyme");
  });

  it("quotes comment excerpts and flags moderator deletions", () => {
    const file = { type: "Exam", moduleName: "Algo", academicLevel: "L1" } as const;
    expect(describeEvent(commentEventMetadata(file, "Merci !"))).toBe("Exam · Algo · L1 · « Merci ! »");
    expect(describeEvent(commentEventMetadata(file, "Spam", { moderated: true }))).toBe(
      "Exam · Algo · L1 · « Spam » · par la modération"
    );
  });

  it("labels report reasons", () => {
    const file = { fileType: "Exam", module: "Algo", academicLevel: "L1" } as const;
    expect(describeEvent(reportEventMetadata(file, "Copyright"))).toBe("Exam · Algo · L1 · Droits d'auteur");
  });

  it("returns an empty string for missing or unknown metadata", () => {
    expect(describeEvent(null)).toBe("");
    expect(describeEvent({ foo: "bar" })).toBe("");
    expect(describeEvent("text")).toBe("");
  });
});

describe("excerpt", () => {
  it("keeps short text as-is, collapsed to one line", () => {
    expect(excerpt("  Très\n utile   merci ")).toBe("Très utile merci");
  });

  it("truncates long text with an ellipsis", () => {
    expect(excerpt("abcdefghij", 5)).toBe("abcd…");
  });
});

describe("commentEventMetadata", () => {
  it("never records the file's anonymous flag", () => {
    const file = { type: "Exam", moduleName: "Algo", academicLevel: "L1", anonymous: true } as const;
    expect(commentEventMetadata(file, "ok")).not.toHaveProperty("anonymous");
  });

  it("only records the moderated flag when set", () => {
    const file = { type: "Exam", moduleName: "Algo", academicLevel: "L1" } as const;
    expect(commentEventMetadata(file, "ok")).not.toHaveProperty("moderated");
    expect(commentEventMetadata(file, "ok", { moderated: true })).toHaveProperty("moderated", true);
  });
});

describe("describeFile", () => {
  it("describes the file without event-specific details", () => {
    expect(
      describeFile({ fileType: "Exam", module: "Algo", academicLevel: "L1", anonymous: true, reason: "Other" })
    ).toBe("Exam · Algo · L1");
  });

  it("returns an empty string for unknown metadata", () => {
    expect(describeFile(null)).toBe("");
  });
});
