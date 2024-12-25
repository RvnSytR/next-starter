"use server";

import { revalidatePath } from "next/cache";
import { SignInHandler } from "@/app/login/sign";

import bcrypt from "bcrypt";
import { state } from "@/lib/db/state";
import { Role, user } from "@/lib/db/schema";

import { label } from "@/components/content";
const { error: errorLabel } = label;

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

export async function RegisUser(
  data: Omit<typeof user.$inferInsert, "id_user">,
) {
  const { email, password, ...restData } = data;
  const [check] = await state.user.selectByEmail.execute({ email: email });

  if (check) throw new Error(errorLabel.regis);
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
  await state.user.updateRole(role).execute({ id_user: id });
  revalidatePath("/account");
}

export async function DeleteUser(id: string) {
  await state.user.delete.execute({ id_user: id });
  revalidatePath("/account");
}
