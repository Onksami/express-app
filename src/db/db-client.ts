import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

type DbType = PostgresJsDatabase<typeof schema>;

const createDbClient = (): DbType => {
  const connectionString = process.env.DATABASE_URL;
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};

class DbClient {
  private static _db?: DbType = undefined;

  db(): DbType {
    if (!DbClient._db) {
      console.log("Creating new db client");
      DbClient._db = createDbClient();
    }

    return DbClient._db;
  }
}

export default new DbClient().db;
