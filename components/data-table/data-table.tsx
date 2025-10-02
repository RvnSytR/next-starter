"use client";

import { actions, messages } from "@/lib/content";
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
  RotateCcw,
  SearchIcon,
} from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { RefreshButton } from "../ui/buttons-client";
import { Checkbox } from "../ui/checkbox";
import { CommandShortcut } from "../ui/command";
import { Input, InputWrapper } from "../ui/input";
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
  className?: string;
  classNames?: {
    toolbox?: string;
    filterContainer?: string;
    tableContainer?: string;
    table?: string;
    footer?: string;
  };
};

const rowsLimitArr = [5, 10, 20, 30, 40, 50, 100];
const defaultRowsLimit = rowsLimitArr[2];

export function DataTable<TData>({
  data,
  columns,
  caption,
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

    initialState: { pagination: { pageIndex: 0, pageSize: defaultRowsLimit } },
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

  const totalPage = table.getPageCount() > 0 ? table.getPageCount() : 1;
  const pageNumber =
    table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 1;

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
                  className="text-muted-foreground py-4 text-center whitespace-pre-line"
                >
                  {messages.empty}
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
            {selectedRows.length} dari {filteredRows.length} baris dipilih.
          </small>

          <div className="flex flex-col items-center gap-4 lg:flex-row">
            <RowsPerPage
              table={table}
              rowsLimitArr={rowsLimitArr}
              className="order-3 lg:order-1"
            />

            <small className="order-2 tabular-nums">
              Halaman {pageNumber} dari {totalPage}
            </small>

            <Pagination table={table} className="order-1 lg:order-3" />
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
        <Search
          table={table}
          searchPlaceholder={searchPlaceholder}
          className="col-span-2"
        />
      </div>
    </div>
  );
}

function View<TData>({ table }: TableProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <Columns3 /> {actions.view}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex flex-col gap-y-1 p-1">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const cbId = `cb-${column.id}`;
            const Icon = column.columnDef.meta?.icon;
            return (
              <Label
                key={cbId}
                htmlFor={cbId}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "group justify-start gap-x-3 p-2 capitalize",
                )}
              >
                <Checkbox
                  id={cbId}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                />

                <div className="flex items-center gap-x-2">
                  {Icon && (
                    <Icon className="text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  <small className="font-medium">{column.id}</small>
                </div>
              </Label>
            );
          })}
      </PopoverContent>
    </Popover>
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
      <RotateCcw /> {actions.reset}
    </Button>
  );
}

function Search<TData>({
  table,
  searchPlaceholder = "Cari...",
  className,
}: TableProps<TData> &
  Pick<ToolBoxProps, "searchPlaceholder"> & { className?: string }) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <InputWrapper icon={<SearchIcon />} className={className}>
      <Input
        ref={searchRef}
        placeholder={searchPlaceholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        className="h-8 lg:pr-12"
      />
      <CommandShortcut className="absolute inset-y-0 right-3 hidden items-center select-none lg:flex">
        ⌘+K
      </CommandShortcut>
    </InputWrapper>
  );
}

function Pagination<TData>({
  table,
  className,
}: TableProps<TData> & { className?: string }) {
  return (
    <div className={cn("flex gap-x-1", className)}>
      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft />
      </Button>

      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
      </Button>

      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight />
      </Button>

      <Button
        size="icon-sm"
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
      <Label>Baris per halaman</Label>
      <Select
        value={String(table.getState().pagination.pageSize ?? defaultRowsLimit)}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {rowsLimitArr.map((item) => (
            <SelectItem key={item} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
