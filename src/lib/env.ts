import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  AUTH_SECRET: z.string().min(1),

  GOOGLE_DRIVE_FOLDER_ID: z.string().min(1),
})

const ENV = envSchema.parse(process.env)
export default ENV