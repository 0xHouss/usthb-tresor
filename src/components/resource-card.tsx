import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResourceListItem } from "@/lib/resources";
import { RESOURCE_TYPE_LABELS } from "@/lib/labels";

export function ResourceCard({ resource }: { resource: ResourceListItem }) {
    const title = resource.title || resource.module.name;

    return (
        <Link href={`/resources/${resource.id}`} className="block">
            <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary">{RESOURCE_TYPE_LABELS[resource.type]}</Badge>
                        <span className="text-sm text-muted-foreground">{resource.year}</span>
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    <p>{resource.major.name}</p>
                    <p>
                        {resource.module.name} · {resource.level} · {resource.semester}
                    </p>
                    {resource.professor && <p>{resource.professor.fullName}</p>}
                </CardContent>
            </Card>
        </Link>
    );
}
