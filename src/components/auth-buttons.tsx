import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { buttonVariants } from "./ui/button";

export function AuthButtons({ loggedIn }: { loggedIn: boolean }) {
    return (
        <>
            {loggedIn ? (
                <LogoutButton />
            ) : (
                <Link href="/login" className={buttonVariants({ variant: "secondary" })}>Login</Link>
            )}
        </>
    )
}
