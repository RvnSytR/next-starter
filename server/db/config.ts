import * as schema from "@/server/db/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";

const poolConnection = createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
