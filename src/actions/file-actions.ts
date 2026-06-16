"use server"

import { ParsedSearchParams } from "@/app/(home)/browse/page"
import { auth, signOut } from "@/lib/auth"
import { FormState, fromErrorToFormState, toFormState } from "@/lib/form-state"
import { uploadPublicFile } from "@/lib/google-drive"
import { prisma } from "@/lib/prisma"
import { getCurrentAcademicYear, MAX_FILE_SIZE, MAX_FILE_SIZE_MB, PAGE_SIZE } from "@/lib/utils"
import { AcademicLevel, FileStatus, FileType, Semester } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const getMajors = prisma.major.findMany;
export const getProfessors = prisma.professor.findMany;
export const getModules = prisma.module.findMany;

export async function getAcademicYearRange() {
  // Get the minimum academicYear
  const minResult = await prisma.file.aggregate({
    _min: {
      academicYear: true,
    },
  });

  // Get the maximum academicYear
  const maxResult = await prisma.file.aggregate({
    _max: {
      academicYear: true,
    },
  });

  // Extract the values, they can be null if no rows exist
  const minYear = minResult._min.academicYear || 1974;
  const maxYear = (maxResult._max.academicYear ? maxResult._max.academicYear : getCurrentAcademicYear()) + 1;

  return {
    minYear,
    maxYear,
  };
}

export async function getFiles({ academicLevels, modules, majors, professors, startYear, endYear, semester, types, group, section, page }: ParsedSearchParams) {
  const files = await prisma.file.findMany({
    where: {
      moduleName: modules?.length ? { in: modules } : undefined,
      professorFullName: professors?.length ? { in: professors } : undefined,
      academicLevel: academicLevels?.length ? { in: academicLevels } : undefined,
      semester: semester ? { equals: semester } : undefined,
      type: types?.length ? { in: types } : undefined,
      majorName: majors?.length ? { in: majors } : undefined,
      academicYear: {
        gte: startYear,
        lte: endYear,
      },
      section: { equals: section },
      group: { equals: group },
    },
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const totalCount = await prisma.file.count({
    where: {
      moduleName: modules?.length ? { in: modules } : undefined,
      professorFullName: professors?.length ? { in: professors } : undefined,
      academicLevel: academicLevels?.length ? { in: academicLevels } : undefined,
      semester: semester ? { equals: semester } : undefined,
      type: types?.length ? { in: types } : undefined,
      majorName: majors?.length ? { in: majors } : undefined,
      academicYear: {
        gte: startYear ? startYear : undefined,
        lte: endYear ? endYear : undefined,
      },
      section: { equals: section },
      group: { equals: group },
    }
  });

  return { files, totalCount };
}

const UploadFormSchema = z.object({
  major: z.string(),
  academicLevel: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(AcademicLevel, { message: 'Please select a valid option.' })),
  section: z.string(),
  group: z.string(),
  academicYear: z
    .string()
    .regex(/^\d{4}\/\d{4}$/, "Academic year must be in format YYYY/YYYY")
    .refine(y => +y.split("/")[1] === +y.split("/")[0] + 1, "The second year must be the first year plus one."),
  semester: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(Semester, { message: 'Please select a valid option.' })),
  module: z.string(),
  professor: z.string(),
  type: z.string({ message: 'Please select an option.' }).min(1, 'Please select an option.').pipe(z.nativeEnum(FileType, { message: 'Please select a valid option.' })),
  file: z
    .instanceof(File)
    .refine(f => f.size, 'Please provide a file.')
    .refine(file => file.type === 'application/pdf', 'Only PDF files are allowed.')
    .refine(file => file.size <= MAX_FILE_SIZE, `File must be ${MAX_FILE_SIZE_MB} MB or smaller.`)
})

export async function uploadFile(state: FormState, formData: FormData): Promise<FormState> {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.email)
      throw new Error('Unauthorized access.');

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!dbUser) signOut({ redirectTo: '/login' });

    const { file, ...metadata } = UploadFormSchema.parse({
      major: formData.get('major'),
      academicLevel: formData.get('academicLevel'),
      section: formData.get('section'),
      group: formData.get('group'),
      academicYear: formData.get('academicYear'),
      semester: formData.get('semester'),
      module: formData.get('module'),
      professor: formData.get('professor'),
      type: formData.get('type'),
      file: formData.get('file'),
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${metadata.type} ${metadata.module} ${metadata.major} ${metadata.academicLevel} S-${metadata.section}${metadata.group ? `G-${metadata.group}` : ''} ${metadata.academicYear}.pdf`;

    // Upload to Drive and make it public (the app's status flag controls listing, not access).
    const fileId = await uploadPublicFile(buffer, fileName);

    await prisma.pendingFile.create({
      data: {
        driveId: fileId,
        uploadedBy: { connect: { email: user.email } },
        academicLevel: metadata.academicLevel,
        majorName: metadata.major,
        section: metadata.section,
        group: metadata.group,
        academicYear: +metadata.academicYear.split("/")[0],
        semester: metadata.semester,
        moduleName: metadata.module,
        professorFullName: metadata.professor,
        type: metadata.type,
      }
    })

    revalidatePath("/contribute");

    return toFormState('SUCCESS', formData, {
      message: 'File uploaded successfully!',
      reset: true,
    });
  } catch (error) {
    console.error("File upload error:", error);

    return fromErrorToFormState(error, formData)
  }
}

export async function approveFile(fileId: string) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "Admin" && session.user.role !== "Moderator") {
    throw new Error("Insufficient permissions")
  }

  try {
    const pendingFile = await prisma.pendingFile.findUniqueOrThrow({
      where: { id: fileId }
    })

    await prisma.file.create({
      data: {
        driveId: pendingFile.driveId,
        type: pendingFile.type,
        academicLevel: pendingFile.academicLevel,
        academicYear: pendingFile.academicYear,
        semester: pendingFile.semester,
        section: pendingFile.section,
        group: pendingFile.group,
        major: {
          connectOrCreate: {
            where: { name: pendingFile.majorName },
            create: { name: pendingFile.majorName }
          }
        },
        module: {
          connectOrCreate: {
            where: { name: pendingFile.moduleName },
            create: { name: pendingFile.moduleName }
          }
        },
        professor: {
          connectOrCreate: {
            where: { fullName: pendingFile.professorFullName },
            create: { fullName: pendingFile.professorFullName }
          }
        },
        uploadedBy: { connect: { email: pendingFile.uploadedByEmail } },
      }
    })

    await prisma.pendingFile.update({
      where: { id: fileId },
      data: { status: FileStatus.Approved },
    })

    revalidatePath("/dashboard")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to approve file:", error)
    throw new Error("Failed to approve file")
  }
}

export async function rejectFile(fileId: string) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }

  if (session.user.role !== "Admin" && session.user.role !== "Moderator") {
    throw new Error("Insufficient permissions")
  }

  try {
    await prisma.pendingFile.update({
      where: { id: fileId },
      data: { status: FileStatus.Rejected },
    })

    revalidatePath("/dashboard")
    revalidatePath("/browse")
    return { success: true }
  } catch (error) {
    console.error("Failed to reject file:", error)
    throw new Error("Failed to reject file")
  }
}
