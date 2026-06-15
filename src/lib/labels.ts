import type {
    AcademicLevel,
    ResourceStatus,
    ResourceType,
    Semester,
} from "@/generated/prisma/client";

export const RESOURCE_TYPES: ResourceType[] = [
    "LECTURE",
    "DW_WORKSHEET",
    "PW_WORKSHEET",
    "INTERROGATION",
    "EXAM",
    "PW_EXAM",
];

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
    LECTURE: "Cours",
    DW_WORKSHEET: "TD",
    PW_WORKSHEET: "TP",
    INTERROGATION: "Interrogation",
    EXAM: "Examen",
    PW_EXAM: "Examen TP",
};

export const ACADEMIC_LEVELS: AcademicLevel[] = [
    "L1",
    "L2",
    "L3",
    "M1",
    "M2",
    "D1",
    "D2",
    "D3",
    "ING1",
    "ING2",
    "ING3",
    "ING4",
    "ING5",
];

export const SEMESTERS: Semester[] = ["S1", "S2"];

export const SEMESTER_LABELS: Record<Semester, string> = {
    S1: "Semestre 1",
    S2: "Semestre 2",
};

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
    PENDING: "En attente",
    APPROVED: "Approuvé",
    REJECTED: "Rejeté",
};
