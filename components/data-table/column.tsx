"use client";

import { baseContent, tableText } from "@/lib/content";
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
  UserAvatar,
  UserDetailSheet,
  UserRoleBadge,
  UserVerifiedBadge,
} from "../modules/auth";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const columnText = tableText.column;
const cAuthFields = baseContent.auth.fields;

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
    id: columnText.num,
    header: columnText.num,
    cell: ({ row }) => cellNum(row.index + 1),
    enableHiding: false,
  }),
  createUserColumn.accessor(({ image }) => image, {
    id: cAuthFields.avatar,
    header: cAuthFields.avatar,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-20" />
      </div>
    ),
  }),
  createUserColumn.accessor(({ email }) => email, {
    id: cAuthFields.email.label,
    header: ({ column }) => headerButton(column, cAuthFields.email.label),
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
      return <UserDetailSheet data={row.original} />;
    },
    filterFn: filterFn("text"),
    meta: { displayName: cAuthFields.email.label, type: "text", icon: Mail },
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: cAuthFields.name.label,
    header: ({ column }) => headerButton(column, cAuthFields.name.label),
    cell: ({ row }) => row.original.name,
    filterFn: filterFn("text"),
    meta: {
      displayName: cAuthFields.name.label,
      type: "text",
      icon: UserRound,
    },
  }),
  createUserColumn.accessor(({ role }) => role, {
    id: cAuthFields.role,
    header: ({ column }) => headerButton(column, cAuthFields.role),
    cell: ({ row }) => <UserRoleBadge role={row.original.role as Role} />,
    filterFn: filterFn("option"),
    meta: {
      displayName: cAuthFields.role,
      type: "option",
      icon: CircleDot,
      transformOptionFn: (value) => {
        const { displayName, icon } = rolesMeta[value as Role];
        return { value, label: displayName ?? capitalize(value), icon: icon };
      },
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: columnText.createdAt,
    header: ({ column }) => headerButton(column, columnText.createdAt),
    cell: ({ row }) =>
      row.original.createdAt
        ? formatDate(row.original.createdAt, "PPPp")
        : null,
    filterFn: filterFn("date"),
    meta: {
      displayName: columnText.createdAt,
      type: "date",
      icon: CalendarCheck2,
    },
  }),
];
