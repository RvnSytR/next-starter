"use client";

import { filterFn } from "@/lib/filters";
import { capitalize } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpDown,
  CircleDot,
  Mail,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
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

const userColumnHelper = createColumnHelper<UserWithRole>();
export const userColumn = [
  userColumnHelper.display({
    id: "number",
    header: "No",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
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
  userColumnHelper.accessor((row) => row.role ?? "user", {
    id: "role",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <Badge variant="outline_success" className="capitalize">
        {row.original.role}
      </Badge>
    ),
    filterFn: filterFn("option"),
    meta: {
      displayName: "Status",
      type: "option",
      icon: CircleDot,
      transformOptionFn(value) {
        return {
          value: value,
          label: capitalize(value),
          icon: value === "admin" ? UserRoundCheck : UserRound,
        };
      },
    },
  }),
  // userColumnHelper.accessor((row) => row.updatedAt, {
  //   id: "updatedAt",
  //   header: ({ column }) => (
  //     <HeaderButton
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Updated At
  //     </HeaderButton>
  //   ),
  //   cell: ({ row }) =>
  //     row.original.updatedAt
  //       ? formatDate(row.original.updatedAt, "PPPp")
  //       : null,
  //   filterFn: filterFn("date"),
  //   meta: {
  //     displayName: "Updated At",
  //     type: "date",
  //     icon: CalendarClock,
  //   },
  // }),
  // userColumnHelper.accessor((row) => row.createdAt, {
  //   id: "createdAt",
  //   header: ({ column }) => (
  //     <HeaderButton
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Created At
  //     </HeaderButton>
  //   ),
  //   cell: ({ row }) =>
  //     row.original.createdAt
  //       ? formatDate(row.original.createdAt, "PPPp")
  //       : null,
  //   filterFn: filterFn("date"),
  //   meta: {
  //     displayName: "Created At",
  //     type: "date",
  //     icon: CalendarCheck2,
  //   },
  // }),
];
