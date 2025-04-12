"use client";

import { filterFn } from "@/lib/filters";
import { adminRoles, Role, roleIcon } from "@/lib/role";
import { capitalize, formatDate } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpDown,
  CalendarCheck2,
  CalendarClock,
  CircleDot,
  Mail,
  UserRound,
} from "lucide-react";
import { UserAvatar } from "../modules/auth";
import { Badge } from "../ui/badge";
import { Button, ButtonProps } from "../ui/button";

const HeaderButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button size="sm" variant="ghost" className="w-full" {...props}>
      {children}
      <ArrowUpDown />
    </Button>
  );
};

export const userColumnHelper = createColumnHelper<UserWithRole>();
export const userColumn = [
  userColumnHelper.display({
    id: "number",
    header: "No",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
  }),
  userColumnHelper.accessor((row) => row.image, {
    id: "Profile Picture",
    header: "Profile Picture",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-18" />
      </div>
    ),
  }),
  userColumnHelper.accessor((row) => row.email, {
    id: "email",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.email,
    filterFn: filterFn("text"),
    meta: {
      displayName: "Email",
      type: "text",
      icon: Mail,
    },
  }),
  userColumnHelper.accessor((row) => row.name, {
    id: "name",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.name,
    filterFn: filterFn("text"),
    meta: {
      displayName: "Name",
      type: "text",
      icon: UserRound,
    },
  }),
  userColumnHelper.accessor((row) => row.role!, {
    id: "role",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
      </HeaderButton>
    ),
    cell: ({ row }) => {
      const role = row.original.role!;
      const isAdmin = adminRoles.find((r) => r === role);
      const Icon = roleIcon[role as Role];
      return (
        <Badge
          variant={isAdmin ? "outline_success" : "outline"}
          className="capitalize"
        >
          <Icon />
          {role}
        </Badge>
      );
    },
    filterFn: filterFn("option"),
    meta: {
      displayName: "Role",
      type: "option",
      icon: CircleDot,
      transformOptionFn: (value) => ({
        value: value,
        label: capitalize(value),
        icon: roleIcon[value as Role],
      }),
    },
  }),
  userColumnHelper.accessor((row) => row.updatedAt, {
    id: "Updated At",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated At
      </HeaderButton>
    ),
    cell: ({ row }) =>
      row.original.updatedAt
        ? formatDate(row.original.updatedAt, "PPPp")
        : null,
    filterFn: filterFn("date"),
    meta: {
      displayName: "Updated At",
      type: "date",
      icon: CalendarClock,
    },
  }),
  userColumnHelper.accessor((row) => row.createdAt, {
    id: "Created At",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
      </HeaderButton>
    ),
    cell: ({ row }) =>
      row.original.createdAt
        ? formatDate(row.original.createdAt, "PPPp")
        : null,
    filterFn: filterFn("date"),
    meta: {
      displayName: "Created At",
      type: "date",
      icon: CalendarCheck2,
    },
  }),
];
