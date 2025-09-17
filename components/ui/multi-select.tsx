"use client";

import { messages } from "@/lib/content";
import { useDebounce } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, LucideIcon, XIcon } from "lucide-react";
import {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Badge } from "./badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./command";

export type MultiSelectConfig = {
  value: string;
  label?: string;
  disabled?: boolean;
  icon?: string | LucideIcon;
  color?: string;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the value. */
  group?: string | boolean | undefined;
};

type GroupOption = Record<string, MultiSelectConfig[]>;

type MultiSelectProps = {
  value?: string[]; // value by keys
  defaultValue?: MultiSelectConfig[];
  /** manually controlled options */
  options?: MultiSelectConfig[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: ReactNode;
  /** Empty component. */
  emptyIndicator?: ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<MultiSelectConfig[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => MultiSelectConfig[];
  onChange?: (selected: MultiSelectConfig[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
};

export type MultiSelectRef = {
  selectedValue: MultiSelectConfig[];
  input: HTMLInputElement;
  focus: () => void;
  reset: () => void;
};

function transToGroupOption(options: MultiSelectConfig[]) {
  if (options.length === 0) return {};

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option.group as string) || "";
    if (!groupOption[key]) groupOption[key] = [];
    groupOption[key].push(option);
  });

  return groupOption;
}

// function removePickedOption(
//   groupOption: GroupOption,
//   picked: MultiSelectConfig[],
// ) {
//   const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;
//   for (const [key, value] of Object.entries(cloneOption)) {
//     cloneOption[key] = value.filter(
//       (val) => !picked.find((p) => p.value === val.value),
//     );
//   }
//   return cloneOption;
// }

function isOptionsExist(
  groupOption: GroupOption,
  targetOption: MultiSelectConfig[],
) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((opt) => targetOption.find((p) => p.value === opt.value))) {
      return true;
    }
  }
  return false;
}

function getValue(
  value: string[],
  defaultValue: MultiSelectConfig[],
  creatable: boolean,
) {
  return Array.from(value)
    .map(
      (v) =>
        defaultValue.find((i) => i.value === v) ||
        (creatable ? { value: v, label: v } : null),
    )
    .filter(Boolean) as MultiSelectConfig[];
}

