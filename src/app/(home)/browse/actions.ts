"use server";

import { prisma } from "@/lib/prisma";


export async function getFiles() {
    const files = prisma.file.findMany({
        where: {
            status: "APPROVED",
        }
    });

    return files;
}

