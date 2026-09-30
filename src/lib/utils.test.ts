import { AcademicLevel, FileType, Semester } from "@prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatDateTime,
  getCurrentAcademicYear,
  getFileDownloadUrl,
  getFileUrl,
  getInitials,
  isEnumValue,
} from "./utils";

describe("getInitials", () => {
  it("returns ? for empty or whitespace-only names", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("   ")).toBe("?");
  });

  it("returns a single uppercased initial for a one-word name", () => {
    expect(getInitials("madonna")).toBe("M");
  });

  it("returns the first two initials, uppercased", () => {
    expect(getInitials("ada lovelace")).toBe("AL");
  });

  it("uses only the first two words when more are present", () => {
    expect(getInitials("john ronald reuel tolkien")).toBe("JR");
  });

  it("ignores extra whitespace between words", () => {
    expect(getInitials("  grace   hopper  ")).toBe("GH");
  });
});

describe("getCurrentAcademicYear", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const at = (iso: string) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(iso));
    return getCurrentAcademicYear();
  };

  it("returns the previous calendar year before September (month < 7 / August)", () => {
    expect(at("2026-01-15T12:00:00Z")).toBe(2025);
    expect(at("2026-07-15T12:00:00Z")).toBe(2025); // July (month index 6)
  });

  it("returns the current calendar year from August onward (month >= 7)", () => {
    expect(at("2026-08-15T12:00:00Z")).toBe(2026); // August (month index 7)
    expect(at("2026-09-15T12:00:00Z")).toBe(2026);
    expect(at("2026-12-31T12:00:00Z")).toBe(2026);
  });
});

describe("isEnumValue", () => {
  it("returns true for a valid enum value", () => {
    expect(isEnumValue(Semester, "S1")).toBe(true);
    expect(isEnumValue(FileType, "Exam")).toBe(true);
    expect(isEnumValue(AcademicLevel, "L1")).toBe(true);
  });

  it("returns false for a value not in the enum", () => {
    expect(isEnumValue(Semester, "S3")).toBe(false);
    expect(isEnumValue(FileType, "")).toBe(false);
    expect(isEnumValue(AcademicLevel, "l1")).toBe(false); // case-sensitive
  });

  it("returns false for null or undefined", () => {
    expect(isEnumValue(Semester, null)).toBe(false);
    expect(isEnumValue(Semester, undefined)).toBe(false);
  });
});

describe("file URL builders", () => {
  it("builds the Drive view URL", () => {
    expect(getFileUrl("abc123")).toBe(
      "https://drive.google.com/file/d/abc123/view"
    );
  });

  it("builds the download URL with the confirm=t bypass param", () => {
    expect(getFileDownloadUrl("abc123")).toBe(
      "https://drive.usercontent.google.com/download?id=abc123&export=download&confirm=t"
    );
  });
});

describe("formatDateTime", () => {
  it("formats as a short date and time in Algiers time (UTC+1)", () => {
    expect(formatDateTime(new Date("2026-09-30T10:05:00Z"), "fr")).toBe("30/09/2026 11:05");
  });

  it("follows the locale's conventions", () => {
    expect(formatDateTime(new Date("2026-09-30T10:05:00Z"), "en").replace(/\s/g, " ")).toBe("9/30/26, 11:05 AM");
  });

  it("rolls over to the next day in Algiers time", () => {
    expect(formatDateTime(new Date("2026-01-01T23:30:00Z"), "fr")).toBe("02/01/2026 00:30");
  });
});
