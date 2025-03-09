'use client'

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

export function LoginForm(props: React.ComponentPropsWithoutRef<"form">) {
    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to your account
                </p>
            </div>
            <Button
                variant="outline"
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
            >
                <Image
                    src="/google-icon.svg"
                    alt="Google icon"
                    width={16}
                    height={16}
                    className="mr-2 h-4 w-4"
                />
                Login with Google
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    )
}
