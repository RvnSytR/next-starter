"use client";

import { useState as UseState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import type { UserCredentials } from "@/lib/db/schema";
import { DeleteUser } from "@/server/action";

import { label } from "../content";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast as Toast } from "sonner";
import { type ButtonProps, Button } from "../ui/button";
import { ArrowUpDown, Trash } from "lucide-react";

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
        {row.original.last_signin_at.toUTCString()}
      </div>
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
  {
    accessorKey: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => {
      const [isDisable, setIsDisable] = UseState<boolean>(false);

      return (
        <AlertDialog>
          <div className="flex justify-center">
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="outline_destructive"
                disabled={isDisable}
              >
                <Trash />
              </Button>
            </AlertDialogTrigger>
          </div>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Hapus {row.original.username} ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini akan menghapus akun secara permanen dan tidak dapat
                dipulihkan. Pastikan Anda benar-benar yakin sebelum melanjutkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Kembali</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const { loading, success } = label;
                  setIsDisable(true);
                  Toast.promise(DeleteUser(row.original.id_user), {
                    loading: loading.default,
                    success: () => {
                      setIsDisable(false);
                      return success.deleteAccountDialog(row.original.username);
                    },
                    error: (e: Error) => {
                      setIsDisable(false);
                      return e.message;
                    },
                  });
                }}
              >
                Hapus Akun
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
