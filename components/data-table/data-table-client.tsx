"use client";

import { tableText } from "@/lib/content";
import { Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { InputWrapper } from "../other/inputs";
import { CommandShortcut } from "../ui/command";
import { Input } from "../ui/input";
import { TableProps, ToolBoxProps } from "./data-table";

export function DataTableSearch<TData>({
  table,
  searchPlaceholder = tableText.placeholder,
  className,
}: TableProps<TData> &
  Pick<ToolBoxProps, "searchPlaceholder"> & { className?: string }) {
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
    <InputWrapper icon={<Search />} className={className}>
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
