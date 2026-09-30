"use client"

import { reportFile } from "@/actions/report-actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToastMessage } from "@/hooks/use-toast-message"
import { EMPTY_FORM_STATE, FormState, getPrevValue } from "@/lib/form-state"
import { reportReasonLabels } from "@/lib/reports"
import { REPORT_DETAILS_MAX_LENGTH } from "@/lib/schemas/report-schema"
import { ReportReason } from "@prisma/client"
import { FlagIcon, Loader2Icon } from "lucide-react"
import { useActionState, useState } from "react"

export function ReportFileDialog({ fileId }: { fileId: string }) {
  const [open, setOpen] = useState(false)
  // Controlled, with a hidden input: React resets the form after each submission,
  // which would silently snap Radix's native <select> back to its first option.
  const [reason, setReason] = useState("")
  const [state, action, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    const next = await reportFile(fileId, prev, formData)
    if (next.status === "SUCCESS") {
      setOpen(false)
      setReason("")
    }
    return next
  }, EMPTY_FORM_STATE)

  useToastMessage(state)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <FlagIcon />
          Signaler un problème
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un problème</DialogTitle>
          <DialogDescription>Votre signalement sera examiné par l&apos;équipe de modération.</DialogDescription>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="report-reason">Motif</Label>
            <input type="hidden" name="reason" value={reason} />
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="report-reason" className="w-full">
                <SelectValue placeholder="Choisir un motif" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ReportReason).map(reason => (
                  <SelectItem key={reason} value={reason}>{reportReasonLabels[reason]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldErrors errors={state.fieldErrors.reason} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="report-details">Détails</Label>
            <Textarea
              id="report-details"
              name="details"
              maxLength={REPORT_DETAILS_MAX_LENGTH}
              placeholder="Décrivez le problème (obligatoire pour « Autre »)"
              defaultValue={getPrevValue(state, "details")}
            />
            <FieldErrors errors={state.fieldErrors.details} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2Icon className="animate-spin" />}
              Envoyer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function FieldErrors({ errors }: { errors?: string[] }) {
  return errors?.map(error => <p key={error} className="text-sm text-destructive">{error}</p>)
}
