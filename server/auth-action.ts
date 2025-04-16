"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { deleteFile, getFileKeyFromPublicUrl } from "./s3";

const getHeader = async (header?: Headers) => header ?? (await headers());

export async function getSession(header?: Headers) {
  return await auth.api.getSession({ headers: await getHeader(header) });
}

export async function getSessionList(header?: Headers) {
  return await auth.api.listSessions({ headers: await getHeader(header) });
}

export async function getUserList(header?: Headers) {
  return await auth.api.listUsers({
    headers: await getHeader(header),
    query: { sortBy: "createdAt", sortDirection: "desc" },
  });
}

export async function deleteProfilePicture(image: string | null | undefined) {
  if (image) await deleteFile([await getFileKeyFromPublicUrl(image)]);
}
