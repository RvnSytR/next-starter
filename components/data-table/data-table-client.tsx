"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { FormFloating } from "../custom/custom-field";
import { CommandShortcut } from "../ui/command";
import { Input } from "../ui/input";
import { TableProps, ToolBoxProps } from "./data-table";

export function DataTableSearch<TData>({
  table,
  searchPlaceholder = "Search Something",
}: TableProps<TData> & Pick<ToolBoxProps, "searchPlaceholder">) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        console.log("first");
        searchRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <FormFloating icon={<Search />}>
      <Input
        type="search"
        ref={searchRef}
        placeholder={searchPlaceholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
        className="h-8"
      />
      <CommandShortcut className="absolute inset-y-0 right-3 flex items-center select-none">
        ⌘+K
      </CommandShortcut>
    </FormFloating>
  );
}
