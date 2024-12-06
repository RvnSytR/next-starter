import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { LABEL } from "@/components/content";

const { success, error } = LABEL.connection;
const poolConnection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

async function CheckConnection() {
  try {
    await poolConnection.query("SELECT 1");
    console.log(success);
    return true;
  } catch (e) {
    console.error(error + (e as Error).message);
    return false;
  }
}

if (!(await CheckConnection())) throw new Error(error);
export const db = drizzle(poolConnection);
