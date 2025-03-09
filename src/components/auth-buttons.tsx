import Link from "next/link";
import { LogoutDropdownMenuItem } from "./logout-button";
import { buttonVariants } from "./ui/button";

export function AuthButtons({ loggedIn }: { loggedIn: boolean }) {
    return (
        <>
            {loggedIn ? (
                <LogoutDropdownMenuItem />
            ) : (
                <Link href="/login" className={buttonVariants({ variant: "secondary" })}>Login</Link>
            )}
        </>
    )
}
