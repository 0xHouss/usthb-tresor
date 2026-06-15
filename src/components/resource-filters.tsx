"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ACADEMIC_LEVELS,
    RESOURCE_TYPES,
    RESOURCE_TYPE_LABELS,
    SEMESTERS,
    SEMESTER_LABELS,
} from "@/lib/labels";

const ALL = "__all__";

type MajorWithModules = {
    id: string;
    name: string;
    modules: { id: string; name: string }[];
};

export function ResourceFilters({ majors }: { majors: MajorWithModules[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const selectedMajorId = params.get("majorId") ?? "";
    const modules = majors.find((m) => m.id === selectedMajorId)?.modules ?? [];

    function update(changes: Record<string, string | undefined>) {
        const next = new URLSearchParams(params.toString());
        for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
        }
        next.delete("page");
        router.push(next.toString() ? `${pathname}?${next}` : pathname);
    }

    function onSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get("search");
        update({ search: typeof value === "string" ? value.trim() : undefined });
    }

    const hasFilters = [...params.keys()].some((k) => k !== "page");

    return (
        <div className="flex flex-col gap-4">
            <form onSubmit={onSearch} className="flex gap-2">
                <Input
                    name="search"
                    placeholder="Rechercher un titre…"
                    defaultValue={params.get("search") ?? ""}
                />
                <Button type="submit" variant="secondary">
                    Rechercher
                </Button>
            </form>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                <Select
                    value={selectedMajorId || ALL}
                    onValueChange={(v) => update({ majorId: v === ALL ? undefined : v, moduleId: undefined })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filière" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Toutes les filières</SelectItem>
                        {majors.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                                {m.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={params.get("moduleId") ?? ALL}
                    onValueChange={(v) => update({ moduleId: v === ALL ? undefined : v })}
                    disabled={!selectedMajorId}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Module" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Tous les modules</SelectItem>
                        {modules.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                                {m.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={params.get("type") ?? ALL}
                    onValueChange={(v) => update({ type: v === ALL ? undefined : v })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Tous les types</SelectItem>
                        {RESOURCE_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {RESOURCE_TYPE_LABELS[t]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={params.get("level") ?? ALL}
                    onValueChange={(v) => update({ level: v === ALL ? undefined : v })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Tous les niveaux</SelectItem>
                        {ACADEMIC_LEVELS.map((l) => (
                            <SelectItem key={l} value={l}>
                                {l}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={params.get("semester") ?? ALL}
                    onValueChange={(v) => update({ semester: v === ALL ? undefined : v })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Semestre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Tous les semestres</SelectItem>
                        {SEMESTERS.map((s) => (
                            <SelectItem key={s} value={s}>
                                {SEMESTER_LABELS[s]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {hasFilters && (
                <div>
                    <Button variant="ghost" size="sm" onClick={() => router.push(pathname)}>
                        Réinitialiser les filtres
                    </Button>
                </div>
            )}
        </div>
    );
}
