"use server";

import { revalidatePath } from "next/cache";
import { SignInHandler } from "@/app/login/sign";

import bcrypt from "bcrypt";
import { state } from "@/lib/db/state";
import { Role, user } from "@/lib/db/schema";

export async function Check(email: string, password: string) {
  const [res] = await state.user.check.execute({ email: email });
  if (!res) throw new Error("Akun tidak terdaftar!");

  if (!bcrypt.compareSync(password, res.password)) {
    throw new Error("Email atau Password Salah!");
  }

  if (res.role == "pending") {
    throw new Error(
      "Akun Anda masih dalam antrian persetujuan. Harap tunggu konfirmasi dari admin.",
    );
  } else {
    await SignInHandler(email, password);
    return res.username;
  }
}

export async function Regis(data: typeof user.$inferInsert) {
  const { email, password, username } = data;
  const [check] = await state.user.getByEmail.execute({ email: email });

  if (check) throw new Error("Email sudah terdaftar!");
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
