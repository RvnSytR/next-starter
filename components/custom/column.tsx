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
    accessorKey: "nomor",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
    cell: ({ row }) => (
      <div className="text-center normal-case">
        {row.original.id_user.slice(0, 5) + "..."}
      </div>
    ),
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
    cell: ({ row }) => (
      <div className="text-center normal-case">{row.original.email}</div>
    ),
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
    cell: ({ row }) => (
      <div className="text-center normal-case">{row.original.username}</div>
    ),
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
      <div className="text-center capitalize">
        <Badge
          variant={
            row.original.role !== "pending"
              ? "outline_success"
              : "outline_warning"
          }
        >
          {row.original.role}
        </Badge>
      </div>
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
    cell: ({ row }) => {
      const { last_signin_at } = row.original;
      return (
        <div className="text-center">
          {last_signin_at ? format(last_signin_at, "PPPp") : null}
        </div>
      );
    },
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
    cell: ({ row }) => (
      <div className="text-center">
        {format(row.original.created_at, "PPPp")}
      </div>
    ),
    sortingFn: (a, b) =>
      a.original.created_at.getTime() - b.original.created_at.getTime(),
  },
];
