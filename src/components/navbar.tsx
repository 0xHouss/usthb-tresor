import { getUserSession } from "@/lib/session";
import { AuthButtons } from "./auth-buttons";
import { ThemeToggle } from "./theme-toggle";

export async function Navbar() {
    const user = await getUserSession()

    return (
        <nav className="w-full bg-primary flex justify-between items-center p-4">
            <p className="text-xl text-white">USTHB Trésor</p>
            <ThemeToggle />
            <AuthButtons loggedIn={!!user} />
        </nav>
    )
}
