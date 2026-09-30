"use client";

import { uploadFile } from "@/actions/file-actions";
import { CreatableCombobox } from "@/components/creatable-combobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastMessage } from "@/hooks/use-toast-message";
import { EMPTY_FORM_STATE, getPrevValue } from "@/lib/form-state";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@/lib/utils";
import { AcademicLevel, FileType, Language, Major, Module, Professor, Semester } from "@prisma/client";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface ContributeFormProps {
  majors: Major[];
  professors: Professor[];
  modules: Module[];
}

export function ContributeForm({ majors, professors, modules }: ContributeFormProps) {
  const t = useTranslations("contribute");
  const tEnums = useTranslations("enums");
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState("")
  const [semester, setSemester] = useState("")
  const [academicLevel, setAcademicLevel] = useState("")
  const [language, setLanguage] = useState("")
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
      setLanguage("")
      setMajor("")
      setProfessor("")
      setModule("")
    }
  }, [state])

  return (
    <form className="space-y-4" action={action}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("major")}</Label>
          {/* <Input required placeholder="e.g., Computer Science" name="major" id="major" defaultValue={getPrevValue(state, 'major')} /> */}

          <CreatableCombobox
            options={majors.map(major => ({
              label: major.name,
              value: major.name
            }))}
            value={major}
            onValueChange={setMajor}
            placeholder={t("majorPlaceholder")}
            searchPlaceholder={t("majorSearch")}
            emptyMessage={t("majorEmpty")}
            selectMessage={t("comboboxSelect")}
          />
          <input type="text" id="major" name="major" value={major} readOnly hidden />

          <ErrorMessage errors={state.fieldErrors.major} />
        </div>
        <div className="space-y-2">
          <Label>{t("level")}</Label>
          <Select onValueChange={(value: AcademicLevel) => setAcademicLevel(value)} value={academicLevel}>
            <SelectTrigger>
              <input type="text" id="academicLevel" name="academicLevel" value={academicLevel} readOnly hidden />
              <SelectValue placeholder={t("levelPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AcademicLevel).map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.academicLevel} />
        </div>
        <div className="space-y-2">
          <Label>{t("section")}</Label>
          <Input required placeholder={t("sectionPlaceholder")} name="section" id="section" defaultValue={getPrevValue(state, 'section')} />

          <ErrorMessage errors={state.fieldErrors.section} />
        </div>
        <div className="space-y-2">
          <Label>{t("group")}</Label>
          <Input placeholder={t("groupPlaceholder")} name="group" id="group" defaultValue={getPrevValue(state, 'group')} />

          <ErrorMessage errors={state.fieldErrors.group} />
        </div>
        <div className="space-y-2">
          <Label>{t("year")}</Label>
          <Input required placeholder={t("yearPlaceholder")} name="academicYear" id="academicYear" pattern="^\d{4}/\d{4}$" defaultValue={getPrevValue(state, 'academicYear')} />

          <ErrorMessage errors={state.fieldErrors.academicYear} />
        </div>
        <div className="space-y-2">
          <Label>{t("semester")}</Label>
          <Select required onValueChange={(value: Semester) => setSemester(value)} value={semester}>
            <SelectTrigger>
              <input type="text" id="semester" name="semester" value={semester} readOnly hidden />
              <SelectValue placeholder={t("semesterPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Semester).map(value => (
                <SelectItem key={value} value={value}>{tEnums(`semesters.${value}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.semester} />
        </div>
        <div className="space-y-2">
          <Label>{t("module")}</Label>
          {/* <Input required placeholder="e.g., Analysis 1" name="module" id="module" defaultValue={getPrevValue(state, 'module')} /> */}

          <CreatableCombobox
            options={modules.map(module => ({
              label: module.name,
              value: module.name
            }))}
            value={module}
            onValueChange={setModule}
            placeholder={t("modulePlaceholder")}
            searchPlaceholder={t("moduleSearch")}
            emptyMessage={t("moduleEmpty")}
            selectMessage={t("comboboxSelect")}
          />
          <input type="text" id="module" name="module" value={module} readOnly hidden />

          <ErrorMessage errors={state.fieldErrors.module} />
        </div>
        <div className="space-y-2">
          <Label>{t("professor")}</Label>
          {/* <Input required placeholder="e.g., John Doe" name="professor" id="professor" defaultValue={getPrevValue(state, 'professor')} /> */}

          <CreatableCombobox
            options={professors.map(professor => ({
              label: professor.fullName,
              value: professor.fullName
            }))}
            value={professor}
            onValueChange={setProfessor}
            placeholder={t("professorPlaceholder")}
            searchPlaceholder={t("professorSearch")}
            emptyMessage={t("professorEmpty")}
            selectMessage={t("comboboxSelect")}
          />
          <input type="text" id="professor" name="professor" value={professor} readOnly hidden />

          <ErrorMessage errors={state.fieldErrors.professor} />
        </div>
        <div className="space-y-2">
          <Label>{t("type")}</Label>
          <Select onValueChange={(value: FileType) => setFileType(value)} value={fileType}>
            <SelectTrigger>
              <input type="text" id="type" name="type" value={fileType} readOnly hidden />
              <SelectValue placeholder={t("typePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(FileType).map(type => (
                <SelectItem key={type} value={type}>{tEnums(`fileTypes.${type}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.type} />
        </div>
        <div className="space-y-2">
          <Label>{t("language")}</Label>
          <Select onValueChange={(value: Language) => setLanguage(value)} value={language}>
            <SelectTrigger>
              <input type="text" id="language" name="language" value={language} readOnly hidden />
              <SelectValue placeholder={t("languagePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Language).map(value => (
                <SelectItem key={value} value={value}>{tEnums(`languages.${value}`)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ErrorMessage errors={state.fieldErrors.language} />
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
            onChange={e => {
              const selected = e.target.files?.[0] || null;
              if (selected && selected.size > MAX_FILE_SIZE) {
                toast.error(t("fileTooLarge", { maxFileSizeMb: MAX_FILE_SIZE_MB }));
                e.target.value = "";
                setFile(null);
                return;
              }
              setFile(selected);
            }}
            defaultValue={getPrevValue(state, 'file')}
          />
          <Label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-gray-500" />
            <span className="text-sm text-gray-500">{file ? file.name : t("fileHint", { maxFileSizeMb: MAX_FILE_SIZE_MB })}</span>
          </Label>

        </div>

        <ErrorMessage errors={state.fieldErrors.file} />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="anonymous"
          name="anonymous"
          key={state.timestamp}
          defaultChecked={getPrevValue(state, 'anonymous') === 'on'}
        />
        <div className="grid gap-1">
          <Label htmlFor="anonymous">{t("anonymous")}</Label>
          <p className="text-sm text-muted-foreground">
            {t("anonymousHelp")}
          </p>
        </div>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("uploading") : t("submit")}
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