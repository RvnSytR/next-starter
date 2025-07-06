"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  Table as DataTableType,
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
  Settings2,
} from "lucide-react";
import { Fragment, useState } from "react";
import { RefreshButton } from "../custom/custom-button";
import { Button, buttonVariants } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DataTableSearch } from "./data-table-client";
import {
  ActiveFilters,
  ActiveFiltersMobileContainer,
  FilterActions,
  FilterSelector,
} from "./data-table-filter";

type DataTableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
};

export type TableProps<TData> = { table: DataTableType<TData> };
export type ToolBoxProps = {
  withRefresh?: boolean;
  searchPlaceholder?: string;
};

export type OtherDataTableProps = ToolBoxProps & {
  caption?: string;
  noResult?: string[];
  className?: string;
};

export function DataTable<TData>({
  data,
  columns,
  caption,
  noResult,
  className,
  ...props
}: DataTableProps<TData> & OtherDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const rowsLimitArr = [20, 30, 40, 50, 100];

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

    initialState: { pagination: { pageIndex: 0, pageSize: rowsLimitArr[0] } },
    state: { sorting, globalFilter, columnFilters, columnVisibility },
  });

  const pageCount = table.getPageCount();
  const pageNumber =
    table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0;

  return (
    <Fragment>
      <ToolBox table={table} {...props} />

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersMobileContainer>
          <FilterActions table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersMobileContainer>
      )}

      <div className={cn("bg-background/50 rounded-lg border", className)}>
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
      </div>

      <div className="flex flex-col items-center gap-4">
        {caption && <small className="text-muted-foreground">{caption}</small>}

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <RowsPerPage
            table={table}
            rowsLimitArr={rowsLimitArr}
            className="order-2 md:order-1"
          />

          <div className="order-1 flex flex-col items-center gap-4 md:order-2 md:flex-row">
            <small className="order-2 tabular-nums md:order-1">
              {`Page ${pageNumber} of ${pageCount}`}
            </small>

            <Pagination table={table} className="order-1 md:order-2" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function ToolBox<TData>({
  table,
  withRefresh = false,
  searchPlaceholder,
}: TableProps<TData> & ToolBoxProps) {
  return (
    <div className="flex w-full flex-col gap-2 lg:flex-row lg:justify-between">
      <DataTableSearch
        table={table}
        searchPlaceholder={searchPlaceholder}
        className="order-2 lg:order-1"
      />

      <div
        className={cn(
          "order-1 grid gap-2 lg:order-2 lg:flex",
          withRefresh ? "grid-cols-3" : "grid-cols-2",
        )}
      >
        <FilterSelector table={table} />
        <View table={table} />
        {withRefresh && <RefreshButton size="sm" variant="outline" />}
      </div>
    </div>
  );
}

function View<TData>({ table }: TableProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <Settings2 /> View
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-fit flex-col gap-y-1 p-1">
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
                  "justify-start gap-x-2 p-2 capitalize",
                )}
              >
                <Checkbox
                  id={cbId}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                />

                <small className="font-medium">{column.id}</small>
              </Label>
            );
          })}
      </PopoverContent>
    </Popover>
  );
}

function Pagination<TData>({
  table,
  className,
}: TableProps<TData> & { className?: string }) {
  const isMobile = useIsMobile();
  return (
    <div className={cn("flex gap-x-1", className)}>
      <Button
        size={isMobile ? "icon" : "iconsm"}
        variant="outline"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft />
      </Button>

      <Button
        size={isMobile ? "icon" : "iconsm"}
        variant="outline"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
      </Button>

      <Button
        size={isMobile ? "icon" : "iconsm"}
        variant="outline"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight />
      </Button>

      <Button
        size={isMobile ? "icon" : "iconsm"}
        variant="outline"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight />
      </Button>
    </div>
  );
}

function RowsPerPage<TData>({
  table,
  rowsLimitArr,
  className,
}: TableProps<TData> & { rowsLimitArr: number[]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Label>Rows per page</Label>
      <Select
        value={String(table.getState().pagination.pageSize)}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {rowsLimitArr.map((item, index) => (
            <SelectItem key={index} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
