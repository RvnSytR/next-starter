"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
import { FormFloating } from "../custom/custom-input";
import { CustomButton } from "../custom/custom-button";
import { SectionGroup, SectionTitle } from "../layout/section";
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
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Search,
  Settings2,
  X,
} from "lucide-react";

// #region // * Types
type TableProps<TData> = {
  table: DataTableType<TData>;
};

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
};

export type ColumnFacetedFilter = {
  id: string;
  arr: { value: string; length: number }[];
  iconArr?: React.ReactNode[];
};
// #endregion

// #region // * Side Component
function FacetedFilter<TData>({
  table,
  id,
  arr,
  iconArr,
  isMobile,
}: TableProps<TData> & ColumnFacetedFilter & { isMobile: boolean }) {
  const breakpoint = isMobile ? 1 : 2;
  const selectedFilterValue = new Set(
    table.getColumn(id)?.getFilterValue() as string[],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 grow select-none capitalize"
        >
          <Filter />
          {id}
          {selectedFilterValue.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />

              <div className="space-x-1">
                {selectedFilterValue.size > breakpoint ? (
                  <Badge
                    className="rounded-sm px-1 font-normal"
                    variant="secondary"
                  >
                    {selectedFilterValue.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedFilterValue).map((item, index) => (
                    <Badge
                      key={index}
                      className="rounded px-1 font-normal"
                      variant="secondary"
                    >
                      {item}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-fit flex-col gap-y-1 p-2">
        {arr.map((item, index) => {
          const { value, length } = item;
          const cbId = `cb${value}`;
          const isSelected = selectedFilterValue.has(value);
          return (
            <Label
              htmlFor={cbId}
              key={index}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start gap-x-6 capitalize",
              )}
            >
              <div className="flex gap-x-3">
                <Checkbox
                  id={cbId}
                  checked={isSelected}
                  onCheckedChange={() =>
                    table.getColumn(id)?.setFilterValue(() => {
                      if (isSelected) selectedFilterValue.delete(value);
                      else selectedFilterValue.add(value);

                      const filteredValues = Array.from(selectedFilterValue);
                      if (filteredValues.length) table.resetColumnFilters();
                      return filteredValues;
                    })
                  }
                />
                {iconArr && iconArr[index]}
                <small className="font-medium">{value}</small>
              </div>

              <small className="ml-auto font-medium">{length}</small>
            </Label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

function ToolBox<TData>({
  table,
  columnFacetedFilter: filterCol,
  placeholder,
  isMobile,
  withRefresh,
  children,
}: TableProps<TData> & {
  columnFacetedFilter?: ColumnFacetedFilter[];
  placeholder: string;
  isMobile: boolean;
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
          <X />
          Reset
        </Button>
      )}

      {filterCol && (
        <div className="order-1 flex flex-wrap gap-2 lg:order-2">
          {filterCol.map((item, index) => (
            <FacetedFilter
              key={index}
              table={table}
              {...item}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}

      <div className="order-4 flex gap-2">
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
                      className="border-none data-[state=checked]:border-none data-[state=checked]:bg-transparent data-[state=checked]:text-primary"
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
          className="h-9 grow"
        >
          <Input
            type="search"
            placeholder={placeholder}
            value={table.getState().globalFilter}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            className="h-9 w-full pl-10 md:w-fit"
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
  );
}
// #endregion

export function DataTable<TData, TValue>({
  data,
  columns,
  columnFacetedFilter,
  title,
  placeholder,
  label,
  withRefresh,
  children,
}: DataTableProps<TData, TValue> & {
  columnFacetedFilter?: ColumnFacetedFilter[];
  title: string;
  placeholder: string;
  label?: string[];
  withRefresh?: boolean;
  children?: React.ReactNode;
}) {
  const isMobile = useIsMobile();

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
      <div className="flex flex-col justify-between gap-y-2 md:flex-row">
        <SectionTitle>{title}</SectionTitle>

        <ToolBox
          table={table}
          columnFacetedFilter={columnFacetedFilter}
          placeholder={placeholder}
          isMobile={isMobile}
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
                className="whitespace-pre-line text-center text-muted-foreground"
              >
                {label ? label.map((item) => item + "\n") : "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination table={table} />
    </SectionGroup>
  );
}
