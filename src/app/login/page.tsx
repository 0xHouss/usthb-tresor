
import { LoginForm } from "@/components/login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="/banner.jpeg"
                    alt="Image"
                    height={1000}
                    width={500}
                    className="absolute  h-full w-full object-cover"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-between items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Image
                            src="/usthb-logo.png"
                            alt="Logo"
                            height={38}
                            width={42}

                        />
                        USTHB Trésor
                    </Link>
                    <ThemeToggle />
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
