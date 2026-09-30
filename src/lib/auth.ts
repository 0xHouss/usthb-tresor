import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "./prisma"

export const auth = betterAuth({
  // Used to build the Google callback URL; must match the redirect URI registered in Google Cloud.
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      // Server-owned: never accepted from sign-up/update input or the Google profile.
      role: {
        type: ["User", "Moderator", "Admin"],
        required: true,
        defaultValue: "User",
        input: false,
      },
    },
  },
  databaseHooks: {
    session: {
      create: {
        // Every new session is a sign-in. Imported lazily: the DAL imports this module.
        after: async (session) => {
          const { logEvent } = await import("@/dal/events")
          await logEvent({ type: "UserLogin", actorId: session.userId })
        },
      },
    },
  },
  // Must stay last so cookies set by auth.api calls in Server Actions reach the browser.
  plugins: [nextCookies()],
})

export type SessionUser = typeof auth.$Infer.Session.user
