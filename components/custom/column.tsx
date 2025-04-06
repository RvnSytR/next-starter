"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "better-auth";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { type ButtonProps, Button } from "../ui/button";

const HeaderButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button size="sm" variant="ghost" className="w-full" {...props}>
      {children}
      <ArrowUpDown />
    </Button>
  );
};

// TODO
export const userColumn: ColumnDef<User>[] = [
  {
    accessorKey: "number",
    header: "No",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User ID
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.id.slice(0, 5) + "...",
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
    accessorKey: "name",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
      </HeaderButton>
    ),
    cell: ({ row }) => row.original.name,
  },
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => (
  //     <HeaderButton
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Role
  //     </HeaderButton>
  //   ),
  //   cell: ({ row }) => (
  //     <Badge
  //       variant={
  //         row.original.role !== "pending"
  //           ? "outline_success"
  //           : "outline_warning"
  //       }
  //       className="capitalize"
  //     >
  //       {row.original.role}
  //     </Badge>
  //   ),
  //   filterFn: (row, id, value) => value.includes(row.getValue(id)),
  // },
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
      row.original.updatedAt ? format(row.original.updatedAt, "PPPp") : null,
    sortingFn: (a, b) => {
      const { updatedAt: aLog } = a.original;
      const { updatedAt: bLog } = b.original;
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
    cell: ({ row }) => format(row.original.createdAt, "PPPp"),
    sortingFn: (a, b) =>
      a.original.createdAt.getTime() - b.original.createdAt.getTime(),
  },
];
