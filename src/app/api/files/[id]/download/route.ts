import { recordDownload } from "@/dal/files"
import { getFileDownloadUrl } from "@/lib/utils"
import { NextResponse } from "next/server"

// Counts the download, then hands off to Drive. Link to it with a plain <a>:
// a prefetching <Link> would count downloads that never happened.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const driveId = await recordDownload((await params).id)
  if (!driveId) return new NextResponse("Fichier introuvable.", { status: 404 })

  return NextResponse.redirect(getFileDownloadUrl(driveId))
}
