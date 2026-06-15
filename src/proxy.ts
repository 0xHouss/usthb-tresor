import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const role = req.nextauth.token?.role;

        if (pathname.startsWith("/moderate") && role !== "MODERATOR" && role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        pages: { signIn: "/login" },
        callbacks: {
            // Require a session for every matched route; per-role checks happen above.
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/contribute", "/contribute/:path*", "/moderate", "/moderate/:path*"],
};
