"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    ACCEPTED_MIME_TYPES,
    MAX_FILE_SIZE,
    resourceMetadataSchema,
} from "@/lib/validation";

type MajorWithModules = {
    id: string;
    name: string;
    modules: { id: string; name: string }[];
};
type Professor = { id: string; fullName: string };

const NONE = "__none__";

const emptyForm = {
    type: "",
    level: "",
    semester: "",
    majorId: "",
    moduleId: "",
    professorId: "",
    year: String(new Date().getFullYear()),
    title: "",
    section: "",
    group: "",
    chapter: "",
};

export function ContributeForm({
    majors,
    professors,
}: {
    majors: MajorWithModules[];
    professors: Professor[];
}) {
    const router = useRouter();
    const [form, setForm] = useState(emptyForm);
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const modules = useMemo(
        () => majors.find((m) => m.id === form.majorId)?.modules ?? [],
        [majors, form.majorId]
    );

    function set(key: keyof typeof emptyForm, value: string) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        const parsed = resourceMetadataSchema.safeParse({
            ...form,
            professorId: form.professorId || undefined,
        });
        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
            return;
        }
        if (!file) {
            toast.error("Veuillez sélectionner un fichier");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Le fichier dépasse 20 Mo");
            return;
        }
        if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
            toast.error("Format non supporté (PDF, PNG ou JPEG)");
            return;
        }

        const data = new FormData();
        data.set("file", file);
        for (const [key, value] of Object.entries(form)) {
            if (value) data.set(key, value);
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/resources", { method: "POST", body: data });
            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error ?? "Échec de l'envoi");
            }
            toast.success("Merci ! Votre ressource est en attente de validation.");
            router.push("/browse");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Échec de l'envoi");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <Field label="Fichier (PDF, PNG, JPEG — max 20 Mo)">
                <Input
                    type="file"
                    accept={ACCEPTED_MIME_TYPES.join(",")}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Filière">
                    <SelectInput
                        value={form.majorId}
                        placeholder="Choisir une filière"
                        onChange={(v) => setForm((p) => ({ ...p, majorId: v, moduleId: "" }))}
                        options={majors.map((m) => ({ value: m.id, label: m.name }))}
                    />
                </Field>

                <Field label="Module">
                    <SelectInput
                        value={form.moduleId}
                        placeholder="Choisir un module"
                        disabled={!form.majorId}
                        onChange={(v) => set("moduleId", v)}
                        options={modules.map((m) => ({ value: m.id, label: m.name }))}
                    />
                </Field>

                <Field label="Type">
                    <SelectInput
                        value={form.type}
                        placeholder="Type de ressource"
                        onChange={(v) => set("type", v)}
                        options={RESOURCE_TYPES.map((t) => ({ value: t, label: RESOURCE_TYPE_LABELS[t] }))}
                    />
                </Field>

                <Field label="Professeur (optionnel)">
                    <Select
                        value={form.professorId || NONE}
                        onValueChange={(v) => set("professorId", v === NONE ? "" : v)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Aucun" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={NONE}>Aucun</SelectItem>
                            {professors.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.fullName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Niveau">
                    <SelectInput
                        value={form.level}
                        placeholder="Niveau"
                        onChange={(v) => set("level", v)}
                        options={ACADEMIC_LEVELS.map((l) => ({ value: l, label: l }))}
                    />
                </Field>

                <Field label="Semestre">
                    <SelectInput
                        value={form.semester}
                        placeholder="Semestre"
                        onChange={(v) => set("semester", v)}
                        options={SEMESTERS.map((s) => ({ value: s, label: SEMESTER_LABELS[s] }))}
                    />
                </Field>

                <Field label="Année">
                    <Input
                        type="number"
                        value={form.year}
                        onChange={(e) => set("year", e.target.value)}
                    />
                </Field>

                <Field label="Titre (optionnel)">
                    <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
                </Field>

                <Field label="Section (optionnel)">
                    <Input value={form.section} onChange={(e) => set("section", e.target.value)} />
                </Field>

                <Field label="Groupe (optionnel)">
                    <Input value={form.group} onChange={(e) => set("group", e.target.value)} />
                </Field>

                <Field label="Chapitre (optionnel)">
                    <Input value={form.chapter} onChange={(e) => set("chapter", e.target.value)} />
                </Field>
            </div>

            <Button type="submit" disabled={submitting} className="w-fit">
                {submitting ? "Envoi…" : "Envoyer pour validation"}
            </Button>
        </form>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {children}
        </div>
    );
}

function SelectInput({
    value,
    placeholder,
    options,
    onChange,
    disabled,
}: {
    value: string;
    placeholder: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    return (
        <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                        {o.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
