import { UserAvatar } from "@/components/user-avatar"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getComments } from "@/dal/comments"
import { getFile } from "@/dal/files"
import { getCurrentUser } from "@/dal/session"
import { Link } from "@/i18n/navigation"
import { formatDateTime, getFileUrl } from "@/lib/utils"
import { ArrowLeftIcon, DownloadIcon, SquareArrowOutUpRightIcon } from "lucide-react"
import type { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { CommentForm } from "./comment-form"
import { DeleteCommentButton } from "./delete-comment-button"
import { ReportFileDialog } from "./report-file-dialog"

type FilePageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: FilePageProps): Promise<Metadata> {
  const [file, tEnums, tMeta] = await Promise.all([
    getFile((await params).id),
    getTranslations("enums"),
    getTranslations("metadata"),
  ])
  return { title: file ? `${tEnums(`fileTypes.${file.type}`)} - ${file.moduleName} | ${tMeta("title")}` : tMeta("title") }
}

export default async function FilePage({ params }: FilePageProps) {
  const { id } = await params
  const [file, comments, user, locale, t, tComments, tEnums] = await Promise.all([
    getFile(id),
    getComments(id),
    getCurrentUser(),
    getLocale(),
    getTranslations("file"),
    getTranslations("comments"),
    getTranslations("enums"),
  ])

  if (!file) notFound()

  const title = `${tEnums(`fileTypes.${file.type}`)} - ${file.moduleName}`

  const isModerator = user?.role === "Admin" || user?.role === "Moderator"

  const details = [
    { label: t("fields.major"), value: file.majorName },
    { label: t("fields.module"), value: file.moduleName },
    { label: t("fields.professor"), value: file.professorFullName },
    { label: t("fields.level"), value: file.academicLevel },
    { label: t("fields.year"), value: `${file.academicYear}/${file.academicYear + 1}` },
    { label: t("fields.semester"), value: tEnums(`semesters.${file.semester}`) },
    { label: t("fields.section"), value: file.section },
    { label: t("fields.group"), value: file.group },
    { label: t("fields.language"), value: tEnums(`languages.${file.language}`) },
    { label: t("fields.addedOn"), value: formatDateTime(file.uploadedAt, locale) },
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-10">
      <div className="flex flex-col gap-2">
        <Link href="/browse" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit">
          <ArrowLeftIcon className="h-4 w-4" />
          {t("back")}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <iframe
          src={`https://drive.google.com/file/d/${file.driveId}/preview`}
          title={t("preview", { title })}
          className="h-[75vh] w-full rounded-lg border bg-muted"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {/* A plain <a>: prefetching the download route would count phantom downloads. */}
            <a href={`/api/files/${file.id}/download`} className={buttonVariants()}>
              <DownloadIcon />
              {t("download")}
            </a>
            <Link href={getFileUrl(file.driveId)} target="_blank" className={buttonVariants({ variant: "outline" })}>
              <SquareArrowOutUpRightIcon />
              {t("openInDrive")}
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("details")}</CardTitle>
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
                <p>{t.rich("sharedBy", {
                  name: file.uploader.name,
                  b: chunks => <span className="font-medium">{chunks}</span>,
                })}</p>
              </>
            ) : (
              <p className="text-muted-foreground">{t("sharedAnonymously")}</p>
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
        <h2 className="text-2xl font-semibold tracking-tight">{tComments("title", { count: comments.length })}</h2>

        {comments.length ? (
          <ul className="flex flex-col gap-4">
            {comments.map(comment => (
              <li key={comment.id} className="flex gap-3">
                <UserAvatar name={comment.author.name} image={comment.author.image} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt, locale)}</span>
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
          <p className="text-muted-foreground">{tComments("empty")}</p>
        )}

        {user ? (
          <CommentForm fileId={file.id} />
        ) : (
          <p className="text-sm text-muted-foreground">
            {tComments.rich("loginPrompt", {
              link: chunks => (
                <Link href="/login" className="underline underline-offset-4 hover:text-foreground">{chunks}</Link>
              ),
            })}
          </p>
        )}
      </section>
    </div>
  )
}
