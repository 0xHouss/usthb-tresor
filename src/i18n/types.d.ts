import type messages from "../../messages/fr.json";
import type { routing } from "./routing";

// Types translation keys against the French catalogue, so a missing or
// misspelled key fails `pnpm typecheck`.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
