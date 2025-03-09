'use client'

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function LogoutDropdownMenuItem() {
    return (
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => signOut({ callbackUrl: '/' })}>Log out</DropdownMenuItem>
    )
}
