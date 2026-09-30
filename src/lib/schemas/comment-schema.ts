import { z } from "zod";

export const COMMENT_MAX_LENGTH = 2000;

export const CommentFormSchema = z.object({
  content: z
    .string({ message: "Le commentaire est vide." })
    .trim()
    .min(1, "Le commentaire est vide.")
    .max(COMMENT_MAX_LENGTH, `Le commentaire ne doit pas dépasser ${COMMENT_MAX_LENGTH} caractères.`),
});
