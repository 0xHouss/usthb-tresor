import { describe, expect, it } from "vitest";
import { z } from "zod";
import { fromErrorToFormState, getPrevValue, toFormState } from "./form-state";

describe("fromErrorToFormState", () => {
  it("maps a ZodError to fieldErrors", () => {
    const schema = z.object({ name: z.string().min(1, "Required") });
    const result = schema.safeParse({ name: "" });
    expect(result.success).toBe(false);

    const state = fromErrorToFormState(result.error, new FormData());
    expect(state.status).toBe("ERROR");
    expect(state.fieldErrors.name).toEqual(["Required"]);
    expect(state.message).toBe("");
  });

  it("maps a generic Error to its message", () => {
    const state = fromErrorToFormState(new Error("boom"), new FormData());
    expect(state.status).toBe("ERROR");
    expect(state.message).toBe("boom");
    expect(state.fieldErrors).toEqual({});
  });

  it("falls back to a generic message for non-Error values", () => {
    const state = fromErrorToFormState("just a string", new FormData());
    expect(state.status).toBe("ERROR");
    expect(state.message).toBe("An error occured !");
  });
});

describe("toFormState", () => {
  it("applies defaults for omitted options", () => {
    const fd = new FormData();
    const state = toFormState("SUCCESS", fd, {});
    expect(state.status).toBe("SUCCESS");
    expect(state.message).toBe("");
    expect(state.redirect).toBe("");
    expect(state.reset).toBe(false);
    expect(state.fieldErrors).toEqual({});
    expect(state.formData).toBe(fd);
    expect(typeof state.timestamp).toBe("number");
  });
});

describe("getPrevValue", () => {
  const stateWith = (value: string, reset: boolean) => {
    const formData = new FormData();
    formData.set("field", value);
    return toFormState("UNSET", formData, { reset });
  };

  it("returns the stored value when present and not reset", () => {
    expect(getPrevValue(stateWith("hello", false), "field")).toBe("hello");
  });

  it("returns empty string when the form was reset", () => {
    expect(getPrevValue(stateWith("hello", true), "field")).toBe("");
  });

  it("returns empty string when the key is absent", () => {
    expect(getPrevValue(toFormState("UNSET", new FormData(), {}), "missing")).toBe("");
  });
});
