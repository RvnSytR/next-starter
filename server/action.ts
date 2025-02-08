"use server";

import { revalidatePath } from "next/cache";
import { SignInHandler } from "@/app/login/sign";

import bcrypt from "bcrypt";
import { state } from "@/server/db/state";
import { Role, user } from "@/server/db/schema";

import { label } from "@/components/content";
import { path } from "@/components/menu";

export type Action = Promise<{ status: boolean; message?: string }>;
const GetStatus = (s: boolean, m?: string) => ({ status: s, message: m });
const { login: loginError, user: userError } = label.toast.error;

// #region // * User Action
export async function CheckUser(email: string, password: string): Action {
  const { notFound, emailOrPassword, pending } = loginError;

  const [res] = await state.user.select.check.execute({ email: email });
  if (!res) return GetStatus(false, notFound);

  const isMatch = bcrypt.compareSync(password, res.password);
  if (!isMatch) return GetStatus(false, emailOrPassword);

  if (res.role == "pending") return GetStatus(false, pending);
  else await SignInHandler(email, password);

  return GetStatus(true, res.username);
}

export async function CreateUser(
  data: Omit<typeof user.$inferInsert, "id_user" | "created_at">,
): Action {
  const { email, password, ...restData } = data;
  const [check] = await state.user.select.byEmail.execute({ email: email });

  if (check) return GetStatus(false, userError.email);
  else {
    const salt = bcrypt.genSaltSync();
    await state.user.insert.execute({
      id_user: crypto.randomUUID(),
      email: email,
      password: bcrypt.hashSync(password, salt),
      ...restData,
    });
  }

  return GetStatus(true);
}

export async function ApproveUser(
  role: Exclude<Role, "pending">,
  id: string,
): Action {
  await state.user.update.role(role).execute({ id_user: id });
  revalidatePath(path.account);
  return GetStatus(true);
}

export async function UpdateUserProfile(id: string, username: string): Action {
  await state.user.update.profile(id, username).execute();
  return GetStatus(true);
}

export async function UpdateUserPassword(id: string, newPass: string): Action {
  await state.user.update
    .password(id, bcrypt.hashSync(newPass, bcrypt.genSaltSync()))
    .execute();
  return GetStatus(true);
}

export async function DeleteUser(id: string): Action {
  await state.user.delete.execute({ id_user: id });
  revalidatePath("/account");
  return GetStatus(true);
}
// #endregion
