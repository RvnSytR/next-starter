"use server";

import { SignIn, SignOut } from "@/app/sign-in/sign";
import { label } from "@/lib/content";
import { path } from "@/lib/menu";
import { zodChangePassword } from "@/lib/zod";
import { Role, user } from "@/server/db/schema";
import { state } from "@/server/db/state";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type ActionResponse = {
  success: boolean;
  code: number;
  message?: string;
};

const setResponse = (success: boolean, code: number, message: string) =>
  ({
    success: success,
    code: code,
    message: message,
  }) satisfies ActionResponse;

const { signIn: signInSuccess, user: userSuccess } = label.toast.success;
const { signIn: signInError, user: userError } = label.toast.error;

// #region // * User Action
export async function CheckUser(
  email: string,
  password: string,
): Promise<ActionResponse> {
  const { notFound, emailOrPassword, pending } = signInError;
  const [res] = await state.user.select.checkByEmail.execute({ email });

  if (!res) return setResponse(false, 404, notFound);
  if (!bcrypt.compareSync(password, res.password))
    return setResponse(false, 401, emailOrPassword);

  if (res.role == "pending") return setResponse(false, 403, pending);
  else await SignIn(email, password);

  return setResponse(true, 200, signInSuccess(res.username));
}

export async function CreateUser(
  data: Omit<typeof user.$inferInsert, "id_user" | "created_at">,
): Promise<ActionResponse> {
  const { email, password, ...restData } = data;
  const [check] = await state.user.select.byEmail.execute({ email });
  if (check) return setResponse(false, 409, userError.email);

  const salt = bcrypt.genSaltSync();
  await state.user.insert.execute({
    id_user: crypto.randomUUID(),
    password: bcrypt.hashSync(password, salt),
    email,
    ...restData,
  });

  return setResponse(true, 201, userSuccess.create);
}

export async function ApproveUser(
  id_user: string,
  username: string,
  role: Exclude<Role, "pending">,
): Promise<ActionResponse> {
  await state.user.update.role(role).execute({ id_user });
  revalidatePath(path.account);
  return setResponse(true, 200, userSuccess.approve(username, role));
}

export async function UpdateUserProfile(
  id_user: string,
  username: string,
): Promise<ActionResponse> {
  await state.user.update.profile(id_user, username).execute();
  return setResponse(true, 200, userSuccess.update.profile);
}

export async function UpdateUserPassword(
  id_user: string,
  data: z.infer<typeof zodChangePassword>,
): Promise<ActionResponse> {
  const { currentPassword, newPassword } = data;

  const [res] = await state.user.select.passwordById.execute({ id_user });
  if (!res) return setResponse(false, 404, userError.notFound);

  if (!bcrypt.compareSync(currentPassword, res.password))
    return setResponse(false, 401, userError.password);
  if (bcrypt.compareSync(newPassword, res.password))
    return setResponse(false, 400, userError.samePassword);

  await state.user.update
    .password(id_user, bcrypt.hashSync(newPassword, bcrypt.genSaltSync()))
    .execute();
  await SignOut();
  return setResponse(true, 200, userSuccess.update.password);
}

export async function DeleteUser(
  id_user: string,
  username: string,
): Promise<ActionResponse> {
  await state.user.delete.execute({ id_user });
  revalidatePath(path.account);
  return setResponse(true, 200, userSuccess.delete(username));
}
// #endregion
