import { auth } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./nav-link";
import { buttonVariants } from "./ui/button";
import UserDropdown from "./user-dropdown";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 border-b-2 py-3 bg-background">
      <nav className="lg:max-w-6xl xl:max-w-7xl m-auto flex items-center justify-between">
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
          <Link className={buttonVariants({ variant: "secondary" })} href="/contribute">
            Contribute
          </Link>
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link className={buttonVariants()} href="/login">Login</Link>
          )}
        </div>
      </nav>
    </header >
  );
}
