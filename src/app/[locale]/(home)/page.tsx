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
import { getFileStats, getRecentFiles } from "@/dal/files";
import { getCurrentUser } from "@/dal/session";
import { getMajors } from "@/dal/taxonomy";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
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
  { key: "browse", icon: Search },
  { key: "contribute", icon: UploadCloud },
  { key: "reviewed", icon: ShieldCheck },
] as const;

function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return <section className={cn("max-w-[1200px] w-full m-auto px-4", className)} {...props} />;
}

export default async function Home() {
  const [user, stats, majors, recent, t, tTypes] = await Promise.all([
    getCurrentUser(),
    getFileStats(),
    getMajors(),
    getRecentFiles(6),
    getTranslations("home"),
    getTranslations("enums.fileTypes"),
  ]);

  const statItems = [
    { label: t("stats.resources"), value: stats.resources, icon: Library },
    { label: t("stats.majors"), value: stats.majors, icon: GraduationCap },
    { label: t("stats.modules"), value: stats.modules, icon: BookOpen },
    { label: t("stats.contributors"), value: stats.contributors, icon: Users },
  ];

  return (
    <main className="flex flex-col gap-20 py-12">
      {/* Hero */}
      <Section className="flex flex-col items-center gap-6 text-center">
        <Badge variant="secondary" className="gap-1">
          <GraduationCap className="size-3.5" />
          {t("badge")}
        </Badge>
        <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
          {t("heroTitle")}
          <span className="text-primary">{t("heroHighlight")}</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("heroText")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/browse" className={buttonVariants({ size: "lg" })}>
            {t("browseNow")}
          </Link>
          <Link
            href={user ? "/contribute" : "/login"}
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            {t("contribute")}
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
          <h2 className="text-2xl font-bold">{t("browseByType")}</h2>
          <Link
            href="/browse"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("viewAll")} <ArrowRight className="size-4" />
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
                <span className="font-medium">{tTypes(type)}</span>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* How it works */}
      <div className="bg-muted/40 py-12">
        <Section className="flex flex-col gap-8">
          <h2 className="text-center text-2xl font-bold">{t("howItWorks")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ key, icon: Icon }, i) => (
              <div key={key} className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="font-semibold">
                  {i + 1}. {t(`steps.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">{t(`steps.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Browse by major */}
      {majors.length > 0 && (
        <Section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold">{t("browseByMajor")}</h2>
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
        <h2 className="text-2xl font-bold">{t("recentUploads")}</h2>
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
              {t("empty")}
            </p>
            <Link href={user ? "/contribute" : "/login"} className={buttonVariants()}>
              {t("contributeResource")}
            </Link>
          </div>
        )}
      </Section>
    </main>
  );
}
