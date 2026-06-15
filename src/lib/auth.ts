import ENV from "@/lib/env"
import { prisma } from "@/lib/prisma"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    secret: ENV.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: ENV.GOOGLE_CLIENT_ID,
            clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email)
                throw new Error("No profile !")

            await prisma.user.upsert({
                where: { email: profile.email },
                update: { name: profile.name },
                create: {
                    email: profile.email,
                    name: profile.name,
                },
            })

            return true
        },
        async session({ token, session }) {
            if (token) {
                session.user.name = token.name
                session.user.email = token.email
                session.user.role = token.role
                session.user.image = token.picture
            }

            return session
        },
        async jwt({ token, user }) {
            const dbUser = await prisma.user.findUnique({
                where: { email: token.email }
            })

            if (!dbUser) {
                token.id = user!.id
                return token
            }

            return {
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
                picture: dbUser.avatar,
            }
        }
    },
}
