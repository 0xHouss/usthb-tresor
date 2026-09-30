import "server-only";

import { routing } from "@/i18n/routing";
import { revalidatePath } from "next/cache";

/** Revalidates an app path (e.g. "/browse") in every locale. */
export function revalidateLocalized(path: string) {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${path === "/" ? "" : path}`);
  }
}
