"use server";

import { revalidatePath } from "next/cache";
import { SignInHandler } from "@/app/login/sign";

import bcrypt from "bcrypt";
import { state } from "@/lib/db/state";
import { Role, user } from "@/lib/db/schema";

import { LABEL } from "@/components/content";
const { error: errorLabel } = LABEL;

export async function CheckUser(email: string, password: string) {
  const { login: checkLabel } = errorLabel;

  const [res] = await state.user.check.execute({ email: email });
  if (!res) throw new Error(checkLabel.notFound);

  if (!bcrypt.compareSync(password, res.password)) {
    throw new Error(checkLabel.emailOrPassword);
  }

  if (res.role == "pending") throw new Error(checkLabel.pending);
  else {
    await SignInHandler(email, password);
    return res.username;
  }
}

export async function Regis(data: typeof user.$inferInsert) {
  const { email, password, username } = data;
  const [check] = await state.user.getByEmail.execute({ email: email });

  if (check) throw new Error(errorLabel.regis);
  else {
    const salt = bcrypt.genSaltSync();
    await state.user.insert.execute({
      email: email,
      password: bcrypt.hashSync(password, salt),
      username: username,
    });
  }
}

export async function Approve(role: Exclude<Role, "pending">, id: string) {
  await state.user.updateRole(role).execute({ id_user: id });
  revalidatePath("/account");
}

export async function Delete(id: string) {
  await state.user.delete.execute({ id_user: id });
  revalidatePath("/account");
}
