import { describe, expect, it } from "vitest";
import { dayKey, fillDays, formatCompact, formatDay, lastDays, niceCeil, startOfDay } from "./stats";

describe("dayKey", () => {
  it("uses the Algiers calendar day (UTC+1)", () => {
    expect(dayKey(new Date("2026-09-30T10:00:00Z"))).toBe("2026-09-30");
    expect(dayKey(new Date("2026-09-30T23:30:00Z"))).toBe("2026-10-01");
  });
});

describe("lastDays", () => {
  it("lists consecutive days, oldest first, ending today", () => {
    expect(lastDays(3, new Date("2026-03-01T12:00:00Z"))).toEqual(["2026-02-27", "2026-02-28", "2026-03-01"]);
  });

  it("returns the requested number of days", () => {
    expect(lastDays(30, new Date("2026-09-30T12:00:00Z"))).toHaveLength(30);
  });
});

describe("startOfDay", () => {
  it("is midnight in Algiers, i.e. 23:00 UTC the day before", () => {
    expect(startOfDay("2026-09-30").toISOString()).toBe("2026-09-29T23:00:00.000Z");
  });

  it("round-trips through dayKey", () => {
    expect(dayKey(startOfDay("2026-09-30"))).toBe("2026-09-30");
  });
});

describe("fillDays", () => {
  it("fills missing days with zero and ignores days outside the range", () => {
    expect(
      fillDays(["2026-09-29", "2026-09-30"], [
        { day: "2026-09-30", count: 4 },
        { day: "2026-08-01", count: 9 },
      ])
    ).toEqual([
      { day: "2026-09-29", count: 0 },
      { day: "2026-09-30", count: 4 },
    ]);
  });
});

describe("niceCeil", () => {
  it("returns 1 for empty or tiny data", () => {
    expect(niceCeil(0)).toBe(1);
    expect(niceCeil(1)).toBe(1);
  });

  it("rounds up to 1, 2 or 5 times a power of ten", () => {
    expect(niceCeil(2)).toBe(2);
    expect(niceCeil(3)).toBe(5);
    expect(niceCeil(7)).toBe(10);
    expect(niceCeil(10)).toBe(10);
    expect(niceCeil(11)).toBe(20);
    expect(niceCeil(480)).toBe(500);
    expect(niceCeil(501)).toBe(1000);
  });
});

describe("formatCompact", () => {
  it("keeps small numbers as-is and compacts large ones", () => {
    expect(formatCompact(42)).toBe("42");
    expect(formatCompact(1284).replace(/\s/g, " ")).toBe("1,3 k");
  });
});

describe("formatDay", () => {
  it("formats a day key as a short French date", () => {
    expect(formatDay("2026-09-30")).toBe("30 sept.");
    expect(formatDay("2026-01-01")).toBe("1 janv.");
  });
});
