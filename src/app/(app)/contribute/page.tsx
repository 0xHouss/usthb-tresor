import { ContributeForm } from "@/components/contribute-form";
import { getMajorsWithModules, listProfessors } from "@/lib/resources";
import { requireUser } from "@/lib/session";

export default async function ContributePage() {
    await requireUser();
    const [majors, professors] = await Promise.all([
        getMajorsWithModules(),
        listProfessors(),
    ]);

    return (
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold">Contribuer une ressource</h1>
                <p className="text-sm text-muted-foreground">
                    Votre contribution sera examinée par un modérateur avant publication.
                </p>
            </div>
            <ContributeForm majors={majors} professors={professors} />
        </div>
    );
}
