"use client";

import { filterFn } from "@/lib/filters";
import { adminRoles, Role, roleMetadata } from "@/lib/permission";
import { capitalize, formatDate } from "@/lib/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpDown,
  Ban,
  CalendarCheck2,
  CalendarClock,
  CircleDot,
  EllipsisVertical,
  Layers2,
  Mail,
  UserRound,
} from "lucide-react";
import {
  AdminChangeUserRoleDialog,
  AdminRemoveUserDialog,
  AdminTerminateUserSessionDialog,
  UserAvatar,
} from "../modules/auth";
import { Badge } from "../ui/badge";
import { Button, ButtonProps } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const HeaderButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button size="sm" variant="ghost" className="w-full" {...props}>
      {children}
      <ArrowUpDown />
    </Button>
  );
};

export const userColumnHelper = createColumnHelper<UserWithRole>();
export const getUserColumn = (currentUserId: string) => [
  userColumnHelper.display({
    id: "number",
    header: () => <div className="px-2">No</div>,
    cell: ({ row }) => row.index + 1,
    enableHiding: false,
  }),
  userColumnHelper.accessor(({ image }) => image, {
    id: "Profile Picture",
    header: "Profile Picture",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar
          {...row.original}
          className="size-24"
          imageCn="group-hover:scale-125"
          fallbackCn="group-hover:scale-125"
        />
      </div>
    ),
  }),
  userColumnHelper.accessor(({ email }) => email, {
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
  userColumnHelper.accessor(({ name }) => name, {
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
  userColumnHelper.accessor(({ role }) => role, {
    id: "role",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
      </HeaderButton>
    ),
    cell: ({ row }) => {
      const role = row.original.role! as Role;
      const isAdmin = adminRoles.includes(role);
      const { displayName, icon: RoleIcon, desc } = roleMetadata[role];
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={isAdmin ? "outline_primary" : "outline"}
              className="capitalize"
            >
              <RoleIcon />
              {displayName ?? role}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{desc}</TooltipContent>
        </Tooltip>
      );
    },
    filterFn: filterFn("option"),
    meta: {
      displayName: "Role",
      type: "option",
      icon: CircleDot,
      transformOptionFn: (value) => {
        const { displayName, icon } = roleMetadata[value as Role];
        return { value, label: displayName ?? capitalize(value), icon: icon };
      },
    },
  }),
  userColumnHelper.accessor(({ updatedAt }) => updatedAt, {
    id: "Updated At",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated At
      </HeaderButton>
    ),
    cell: ({ row }) =>
      row.original.updatedAt
        ? formatDate(row.original.updatedAt, "PPPp")
        : null,
    filterFn: filterFn("date"),
    meta: {
      displayName: "Updated At",
      type: "date",
      icon: CalendarClock,
    },
  }),
  userColumnHelper.accessor(({ createdAt }) => createdAt, {
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
    meta: {
      displayName: "Created At",
      type: "date",
      icon: CalendarCheck2,
    },
  }),
  userColumnHelper.display({
    id: "Action",
    header: "Action",
    cell: ({ row }) => {
      if (row.original.id === currentUserId) {
        return <Badge variant="outline">Current User</Badge>;
      }

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost">
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

            <AdminTerminateUserSessionDialog {...row.original} />

            <Button size="sm" variant="ghost_destructive" disabled>
              <Ban />
              Ban
            </Button>

            <AdminRemoveUserDialog {...row.original} />
          </PopoverContent>
        </Popover>
      );
    },
  }),
];
