import { UserRole } from "@prisma/client";
import type { User as SessionUser } from "next-auth";

declare module 'next-auth/jwt' {
    interface JWT {
        email: string
        role: UserRole
    }
}

interface User extends SessionUser {
    role: UserRole
}

declare module 'next-auth' {
    interface Session {
        user: User
    }
}