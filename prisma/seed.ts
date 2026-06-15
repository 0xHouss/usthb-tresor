import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const MAJORS: { name: string; modules: string[] }[] = [
    {
        name: "Informatique",
        modules: [
            "Analyse 1",
            "Algèbre 1",
            "Algorithmique et structures de données",
            "Systèmes d'exploitation",
            "Compilation",
            "Bases de données",
            "Réseaux",
        ],
    },
    {
        name: "Mathématiques",
        modules: ["Analyse 1", "Algèbre 1", "Topologie", "Probabilités", "Analyse numérique"],
    },
    {
        name: "Génie Civil",
        modules: ["Résistance des matériaux", "Béton armé", "Mécanique des sols", "Hydraulique"],
    },
    {
        name: "Physique",
        modules: ["Mécanique du point", "Électromagnétisme", "Thermodynamique", "Optique"],
    },
];

const PROFESSORS = ["Dr. Benali", "Pr. Hamadi", "Dr. Saidi", "Pr. Cherif", "Dr. Mansouri"];

async function main() {
    for (const entry of MAJORS) {
        const major = await prisma.major.upsert({
            where: { name: entry.name },
            update: {},
            create: { name: entry.name },
        });

        for (const moduleName of entry.modules) {
            await prisma.module.upsert({
                where: { name_majorId: { name: moduleName, majorId: major.id } },
                update: {},
                create: { name: moduleName, majorId: major.id },
            });
        }
    }

    for (const fullName of PROFESSORS) {
        await prisma.professor.upsert({
            where: { fullName },
            update: {},
            create: { fullName },
        });
    }

    const [majors, modules, professors] = await Promise.all([
        prisma.major.count(),
        prisma.module.count(),
        prisma.professor.count(),
    ]);
    console.log(`Seed complete: ${majors} majors, ${modules} modules, ${professors} professors.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
