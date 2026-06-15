import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import type { UserRole } from "@/generated/prisma/client";

/** Returns the current session user, or undefined if not signed in. */
export async function getUserSession() {
    const session = await getServerSession(authOptions);
    return session?.user;
}

/** Returns the current user, redirecting to /login when not signed in. */
export async function requireUser() {
    const user = await getUserSession();
    if (!user) redirect("/login");
    return user;
}

/** Returns the current user when their role is allowed; otherwise redirects. */
export async function requireRole(roles: UserRole[]) {
    const user = await getUserSession();
    if (!user) redirect("/login");
    if (!roles.includes(user.role)) redirect("/");
    return user;
}
