import { UserAvatar } from "@/components/user-avatar"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getComments } from "@/dal/comments"
import { getFile } from "@/dal/files"
import { getCurrentUser } from "@/dal/session"
import { fileTypeLabels, formatDateTime, getFileDownloadUrl, getFileUrl } from "@/lib/utils"
import { ArrowLeftIcon, DownloadIcon, SquareArrowOutUpRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CommentForm } from "./comment-form"
import { DeleteCommentButton } from "./delete-comment-button"
import { ReportFileDialog } from "./report-file-dialog"

type FilePageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: FilePageProps): Promise<Metadata> {
  const file = await getFile((await params).id)
  return { title: file ? `${fileTypeLabels[file.type]} - ${file.moduleName} | USTHB Trésor` : "USTHB Trésor" }
}

export default async function FilePage({ params }: FilePageProps) {
  const { id } = await params
  const [file, comments, user] = await Promise.all([getFile(id), getComments(id), getCurrentUser()])

  if (!file) notFound()

  const isModerator = user?.role === "Admin" || user?.role === "Moderator"

  const details = [
    { label: "Filière", value: file.majorName },
    { label: "Module", value: file.moduleName },
    { label: "Enseignant", value: file.professorFullName },
    { label: "Niveau", value: file.academicLevel },
    { label: "Année universitaire", value: `${file.academicYear}/${file.academicYear + 1}` },
    { label: "Semestre", value: file.semester },
    { label: "Section", value: file.section },
    { label: "Groupe", value: file.group },
    { label: "Ajouté le", value: formatDateTime(file.uploadedAt) },
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-10">
      <div className="flex flex-col gap-2">
        <Link href="/browse" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit">
          <ArrowLeftIcon className="h-4 w-4" />
          Retour aux ressources
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {fileTypeLabels[file.type]} - {file.moduleName}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <iframe
          src={`https://drive.google.com/file/d/${file.driveId}/preview`}
          title={`Aperçu : ${fileTypeLabels[file.type]} - ${file.moduleName}`}
          className="h-[75vh] w-full rounded-lg border bg-muted"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Link href={getFileDownloadUrl(file.driveId)} className={buttonVariants()}>
              <DownloadIcon />
              Télécharger
            </Link>
            <Link href={getFileUrl(file.driveId)} target="_blank" className={buttonVariants({ variant: "outline" })}>
              <SquareArrowOutUpRightIcon />
              Ouvrir dans Drive
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détails</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                {details.filter(detail => detail.value).map(detail => (
                  <div key={detail.label} className="contents">
                    <dt className="text-muted-foreground">{detail.label}</dt>
                    <dd className="font-medium">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3 rounded-lg border p-4 text-sm">
            {file.uploader ? (
              <>
                <UserAvatar name={file.uploader.name} image={file.uploader.image} />
                <p>Partagé par <span className="font-medium">{file.uploader.name}</span></p>
              </>
            ) : (
              <p className="text-muted-foreground">Partagé anonymement</p>
            )}
          </div>

          {user && (
            <div className="self-start">
              <ReportFileDialog fileId={file.id} />
            </div>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-4 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Commentaires ({comments.length})</h2>

        {comments.length ? (
          <ul className="flex flex-col gap-4">
            {comments.map(comment => (
              <li key={comment.id} className="flex gap-3">
                <UserAvatar name={comment.author.name} image={comment.author.image} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</span>
                    {user && (comment.authorId === user.id || isModerator) && (
                      <div className="ml-auto">
                        <DeleteCommentButton commentId={comment.id} />
                      </div>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm">{comment.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Aucun commentaire pour le moment.</p>
        )}

        {user ? (
          <CommentForm fileId={file.id} />
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground">Connectez-vous</Link>{" "}
            pour laisser un commentaire.
          </p>
        )}
      </section>
    </div>
  )
}
