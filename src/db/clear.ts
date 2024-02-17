import { PgTransaction } from "drizzle-orm/pg-core";
import type { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";


async function clearDBTables() {
  const connectionString = process.env.DATABASE_URL;
  const client = postgres(connectionString);
  const db =drizzle(client, { schema });

  console.log("🗑️ Emptying the entire database");

  const tablesSchema = db._.schema;
  if (!tablesSchema) throw new Error("Schema not loaded");

  const queries = Object.values(tablesSchema).map((table:any) => {
    console.log(`🧨 Preparing delete query for table: ${table.dbName}`);
    return db.delete(table.dbName)
  });

  console.log("🛜 Sending delete queries");

  await db.transaction(async (trx:any) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query) await trx.execute(query);
      }),
    );
  });

  console.log("✅ Database emptied");
}
clearDBTables()