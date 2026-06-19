import { describe, expect, it } from "vitest";
import { parseSearchParams, type SearchParams } from "./search-params";

// The function awaits its argument, so a plain object satisfies the Promise type.
const parse = (params: Record<string, string>) =>
  parseSearchParams(Promise.resolve(params) as unknown as SearchParams);

describe("parseSearchParams", () => {
  it("defaults page to 1 when missing or non-numeric", async () => {
    expect((await parse({})).page).toBe(1);
    expect((await parse({ page: "abc" })).page).toBe(1);
  });

  it("parses a valid page number", async () => {
    expect((await parse({ page: "5" })).page).toBe(5);
  });

  it("clamps zero or negative page to 1", async () => {
    expect((await parse({ page: "0" })).page).toBe(1);
    expect((await parse({ page: "-5" })).page).toBe(1);
  });

  it("splits comma-separated list params", async () => {
    const result = await parse({
      majors: "CS,Math",
      modules: "Algo,Algebra",
      professors: "Dupont,Smith",
    });
    expect(result.majors).toEqual(["CS", "Math"]);
    expect(result.modules).toEqual(["Algo", "Algebra"]);
    expect(result.professors).toEqual(["Dupont", "Smith"]);
  });

  it("leaves omitted list params undefined", async () => {
    const result = await parse({});
    expect(result.majors).toBeUndefined();
    expect(result.modules).toBeUndefined();
    expect(result.professors).toBeUndefined();
  });

  it("keeps only valid AcademicLevel values", async () => {
    expect((await parse({ academicLevels: "L1,XX,M2" })).academicLevels).toEqual([
      "L1",
      "M2",
    ]);
  });

  it("keeps only valid FileType values", async () => {
    expect((await parse({ types: "Exam,bogus,Lecture" })).types).toEqual([
      "Exam",
      "Lecture",
    ]);
  });

  it("keeps a valid semester and drops an invalid one", async () => {
    expect((await parse({ semester: "S1" })).semester).toBe("S1");
    expect((await parse({ semester: "S9" })).semester).toBeUndefined();
  });

  it("parses year bounds as integers and leaves them undefined when absent", async () => {
    const result = await parse({ startYear: "2020", endYear: "2024" });
    expect(result.startYear).toBe(2020);
    expect(result.endYear).toBe(2024);

    const empty = await parse({});
    expect(empty.startYear).toBeUndefined();
    expect(empty.endYear).toBeUndefined();
  });

  it("leaves year bounds undefined when not a number", async () => {
    const result = await parse({ startYear: "abc", endYear: "" });
    expect(result.startYear).toBeUndefined();
    expect(result.endYear).toBeUndefined();
  });

  it("passes section and group through unchanged", async () => {
    const result = await parse({ section: "A", group: "2" });
    expect(result.section).toBe("A");
    expect(result.group).toBe("2");
  });
});
