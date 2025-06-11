"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FileStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function approveFile(fileId: string) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "Admin" && session.user.role !== "Moderator") {
    throw new Error("Insufficient permissions")
  }

  try {
    const pendingFile = await prisma.pendingFile.findUniqueOrThrow({
      where: { id: fileId }
    })

    await prisma.file.create({
      data: {
        driveId: pendingFile.driveId,
        type: pendingFile.type,
        academicLevel: pendingFile.academicLevel,
        academicYear: pendingFile.academicYear,
        semester: pendingFile.semester,
        section: pendingFile.section,
        group: pendingFile.group,
        major: {
          connectOrCreate: {
            where: { name: pendingFile.majorName },
            create: { name: pendingFile.majorName }
          }
        },
        module: {
          connectOrCreate: {
            where: { name: pendingFile.moduleName },
            create: { name: pendingFile.moduleName }
          }
        },
        professor: {
          connectOrCreate: {
            where: { fullName: pendingFile.professorFullName },
            create: { fullName: pendingFile.professorFullName }
          }
        },
        uploadedBy: { connect: { email: pendingFile.uploadedByEmail } },
      }
    })

    await prisma.pendingFile.update({
      where: { id: fileId },
      data: { status: FileStatus.Approved },
    })

    revalidatePath("/dashboard")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to approve file:", error)
    throw new Error("Failed to approve file")
  }
}

export async function rejectFile(fileId: string) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "Admin" && session.user.role !== "Moderator") {
    throw new Error("Insufficient permissions")
  }

  try {
    await prisma.pendingFile.update({
      where: { id: fileId },
      data: { status: FileStatus.Rejected },
    })

    revalidatePath("/dashboard")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to reject file:", error)
    throw new Error("Failed to reject file")
  }
}
