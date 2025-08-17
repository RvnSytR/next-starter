"use server";

import { auth, Session } from "@/lib/auth";
import { Role } from "@/lib/permission";
import { headers } from "next/headers";
import { deleteFiles, extractKeyFromPublicUrl } from "../s3";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getListSession() {
  return await auth.api.listSessions({ headers: await headers() });
}

export async function getUserList(): Promise<{
  users: Session["user"][];
  total: number;
}> {
  const { total, users } = await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });

  return {
    total,
    users: users.map(({ role, banned, ...rest }) => ({
      role: role as Role,
      banned,
      ...rest,
    })),
  };
}

export async function revokeUserSessions(ids: string[]) {
  return Promise.all(
    ids.map(async (id) => {
      return await auth.api.revokeUserSessions({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}

export async function deleteProfilePicture(image: string) {
  await deleteFiles([await extractKeyFromPublicUrl(image)]);
}

export async function deleteUsers(
  data: Pick<Session["user"], "id" | "image">[],
) {
  return Promise.all(
    data.map(async ({ id, image }) => {
      if (image) await deleteProfilePicture(image);
      return await auth.api.removeUser({
        body: { userId: id },
        headers: await headers(),
      });
    }),
  );
}
