import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects unprefixed URLs to a locale (from the NEXT_LOCALE cookie, then
// Accept-Language, then French) and resolves the locale for each request.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals and static files.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
