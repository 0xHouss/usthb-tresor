import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware replacements for next/link and next/navigation. Use these for
// in-app links and redirects so the current locale is kept.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
