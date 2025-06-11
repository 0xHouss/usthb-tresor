"use client"

import { approveFile, rejectFile } from "@/actions/file-actions"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, getFileUrl } from "@/lib/utils"
import { File } from "@prisma/client"
import { CheckIcon, Loader2Icon, SquareArrowOutUpRightIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface PendingFilesTableProps {
  pendingFiles: File[]
}

export function PendingFilesTable({ pendingFiles }: PendingFilesTableProps) {
  const [processingFile, setProcessingFile] = useState<string | null>(null)
  const [processingFileAction, setProcessingFileAction] = useState<"Approve" | "Reject" | null>(null)

  const handleApprove = async (fileId: string) => {
    setProcessingFile(fileId)
    setProcessingFileAction("Approve")

    try {
      await approveFile(fileId)
      toast.success("File has been approved.")
    } catch (error) {
      console.error("Error approving file:", error)
      toast.error("Failed to approve file.")
    }

    setProcessingFile(null)
    setProcessingFileAction(null)
  }

  const handleReject = async (fileId: string) => {
    setProcessingFile(fileId)
    setProcessingFileAction("Reject")

    try {
      await rejectFile(fileId)
      toast.success("File has been rejected.")
    } catch (error) {
      console.error("Error rejecting file:", error)
      toast.error("Failed to reject file.")
    }

    setProcessingFile(null)
    setProcessingFileAction(null)
  }

  if (!pendingFiles.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No pending files</h3>
        <p className="text-muted-foreground mt-2">All files have been reviewed</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Major</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Professor</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead className="text-right">
              {/* Actions */}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <Badge variant="outline">{file.type}</Badge>
              </TableCell>
              <TableCell>{file.moduleName}</TableCell>
              <TableCell>{file.majorName}</TableCell>
              <TableCell>{file.academicLevel}</TableCell>
              <TableCell>{file.academicYear}</TableCell>
              <TableCell>{file.semester}</TableCell>
              <TableCell>{file.section}</TableCell>
              <TableCell>{file.professorFullName}</TableCell>
              <TableCell>{file.uploadedByEmail}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 cursor-pointer"
                    onClick={() => handleApprove(file.id)}
                    disabled={processingFile === file.id}
                  >
                    {processingFile === file.id && processingFileAction === "Approve" ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                    onClick={() => handleReject(file.id)}
                    disabled={processingFile === file.id}
                  >
                    {processingFile === file.id && processingFileAction === "Reject" ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <XIcon className="h-4 w-4" />
                    )}
                  </Button>
                  <Link
                    className={cn("h-8 gap-1", buttonVariants({
                      size: "sm",
                      variant: "outline"
                    }))}
                    href={getFileUrl(file.driveId)}
                    target="_blank"
                  >
                    <SquareArrowOutUpRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
