"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const login = async () => {
  const { url } = await auth.api.signInSocial({
    body: { provider: "google", callbackURL: "/" },
    headers: await headers(),
  })
  if (!url) throw new Error("Google sign-in did not return an authorization URL")
  redirect(url)
}

export const logout = async () => {
  await auth.api.signOut({ headers: await headers() })
  redirect("/login")
}
