"use client";

import { useIsMobile } from "@/hooks";
import { actions, messages } from "@/lib/content";
import { cn } from "@/utils";
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
import { ButtonGroup } from "../ui/button-group";
import { RefreshButton } from "../ui/buttons-client";
import { Checkbox } from "../ui/checkbox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Kbd } from "../ui/kbd";
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
export type ToolBoxProps = { withRefresh?: boolean; placeholder?: string };

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

  const isMobile = useIsMobile();
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
      <ToolBox
        table={table}
        isMobile={isMobile}
        className={classNames?.toolbox}
        {...props}
      >
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
        className={cn(
          "flex w-full flex-col items-center gap-4 text-center lg:flex-row",
          classNames?.footer,
        )}
      >
        <RowsPerPage
          table={table}
          isMobile={isMobile}
          rowsLimitArr={rowsLimitArr}
          className="order-4 shrink-0 lg:order-1"
        />

        <small className="text-muted-foreground order-3 shrink-0 lg:order-2">
          {selectedRows.length} dari {filteredRows.length} baris dipilih
        </small>

        <small className="text-muted-foreground order-1 mx-auto text-sm lg:order-3">
          {caption}
        </small>

        <small className="order-2 shrink-0 tabular-nums lg:order-4">
          Halaman {pageNumber} dari {totalPage}
        </small>

        <Pagination
          table={table}
          isMobile={isMobile}
          className="order-3 shrink-0 lg:order-5"
        />
      </div>
    </div>
  );
}

function ToolBox<TData>({
  table,
  placeholder,
  withRefresh = false,
  isMobile = false,
  className,
  children,
}: TableProps<TData> &
  ToolBoxProps & {
    isMobile?: boolean;
    className?: string;
    children: ReactNode;
  }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 lg:flex-row lg:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-2 lg:flex-row lg:items-center")}>
        <ButtonGroup className="w-full lg:w-fit [&_button]:grow">
          <FilterSelector table={table} />
          <View table={table} isMobile={isMobile} withRefresh={withRefresh} />
          {withRefresh && <RefreshButton variant="outline" />}
        </ButtonGroup>

        {children && !isMobile && (
          <Separator orientation="vertical" className="h-5" />
        )}

        {children}
      </div>

      <div className="flex gap-x-2 *:grow">
        <Reset table={table} />
        <Search
          table={table}
          placeholder={placeholder}
          className="col-span-2"
        />
      </div>
    </div>
  );
}

function View<TData>({
  table,
  isMobile,
  withRefresh,
}: TableProps<TData> &
  Pick<ToolBoxProps, "withRefresh"> & { isMobile: boolean }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Columns3 /> {actions.view}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={isMobile && !withRefresh ? "end" : "center"}
        className="flex flex-col gap-y-1 p-1"
      >
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
  placeholder = "Cari...",
  className,
}: TableProps<TData> &
  Pick<ToolBoxProps, "placeholder"> & { className?: string }) {
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
    <InputGroup className={className}>
      <InputGroupInput
        ref={searchRef}
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      />

      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>

      <InputGroupAddon align="inline-end">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}

function Pagination<TData>({
  table,
  isMobile,
  className,
}: TableProps<TData> & { isMobile: boolean; className?: string }) {
  const size = isMobile ? "icon" : "icon-sm";
  const variant = "outline";
  return (
    <ButtonGroup className={cn(className)}>
      <Button
        size={size}
        variant={variant}
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight />
      </Button>
    </ButtonGroup>
  );
}

function RowsPerPage<TData>({
  table,
  isMobile,
  rowsLimitArr,
  className,
}: TableProps<TData> & {
  rowsLimitArr: number[];
  isMobile: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-x-2", className)}>
      <Label>Baris per halaman</Label>
      <Select
        value={String(table.getState().pagination.pageSize ?? defaultRowsLimit)}
        onValueChange={(value) => {
          table.setPageSize(Number(value));
        }}
      >
        <SelectTrigger size={isMobile ? "default" : "sm"}>
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
