import { describe, expect, it } from "vitest";
import { describeEvent, fileEventMetadata } from "./events";

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

  it("returns an empty string for missing or unknown metadata", () => {
    expect(describeEvent(null)).toBe("");
    expect(describeEvent({ foo: "bar" })).toBe("");
    expect(describeEvent("text")).toBe("");
  });
});
