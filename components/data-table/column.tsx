"use client";

import { filterFn } from "@/lib/filters";
import { Role, rolesMeta } from "@/lib/permission";
import { cn, formatDate } from "@/lib/utils";
import { Column, createColumnHelper, Row, Table } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpDown,
  CalendarCheck2,
  CalendarSync,
  CircleDot,
  Mail,
  UserRound,
  UserSquare2,
} from "lucide-react";
import { UserAvatar, UserRoleBadge, UserVerifiedBadge } from "../modules/user";
import { UserDetailSheet } from "../modules/user-client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

function headerButton<C, T>(
  column: Column<C, T>,
  children: React.ReactNode,
  center: boolean = false,
) {
  return (
    <div className={cn("flex", center ? "justify-center" : "justify-start")}>
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
    id: "no",
    header: "No",
    cell: ({ row }) => cellNum(row.index + 1),
    enableHiding: false,
  }),
  createUserColumn.accessor(({ image }) => image, {
    id: "image",
    header: "Foto Profil",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-20" />
      </div>
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Foto Profil", type: "text", icon: UserSquare2 },
    enableSorting: false,
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: "name",
    header: ({ column }) => headerButton(column, "Nama"),
    cell: ({ row }) => (
      <UserDetailSheet
        data={row.original}
        isCurrentUser={row.original.id === currentUserId}
      />
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Nama", type: "text", icon: UserRound },
  }),
  createUserColumn.accessor(({ email }) => email, {
    id: "email",
    header: ({ column }) => headerButton(column, "Alamat Email"),
    cell: ({ row }) => {
      const { email, emailVerified } = row.original;
      return (
        <div className="flex items-center gap-x-2">
          {email} {!emailVerified && <UserVerifiedBadge withoutText />}
        </div>
      );
    },
    filterFn: filterFn("text"),
    meta: { displayName: "Alamat Email", type: "text", icon: Mail },
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
        return { value, label: displayName, icon };
      },
    },
  }),
  createUserColumn.accessor(({ updatedAt }) => updatedAt, {
    id: "updatedAt",
    header: ({ column }) => headerButton(column, "Terakhir Diperbarui"),
    cell: ({ row }) => formatDate(row.original.updatedAt, "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      displayName: "Terakhir Diperbarui",
      type: "date",
      icon: CalendarSync,
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: "createdAt",
    header: ({ column }) => headerButton(column, "Waktu Dibuat"),
    cell: ({ row }) => formatDate(row.original.createdAt, "PPPp"),
    filterFn: filterFn("date"),
    meta: { displayName: "Waktu Dibuat", type: "date", icon: CalendarCheck2 },
  }),
];
