"use server";

import { revalidatePath } from "next/cache";
import { SignInHandler } from "@/app/login/sign";

import bcrypt from "bcrypt";
import { state } from "@/lib/db/state";
import { Role, user } from "@/lib/db/schema";

import { label } from "@/components/content";
import { path } from "@/components/menu";

const { login: loginError, user: userError } = label.toast.error;

// #region // * User Action
export async function CheckUser(email: string, password: string) {
  const [res] = await state.user.select.check.execute({ email: email });
  if (!res) throw new Error(loginError.notFound);

  if (!bcrypt.compareSync(password, res.password)) {
    throw new Error(loginError.emailOrPassword);
  }

  if (res.role == "pending") throw new Error(loginError.pending);
  else {
    await SignInHandler(email, password);
    return res.username;
  }
}

export async function CreateUser(
  data: Omit<typeof user.$inferInsert, "id_user">,
) {
  const { email, password, ...restData } = data;
  const [check] = await state.user.select.byEmail.execute({ email: email });

  if (check) throw new Error(userError.email);
  else {
    const salt = bcrypt.genSaltSync();
    await state.user.insert.execute({
      id_user: crypto.randomUUID(),
      email: email,
      password: bcrypt.hashSync(password, salt),
      ...restData,
    });
  }
}

export async function ApproveUser(role: Exclude<Role, "pending">, id: string) {
  await state.user.update.role(role).execute({ id_user: id });
  revalidatePath(path.account);
}

export async function UpdateUserProfile(id: string, username: string) {
  await state.user.update.profile(id, username).execute();
}

export async function UpdateUserPassword(id: string, newPass: string) {
  const salt = bcrypt.genSaltSync();
  await state.user.update
    .password(id, bcrypt.hashSync(newPass, salt))
    .execute();
}

export async function DeleteUser(id: string) {
  await state.user.delete.execute({ id_user: id });
  revalidatePath("/account");
}
// #endregion
