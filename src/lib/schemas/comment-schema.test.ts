import { describe, expect, it } from "vitest";
import { COMMENT_MAX_LENGTH, CommentFormSchema } from "./comment-schema";

describe("CommentFormSchema", () => {
  it("trims the content", () => {
    expect(CommentFormSchema.parse({ content: "  Merci !  " })).toEqual({ content: "Merci !" });
  });

  it("rejects missing, empty or whitespace-only content", () => {
    expect(CommentFormSchema.safeParse({ content: null }).success).toBe(false);
    expect(CommentFormSchema.safeParse({ content: "" }).success).toBe(false);
    expect(CommentFormSchema.safeParse({ content: "   " }).success).toBe(false);
  });

  it("enforces the maximum length", () => {
    expect(CommentFormSchema.safeParse({ content: "a".repeat(COMMENT_MAX_LENGTH) }).success).toBe(true);
    expect(CommentFormSchema.safeParse({ content: "a".repeat(COMMENT_MAX_LENGTH + 1) }).success).toBe(false);
  });
});
