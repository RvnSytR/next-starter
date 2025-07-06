"use client";

import { filterFn } from "@/lib/filters";
import { Role, rolesMeta } from "@/lib/permission";
import { capitalize, cn, formatDate } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpDown,
  Ban,
  CalendarCheck2,
  CircleDot,
  EllipsisVertical,
  Layers2,
  Mail,
  UserRound,
} from "lucide-react";
import {
  AdminChangeUserRoleDialog,
  AdminRemoveUserDialog,
  AdminTerminateUserSessionsDialog,
  UserAvatar,
  UserRoleBadge,
  UserVerifiedBadge,
} from "../modules/auth";
import { Badge } from "../ui/badge";
import { Button, ButtonProps } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

const HeaderButton = ({ className, children, ...props }: ButtonProps) => {
  return (
    <div className="flex justify-start">
      <Button
        size="sm"
        variant="ghost"
        className={cn("h-7 justify-between", className)}
        {...props}
      >
        {children}
        <ArrowUpDown />
      </Button>
    </div>
  );
};

const createUserColumn = createColumnHelper<UserWithRole>();
export const getUserColumn = (currentUserId: string) => [
  createUserColumn.display({
    id: "number",
    header: "No",
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
  }),
  createUserColumn.accessor(({ image }) => image, {
    id: "Avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar
          {...row.original}
          className="size-20"
          imageCn="group-hover:scale-125"
          fallbackCn="group-hover:scale-125"
        />
      </div>
    ),
  }),
  createUserColumn.accessor(({ email }) => email, {
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
    meta: { displayName: "Email", type: "text", icon: Mail },
  }),
  createUserColumn.accessor(({ name }) => name, {
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
    meta: { displayName: "Name", type: "text", icon: UserRound },
  }),
  createUserColumn.accessor(({ role }) => role, {
    id: "role",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1.5">
        {row.original.emailVerified && <UserVerifiedBadge />}
        <UserRoleBadge role={row.original.role as Role} />
      </div>
    ),
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
    meta: { displayName: "Created At", type: "date", icon: CalendarCheck2 },
  }),
  createUserColumn.display({
    id: "Action",
    header: "Action",
    cell: ({ row }) => {
      if (row.original.id === currentUserId) {
        return (
          <div className="flex justify-center">
            <Badge variant="outline">Current User</Badge>
          </div>
        );
      }

      return (
        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="iconsm" variant="ghost">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="flex w-fit flex-col gap-y-1 p-1 [&_button]:justify-start"
            >
              <div className="px-2 py-1 text-center">
                <small className="font-medium">{row.original.name}</small>
              </div>

              <Separator />

              <AdminChangeUserRoleDialog {...row.original} />

              <Button size="sm" variant="ghost" disabled>
                <Layers2 />
                Impersonate Session
              </Button>

              <AdminTerminateUserSessionsDialog {...row.original} />

              <Button size="sm" variant="ghost_destructive" disabled>
                <Ban />
                Ban
              </Button>

              <AdminRemoveUserDialog {...row.original} />
            </PopoverContent>
          </Popover>
        </div>
      );
    },
  }),
];
