"use server";

import { revalidatePath } from "next/cache";
import { setResourceStatus } from "@/lib/resources";
import { requireRole } from "@/lib/session";

export async function approveResource(id: string) {
    const user = await requireRole(["MODERATOR", "ADMIN"]);
    await setResourceStatus(id, "APPROVED", user.email as string);
    revalidatePath("/moderate");
}

export async function rejectResource(id: string, reason: string) {
    const user = await requireRole(["MODERATOR", "ADMIN"]);
    await setResourceStatus(id, "REJECTED", user.email as string, reason || undefined);
    revalidatePath("/moderate");
}
