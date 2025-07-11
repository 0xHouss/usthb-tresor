"use server"

import { signIn, signOut } from "@/lib/auth"

export const login = async () => signIn('google', { redirectTo: '/' })

export const logout = async () => signOut({ redirectTo: '/login' })