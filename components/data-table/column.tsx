"use client";

import { filterFn } from "@/lib/filters";
import { Role, rolesMeta } from "@/lib/permission";
import { capitalize, formatDate } from "@/lib/utils";
import { Column, createColumnHelper, Row, Table } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpDown,
  CalendarCheck2,
  CircleDot,
  Mail,
  UserRound,
} from "lucide-react";
import {
  AdminUserDetailSheet,
  UserAvatar,
  UserRoleBadge,
  UserVerifiedBadge,
} from "../modules/auth";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

function headerButton<C, T>(column: Column<C, T>, children: React.ReactNode) {
  return (
    <div className="flex justify-start">
      <Button
        size="sm"
        variant="ghost"
        className="h-7 justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {children}
        <ArrowUpDown />
      </Button>
    </div>
  );
}

function cellNum(num: number) {
  return <div className="text-center">{num}</div>;
}

function headerCheckbox<T>(table: Table<T>) {
  return (
    <Checkbox
      aria-label="Select all"
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
    />
  );
}

function cellCheckbox<R>(row: Row<R>, disabled: boolean = false) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      disabled={disabled}
    />
  );
}

const createUserColumn = createColumnHelper<UserWithRole>();
export const getUserColumn = (currentUserId: string) => [
  createUserColumn.display({
    id: "select",
    header: ({ table }) => headerCheckbox(table),
    cell: ({ row }) => cellCheckbox(row),
    enableHiding: false,
    enableSorting: false,
  }),
  createUserColumn.display({
    id: "number",
    header: "No",
    cell: ({ row }) => cellNum(row.index + 1),
    enableHiding: false,
  }),
  createUserColumn.accessor(({ image }) => image, {
    id: "Avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-20" />
      </div>
    ),
  }),
  createUserColumn.accessor(({ email }) => email, {
    id: "email",
    header: ({ column }) => headerButton(column, "Email"),
    cell: ({ row }) => {
      const { id, email, emailVerified } = row.original;
      if (id === currentUserId) {
        return (
          <div className="flex items-center gap-x-2">
            {email}
            {emailVerified && <UserVerifiedBadge withoutText />}
          </div>
        );
      }

      return <AdminUserDetailSheet data={row.original} />;
    },
    filterFn: filterFn("text"),
    meta: { displayName: "Email", type: "text", icon: Mail },
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: "name",
    header: ({ column }) => headerButton(column, "Name"),
    cell: ({ row }) => row.original.name,
    filterFn: filterFn("text"),
    meta: { displayName: "Name", type: "text", icon: UserRound },
  }),
  createUserColumn.accessor(({ role }) => role, {
    id: "role",
    header: ({ column }) => headerButton(column, "Role"),
    cell: ({ row }) => <UserRoleBadge role={row.original.role as Role} />,
    filterFn: filterFn("option"),
    meta: {
      displayName: "Role",
      type: "option",
      icon: CircleDot,
      transformOptionFn: (value) => {
        const { displayName, icon } = rolesMeta[value as Role];
        return { value, label: displayName ?? capitalize(value), icon: icon };
      },
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: "Created At",
    header: ({ column }) => headerButton(column, "Created At"),
    cell: ({ row }) =>
      row.original.createdAt
        ? formatDate(row.original.createdAt, "PPPp")
        : null,
    filterFn: filterFn("date"),
    meta: { displayName: "Created At", type: "date", icon: CalendarCheck2 },
  }),
];
