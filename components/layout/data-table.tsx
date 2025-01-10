"use client";

import { useState } from "react";

import {
  ColumnDef,
  // ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type { UserCredentials } from "@/lib/db/schema";
import { CreateUserDialog, DeleteUserDialog } from "./auth";
import { SectionGroup, SectionTitle } from "./section";
import { CustomButton } from "../global/custom-button";
import { colUser } from "./column";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  label?: string[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
  label,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="w-full space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="whitespace-pre-line text-center text-muted-foreground"
              >
                {label ? label.map((item) => item + "\n") : "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center gap-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="gap-x-2"
        >
          <ChevronLeft />
          Prev
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="gap-x-2"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export function AccountDataTable({
  data,
  currentIdUser,
}: {
  currentIdUser: string;
  data: UserCredentials[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const columns: ColumnDef<UserCredentials>[] = [
    ...colUser,
    {
      accessorKey: "action",
      header: () => <div className="text-center">Action</div>,
      cell: ({ row }) => {
        const { id_user, username } = row.original;
        return (
          <div className="flex justify-center">
            <DeleteUserDialog
              id_user={id_user}
              username={username}
              currentIdUser={currentIdUser}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      // columnFilters,
      globalFilter,
    },
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <SectionGroup>
      <div className="flex flex-col justify-between gap-y-2 md:flex-row">
        <SectionTitle withHash>Data Pengguna</SectionTitle>

        <div className="flex gap-x-2">
          <CustomButton
            customType="refresh"
            variant="outline"
            hideTextOnMobile
          />

          <CreateUserDialog />

          <Input
            type="search"
            placeholder="Cari Pengguna"
            // value={
            //   (table.getColumn("id_user")?.getFilterValue() as string) ?? ""
            // }
            // onChange={(e) =>
            //   table.getColumn("id_user")?.setFilterValue(e.target.value)
            // }
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="w-full md:w-fit"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="whitespace-pre-line text-center text-muted-foreground"
              >
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center gap-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft />
          First
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
          Prev
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          Last
          <ChevronsRight />
        </Button>
      </div>
    </SectionGroup>
  );
}
