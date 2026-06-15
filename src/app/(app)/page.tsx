import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getUserSession } from "@/lib/session";

export default async function Home() {
    const user = await getUserSession();

    return (
        <div className="flex flex-col items-center gap-10 py-12 text-center">
            <div className="flex max-w-2xl flex-col gap-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Tout le savoir de l&apos;USTHB, au même endroit
                </h1>
                <p className="text-lg text-muted-foreground">
                    Partagez et retrouvez cours, TD, TP et examens des années précédentes —
                    contribués et vérifiés par la communauté étudiante.
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/browse" className={buttonVariants({ size: "lg" })}>
                    Parcourir les ressources
                </Link>
                <Link
                    href={user ? "/contribute" : "/login"}
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                    Contribuer
                </Link>
            </div>
        </div>
    );
}
