"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastMessage } from "@/hooks/use-toast-message";
import { EMPTY_FORM_STATE, getPrevValue } from "@/lib/form-state";
import { AcademicLevel, FileType, Major, Module, Professor, Semester } from "@prisma/client";
import { Upload } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { uploadFile } from "./actions";
import { CreatableCombobox } from "@/components/creatable-combobox";

interface ContributeFormProps {
  majors: Major[];
  professors: Professor[];
  modules: Module[];
}

export function ContributeForm({ majors, professors, modules}: ContributeFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("")
  const [semester, setSemester] = useState("")
  const [academicLevel, setAcademicLevel] = useState("")
  const [state, action, pending] = useActionState(uploadFile, EMPTY_FORM_STATE)

  const [major, setMajor] = useState("")
  const [professor, setProfessor] = useState("")
  const [module, setModule] = useState("")

  useToastMessage(state)

  useEffect(() => {
    if (state.reset) {
      setFile(null)
      setFileType("")
      setSemester("")
      setAcademicLevel("")
      setMajor("")
      setProfessor("")
      setModule("")
    }
  }, [state])

  return (
    <form className="space-y-4" action={action}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Major</Label>
          {/* <Input required placeholder="e.g., Computer Science" name="major" id="major" defaultValue={getPrevValue(state, 'major')} /> */}

          <CreatableCombobox
            options={majors.map(major => ({
              label: major.name,
              value: major.name
            }))}
            value={major}
            onValueChange={setMajor}
            placeholder="Select or type a major..."
            searchPlaceholder="Search majors..."
            emptyMessage="No major found."
            selectMessage="Select"
          />
          <input type="text" id="major" name="major" value={major} readOnly hidden />

          <ErrorMessage errors={state.fieldErrors.major} />
        </div>
        <div className="space-y-2">
          <Label>Academic Level</Label>
          <Select onValueChange={(value: AcademicLevel) => setAcademicLevel(value)} value={academicLevel}>
            <SelectTrigger>
              <input type="text" id="academicLevel" name="academicLevel" value={academicLevel} readOnly hidden />
              <SelectValue placeholder="Select academic level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L1">L1</SelectItem>
              <SelectItem value="L2">L2</SelectItem>
              <SelectItem value="L3">L3</SelectItem>
              <SelectItem value="M1">M1</SelectItem>
              <SelectItem value="M2">M2</SelectItem>
              <SelectItem value="D1">D1</SelectItem>
              <SelectItem value="D2">D2</SelectItem>
              <SelectItem value="D3">D3</SelectItem>
              <SelectItem value="ING1">ING1</SelectItem>
              <SelectItem value="ING2">ING2</SelectItem>
              <SelectItem value="ING3">ING3</SelectItem>
              <SelectItem value="ING4">ING4</SelectItem>
              <SelectItem value="ING5">ING5</SelectItem>
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.academicLevel} />
        </div>
        <div className="space-y-2">
          <Label>Section</Label>
          <Input required placeholder="e.g., A" name="section" id="section" defaultValue={getPrevValue(state, 'section')} />

          <ErrorMessage errors={state.fieldErrors.section} />
        </div>
        <div className="space-y-2">
          <Label>Group (Optional)</Label>
          <Input placeholder="e.g., 1" name="group" id="group" defaultValue={getPrevValue(state, 'group')} />

          <ErrorMessage errors={state.fieldErrors.group} />
        </div>
        <div className="space-y-2">
          <Label>Academic Year</Label>
          <Input required placeholder="e.g., 2024/2025" name="academicYear" id="academicYear" pattern="^\d{4}/\d{4}$" defaultValue={getPrevValue(state, 'academicYear')} />

          <ErrorMessage errors={state.fieldErrors.academicYear} />
        </div>
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select required onValueChange={(value: Semester) => setSemester(value)} value={semester}>
            <SelectTrigger>
              <input type="text" id="semester" name="semester" value={semester} readOnly hidden />
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S1">S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.semester} />
        </div>
        <div className="space-y-2">
          <Label>Module</Label>
          {/* <Input required placeholder="e.g., Analysis 1" name="module" id="module" defaultValue={getPrevValue(state, 'module')} /> */}

          <CreatableCombobox
            options={modules.map(module => ({
              label: module.name,
              value: module.name
            }))}
            value={module}
            onValueChange={setModule}
            placeholder="Select or type a module..."
            searchPlaceholder="Search modules..."
            emptyMessage="No module found."
            selectMessage="Select"
          />
          <input type="text" id="module" name="module" value={module} readOnly hidden />

          <ErrorMessage errors={state.fieldErrors.module} />
        </div>
        <div className="space-y-2">
          <Label>Professor</Label>
          {/* <Input required placeholder="e.g., John Doe" name="professor" id="professor" defaultValue={getPrevValue(state, 'professor')} /> */}

          <CreatableCombobox
            options={professors.map(professor => ({
              label: professor.fullName,
              value: professor.fullName
            }))}
            value={professor}
            onValueChange={setProfessor}
            placeholder="Select or type a professor..."
            searchPlaceholder="Search professors..."
            emptyMessage="No professor found."
            selectMessage="Select"
          />
          <input type="text" id="professor" name="professor" value={professor} readOnly hidden />

          <ErrorMessage errors={state.fieldErrors.professor} />
        </div>
        <div className="col-span-2 space-y-2">
          <Label>Resource Type</Label>
          <Select onValueChange={(value: FileType) => setFileType(value)} value={fileType}>
            <SelectTrigger>
              <input type="text" id="type" name="type" value={fileType} readOnly hidden />
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lecture">Lecture</SelectItem>
              <SelectItem value="DW_Worksheet">DW Worksheet</SelectItem>
              <SelectItem value="PW_Worksheet">PW Worksheet</SelectItem>
              <SelectItem value="Interrogation">Interrogation</SelectItem>
              <SelectItem value="Exam">Exam</SelectItem>
              <SelectItem value="PW_Exam">PW Exam</SelectItem>
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.type} />
        </div>

      </div>

      <div className="space-y-2">
        <div className="border-2 border-dashed rounded-lg p-4 text-center">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="fileInput"
            name="file"
            onChange={e => setFile(e.target.files?.[0] || null)}
            defaultValue={getPrevValue(state, 'file')}
          />
          <Label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-gray-500" />
            <span className="text-sm text-gray-500">{file ? file.name : "Click to upload a PDF"}</span>
          </Label>

        </div>

        <ErrorMessage errors={state.fieldErrors.file} />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Uploading..." : "Submit"}
      </Button>
    </form>
  )
}

function ErrorMessage({ errors }: { errors: string[] | undefined }) {
  if (!errors?.length) return null;

  return (
    <p className="text-sm text-red-500">
      {errors[0]}
    </p>
  )
}