import { z } from "zod";

export const COMMENT_MAX_LENGTH = 2000;

// Messages are keys under `errors` in the message catalogues; actions translate them.
export const CommentFormSchema = z.object({
  content: z
    .string({ message: "commentEmpty" })
    .trim()
    .min(1, "commentEmpty")
    .max(COMMENT_MAX_LENGTH, "commentTooLong"),
});
