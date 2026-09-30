import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

/** Current session user, or null when signed out. Deduped per request. */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

/** Asserts an authenticated user; throws otherwise. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/** Asserts the caller is a Moderator or Admin; throws otherwise. */
export async function requireModerator() {
  const user = await requireUser();
  if (user.role !== "Admin" && user.role !== "Moderator") {
    throw new Error("Insufficient permissions");
  }
  return user;
}

/** Asserts the caller is an Admin; throws otherwise. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "Admin") {
    throw new Error("Insufficient permissions");
  }
  return user;
}
