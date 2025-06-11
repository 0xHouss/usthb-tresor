import { PendingFilesTable } from "@/components/pending-files-table"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect("/login")
  } else if (!["Admin", "Moderator"].includes(user.role)) {
    redirect("/")
  }

  const pendingFiles = await prisma.file.findMany({ where: { status: "Pending" } })
  
  return (
    <div className="flex flex-col p-10 gap-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Submissions Review</h1>
        <p className="text-muted-foreground">Manage pending file submissions</p>
      </div>
      <PendingFilesTable pendingFiles={pendingFiles} />
    </div>
  )
}
