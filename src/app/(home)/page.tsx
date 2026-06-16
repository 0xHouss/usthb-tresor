import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  FileText,
  FlaskConical,
  GraduationCap,
  Library,
  PencilLine,
  ShieldCheck,
  Search,
  UploadCloud,
  Users,
} from "lucide-react";
import ResourceCard from "@/components/resource-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn, fileTypeLabels } from "@/lib/utils";
import { FileType } from "@prisma/client";

const TYPE_ICONS: Record<FileType, typeof BookOpen> = {
  Lecture: BookOpen,
  DW_Worksheet: PencilLine,
  PW_Worksheet: FlaskConical,
  Interrogation: ClipboardList,
  Exam: GraduationCap,
  PW_Exam: FileText,
};

const STEPS = [
  {
    icon: Search,
    title: "Browse",
    text: "Filter by major, module, type, level and year to find exactly what you need.",
  },
  {
    icon: UploadCloud,
    title: "Contribute",
    text: "Share your lectures, worksheets and past exams in a few clicks, with full metadata.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewed",
    text: "Every submission is checked by a moderator before it's published to the community.",
  },
];

function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("max-w-[1200px] w-full m-auto px-4", className)} {...props} />;
}

async function getStats() {
  const [resources, majors, modules, contributors] = await Promise.all([
    prisma.file.count(),
    prisma.major.count(),
    prisma.module.count(),
    prisma.file.findMany({ distinct: ["uploadedByEmail"], select: { uploadedByEmail: true } }),
  ]);
  return { resources, majors, modules, contributors: contributors.length };
}

export default async function Home() {
  const [session, stats, majors, recent] = await Promise.all([
    auth(),
    getStats(),
    prisma.major.findMany({ orderBy: { name: "asc" } }),
    prisma.file.findMany({ orderBy: { uploadedAt: "desc" }, take: 6 }),
  ]);

  const statItems = [
    { label: "Resources", value: stats.resources, icon: Library },
    { label: "Majors", value: stats.majors, icon: GraduationCap },
    { label: "Modules", value: stats.modules, icon: BookOpen },
    { label: "Contributors", value: stats.contributors, icon: Users },
  ];

  return (
    <main className="flex flex-col gap-20 py-12">
      {/* Hero */}
      <Section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary" className="gap-1">
          <GraduationCap className="size-3.5" />
          USTHB student platform
        </Badge>
        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          {"All of USTHB's knowledge, "}
          <span className="text-primary">in one place.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Your collaborative hub for academic resources — old exams, lecture notes, worksheets and
          more. Search, share, and learn with the USTHB community. 🚀
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/browse" className={buttonVariants({ size: "lg" })}>
            Browse Now
          </Link>
          <Link
            href={session?.user ? "/contribute" : "/login"}
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Contribute
          </Link>
        </div>
      </Section>

      {/* Stats */}
      <Section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statItems.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-xl border bg-card p-6 text-center"
          >
            <Icon className="size-5 text-muted-foreground" />
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        ))}
      </Section>

      {/* Browse by type */}
      <Section className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Browse by type</h2>
          <Link
            href="/browse"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(Object.keys(TYPE_ICONS) as FileType[]).map((type) => {
            const Icon = TYPE_ICONS[type];
            return (
              <Link
                key={type}
                href={`/browse?types=${type}`}
                className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="font-medium">{fileTypeLabels[type]}</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* How it works */}
      <div className="bg-muted/40 py-12">
        <Section className="flex flex-col gap-8">
          <h2 className="text-center text-2xl font-bold">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="font-semibold">
                  {i + 1}. {title}
                </h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Browse by major */}
      {majors.length > 0 && (
        <Section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">Browse by major</h2>
          <div className="flex flex-wrap gap-2">
            {majors.map((major) => (
              <Link
                key={major.id}
                href={`/browse?majors=${encodeURIComponent(major.name)}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {major.name}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Recent uploads */}
      <Section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Recent uploads</h2>
        {recent.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((file) => (
              <ResourceCard key={file.id} file={file} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
            <Library className="size-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              No resources published yet. Be the first to contribute!
            </p>
            <Link href={session?.user ? "/contribute" : "/login"} className={buttonVariants()}>
              Contribute a resource
            </Link>
          </div>
        )}
      </Section>
    </main>
  );
}
