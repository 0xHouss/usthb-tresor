import Link from "next/link";
import { ModerationActions } from "@/components/moderation-actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RESOURCE_TYPE_LABELS } from "@/lib/labels";
import { listPendingResources } from "@/lib/resources";
import { requireRole } from "@/lib/session";

export default async function ModeratePage() {
    await requireRole(["MODERATOR", "ADMIN"]);
    const pending = await listPendingResources();

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">File de modération</h1>
                <p className="text-sm text-muted-foreground">
                    {pending.length} ressource(s) en attente
                </p>
            </div>

            {pending.length === 0 ? (
                <p className="py-12 text-center text-muted-foreground">
                    Aucune ressource en attente.
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ressource</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Détails</TableHead>
                            <TableHead>Contributeur</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pending.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>
                                    <Link
                                        href={`/api/resources/${r.id}/download`}
                                        className="font-medium underline-offset-2 hover:underline"
                                    >
                                        {r.title || r.module.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">
                                        {r.major.name} · {r.module.name}
                                    </div>
                                </TableCell>
                                <TableCell>{RESOURCE_TYPE_LABELS[r.type]}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {r.level} · {r.semester} · {r.year}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {r.contributor.name ?? r.contributor.email}
                                </TableCell>
                                <TableCell>
                                    <ModerationActions id={r.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
