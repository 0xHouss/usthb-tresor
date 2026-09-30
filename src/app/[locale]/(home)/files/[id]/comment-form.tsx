"use client"

import { addComment } from "@/actions/comment-actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToastMessage } from "@/hooks/use-toast-message"
import { EMPTY_FORM_STATE, getPrevValue } from "@/lib/form-state"
import { COMMENT_MAX_LENGTH } from "@/lib/schemas/comment-schema"
import { Loader2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useActionState } from "react"

export function CommentForm({ fileId }: { fileId: string }) {
  const t = useTranslations("comments")
  const [state, action, pending] = useActionState(addComment.bind(null, fileId), EMPTY_FORM_STATE)

  useToastMessage(state)

  return (
    <form action={action} className="flex flex-col gap-2">
      <Textarea
        name="content"
        required
        maxLength={COMMENT_MAX_LENGTH}
        placeholder={t("placeholder")}
        aria-label={t("label")}
        defaultValue={getPrevValue(state, "content")}
        className="min-h-24"
      />
      {state.fieldErrors.content?.map(error => (
        <p key={error} className="text-sm text-destructive">{error}</p>
      ))}
      <Button type="submit" disabled={pending} className="self-end">
        {pending && <Loader2Icon className="animate-spin" />}
        {t("publish")}
      </Button>
    </form>
  )
}
