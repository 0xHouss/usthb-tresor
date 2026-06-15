import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResourceById } from "@/lib/resources";
import { getUserSession } from "@/lib/session";
import {
    RESOURCE_STATUS_LABELS,
    RESOURCE_TYPE_LABELS,
    SEMESTER_LABELS,
} from "@/lib/labels";

export default async function ResourceDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const resource = await getResourceById(id);
    if (!resource) notFound();

    const user = await getUserSession();
    const canModerate = user?.role === "MODERATOR" || user?.role === "ADMIN";
    if (resource.status !== "APPROVED" && !canModerate) notFound();

    const rows: [string, string | null][] = [
        ["Filière", resource.major.name],
        ["Module", resource.module.name],
        ["Type", RESOURCE_TYPE_LABELS[resource.type]],
        ["Niveau", resource.level],
        ["Semestre", SEMESTER_LABELS[resource.semester]],
        ["Année", String(resource.year)],
        ["Section", resource.section],
        ["Groupe", resource.group],
        ["Chapitre", resource.chapter],
        ["Professeur", resource.professor?.fullName ?? null],
        ["Contribué par", resource.contributor.name ?? resource.contributor.email],
    ];

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary">{RESOURCE_TYPE_LABELS[resource.type]}</Badge>
                        {resource.status !== "APPROVED" && (
                            <Badge variant="outline">{RESOURCE_STATUS_LABELS[resource.status]}</Badge>
                        )}
                    </div>
                    <CardTitle>{resource.title || resource.module.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
                        {rows
                            .filter(([, value]) => value)
                            .map(([label, value]) => (
                                <div key={label} className="contents">
                                    <dt className="text-muted-foreground">{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                    </dl>

                    <a
                        href={`/api/resources/${resource.id}/download`}
                        className={buttonVariants({ className: "w-fit" })}
                    >
                        Télécharger ({resource.fileName})
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
