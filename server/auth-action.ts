"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteFile, getFileKeyFromPublicUrl } from "./s3";

export async function getSession(header?: Headers) {
  return await auth.api.getSession({ headers: header ?? (await headers()) });
}

export async function getSessionList(header?: Headers) {
  return await auth.api.listSessions({ headers: header ?? (await headers()) });
}

export async function getUserList(header?: Headers) {
  return await auth.api.listUsers({
    headers: header ?? (await headers()),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function deleteProfilePicture(image: string) {
  await deleteFile([await getFileKeyFromPublicUrl(image)]);
}
