import {
  mysqlTable,
  varchar,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

//#region // * Column Attributes
const role = ["user", "admin", "pending"] as const;
type Role = (typeof role)[number];
//#endregion

//#region // * Tables
const user = mysqlTable("user", {
  id_user: varchar("id_user", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  role: mysqlEnum("role", role).notNull().default("pending"),
  lastSignInAt: timestamp("lastSignInAt").notNull().defaultNow(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

type UserCredentials = Omit<typeof user.$inferSelect, "password">;
//#endregion

export type { Role, UserCredentials };
export { user };
