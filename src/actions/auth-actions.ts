"use server"

import { redirect as redirectLocalized } from "@/i18n/navigation"
import { auth } from "@/lib/auth"
import { getLocale } from "next-intl/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const login = async () => {
  const { url } = await auth.api.signInSocial({
    // Come back to the home page in the language the user signed in from.
    body: { provider: "google", callbackURL: `/${await getLocale()}` },
    headers: await headers(),
  })
  if (!url) throw new Error("Google sign-in did not return an authorization URL")
  redirect(url)
}

export const logout = async () => {
  await auth.api.signOut({ headers: await headers() })
  redirectLocalized({ href: "/login", locale: await getLocale() })
}
