import { env } from "@/lib/env";
import * as schema from "@/server/db/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";

const poolConnection = createPool({
  host: env.MYSQL_HOST,
  user: env.MYSQL_USER,
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
