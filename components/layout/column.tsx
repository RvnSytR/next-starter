import { ColumnDef } from "@tanstack/react-table";

import { type ButtonProps, Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { UserCredentials } from "@/lib/db/schema";

const HeaderButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button size="sm" variant="ghost" className="w-full" {...props}>
      {children}
      <ArrowUpDown />
    </Button>
  );
};

export const colUser: ColumnDef<UserCredentials>[] = [
  {
    accessorKey: "num",
    header: () => <div className="text-center">No</div>,
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
  },
  {
    accessorKey: "id_user",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID Pengguna
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <div className="text-center">
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
    cell: ({ row }) => <div className="text-center">{row.original.email}</div>,
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
      <div className="text-center">{row.original.username}</div>
    ),
  },
  {
    accessorKey: "last_signin_at",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Terakhir Login
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.last_signin_at?.toUTCString()}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Dibuat Pada
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.created_at.toUTCString()}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <HeaderButton
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
      </HeaderButton>
    ),
    cell: ({ row }) => (
      <div className="text-center capitalize">{row.original.role}</div>
    ),
  },
];
