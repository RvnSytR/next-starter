"use server";

import { SignInHandler, SignOutHandler } from "@/app/login/sign";
import { label } from "@/lib/content";
import { path } from "@/lib/menu";
import { zodChangePasswordSchema } from "@/lib/zod";
import { Role, user } from "@/server/db/schema";
import { state } from "@/server/db/state";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type Action = Promise<{ status: boolean; message?: string }>;
const GetStatus = (s: boolean, m?: string) => ({ status: s, message: m });

const { login: loginError, user: userError } = label.toast.error;

// #region // * User Action
export async function CheckUser(email: string, password: string): Action {
  const { notFound, emailOrPassword, pending } = loginError;

  const [res] = await state.user.select.checkByEmail.execute({ email: email });
  if (!res) return GetStatus(false, notFound);

  if (!bcrypt.compareSync(password, res.password)) {
    return GetStatus(false, emailOrPassword);
  }

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
  id_user: string,
): Action {
  await state.user.update.role(role).execute({ id_user: id_user });
  revalidatePath(path.account);
  return GetStatus(true);
}

export async function UpdateUserProfile(
  id_user: string,
  username: string,
): Action {
  await state.user.update.profile(id_user, username).execute();
  return GetStatus(true);
}

export async function UpdateUserPassword(
  id_user: string,
  data: z.infer<typeof zodChangePasswordSchema>,
): Action {
  const { currentPassword, newPassword } = data;
  const [res] = await state.user.select.passwordById.execute({
    id_user: id_user,
  });

  if (!res) return GetStatus(false, loginError.notFound);

  if (!bcrypt.compareSync(currentPassword, res.password)) {
    return GetStatus(false, userError.password);
  }

  if (bcrypt.compareSync(newPassword, res.password)) {
    return GetStatus(false, userError.samePassword);
  }

  await state.user.update
    .password(id_user, bcrypt.hashSync(newPassword, bcrypt.genSaltSync()))
    .execute();
  await SignOutHandler();

  return GetStatus(true);
}

export async function DeleteUser(id_user: string): Action {
  await state.user.delete.execute({ id_user: id_user });
  revalidatePath("/account");
  return GetStatus(true);
}
// #endregion
