if (process.env.NODE_ENV === 'production') {
  console.log('❌ Seeding aborted: Do not run seeds in production.');
  process.exit(1);
}

import { getCurrentAcademicYear } from '@/lib/utils';
import { PrismaPg } from '@prisma/adapter-pg';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Ensure the uploader exists (File/PendingFile reference it via FK).
  await prisma.user.upsert({
    where: { email: 'tkthoussam@gmail.com' },
    update: {},
    create: { email: 'tkthoussam@gmail.com', name: 'Houssam' },
  });

  // Create dummy professors
  const professors = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.professor.create({
        data: {
          fullName: faker.person.fullName(),
        },
      })
    )
  );

  // Create dummy modules
  const modules = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.module.create({
        data: {
          name: faker.science.chemicalElement().name,
        },
      })
    )
  );

  // Create dummy majors
  const majors = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.major.create({
        data: {
          name: faker.lorem.word().toUpperCase(),
        },
      })
    )
  );

  const fileTypes = ['Lecture', 'DW_Worksheet', 'PW_Worksheet', 'Interrogation', 'Exam', 'PW_Exam'] as const;
  const academicLevels = ['L1', 'L2', 'L3', 'M1', 'M2', 'D1', 'D2', 'D3', 'ING1', 'ING2', 'ING3', 'ING4', 'ING5'] as const;
  const semesters = ['S1', 'S2'] as const;

  // Create 100 dummy files
  await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prisma.file.create({
        data: {
          driveId: faker.string.uuid(),
          type: faker.helpers.arrayElement(fileTypes),
          academicLevel: faker.helpers.arrayElement(academicLevels),
          academicYear: faker.number.int({ min: 1974, max: getCurrentAcademicYear() }),
          semester: faker.helpers.arrayElement(semesters),
          section: faker.number.int({ min: 1, max: 5 }).toString(),
          group: faker.number.int({ min: 1, max: 3 }).toString(),
          majorName: faker.helpers.arrayElement(majors).name,
          moduleName: faker.helpers.arrayElement(modules).name,
          professorFullName: faker.helpers.arrayElement(professors).fullName,
          uploadedByEmail: 'tkthoussam@gmail.com',
        },
      })
    )
  );

  // Create 100 dummy pending files
  await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prisma.pendingFile.create({
        data: {
          driveId: faker.string.uuid(),
          type: faker.helpers.arrayElement(fileTypes),
          academicLevel: faker.helpers.arrayElement(academicLevels),
          academicYear: faker.number.int({ min: 1974, max: getCurrentAcademicYear() }),
          semester: faker.helpers.arrayElement(semesters),
          section: faker.number.int({ min: 1, max: 5 }).toString(),
          group: faker.number.int({ min: 1, max: 3 }).toString(),
          majorName: faker.helpers.arrayElement(majors).name,
          moduleName: faker.helpers.arrayElement(modules).name,
          professorFullName: faker.helpers.arrayElement(professors).fullName,
          uploadedByEmail: 'tkthoussam@gmail.com',
        },
      })
    )
  );

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
