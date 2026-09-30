"use server"

import { createComment, deleteComment as deleteCommentRecord, getComment } from "@/dal/comments"
import { logEvent } from "@/dal/events"
import { requireUser } from "@/dal/session"
import { commentEventMetadata } from "@/lib/events"
import { getErrorTranslator } from "@/lib/action-errors"
import { FormState, fromErrorToFormState, toFormState } from "@/lib/form-state"
import { revalidateLocalized } from "@/lib/revalidate"
import { CommentFormSchema } from "@/lib/schemas/comment-schema"
import { getTranslations } from "next-intl/server"

export async function addComment(fileId: string, state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireUser()
    const { content } = CommentFormSchema.parse({ content: formData.get("content") })

    const comment = await createComment({ fileId, authorId: user.id, content })

    await logEvent({
      type: "CommentCreated",
      actorId: user.id,
      targetId: comment.id,
      metadata: commentEventMetadata(comment.file, comment.content),
    })

    revalidateLocalized(`/files/${fileId}`)

    const t = await getTranslations("comments")
    return toFormState("SUCCESS", formData, { message: t("published"), reset: true })
  } catch (error) {
    return fromErrorToFormState(error, formData, await getErrorTranslator())
  }
}

/** Deletes a comment. Allowed for its author and for moderators/admins. */
export async function deleteComment(commentId: string) {
  const user = await requireUser()

  const comment = await getComment(commentId)
  if (!comment) throw new Error("Comment not found")

  const isAuthor = comment.authorId === user.id
  const isModerator = user.role === "Admin" || user.role === "Moderator"
  if (!isAuthor && !isModerator) throw new Error("Insufficient permissions")

  await deleteCommentRecord(commentId)

  await logEvent({
    type: "CommentDeleted",
    actorId: user.id,
    targetId: comment.id,
    metadata: commentEventMetadata(comment.file, comment.content, { moderated: !isAuthor }),
  })

  revalidateLocalized(`/files/${comment.fileId}`)
}
