"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteFile, getFileKeyFromPublicUrl } from "./s3";

export async function getSession() {
  return await auth.api.getSession({ headers: await headers() });
}

export async function getSessionList() {
  return await auth.api.listSessions({ headers: await headers() });
}

export async function getUserList() {
  return await auth.api.listUsers({
    headers: await headers(),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function deleteProfilePicture(image: string | null | undefined) {
  if (image) await deleteFile([await getFileKeyFromPublicUrl(image)]);
}
