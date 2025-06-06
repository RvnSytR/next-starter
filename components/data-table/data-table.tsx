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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
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
type TableProps<TData> = { table: DataTableType<TData> };
type ToolBoxProps = {
  withRefresh?: boolean;
  searchPlaceholder?: string;
  children?: React.ReactNode;
};

export type OtherDataTableProps = ToolBoxProps & {
  title?: string;
  desc?: string;
  caption?: string;
  noResult?: string[];
  className?: string;
};

export function DataTable<TData>({
  data,
  columns,
  title = "Data Table",
  desc = "Data Table Description",
  caption,
  noResult,
  className,
  ...props
}: DataTableProps<TData> & OtherDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const rowsLimitArr = [10, 20, 30, 40, 50];

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

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: rowsLimitArr[0],
      },
    },

    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-x-2 gap-y-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>

        <ToolBox table={table} {...props} />
      </CardHeader>

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersMobileContainer>
          <FilterActions table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersMobileContainer>
      )}

      <CardContent>
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
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <RowsPerPage
          table={table}
          rowsLimitArr={rowsLimitArr}
          className="order-3 md:order-1"
        />

        {caption && (
          <small className="text-muted-foreground order-1 md:order-2">
            {caption}
          </small>
        )}

        <Pagination table={table} className="order-2 md:order-3" />
      </CardFooter>
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

function Pagination<TData>({
  table,
  className,
}: TableProps<TData> & { className?: string }) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn("flex flex-col items-center gap-4 md:flex-row", className)}
    >
      <Label className="order-2 md:order-1">
        {`Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`}
      </Label>

      <div className="order-1 flex gap-x-1 md:order-2">
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
