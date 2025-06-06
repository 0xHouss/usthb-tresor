import { Navbar } from "@/components/navbar";
import { auth } from "@/lib/auth";

export default async function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  const user = session?.user;

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
