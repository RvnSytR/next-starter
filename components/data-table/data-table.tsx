"use client";

import { buttonText, tableText } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  Table as DataTableType,
  Row,
  SortingState,
  TableOptions,
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
  Columns3,
  ListRestart,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { RefreshButton } from "../other/buttons";
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

export type OtherDataTableProps<TData> = ToolBoxProps & {
  onRowSelection?: (
    data: Row<TData>[],
    table: DataTableType<TData>,
  ) => ReactNode;
  caption?: string;
  noResult?: string[];
  className?: string;
  classNames?: {
    toolbox?: string;
    filterContainer?: string;
    tableContainer?: string;
    table?: string;
    footer?: string;
  };
};

export function DataTable<TData>({
  data,
  columns,
  caption,
  noResult,
  className,
  classNames,
  onRowSelection,
  enableRowSelection,
  ...props
}: DataTableProps<TData> &
  OtherDataTableProps<TData> &
  Pick<TableOptions<TData>, "enableRowSelection">) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [children, setChildren] = useState<ReactNode>(null);
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

    onRowSelectionChange: setRowSelection,
    enableRowSelection,

    initialState: { pagination: { pageIndex: 0, pageSize: rowsLimitArr[0] } },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const filteredRows = table.getFilteredRowModel().rows;

  const totalPage = table.getPageCount();
  const pageNumber =
    table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0;

  useEffect(() => {
    if (onRowSelection) setChildren(onRowSelection(selectedRows, table));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows]);

  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      <ToolBox table={table} className={classNames?.toolbox} {...props}>
        {selectedRows.length > 0 && children}
      </ToolBox>

      {table.getState().columnFilters.length > 0 && (
        <ActiveFiltersMobileContainer className={classNames?.filterContainer}>
          <FilterActions table={table} />
          <Separator orientation="vertical" className="h-4" />
          <ActiveFilters table={table} />
        </ActiveFiltersMobileContainer>
      )}

      <div className={cn("rounded-lg border", classNames?.tableContainer)}>
        <Table className={classNames?.table}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
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
                    : tableText.noResult}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div
        className={cn("flex flex-col items-center gap-4", classNames?.footer)}
      >
        {caption && <small className="text-muted-foreground">{caption}</small>}

        <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row">
          <small className="text-muted-foreground">
            {tableText.rowSelection(selectedRows.length, filteredRows.length)}
          </small>

          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <div className="order-2 flex items-center gap-4 lg:order-1">
              <RowsPerPage table={table} rowsLimitArr={rowsLimitArr} />

              <small className="tabular-nums">
                {tableText.pagenation(pageNumber, totalPage)}
              </small>
            </div>

            <Pagination table={table} className="order-1 lg:order-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolBox<TData>({
  table,
  withRefresh = false,
  searchPlaceholder,
  className,
  children,
}: TableProps<TData> &
  ToolBoxProps & { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 lg:flex-row lg:justify-between",
        className,
      )}
    >
      <div className={cn("flex items-center gap-x-2 [&_button]:grow")}>
        <FilterSelector table={table} />
        <View table={table} />
        {withRefresh && <RefreshButton size="sm" variant="outline" />}
        {children && (
          <Separator orientation="vertical" className="hidden h-4 lg:flex" />
        )}

        {children}
      </div>

      <div className="flex gap-x-2 *:grow">
        <Reset table={table} />
        <DataTableSearch
          table={table}
          searchPlaceholder={searchPlaceholder}
          className="col-span-2"
        />
      </div>
    </div>
  );
}

function Reset<TData>({
  table,
  className,
}: TableProps<TData> & { className?: string }) {
  return (
    <Button
      size="sm"
      variant="outline"
      className={className}
      onClick={() => {
        table.reset();
        table.resetColumnFilters();
        table.resetColumnOrder();
        table.resetColumnPinning();
        table.resetColumnSizing();
        table.resetColumnVisibility();
        table.resetExpanded();

        table.resetGlobalFilter();
        table.setGlobalFilter("");

        table.resetGrouping();
        table.resetHeaderSizeInfo();
        table.resetPageIndex();
        table.resetPageSize();
        table.resetPagination();
        table.resetRowPinning();
        table.resetRowSelection();
        table.resetSorting();
      }}
    >
      <ListRestart />
      {buttonText.reset}
    </Button>
  );
}

function View<TData>({ table }: TableProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <Columns3 /> {buttonText.view}
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
  return (
    <div className={cn("flex gap-x-1", className)}>
      <Button
        size="iconsm"
        variant="outline"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft />
      </Button>

      <Button
        size="iconsm"
        variant="outline"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
      </Button>

      <Button
        size="iconsm"
        variant="outline"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight />
      </Button>

      <Button
        size="iconsm"
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
      <Label>{tableText.rowsPerPage}</Label>
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
