"use client"

import type { AcademicYearRange } from "@/dal/files"
import { ParsedSearchParams } from "@/app/(home)/browse/page"
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
import { Major, Module, Professor } from "@prisma/client"
import { Check, ChevronsUpDown, Filter, X } from "lucide-react"
import { useState } from "react"

const academicLevels = [
  "L1",
  "L2",
  "L3",
  "M1",
  "M2",
  "D1",
  "D2",
  "D3",
  "ING 1",
  "ING 2",
  "ING 3",
  "ING 4",
  "ING 5",
]

const fileTypes = [
  { label: "Lecture", value: "Lecture" },
  { label: "DW Worksheet", value: "DW_Worksheet" },
  { label: "PW Worksheet", value: "PW_Worksheet" },
  { label: "Interrogation", value: "Interrogation" },
  { label: "Exam", value: "Exam" },
  { label: "PW Exam", value: "PW_Exam" },
]

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
  const [filtersVisible, setFiltersVisible] = useState(true)

  const yearRange = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)

  const totalActiveFilters = [
    ...selectedMajors,
    ...selectedLevels,
    ...selectedModules,
    ...selectedProfessors,
    ...selectedTypes,
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

    window.location.search = params.toString();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-medium">Filters</h3>
          <Badge variant="secondary" className="ml-1">
            {totalActiveFiltersNumber}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="px-2 h-0 text-xs cursor-pointer">
            Clear all
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            {filtersVisible ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <ScrollArea className={cn("flex-1 p-4 overflow-hidden", !filtersVisible && "hidden md:block")}>
        <Accordion type="multiple" defaultValue={["major", "level", "year", "type"]}>
          <AccordionItem value="major">
            <AccordionTrigger className="text-sm font-medium">Major</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                      {selectedMajors.length > 0 ? `${selectedMajors.length} selected` : "Select major..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search major..." />
                      <CommandList>
                        <CommandEmpty>No major found.</CommandEmpty>
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
            <AccordionTrigger className="text-sm font-medium">Academic Level</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedLevels.length > 0 ? `${selectedLevels.length} selected` : "Select levels..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" side="bottom">
                    <Command>
                      <CommandInput placeholder="Search levels..." />
                      <CommandList>
                        <CommandEmpty>No level found.</CommandEmpty>
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
            <AccordionTrigger className="text-sm font-medium">Section & Group</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    placeholder="Enter section..."
                    value={section}
                    onChange={e => setSection(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group">Group</Label>
                  <Input
                    id="group"
                    placeholder="Enter group..."
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="year">
            <AccordionTrigger className="text-sm font-medium">Academic Year</AccordionTrigger>
            <AccordionContent>
              <div className="flex justify-between items-center gap-4">
                <Select value={startYear.toString()} onValueChange={(value) => setStartYear(Number(value))}>
                  <SelectTrigger id="year-start" className="flex-1">
                    <SelectValue placeholder="Select start year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearRange.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm">to</span>
                <Select value={endYear.toString()} onValueChange={(value) => setEndYear(Number(value))}>
                  <SelectTrigger id="year-end" className="flex-1">
                    <SelectValue placeholder="Select end year" />
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
            <AccordionTrigger className="text-sm font-medium">Semester</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                <Button
                  variant={semester === "1" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSemester(semester === "1" ? null : "1")}
                >
                  Semester 1
                </Button>
                <Button
                  variant={semester === "2" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSemester(semester === "2" ? null : "2")}
                >
                  Semester 2
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="module">
            <AccordionTrigger className="text-sm font-medium">Module</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedModules.length > 0 ? `${selectedModules.length} selected` : "Select modules..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search modules..." />
                      <CommandList>
                        <CommandEmpty>No module found.</CommandEmpty>
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
            <AccordionTrigger className="text-sm font-medium">Professor</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedProfessors.length > 0 ? `${selectedProfessors.length} selected` : "Select professors..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search professors..." />
                      <CommandList>
                        <CommandEmpty>No professor found.</CommandEmpty>
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
            <AccordionTrigger className="text-sm font-medium">File Type</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {fileTypes.map(type => (
                  <Badge
                    key={type.value}
                    variant={selectedTypes.includes(type.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter(type.value, selectedTypes, setSelectedTypes)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <form className={cn("p-4 border-t", !filtersVisible && "hidden md:block")} onSubmit={handleSubmit}>
        <Button className="w-full cursor-pointer">Apply Filters</Button>
      </form>
    </div>
  )
}