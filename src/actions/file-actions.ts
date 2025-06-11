"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function approveFile(fileId: string) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "Admin" && session.user.role !== "Moderator") {
    throw new Error("Insufficient permissions")
  }

  try {
    await prisma.file.update({
      where: { id: fileId },
      data: { status: "Approved" },
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
    await prisma.file.update({
      where: { id: fileId },
      data: { status: "Rejected" },
    })

    revalidatePath("/dashboard")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to reject file:", error)
    throw new Error("Failed to reject file")
  }
}
