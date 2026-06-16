import { z } from "zod";

const envSchema = z.object({
  // Prisma
  DATABASE_URL: z.string().min(1),

  // Auth.js
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_SECRET: z.string().min(1),

  // Google Drive
  GOOGLE_DRIVE_FOLDER_ID: z.string().min(1),
  GOOGLE_DRIVE_CLIENT_ID: z.string().min(1),
  GOOGLE_DRIVE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_DRIVE_REDIRECT_URI: z.string().min(1),
  GOOGLE_DRIVE_REFRESH_TOKEN: z.string().min(1),
})

const ENV = envSchema.parse(process.env)
export default ENV