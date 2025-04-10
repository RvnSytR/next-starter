"use client";

import { cn } from "@/lib/utils";
import {
  type Table as DataTableType,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Settings2,
} from "lucide-react";
import { useState } from "react";
import { RefreshButton } from "../custom/custom-button";
import { FormFloating } from "../custom/custom-field";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ActiveFilters,
  ActiveFiltersMobileContainer,
  FilterActions,
  FilterSelector,
} from "./data-table-filter";

type TableProps<TData> = { table: DataTableType<TData> };
type DataTableProps<TData> = {
  data: TData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
};

type ToolBoxProps = {
  withRefresh?: boolean;
  searchPlaceholder?: string;
  children?: React.ReactNode;
};

export function DataTable<TData>({
  data,
  columns,
  title = "Data Table",
  subtitle = "Data Table Description",
  caption,
  noResult,
  className,
  ...props
}: DataTableProps<TData> &
  ToolBoxProps & {
    title?: string;
    subtitle?: string;
    caption?: string;
    noResult?: string[];
    className?: string;
  }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,

    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
  });

  const hasFilters = table.getState().columnFilters.length > 0;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>

        <ToolBox table={table} {...props} />
      </CardHeader>

      {hasFilters && (
        <div className="border-t border-b px-6 py-2 shadow-xs">
          <ActiveFiltersMobileContainer>
            <FilterActions table={table} />
            <ActiveFilters table={table} />
          </ActiveFiltersMobileContainer>
        </div>
      )}

      <CardContent className="space-y-4">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground text-center whitespace-pre-line"
                >
                  {noResult
                    ? noResult.map((item) => item + "\n")
                    : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div
          className={cn(
            "mt-4 flex flex-col gap-2 lg:mt-0 lg:flex-row lg:items-center",
            caption ? "justify-between" : "justify-center",
          )}
        >
          <small className="text-muted-foreground text-left font-medium lg:text-center">
            {caption}
          </small>

          <Pagination table={table} />
        </div>
      </CardContent>
    </Card>
  );
}

function ToolBox<TData>({
  table,
  withRefresh = false,
  searchPlaceholder = "Search Something",
  children,
}: TableProps<TData> & ToolBoxProps) {
  return (
    <div className="flex w-full flex-col gap-2 lg:w-fit lg:flex-row">
      {children}

      <FilterSelector table={table} />

      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <Settings2 />
            View
          </Button>
        </PopoverTrigger>

        <PopoverContent className="flex w-fit min-w-60 flex-col gap-y-1 p-1">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column, index) => {
              const cbId = `cb${column.id}`;
              return (
                <Label
                  key={index}
                  htmlFor={cbId}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "items-center justify-start gap-x-2 p-2 capitalize",
                  )}
                >
                  <Checkbox
                    id={cbId}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  />

                  <small className="font-medium">{column.id}</small>
                </Label>
              );
            })}
        </PopoverContent>
      </Popover>

      <div className="flex gap-x-2">
        {withRefresh && <RefreshButton size="sm" variant="outline" />}

        <FormFloating icon={<Search />} className="grow">
          <Input
            type="search"
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="h-8"
          />
        </FormFloating>
      </div>
    </div>
  );
}

function Pagination<TData>({ table }: TableProps<TData>) {
  return (
    <div className="flex justify-center gap-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft />
        <span className="hidden md:flex">First</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
        Previous
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
        <span className="hidden md:flex">Last</span>
        <ChevronsRight />
      </Button>
    </div>
  );
}
