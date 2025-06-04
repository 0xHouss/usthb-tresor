import { z } from "zod";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z
    .string({ required_error: "GOOGLE_CLIENT_ID is required" })
    .min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z
    .string({ required_error: "GOOGLE_CLIENT_SECRET is required" })
    .min(1, "GOOGLE_CLIENT_SECRET is required"),
  AUTH_URL: z
    .string({ required_error: "NEXTAUTH_URL is required" })
    .min(1, "NEXTAUTH_URL is required"),
  AUTH_SECRET: z
    .string({ required_error: "AUTH_SECRET is required" })
    .min(1, "AUTH_SECRET is required"),
})

const ENV = envSchema.parse(process.env)
export default ENV