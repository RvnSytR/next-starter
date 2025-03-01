import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "./config";
import { type Role, user as userSchema } from "./schema";

const { placeholder } = sql;

const param = {
  user: () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...restProps } = getTableColumns(userSchema);
    return restProps;
  },
};

const user = {
  insert: db
    .insert(userSchema)
    .values({
      id_user: placeholder("id_user"),
      email: placeholder("email"),
      password: placeholder("password"),
      username: placeholder("username"),
      created_at: new Date(),
    })
    .prepare(),

  select: {
    checkByEmail: db
      .select({
        password: userSchema.password,
        username: userSchema.username,
        role: userSchema.role,
      })
      .from(userSchema)
      .where(eq(userSchema.email, placeholder("email")))
      .prepare(),

    passwordById: db
      .select({ password: userSchema.password })
      .from(userSchema)
      .where(eq(userSchema.id_user, placeholder("id_user")))
      .prepare(),

    all: db
      .select(param.user())
      .from(userSchema)
      .orderBy(desc(userSchema.created_at))
      .prepare(),

    byId: db
      .select(param.user())
      .from(userSchema)
      .where(eq(userSchema.id_user, placeholder("id_user")))
      .prepare(),

    byEmail: db
      .select(param.user())
      .from(userSchema)
      .where(eq(userSchema.email, placeholder("email")))
      .prepare(),
  },

  update: {
    log: db
      .update(userSchema)
      .set({ last_signin_at: new Date() })
      .where(eq(userSchema.id_user, placeholder("id_user")))
      .prepare(),

    password: (id_user: string, newPass: string) =>
      db
        .update(userSchema)
        .set({ password: newPass })
        .where(eq(userSchema.id_user, id_user))
        .prepare(),

    profile: (id_user: string, username: string) =>
      db
        .update(userSchema)
        .set({ username: username })
        .where(eq(userSchema.id_user, id_user))
        .prepare(),

    role: (role: Exclude<Role, "pending">) =>
      db
        .update(userSchema)
        .set({ role: role })
        .where(eq(userSchema.id_user, placeholder("id_user")))
        .prepare(),
  },

  delete: db
    .delete(userSchema)
    .where(eq(userSchema.id_user, placeholder("id_user")))
    .prepare(),
};

export const state = { user };
