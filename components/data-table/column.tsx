"use client";

import { filterFn } from "@/lib/filters";
import { Role, rolesMeta } from "@/lib/permission";
import { cn, formatDate } from "@/utils";
import { Column, createColumnHelper, Row, Table } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CalendarCheck2,
  CalendarSync,
  CircleDot,
  Mail,
  Pin,
  PinOff,
  UserRound,
  UserSquare2,
  X,
} from "lucide-react";
import { UserAvatar, UserRoleBadge, UserVerifiedBadge } from "../modules/user";
import { UserDetailSheet } from "../modules/user-client";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function headerColumn<C, T>(
  column: Column<C, T>,
  title: React.ReactNode,
  center: boolean = false,
) {
  const columnPinned = column.getIsPinned();
  const ColumnPinIcon = columnPinned ? PinOff : Pin;

  return (
    <div
      className={cn(
        "flex items-center gap-x-2",
        center ? "justify-center" : "justify-start",
      )}
    >
      <span className="font-medium">{title}</span>

      <div className="flex gap-x-px">
        {column.getCanSort() && (
          <Button
            size="icon-xs"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        )}

        {column.getCanPin() && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-xs" variant="ghost">
                <ColumnPinIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-fit flex-row">
              <DropdownMenuItem
                className="size-6"
                onClick={() => column.pin("left")}
                disabled={columnPinned === "left"}
              >
                <ArrowLeft />
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="size-6"
                onClick={() => column.pin(false)}
                disabled={columnPinned === false}
              >
                <X />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="size-6"
                onClick={() => column.pin("right")}
                disabled={columnPinned === "right"}
              >
                <ArrowRight />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
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

function cellNum(num: number) {
  return <div className="text-center">{num}</div>;
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
    id: "Foto Profil",
    header: ({ column }) => headerColumn(column, "Foto Profil", true),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-20" />
      </div>
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Foto Profil", type: "text", icon: UserSquare2 },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enablePinning: true,
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: "name",
    header: ({ column }) => headerColumn(column, "Nama"),
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
    header: ({ column }) => headerColumn(column, "Alamat Email"),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <span>{row.original.email}</span>
          {!row.original.emailVerified && <UserVerifiedBadge withoutText />}
        </div>
      );
    },
    filterFn: filterFn("text"),
    meta: { displayName: "Alamat Email", type: "text", icon: Mail },
  }),
  createUserColumn.accessor(({ role }) => role, {
    id: "role",
    header: ({ column }) => headerColumn(column, "Role"),
    cell: ({ cell }) => <UserRoleBadge role={cell.getValue() as Role} />,
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
    id: "Terakhir Diperbarui",
    header: ({ column }) => headerColumn(column, "Terakhir Diperbarui"),
    cell: ({ cell }) => formatDate(cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      displayName: "Terakhir Diperbarui",
      type: "date",
      icon: CalendarSync,
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: "Waktu Dibuat",
    header: ({ column }) => headerColumn(column, "Waktu Dibuat"),
    cell: ({ cell }) => formatDate(cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: { displayName: "Waktu Dibuat", type: "date", icon: CalendarCheck2 },
  }),
];
