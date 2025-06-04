import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth, signOut } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./nav-link";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 border-b-2 px-6">
      <nav className="max-w-[1400px] m-auto flex h-16 items-center w-full justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold ">
            <Image src="/usthb-logo.png" alt="Logo" height={38} width={42} />
            <span className="leading-4">
              USTHB<br />TRÉSOR
            </span>
          </Link>

          <NavLink href="/browse" label="Resources" />
          <NavLink href="/about" label="About Us" />
          <NavLink href="/contact" label="Contact Us" />
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Input placeholder="Search resources..." />
          </div>
          <Link className={buttonVariants({ variant: "secondary" })} href="/contribute">
            Contribute
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus-visible:outline-none focus:outline-none">
                {user.image ? (
                  <Image alt="User Dropdown" src={user.image} width={50} height={50} className="rounded-full w-10 h-10" />
                ) : (
                  <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">{getInitials(user.name ?? "")}</span>
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="px-2 py-2 text-sm">
                  <div>{user.name}</div>
                  <div className="font-semibold truncate">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                {user.role === "ADMIN" && (
                  <DropdownMenuItem>Dashboard</DropdownMenuItem>
                )}
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={async () => {
                  "use server"

                  await signOut({ redirectTo: '/login' })
                }}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link className={buttonVariants()} href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
