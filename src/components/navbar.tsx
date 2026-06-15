import Link from "next/link";
import { getUserSession } from "@/lib/session";
import { AuthButtons } from "./auth-buttons";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

export async function Navbar() {
    const user = await getUserSession();
    const canModerate = user?.role === "MODERATOR" || user?.role === "ADMIN";

    return (
        <nav className="w-full border-b bg-background">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-lg font-semibold">
                        USTHB Trésor
                    </Link>
                    <div className="hidden items-center gap-1 sm:flex">
                        <Link href="/browse" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                            Parcourir
                        </Link>
                        {user && (
                            <Link href="/contribute" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                Contribuer
                            </Link>
                        )}
                        {canModerate && (
                            <Link href="/moderate" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                Modération
                            </Link>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <AuthButtons loggedIn={!!user} />
                </div>
            </div>
        </nav>
    );
}
