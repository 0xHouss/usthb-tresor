import { ThemeToggle } from "@/components/theme-toggle";

export default async function Home() {
  return (
    <main className="h-screen w-screen flex justify-center">
      <div className="max-w-5xl w-full h-screen">
        {/* <nav className="bg-gray-100 justify-between flex items-center rounded-xl p-5 mt-3">
          <p className="font-bold">Acme.inc</p>
          <Input
            placeholder="Search for something..."
            className="w-fit"
          />

          <div className="flex gap-3">
            <Button variant="secondary">Contribute now</Button>
            <Button>Log in</Button>
          </div>
        </nav> */}
        <ThemeToggle />
      </div>
    </main>
  );
}