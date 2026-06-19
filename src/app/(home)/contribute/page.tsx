import { getMajors, getModules, getProfessors } from "@/dal/taxonomy";
import { ContributeForm } from "./contribute-form";

export default async function ContributePage() {
  const majors = await getMajors()
  const professors = await getProfessors()
  const modules = await getModules()

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload a Resource</h1>
      <ContributeForm
        majors={majors}
        professors={professors}
        modules={modules}
      />
    </div>
  );
}
