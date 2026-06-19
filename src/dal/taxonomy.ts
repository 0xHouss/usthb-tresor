import "server-only";

import { prisma } from "@/lib/prisma";

// Reference / taxonomy tables (Major, Module, Professor). These are public,
// read-only lookups used to populate filters and upload form options.

export function getMajors() {
  return prisma.major.findMany({ orderBy: { name: "asc" } });
}

export function getModules() {
  return prisma.module.findMany({ orderBy: { name: "asc" } });
}

export function getProfessors() {
  return prisma.professor.findMany({ orderBy: { fullName: "asc" } });
}
