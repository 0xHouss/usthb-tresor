import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { signIn } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/banner.jpeg"
          alt="Image"
          width={500}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold ">
            <Image
              src="/usthb-logo.png"
              alt="Logo"
              height={38}
              width={42}

            />
            <span className="leading-4">
              USTHB<br />TRÉSOR
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
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
                onClick={async () => {
                  "use server"

                  await signIn('google', { redirectTo: '/' })
                }}
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
          </div>
        </div>
      </div>
    </div>
  )
}
