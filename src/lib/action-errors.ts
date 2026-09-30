import "server-only";

import type { ErrorKey } from "@/lib/errors";
import { COMMENT_MAX_LENGTH } from "@/lib/schemas/comment-schema";
import { REPORT_DETAILS_MAX_LENGTH } from "@/lib/schemas/report-schema";
import { MAX_FILE_SIZE_MB } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

// Values the error messages may interpolate.
const LIMITS = {
  maxFileSizeMb: MAX_FILE_SIZE_MB,
  commentMaxLength: COMMENT_MAX_LENGTH,
  reportDetailsMaxLength: REPORT_DETAILS_MAX_LENGTH,
};

/**
 * Translates error keys (from schemas and AppErrors) to the request's locale.
 * Unknown keys, e.g. zod's built-in messages, become a generic "invalid value".
 */
export async function getErrorTranslator() {
  const t = await getTranslations("errors");
  return (key: string) => (t.has(key as ErrorKey) ? t(key as ErrorKey, LIMITS) : t("invalid"));
}
