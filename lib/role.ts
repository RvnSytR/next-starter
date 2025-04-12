// Any role that isn't in the adminRoles list, even if they have the permission, will not be considered an admin.
// https://www.better-auth.com/docs/plugins/admin#admin-roles

import { LucideIcon, UserRound, UserRoundCheck } from "lucide-react";

export const adminRoles = ["admin"] as const;
export type AdminRole = (typeof adminRoles)[number];

export const userRoles = ["user"] as const;
export type UserRole = (typeof userRoles)[number];

export type Role = AdminRole | UserRole;

export const roleIcon: Record<UserRole | AdminRole, LucideIcon> = {
  user: UserRound,
  admin: UserRoundCheck,
};
