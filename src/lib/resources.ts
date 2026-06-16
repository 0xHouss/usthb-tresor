import { prisma } from "@/lib/prisma";
import {
    Prisma,
    type AcademicLevel,
    type ResourceStatus,
    type ResourceType,
    type Semester,
} from "@/generated/prisma/client";

export const PAGE_SIZE = 20;

export type ResourceFilters = {
    majorId?: string;
    moduleId?: string;
    professorId?: string;
    type?: ResourceType;
    level?: AcademicLevel;
    semester?: Semester;
    year?: number;
    search?: string;
};

const resourceInclude = {
    major: true,
    module: true,
    professor: true,
} satisfies Prisma.ResourceInclude;

export type ResourceListItem = Prisma.ResourceGetPayload<{
    include: typeof resourceInclude;
}>;

/** Lists resources (defaults to APPROVED) matching the given filters, paginated. */
export async function listResources(
    filters: ResourceFilters = {},
    opts: { status?: ResourceStatus; page?: number } = {}
) {
    const status = opts.status ?? "APPROVED";
    const page = Math.max(1, opts.page ?? 1);

    const where: Prisma.ResourceWhereInput = {
        status,
        majorId: filters.majorId,
        moduleId: filters.moduleId,
        professorId: filters.professorId,
        type: filters.type,
        level: filters.level,
        semester: filters.semester,
        year: filters.year,
        ...(filters.search ? { title: { contains: filters.search } } : {}),
    };

    const [items, total] = await Promise.all([
        prisma.resource.findMany({
            where,
            include: resourceInclude,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * PAGE_SIZE,
            take: PAGE_SIZE,
        }),
        prisma.resource.count({ where }),
    ]);

    return {
        items,
        total,
        page,
        pageSize: PAGE_SIZE,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
}

export function getResourceById(id: string) {
    return prisma.resource.findUnique({
        where: { id },
        include: { ...resourceInclude, contributor: true },
    });
}

export function listPendingResources() {
    return prisma.resource.findMany({
        where: { status: "PENDING" },
        include: { ...resourceInclude, contributor: true },
        orderBy: { createdAt: "asc" },
    });
}

export type CreateResourceInput = {
    title?: string | null;
    type: ResourceType;
    level: AcademicLevel;
    semester: Semester;
    section?: string | null;
    group?: string | null;
    year: number;
    chapter?: string | null;
    majorId: string;
    moduleId: string;
    professorId?: string | null;
    contributorEmail: string;
    driveFileId: string;
    fileName: string;
    mimeType?: string | null;
    size?: number | null;
};

export function createResource(input: CreateResourceInput) {
    return prisma.resource.create({ data: input });
}

export function setResourceStatus(
    id: string,
    status: Extract<ResourceStatus, "APPROVED" | "REJECTED">,
    reviewerEmail: string,
    rejectionReason?: string
) {
    return prisma.resource.update({
        where: { id },
        data: {
            status,
            reviewedByEmail: reviewerEmail,
            reviewedAt: new Date(),
            rejectionReason: status === "REJECTED" ? rejectionReason ?? null : null,
        },
    });
}

/** Majors with their modules, for cascading select inputs. */
export function getMajorsWithModules() {
    return prisma.major.findMany({
        orderBy: { name: "asc" },
        include: { modules: { orderBy: { name: "asc" } } },
    });
}

export function listProfessors() {
    return prisma.professor.findMany({ orderBy: { fullName: "asc" } });
}

export function listMajors() {
    return prisma.major.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });
}

/** Aggregate counts for the landing page. */
export async function getResourceStats() {
    const [resources, majors, modules, contributors] = await Promise.all([
        prisma.resource.count({ where: { status: "APPROVED" } }),
        prisma.major.count(),
        prisma.module.count(),
        prisma.resource.findMany({
            where: { status: "APPROVED" },
            distinct: ["contributorEmail"],
            select: { contributorEmail: true },
        }),
    ]);
    return { resources, majors, modules, contributors: contributors.length };
}

export function getRecentResources(take = 6) {
    return prisma.resource.findMany({
        where: { status: "APPROVED" },
        include: resourceInclude,
        orderBy: { createdAt: "desc" },
        take,
    });
}
