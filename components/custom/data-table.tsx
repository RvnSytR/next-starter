"use client";

import { useState } from "react";

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

import { cn } from "@/lib/utils";

import {
  type CheckboxPopoverProps,
  CheckboxPopover,
} from "../custom/custom-input-client";
import { FormFloating } from "../custom/custom-input";
import { SectionGroup, SectionTitle } from "../layout/section";
import { CustomButton } from "../custom/custom-button";
import { iconSize } from "../icon";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FilterX,
  Search,
  Settings2,
} from "lucide-react";

// #region // * Types
type TableProps<TData> = {
  table: DataTableType<TData>;
};

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
};

export type FacetedFilter = Pick<CheckboxPopoverProps, "id" | "arr" | "icon">;
// #endregion

// #region // * Side Component
function FacetedFilter<TData>({
  table,
  id,
  arr,
  icon,
}: TableProps<TData> & FacetedFilter) {
  const column = table.getColumn(id);
  if (!column) throw new Error(`Column ${id} not found`);
  return (
    <CheckboxPopover
      id={id}
      state={column.getFilterValue() as string[]}
      setState={column.setFilterValue}
      arr={arr}
      icon={icon}
    />
  );
}

function ToolBox<TData>({
  table,
  placeholder = "Search Something",
  facetedFilter: filterCol,
  withRefresh,
  children,
}: TableProps<TData> & {
  placeholder?: string;
  facetedFilter?: FacetedFilter[];
  withRefresh?: boolean;
  children?: React.ReactNode;
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      {children}

      {filterCol && isFiltered && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="order-2 border-dashed lg:order-1"
        >
          <FilterX />
          Reset
        </Button>
      )}

      {filterCol && (
        <div className="order-1 flex gap-2 lg:order-2">
          {filterCol.map((item, index) => (
            <FacetedFilter key={index} table={table} {...item} />
          ))}
        </div>
      )}

      <div className="order-4 flex grow gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="shrink-0">
              <Settings2 />
              View
            </Button>
          </PopoverTrigger>

          <PopoverContent className="flex w-fit flex-col gap-y-1 p-2">
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
                      "justify-start p-2 capitalize",
                    )}
                  >
                    <Checkbox
                      id={cbId}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      className="data-[state=checked]:text-primary border-none shadow-none data-[state=checked]:border-none data-[state=checked]:bg-transparent"
                    />
                    <small className="font-medium">{column.id}</small>
                  </Label>
                );
              })}
          </PopoverContent>
        </Popover>

        {withRefresh && (
          <CustomButton customType="refresh" size="sm" variant="outline" />
        )}

        <FormFloating
          icon={<Search size={iconSize.base} />}
          className="h-8 grow"
        >
          <Input
            type="search"
            placeholder={placeholder}
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="h-8 pl-10"
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
        <span className="hidden md:flex">Last</span>
        <ChevronsRight />
      </Button>
    </div>
  );
}
// #endregion

export function DataTable<TData, TValue>({
  data,
  columns,
  title = "Data Table",
  caption,
  label,
  placeholder,
  withRefresh,
  facetedFilter,
  children,
}: DataTableProps<TData, TValue> & {
  title?: string;
  caption?: string;
  label?: string[];
  placeholder?: string;
  withRefresh?: boolean;
  facetedFilter?: FacetedFilter[];
  children?: React.ReactNode;
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

  return (
    <SectionGroup>
      <div className="flex flex-col justify-between gap-y-2 lg:flex-row">
        <SectionTitle text={title} />

        <ToolBox
          table={table}
          facetedFilter={facetedFilter}
          placeholder={placeholder}
          withRefresh={withRefresh}
        >
          {children}
        </ToolBox>
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
                className="text-muted-foreground text-center whitespace-pre-line"
              >
                {label ? label.map((item) => item + "\n") : "No results."}
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
    </SectionGroup>
  );
}
