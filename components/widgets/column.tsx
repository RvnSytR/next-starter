"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserCredentials } from "@/server/db/schema";
import { format } from "date-fns";

import { Badge } from "../ui/badge";
import { type ButtonProps, Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

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
    accessorKey: "ID pengguna",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID Pengguna
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
    accessorKey: "terakhir login",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Terakhir Login
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
    accessorKey: "registrasi pada",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Registrasi Pada
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
];
