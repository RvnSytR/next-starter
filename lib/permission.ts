// Any role that isn't in the adminRoles list, even if they have the permission, will not be considered an admin.
// https://www.better-auth.com/docs/plugins/admin#admin-roles

import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";
import {
  FlaskConical,
  LucideIcon,
  UserRound,
  UserRoundCheck,
} from "lucide-react";

export const ac = createAccessControl({
  ...defaultStatements,
  project: ["create", "read", "update", "delete"],
} as const);

export const roles = {
  user: ac.newRole({
    project: ["create"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    project: ["create", "read", "update", "delete"],
  }),

  customRoleExample: ac.newRole({
    project: ["create", "read"],
  }),
};

export type Role = keyof typeof roles;
export const allRoles: Role[] = Object.keys(roles) as Role[];
export const adminRoles: Role[] = ["admin"];
export const userRoles: Role[] = allRoles.filter(
  (role) => !adminRoles.includes(role),
);

export const roleMetadata: Record<
  Role,
  { displayName?: string; icon: LucideIcon; desc: string }
> = {
  user: {
    icon: UserRound,
    desc: "Standard user with basic access and permissions.",
  },
  admin: {
    icon: UserRoundCheck,
    desc: "Administrator with full access and management capabilities.",
  },
  customRoleExample: {
    displayName: "Custom Role Example",
    icon: FlaskConical,
    desc: "A sample custom role for demonstration or testing purposes.",
  },
};