export function MultiSelect({
  value,
  onChange,
  placeholder,
  defaultValue = [],
  options: arrayOptions,
  delay,
  onSearch,
  onSearchSync,
  loadingIndicator,
  emptyIndicator = messages.empty,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  className,
  badgeClassName,
  selectFirstItem = true,
  creatable = false,
  triggerSearchOnFocus = false,
  commandProps,
  inputProps,
  hideClearAllButton = false,
}: MultiSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [onScrollbar, setOnScrollbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Added this

  const [selected, setSelected] = useState<MultiSelectConfig[]>(
    getValue(value || [], defaultValue, creatable),
  );
  const [options, setOptions] = useState<GroupOption>(
    transToGroupOption(defaultValue),
  );
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchTerm = useDebounce(inputValue, delay);

  const isAllSelected = selected.length === defaultValue.length;

  const getItemMeta = useCallback(
    (itemValue: string) =>
      defaultValue.find(({ value }) => value === itemValue),
    [defaultValue],
  );

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  const handleUnselect = useCallback(
    (option: MultiSelectConfig) => {
      const newOptions = selected.filter((s) => s.value !== option.value);
      setSelected(newOptions);
      onChange?.(newOptions);
    },
    [onChange, selected],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            const lastSelectOption = selected[selected.length - 1];
            // If last item is fixed, we should not remove it.
            if (!lastSelectOption.fixed) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") input.blur();
      }
    },
    [handleUnselect, selected],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (value) setSelected(getValue(value, defaultValue, creatable));
  }, [value, defaultValue, creatable]);

  useEffect(() => {
    /** If `onSearch` is provided, do not trigger options updated. */
    if (!arrayOptions || onSearch) return;
    const newOption = transToGroupOption(arrayOptions || []);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [defaultValue, arrayOptions, onSearch, options]);

  useEffect(() => {
    /** sync search */

    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || []));
    };

    const exec = async () => {
      if (!onSearchSync || !open) return;
      if (triggerSearchOnFocus) doSearchSync();
      if (debouncedSearchTerm) doSearchSync();
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, open, triggerSearchOnFocus]);

  useEffect(() => {
    /** async search */

    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || []));
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;
      if (triggerSearchOnFocus) await doSearch();
      if (debouncedSearchTerm) await doSearch();
    };

    void exec();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, open, triggerSearchOnFocus]);

  // const selectables = useMemo<GroupOption>(
  //   () => removePickedOption(options, selected),
  //   [options, selected],
  // );

  /** Avoid Creatable Selector freezing or lagging when paste a long string. */
  const commandFilter = useCallback(() => {
    if (commandProps?.filter) return commandProps.filter;
    if (creatable) {
      return (value: string, search: string) =>
        value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
    }
    // Using default filter in `cmdk`. We don&lsquo;t have to provide it.
    return undefined;
  }, [creatable, commandProps?.filter]);

  const CreatableItem = () => {
    if (!creatable) return undefined;
    if (
      isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
      selected.find((s) => s.value === inputValue)
    ) {
      return undefined;
    }

    const Item = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onSelect={(value: string) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length);
            return;
          }
          setInputValue("");
          const newOptions = [...selected, { value, label: value }];
          setSelected(newOptions);
          onChange?.(newOptions);
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    // For normal creatable
    if (!onSearch && inputValue.length > 0) return Item;

    // For async search creatable. avoid showing creatable item before loading at first.
    if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) return Item;
    return undefined;
  };

  const EmptyItem = useCallback(() => {
    if (!emptyIndicator) return undefined;

    // For async search that showing emptyIndicator
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return (
        <CommandItem value="-" disabled>
          {emptyIndicator}
        </CommandItem>
      );
    }

    return <CommandEmpty className="h-fit py-2">{emptyIndicator}</CommandEmpty>;
  }, [creatable, emptyIndicator, onSearch, options]);

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      onKeyDown={(e) => {
        handleKeyDown(e);
        commandProps?.onKeyDown?.(e);
      }}
      className={cn(
        "h-auto overflow-visible bg-transparent",
        commandProps?.className,
      )}
      shouldFilter={
        commandProps?.shouldFilter !== undefined
          ? commandProps.shouldFilter
          : !onSearch
      } // When onSearch is provided, we don&lsquo;t want to filter the options. You can still override it.
      filter={commandFilter()}
    >
      <div
        className={cn(
          "border-input dark:bg-input/30 focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive relative min-h-[38px] rounded-md border text-sm transition-[color,box-shadow] outline-none focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50",
          "flex flex-wrap gap-1",
          selected.length !== 0 && "p-1",
          disabled && selected.length !== 0 && "cursor-text",
          !hideClearAllButton && "pe-9",
          className,
        )}
        onClick={() => {
          if (!disabled) inputRef?.current?.focus();
        }}
      >
        {selected.map((item) => {
          const Icon = getItemMeta(item.value)?.icon;
          return (
            <Badge
              key={item.value}
              variant="default"
              data-fixed={item.fixed}
              data-disabled={disabled || undefined}
              style={
                {
                  "--badge-color": item.color ?? "var(--foreground)",
                } as React.CSSProperties
              }
              className={cn(
                "relative h-7 overflow-visible rounded-sm ps-2 pe-7 pl-2 data-fixed:pe-2",
                "bg-[var(--badge-color)]/10 text-[var(--badge-color)]",
                badgeClassName,
              )}
            >
              {Icon &&
                (typeof Icon === "string" ? (
                  Icon
                ) : (
                  <Icon className="size-3.5" />
                ))}

              {item.label ?? item.value}

              {!item.fixed && (
                <button
                  className="absolute -inset-y-px end-0 flex items-center justify-center rounded-e-md border border-transparent px-1 text-[var(--badge-color)]/40 outline-hidden transition-[color,box-shadow] outline-none hover:text-[var(--badge-color)] focus-visible:border-[var(--badge-color)]/40 focus-visible:ring-[3px] focus-visible:ring-[var(--badge-color)]/50"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                  aria-label="Remove"
                >
                  <XIcon aria-hidden="true" />
                </button>
              )}
            </Badge>
          );
        })}

        {/* Avoid having the "Search" Icon */}
        <CommandPrimitive.Input
          {...inputProps}
          ref={inputRef}
          value={inputValue}
          disabled={disabled}
          onValueChange={(value) => {
            setInputValue(value);
            inputProps?.onValueChange?.(value);
          }}
          onBlur={(event) => {
            if (!onScrollbar) setOpen(false);
            inputProps?.onBlur?.(event);
          }}
          onFocus={(event) => {
            setOpen(true);
            if (triggerSearchOnFocus) onSearch?.(debouncedSearchTerm);
            inputProps?.onFocus?.(event);
          }}
          placeholder={
            hidePlaceholderWhenSelected && selected.length !== 0
              ? ""
              : placeholder
          }
          className={cn(
            "placeholder:text-muted-foreground/70 flex-1 bg-transparent outline-hidden disabled:cursor-not-allowed",
            hidePlaceholderWhenSelected && "w-full",
            selected.length === 0 && "px-3 py-2",
            selected.length !== 0 && "mx-1",
            inputProps?.className,
          )}
        />

        <button
          type="button"
          onClick={() => {
            setSelected(selected.filter((s) => s.fixed));
            onChange?.(selected.filter((s) => s.fixed));
          }}
          className={cn(
            "text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute end-0 top-0 flex h-full w-9 items-center justify-center rounded-r-md border border-transparent transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
            (hideClearAllButton ||
              disabled ||
              selected.filter((s) => s.fixed).length === selected.length) &&
              "hidden",
          )}
          aria-label="Clear all"
        >
          <XIcon size={16} aria-hidden="true" />
        </button>
      </div>

      {open && !isAllSelected && (
        <div className="relative">
          <div
            className={cn(
              "border-input absolute top-2 z-10 w-full overflow-hidden rounded-md border",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              !open && "hidden",
            )}
            data-state={open ? "open" : "closed"}
          >
            <CommandList
              className="bg-popover text-popover-foreground shadow-lg outline-hidden"
              onMouseLeave={() => setOnScrollbar(false)}
              onMouseEnter={() => setOnScrollbar(true)}
              onMouseUp={() => inputRef?.current?.focus()}
            >
              {isLoading ? (
                loadingIndicator
              ) : (
                <>
                  <EmptyItem />

                  <CreatableItem />

                  {!selectFirstItem && (
                    <CommandItem value="-" className="hidden" />
                  )}

                  {/* {Object.entries(selectables).map(([key, dropdowns]) => ( */}
                  {Object.entries(options).map(([key, dropdowns]) => (
                    <CommandGroup
                      key={key}
                      heading={key}
                      className="h-full overflow-auto"
                    >
                      {dropdowns.map((item) => {
                        const Icon = getItemMeta(item.value)?.icon;
                        const isSelected = selected.some(
                          ({ value }) => value === item.value,
                        );

                        return (
                          <CommandItem
                            key={item.value}
                            value={item.value}
                            disabled={item.disabled}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              if (selected.length >= maxSelected) {
                                onMaxSelected?.(selected.length);
                                return;
                              }
                              setInputValue("");
                              if (isSelected) {
                                if (!item.fixed) handleUnselect(item);
                              } else {
                                const newOptions = [...selected, item];
                                setSelected(newOptions);
                                onChange?.(newOptions);
                              }
                            }}
                            style={
                              {
                                "--item-color": item.color ?? "transparent",
                              } as React.CSSProperties
                            }
                            className={cn(
                              "cursor-pointer",
                              (item.disabled || (isSelected && item.fixed)) &&
                                "pointer-events-none cursor-not-allowed opacity-50",
                            )}
                          >
                            <Check
                              className={cn(
                                isSelected
                                  ? "text-accent-foreground"
                                  : "text-transparent",
                              )}
                            />

                            {Icon &&
                              (typeof Icon === "string" ? Icon : <Icon />)}
                            {item.label ?? item.value}

                            <div className="ml-auto size-2 rounded-full bg-[var(--item-color)]" />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  ))}
                </>
              )}
            </CommandList>
          </div>
        </div>
      )}
    </Command>
  );
}
