import { z } from "zod";

const envSchema = z.object({
    GOOGLE_CLIENT_ID: z
        .string({ error: "GOOGLE_CLIENT_ID is required" })
        .min(1, "GOOGLE_CLIENT_ID is required"),
    GOOGLE_CLIENT_SECRET: z
        .string({ error: "GOOGLE_CLIENT_SECRET is required" })
        .min(1, "GOOGLE_CLIENT_SECRET is required"),
    NEXTAUTH_URL: z
        .string({ error: "NEXTAUTH_URL is required" })
        .min(1, "NEXTAUTH_URL is required"),
    NEXTAUTH_SECRET: z
        .string({ error: "AUTH_SECRET is required" })
        .min(1, "AUTH_SECRET is required"),
    // Optional at boot: only required when uploading/downloading files via Drive.
    // Validated at call time in src/lib/drive.ts so the app stays bootable for browse-only.
    GOOGLE_SERVICE_ACCOUNT_JSON: z.string().optional(),
    GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
})

const ENV = envSchema.parse(process.env)
export default ENV