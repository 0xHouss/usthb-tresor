import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

function Hero() {
  return (
    <Section className="flex flex-col items-center justify-center my-25">
      <h1 className="text-[64px] font-extrabold text-center my-5">{"All of USTHB's Knowledge,"}<br />{"in one place."}</h1>
      <div className="py-3 text-center">
        <p className=" text-gray-600">USTHB Trésor is your <b className="text-black">collaborative</b> hub for academic resources—<b className="text-black">old exams</b>, <b className="text-black">lecture notes</b>, and more...</p>
        <p> <b className="text-black">Search</b>, <b className="text-black">share</b>, and <b className="text-black">learn</b> with the USTHB community. 🚀</p>
      </div>
      <div>
        <div className="p-5 flex gap-5">
          <Link className={buttonVariants({ size: "lg" })} href="/browse">
            Browse Now
          </Link>
          <Link className={buttonVariants({ size: "lg", variant: "secondary" })} href="/contribute">
            Contribute
          </Link>
        </div>
      </div>
    </Section>
  );
}

function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section className={cn("max-w-[1200px] w-full m-auto", className)} {...props} />
  );
}

export default async function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}