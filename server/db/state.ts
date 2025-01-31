import { db } from "./config";
import { user as userSchema, Role } from "./schema";
import { eq, sql, getTableColumns } from "drizzle-orm";

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
    check: db
      .select({
        password: userSchema.password,
        username: userSchema.username,
        role: userSchema.role,
      })
      .from(userSchema)
      .where(eq(userSchema.email, placeholder("email")))
      .prepare(),

    all: db.select(param.user()).from(userSchema).prepare(),

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
      .set({ last_signin_at: sql`NOW()` })
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

export const state = {
  user,
};
