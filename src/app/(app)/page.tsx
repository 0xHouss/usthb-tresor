import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    ClipboardList,
    FileText,
    FlaskConical,
    GraduationCap,
    Library,
    PencilLine,
    Search,
    ShieldCheck,
    UploadCloud,
    Users,
} from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RESOURCE_TYPE_LABELS } from "@/lib/labels";
import {
    getRecentResources,
    getResourceStats,
    listMajors,
} from "@/lib/resources";
import { getUserSession } from "@/lib/session";
import type { ResourceType } from "@/generated/prisma/client";

const TYPE_ICONS: Record<ResourceType, typeof BookOpen> = {
    LECTURE: BookOpen,
    DW_WORKSHEET: PencilLine,
    PW_WORKSHEET: FlaskConical,
    INTERROGATION: ClipboardList,
    EXAM: GraduationCap,
    PW_EXAM: FileText,
};

const STEPS = [
    {
        icon: Search,
        title: "Parcourez",
        text: "Filtrez par filière, module, type, niveau et année pour trouver exactement ce qu'il vous faut.",
    },
    {
        icon: UploadCloud,
        title: "Contribuez",
        text: "Partagez vos cours, TD, TP et examens en quelques clics avec leurs métadonnées.",
    },
    {
        icon: ShieldCheck,
        title: "Validé",
        text: "Chaque ressource est vérifiée par un modérateur avant d'être publiée à toute la communauté.",
    },
];

export default async function Home() {
    const [user, stats, majors, recent] = await Promise.all([
        getUserSession(),
        getResourceStats(),
        listMajors(),
        getRecentResources(6),
    ]);

    const statItems = [
        { label: "Ressources", value: stats.resources, icon: Library },
        { label: "Filières", value: stats.majors, icon: GraduationCap },
        { label: "Modules", value: stats.modules, icon: BookOpen },
        { label: "Contributeurs", value: stats.contributors, icon: Users },
    ];

    return (
        <div className="flex flex-col gap-20 py-8">
            {/* Hero */}
            <section className="flex flex-col items-center gap-6 text-center">
                <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="size-3.5" />
                    Plateforme étudiante USTHB
                </Badge>
                <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Tout le savoir de l&apos;USTHB,{" "}
                    <span className="text-primary">au même endroit</span>
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    Cours, TD, TP et examens des années précédentes — partagés et
                    vérifiés par la communauté étudiante.
                </p>

                <form action="/browse" className="flex w-full max-w-md gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="search"
                            placeholder="Rechercher une ressource…"
                            className="pl-9"
                        />
                    </div>
                    <Button type="submit">Rechercher</Button>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {statItems.map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="flex flex-col items-center gap-1 rounded-xl border bg-card p-6 text-center"
                    >
                        <Icon className="size-5 text-muted-foreground" />
                        <span className="text-3xl font-bold">{value}</span>
                        <span className="text-sm text-muted-foreground">{label}</span>
                    </div>
                ))}
            </section>

            {/* Browse by type */}
            <section className="flex flex-col gap-6">
                <div className="flex items-end justify-between">
                    <h2 className="text-2xl font-bold">Parcourir par type</h2>
                    <Link
                        href="/browse"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        Tout voir <ArrowRight className="size-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {(Object.keys(TYPE_ICONS) as ResourceType[]).map((type) => {
                        const Icon = TYPE_ICONS[type];
                        return (
                            <Link
                                key={type}
                                href={`/browse?type=${type}`}
                                className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary"
                            >
                                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </span>
                                <span className="font-medium">{RESOURCE_TYPE_LABELS[type]}</span>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* How it works */}
            <section className="flex flex-col gap-6 rounded-2xl bg-muted/40 p-8">
                <h2 className="text-center text-2xl font-bold">Comment ça marche</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, text }, i) => (
                        <div key={title} className="flex flex-col items-center gap-3 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Icon className="size-6" />
                            </span>
                            <h3 className="font-semibold">
                                {i + 1}. {title}
                            </h3>
                            <p className="text-sm text-muted-foreground">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Browse by major */}
            {majors.length > 0 && (
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-bold">Parcourir par filière</h2>
                    <div className="flex flex-wrap gap-2">
                        {majors.map((major) => (
                            <Link
                                key={major.id}
                                href={`/browse?majorId=${major.id}`}
                                className={buttonVariants({ variant: "outline", size: "sm" })}
                            >
                                {major.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Recent resources / contribute CTA */}
            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold">Ressources récentes</h2>
                {recent.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {recent.map((resource) => (
                            <ResourceCard key={resource.id} resource={resource} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
                        <Library className="size-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            Aucune ressource publiée pour l&apos;instant. Soyez le premier à contribuer !
                        </p>
                        <Link
                            href={user ? "/contribute" : "/login"}
                            className={buttonVariants()}
                        >
                            Contribuer une ressource
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
