"use client"

import type { AcademicYearRange } from "@/dal/files"
import type { ParsedSearchParams } from "@/lib/search-params"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AcademicLevel, FileType, Language, Major, Module, Professor, Semester } from "@prisma/client"
import { Check, ChevronsUpDown, Filter, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

const academicLevels = Object.values(AcademicLevel)
const fileTypes = Object.values(FileType)
const languages = Object.values(Language)

interface SelectedItemBadgeProps {
  label: string
  value: string
  selectedValues: string[]
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>
}

function SelectedItemBadge({ label, value, selectedValues, setSelectedValues }: SelectedItemBadgeProps) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}
      <div className="cursor-pointer" onClick={() => setSelectedValues(selectedValues.filter(v => v !== value))}>
        <X className="h-3 w-3" />
      </div>
    </Badge>
  )
}

interface FileFilterSidebarProps {
  searchParams: ParsedSearchParams
  majors: Major[]
  professors: Professor[]
  modules: Module[]
  academicYearRange: AcademicYearRange
}

export function FileFilterSidebar({ searchParams, majors, modules, professors, academicYearRange: { minYear, maxYear } }: FileFilterSidebarProps) {
  const t = useTranslations("filters")
  const tEnums = useTranslations("enums")
  const [open, setOpen] = useState(false)
  const [selectedMajors, setSelectedMajors] = useState<string[]>(searchParams.majors ?? [])
  const [selectedLevels, setSelectedLevels] = useState<string[]>(searchParams.academicLevels ?? [])
  const [section, setSection] = useState(searchParams.section ?? "")
  const [group, setGroup] = useState(searchParams.group ?? "")
  const [startYear, setStartYear] = useState(searchParams.startYear ?? minYear)
  const [endYear, setEndYear] = useState(searchParams.endYear ?? maxYear)
  const [semester, setSemester] = useState<string | null>(searchParams.semester ?? null)
  const [selectedModules, setSelectedModules] = useState<string[]>(searchParams.modules ?? [])
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>(searchParams.professors ?? [])
  const [selectedTypes, setSelectedTypes] = useState<string[]>(searchParams.types ?? [])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(searchParams.languages ?? [])
  const [filtersVisible, setFiltersVisible] = useState(true)

  const yearRange = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  const totalActiveFilters = [
    ...selectedMajors,
    ...selectedLevels,
    ...selectedModules,
    ...selectedProfessors,
    ...selectedTypes,
    ...selectedLanguages,
  ]

  if (section) totalActiveFilters.push(section)
  if (group) totalActiveFilters.push(group)
  if (semester) totalActiveFilters.push(semester)

  const totalActiveFiltersNumber = totalActiveFilters.length

  const clearAllFilters = () => {
    setSelectedMajors([])
    setSelectedLevels([])
    setSection("")
    setGroup("")
    setStartYear(minYear)
    setEndYear(maxYear)
    setSemester(null)
    setSelectedModules([])
    setSelectedProfessors([])
    setSelectedTypes([])
    setSelectedLanguages([])
  }

  const toggleFilter = (
    value: string,
    selectedValues: string[],
    setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(item => item !== value))
    } else {
      setSelectedValues([...selectedValues, value])
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams();

    if (semester) params.set("semester", semester);
    if (selectedMajors.length) params.set("majors", selectedMajors.join(","));
    if (section) params.set("section", section);
    if (group) params.set("group", group);
    if (startYear) params.set("startYear", startYear.toString());
    if (endYear) params.set("endYear", endYear.toString());
    if (selectedLevels.length) params.set("academicLevels", selectedLevels.join(","));
    if (selectedProfessors.length) params.set("professors", selectedProfessors.join(","));
    if (selectedTypes.length) params.set("types", selectedTypes.join(","));
    if (selectedModules.length) params.set("modules", selectedModules.join(","));
    if (selectedLanguages.length) params.set("languages", selectedLanguages.join(","));

    window.location.search = params.toString();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-medium">{t("title")}</h3>
          <Badge variant="secondary" className="ml-1">
            {totalActiveFiltersNumber}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="px-2 h-0 text-xs cursor-pointer">
            {t("clearAll")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setFiltersVisible(!filtersVisible)}
            aria-label={t("toggle")}
          >
            {filtersVisible ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className={cn("flex-1 p-4 overflow-hidden", !filtersVisible && "hidden md:block")}>
        <Accordion type="multiple" defaultValue={["major", "level", "year", "type", "language"]}>
          <AccordionItem value="major">
            <AccordionTrigger className="text-sm font-medium">{t("major")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                      {selectedMajors.length > 0 ? t("selected", { count: selectedMajors.length }) : t("selectMajor")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder={t("searchMajor")} />
                      <CommandList>
                        <CommandEmpty>{t("noMajor")}</CommandEmpty>
                        <CommandGroup>
                          {majors.map(major => (
                            <CommandItem
                              key={major.name}
                              value={major.name}
                              onSelect={() => toggleFilter(major.name, selectedMajors, setSelectedMajors)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedMajors.includes(major.name) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {major.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedMajors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedMajors.map(value => {
                      const major = majors.find(m => m.name === value)
                      return (
                        <Badge key={value} variant="secondary" className="flex items-center gap-1">
                          {major?.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => setSelectedMajors(selectedMajors.filter((m) => m !== value))}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="level">
            <AccordionTrigger className="text-sm font-medium">{t("level")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedLevels.length > 0 ? t("selected", { count: selectedLevels.length }) : t("selectLevels")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" side="bottom">
                    <Command>
                      <CommandInput placeholder={t("searchLevels")} />
                      <CommandList>
                        <CommandEmpty>{t("noLevel")}</CommandEmpty>
                        <CommandGroup>
                          {academicLevels.map((level) => (
                            <CommandItem
                              key={level}
                              value={level}
                              onSelect={() => toggleFilter(level, selectedLevels, setSelectedLevels)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedLevels.includes(level) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {level}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedLevels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedLevels.map(level => (
                      <SelectedItemBadge
                        key={level}
                        label={level}
                        value={level}
                        selectedValues={selectedLevels}
                        setSelectedValues={setSelectedLevels}
                      />
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="section">
            <AccordionTrigger className="text-sm font-medium">{t("sectionGroup")}</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                <div className="space-y-2">
                  <Label htmlFor="section">{t("section")}</Label>
                  <Input
                    id="section"
                    placeholder={t("sectionPlaceholder")}
                    value={section}
                    onChange={e => setSection(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">{t("group")}</Label>
                  <Input
                    id="group"
                    placeholder={t("groupPlaceholder")}
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="year">
            <AccordionTrigger className="text-sm font-medium">{t("year")}</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-center gap-4">
                <Select value={startYear.toString()} onValueChange={(value) => setStartYear(Number(value))}>
                  <SelectTrigger id="year-start" className="flex-1" aria-label={t("startYear")}>
                    <SelectValue placeholder={t("startYear")} />
                  </SelectTrigger>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm">{t("yearTo")}</span>
                <Select value={endYear.toString()} onValueChange={(value) => setEndYear(Number(value))}>
                  <SelectTrigger id="year-end" className="flex-1" aria-label={t("endYear")}>
                    <SelectValue placeholder={t("endYear")} />
                  </SelectTrigger>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="semester">
            <AccordionTrigger className="text-sm font-medium">{t("semester")}</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                {Object.values(Semester).map(value => (
                  <Button
                    key={value}
                    type="button"
                    variant={semester === value ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setSemester(semester === value ? null : value)}
                  >
                    {tEnums(`semesters.${value}`)}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="module">
            <AccordionTrigger className="text-sm font-medium">{t("module")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedModules.length > 0 ? t("selected", { count: selectedModules.length }) : t("selectModules")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder={t("searchModules")} />
                      <CommandList>
                        <CommandEmpty>{t("noModule")}</CommandEmpty>
                        <CommandGroup>
                          {modules.map(module => (
                            <CommandItem
                              key={module.name}
                              value={module.name}
                              onSelect={() => toggleFilter(module.name, selectedModules, setSelectedModules)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedModules.includes(module.name) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {module.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedModules.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedModules.map(module => (
                      <SelectedItemBadge
                        key={module}
                        label={module}
                        value={module}
                        selectedValues={selectedModules}
                        setSelectedValues={setSelectedModules}
                      />
                    ))}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="professor">
            <AccordionTrigger className="text-sm font-medium">{t("professor")}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedProfessors.length > 0 ? t("selected", { count: selectedProfessors.length }) : t("selectProfessors")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder={t("searchProfessors")} />
                      <CommandList>
                        <CommandEmpty>{t("noProfessor")}</CommandEmpty>
                        <CommandGroup>
                          {professors.map(professor => (
                            <CommandItem
                              key={professor.fullName}
                              value={professor.fullName}
                              onSelect={() => toggleFilter(professor.fullName, selectedProfessors, setSelectedProfessors)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProfessors.includes(professor.fullName) ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {professor.fullName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedProfessors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedProfessors.map(value => {
                      const professor = professors.find(p => p.fullName === value)
                      return (
                        <SelectedItemBadge
                          key={value}
                          label={professor?.fullName || value}
                          value={value}
                          selectedValues={selectedProfessors}
                          setSelectedValues={setSelectedProfessors}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="type">
            <AccordionTrigger className="text-sm font-medium">{t("type")}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {fileTypes.map(type => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                  >
                    {tEnums(`fileTypes.${type}`)}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="language">
            <AccordionTrigger className="text-sm font-medium">{t("language")}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {languages.map(language => (
                  <Badge
                    key={language}
                    variant={selectedLanguages.includes(language) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter(language, selectedLanguages, setSelectedLanguages)}
                  >
                    {tEnums(`languages.${language}`)}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <form className={cn("p-4 border-t", !filtersVisible && "hidden md:block")} onSubmit={handleSubmit}>
        <Button className="w-full cursor-pointer">{t("apply")}</Button>
      </form>
    </div>
  )
}