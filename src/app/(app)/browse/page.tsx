import Link from "next/link";
import { ResourceCard } from "@/components/resource-card";
import { ResourceFilters } from "@/components/resource-filters";
import { buttonVariants } from "@/components/ui/button";
import {
    getMajorsWithModules,
    listResources,
    type ResourceFilters as Filters,
} from "@/lib/resources";
import { ACADEMIC_LEVELS, RESOURCE_TYPES, SEMESTERS } from "@/lib/labels";
import type { AcademicLevel, ResourceType, Semester } from "@/generated/prisma/client";

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

function parseFilters(sp: SearchParams): Filters {
    const type = one(sp.type);
    const level = one(sp.level);
    const semester = one(sp.semester);
    const year = one(sp.year);

    return {
        majorId: one(sp.majorId),
        moduleId: one(sp.moduleId),
        professorId: one(sp.professorId),
        type: RESOURCE_TYPES.includes(type as ResourceType) ? (type as ResourceType) : undefined,
        level: ACADEMIC_LEVELS.includes(level as AcademicLevel) ? (level as AcademicLevel) : undefined,
        semester: SEMESTERS.includes(semester as Semester) ? (semester as Semester) : undefined,
        year: year && /^\d+$/.test(year) ? Number(year) : undefined,
        search: one(sp.search),
    };
}

export default async function BrowsePage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const sp = await searchParams;
    const filters = parseFilters(sp);
    const page = Number(one(sp.page)) || 1;

    const [majors, { items, total, totalPages }] = await Promise.all([
        getMajorsWithModules(),
        listResources(filters, { page }),
    ]);

    function pageHref(p: number) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(sp)) {
            const v = one(value);
            if (v && key !== "page") params.set(key, v);
        }
        params.set("page", String(p));
        return `/browse?${params}`;
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Ressources</h1>
                <p className="text-sm text-muted-foreground">{total} ressource(s) approuvée(s)</p>
            </div>

            <ResourceFilters majors={majors} />

            {items.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                    Aucune ressource ne correspond à ces critères.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                    {page > 1 && (
                        <Link href={pageHref(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
                            Précédent
                        </Link>
                    )}
                    <span className="text-sm text-muted-foreground">
                        Page {page} / {totalPages}
                    </span>
                    {page < totalPages && (
                        <Link href={pageHref(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
                            Suivant
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
