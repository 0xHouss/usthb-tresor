"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { SearchParams } from './page';

export default function SearchBar({ searchParams }: { searchParams: Awaited<SearchParams> }) {
  const [search, setSearch] = useState(searchParams.search || '')
  const [semester, setSemester] = useState(searchParams.semester || '')
  const [speciality, setSpeciality] = useState(searchParams.speciality || '')
  const [section, setSection] = useState(searchParams.section || '')
  const [group, setGroup] = useState(searchParams.group || '')
  const [schoolYear, setSchoolYear] = useState(searchParams.schoolYear || '')
  const [academicYear, setAcademicYear] = useState(searchParams.academicYear || '')
  const [professor, setProfessor] = useState(searchParams.professor || '')
  const [type, setType] = useState(searchParams.type || '')

  function handleSubmit() {
    const params = new URLSearchParams(searchParams);

    if (search)
      params.set("search", search);

    if (semester)
      params.set("semester", semester);

    if (speciality)
      params.set("speciality", speciality);

    if (section)
      params.set("section", section);

    if (group)
      params.set("group", group);

    if (schoolYear)
      params.set("schoolYear", schoolYear);

    if (academicYear)
      params.set("academicYear", academicYear);

    if (professor)
      params.set("professor", professor);

    if (type)
      params.set("type", type);

    window.location.search = params.toString();
  }

  return (
    <div className='flex gap-2 flex-wrap'>
      <div className="relative mb-6 flex-1">
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      <Select onValueChange={(value) => setType(value)} value={type}>
        <SelectTrigger>
          <input type="text" hidden id="type" name="type" value={type} readOnly />
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Exam">Exam</SelectItem>
          <SelectItem value="Interro">Interro</SelectItem>
          <SelectItem value="Worksheet">Worksheet</SelectItem>
          <SelectItem value="Lecture">Lecture</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setSemester(value)} value={semester}>
        <SelectTrigger>
          <input type="text" hidden id="semester" name="semester" value={semester} readOnly />
          <SelectValue placeholder="Select Semester" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setSpeciality(value)} value={speciality}>
        <SelectTrigger>
          <input type="text" hidden id="speciality" name="speciality" value={speciality} readOnly />
          <SelectValue placeholder="Select Speciality" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Computer Science">Computer Science</SelectItem>
          <SelectItem value="Mathematics">Mathematics</SelectItem>
          <SelectItem value="Physics">Physics</SelectItem>
          <SelectItem value="Chemistry">Chemistry</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setAcademicYear(value)} value={academicYear}>
        <SelectTrigger>
          <input type="text" hidden id="academicYear" name="academicYear" value={academicYear} readOnly />
          <SelectValue placeholder="Select Academic Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="L1">L1</SelectItem>
          <SelectItem value="L2">L2</SelectItem>
          <SelectItem value="L3">L3</SelectItem>
          <SelectItem value="M1">M1</SelectItem>
          <SelectItem value="M2">M2</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setSection(value)} value={section}>
        <SelectTrigger>
          <input type="text" hidden id="section" name="section" value={section} readOnly />
          <SelectValue placeholder="Select Section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A">A</SelectItem>
          <SelectItem value="B">B</SelectItem>
          <SelectItem value="C">C</SelectItem>
          <SelectItem value="D">D</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setGroup(value)} value={group}>
        <SelectTrigger>
          <input type="text" hidden id="group" name="group" value={group} readOnly />
          <SelectValue placeholder="Select Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setSchoolYear(value)} value={schoolYear}>
        <SelectTrigger>
          <input type="text" hidden id="schoolYear" name="schoolYear" value={schoolYear} readOnly />
          <SelectValue placeholder="Select School Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2027/2028">2021/2022</SelectItem>
          <SelectItem value="2024/2025">2022/2023</SelectItem>
          <SelectItem value="2025/2026">2023/2024</SelectItem>
          <SelectItem value="2026/2027">2024/2025</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setProfessor(value)} value={professor}>
        <SelectTrigger>
          <input type="text" hidden id="professor" name="professor" value={professor} readOnly />
          <SelectValue placeholder="Select Professor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Farouk Adda">Farouk Adda</SelectItem>
          <SelectItem value="Abdelmajid Boukra">Abdelmajid Boukra</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleSubmit}>Search</Button>
    </div>
  )
}
