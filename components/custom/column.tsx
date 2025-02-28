"use client";

import { UserCredentials } from "@/server/db/schema";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { type ButtonProps, Button } from "../ui/button";

const HeaderButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button size="sm" variant="ghost" className="w-full" {...props}>
      {children}
      <ArrowUpDown />
    </Button>
  );
};

export const userColumn: ColumnDef<UserCredentials>[] = [
  {
    accessorKey: "number",
    header: "No",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
  },
  {
    accessorKey: "user ID",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User ID
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.id_user.slice(0, 5) + "...",
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.username,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.role !== "pending"
            ? "outline_success"
            : "outline_warning"
        }
        className="capitalize"
      >
        {row.original.role}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "last sign in at",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Sign In At
      </HeaderButton>
    ),
    cell: ({ row }) =>
      row.original.last_signin_at
        ? format(row.original.last_signin_at, "PPPp")
        : null,
    sortingFn: (a, b) => {
      const { last_signin_at: aLog } = a.original;
      const { last_signin_at: bLog } = b.original;
      if (aLog && bLog) return aLog.getTime() - bLog.getTime();

      if (!aLog) return 1;
      else return -1;
    },
  },
  {
    accessorKey: "registration at",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Registration At
      </HeaderButton>
    ),
    cell: ({ row }) => format(row.original.created_at, "PPPp"),
    sortingFn: (a, b) =>
      a.original.created_at.getTime() - b.original.created_at.getTime(),
  },
];
