"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToastMessage } from "@/hooks/use-toast-message";
import { EMPTY_FORM_STATE } from "@/lib/to-form-state";
import { Upload } from "lucide-react";
import { useActionState, useState } from "react";
import { uploadFile } from "./actions";

export default function ContributePage() {
    const [file, setFile] = useState<File | null>(null);
    const [ressourceType, setRessourceType] = useState('')
    const [semester, setSemester] = useState('')
    const [academicYear, setAcademicYear] = useState('')
    const [state, action, pending] = useActionState(uploadFile.bind(null), EMPTY_FORM_STATE)

    useToastMessage(state)

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Upload a Resource</h1>
            <form className="space-y-4" action={action}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Speciality</Label>
                        <Input placeholder="e.g., Computer Science" name="speciality" id="speciality" />
                    </div>
                    <div>
                        <Label>Academic Year</Label>
                        <Input placeholder="e.g., L1" name="academicYear" id="academicYear" />
                    </div>
                    <div>
                        <Label>Section</Label>
                        <Input placeholder="e.g., A" name="section" id="section" />
                    </div>
                    <div>
                        <Label>Group (Optional)</Label>
                        <Input placeholder="e.g., 1" name="group" id="group" />
                    </div>
                    <div>
                        <Label>School Year</Label>
                        <Input placeholder="e.g., 2024/2025" name="schoolYear" id="schoolYear" />
                    </div>
                    <div>
                        <Label>Semester</Label>
                        <Select required onValueChange={(value) => setSemester(value)}>
                            <SelectTrigger>
                                <input type="text" hidden id="semester" name="semester" value={semester} readOnly />
                                <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Module</Label>
                        <Input placeholder="e.g., Analysis 1" name="module" id="module" />
                    </div>
                    <div>
                        <Label>Professor</Label>
                        <Input placeholder="e.g., John Doe" name="professor" id="professor" />
                    </div>
                    <div className="col-span-2">
                        <Label>Resource Type</Label>
                        <Select required onValueChange={(value) => setRessourceType(value)}>
                            <SelectTrigger>
                                <input type="text" hidden id="type" name="type" value={ressourceType} readOnly />
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Exam">Exam</SelectItem>
                                <SelectItem value="Interro">Interro</SelectItem>
                                <SelectItem value="Worksheet">Worksheet</SelectItem>
                                <SelectItem value="Lecture">Lecture</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        id="fileInput"
                        name="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <span className="text-sm text-gray-500">{file ? file.name : "Click to upload a PDF"}</span>
                    </Label>
                </div>

                <Button type="submit" disabled={pending} className="w-full">
                    {pending ? "Uploading..." : "Submit"}
                </Button>
            </form>
        </div>
    );
}
