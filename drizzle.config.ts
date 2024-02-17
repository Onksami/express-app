import type { Config } from "drizzle-kit";

export default {
  strict: true,
  schema: "./src/db/schema.ts",
  driver: "pg",
  out: "./src/db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
