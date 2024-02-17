import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(sql);

migrate(db, { migrationsFolder: "src/db/migrations" }).then(() => {
  console.log("Migration complete");
  process.exit(0);
});
