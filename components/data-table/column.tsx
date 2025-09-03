"use client";

import { Session } from "@/lib/auth";
import { filterFn } from "@/lib/filters";
import { fieldsMeta } from "@/lib/meta";
import { Role, rolesMeta } from "@/lib/permission";
import { cn, formatDate } from "@/lib/utils";
import { Column, createColumnHelper, Row, Table } from "@tanstack/react-table";
import {
  ArrowUpDown,
  CalendarCheck2,
  CircleDot,
  CircleUserRound,
  Mail,
  UserRound,
} from "lucide-react";
import {
  UserAvatar,
  UserDetailSheet,
  UserRoleBadge,
  UserVerifiedBadge,
} from "../modules/user";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

const userFields = fieldsMeta.user;

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

const createUserColumn = createColumnHelper<Session["user"]>();
export const getUserColumn = (currentUserId: string) => [
  createUserColumn.display({
    id: "select",
    header: ({ table }) => headerCheckbox(table),
    cell: ({ row }) => cellCheckbox(row),
    enableHiding: false,
    enableSorting: false,
  }),
  createUserColumn.display({
    id: fieldsMeta.num,
    header: fieldsMeta.num,
    cell: ({ row }) => cellNum(row.index + 1),
    enableHiding: false,
  }),
  createUserColumn.accessor(({ image }) => image, {
    id: userFields.avatar,
    header: userFields.avatar,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-20" />
      </div>
    ),
    meta: {
      displayName: userFields.avatar,
      type: "text",
      icon: CircleUserRound,
    },
  }),
  createUserColumn.accessor(({ email }) => email, {
    id: userFields.email.label,
    header: ({ column }) => headerButton(column, userFields.email.label),
    cell: ({ row }) => {
      const { id, email, emailVerified } = row.original;
      if (id === currentUserId) {
        return (
          <div className="flex items-center gap-x-2">
            {email} {emailVerified && <UserVerifiedBadge withoutText />}
          </div>
        );
      }
      return <UserDetailSheet data={row.original} />;
    },
    filterFn: filterFn("text"),
    meta: { displayName: userFields.email.label, type: "text", icon: Mail },
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: userFields.name.label,
    header: ({ column }) => headerButton(column, userFields.name.label),
    cell: ({ row }) => row.original.name,
    filterFn: filterFn("text"),
    meta: { displayName: userFields.name.label, type: "text", icon: UserRound },
  }),
  createUserColumn.accessor(({ role }) => role, {
    id: userFields.role.label,
    header: ({ column }) => headerButton(column, userFields.role.label, true),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserRoleBadge role={row.original.role as Role} />
      </div>
    ),
    filterFn: filterFn("option"),
    meta: {
      displayName: userFields.role.label,
      type: "option",
      icon: CircleDot,
      transformOptionFn: (value) => {
        const { displayName, icon } = rolesMeta[value as Role];
        return { value, label: displayName, icon };
      },
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: fieldsMeta.createdAt,
    header: ({ column }) => headerButton(column, fieldsMeta.createdAt),
    cell: ({ row }) =>
      row.original.createdAt
        ? formatDate(row.original.createdAt, "PPPp")
        : null,
    filterFn: filterFn("date"),
    meta: {
      displayName: fieldsMeta.createdAt,
      type: "date",
      icon: CalendarCheck2,
    },
  }),
];
