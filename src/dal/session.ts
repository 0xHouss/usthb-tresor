import "server-only";

import { auth } from "@/lib/auth";

/** Current session user, or null when signed out. */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Asserts an authenticated user with an email; throws otherwise. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user?.email) throw new Error("Unauthorized");
  return user as typeof user & { email: string };
}

/** Asserts the caller is a Moderator or Admin; throws otherwise. */
export async function requireModerator() {
  const user = await requireUser();
  if (user.role !== "Admin" && user.role !== "Moderator") {
    throw new Error("Insufficient permissions");
  }
  return user;
}
