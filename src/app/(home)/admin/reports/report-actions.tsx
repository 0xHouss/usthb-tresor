"use client"

import { closeReport, deleteFile } from "@/actions/report-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { CheckIcon, Loader2Icon, Trash2Icon, XIcon } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

interface ReportActionsProps {
  reportId: string
  /** Set when the reported file still exists and the viewer may delete it (admins). */
  deletableFileId?: string
}

export function ReportActions({ reportId, deletableFileId }: ReportActionsProps) {
  const [pending, startTransition] = useTransition()

  const run = (action: () => Promise<void>, success: string, failure: string) => {
    startTransition(async () => {
      try {
        await action()
        toast.success(success)
      } catch (error) {
        console.error(failure, error)
        toast.error(failure)
      }
    })
  }

  return (
    <div className="flex justify-end gap-2">
      {pending && <Loader2Icon className="h-4 w-4 animate-spin self-center text-muted-foreground" />}
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run(() => closeReport(reportId, "Resolved"), "Signalement résolu.", "Impossible de résoudre le signalement.")}
      >
        <CheckIcon />
        Résoudre
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => run(() => closeReport(reportId, "Dismissed"), "Signalement rejeté.", "Impossible de rejeter le signalement.")}
      >
        <XIcon />
        Rejeter
      </Button>
      {deletableFileId && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" disabled={pending}>
              <Trash2Icon />
              Supprimer le fichier
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce fichier ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le fichier sera retiré du site et de Google Drive, avec ses commentaires. Ses signalements ouverts seront
                marqués comme résolus. Cette action est définitive.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() => run(() => deleteFile(deletableFileId), "Fichier supprimé.", "Impossible de supprimer le fichier.")}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
