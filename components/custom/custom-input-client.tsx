import { Dispatch, ReactNode, SetStateAction } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";

import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Filter } from "lucide-react";

export type CheckboxPopoverProps = {
  id: string;
  state: string[];
  setState: Dispatch<SetStateAction<string[]>>;
  arr: { value: string; length: number; icon?: ReactNode }[];
  icon?: ReactNode;
  disabled?: boolean;
};

export function CheckboxPopover({
  id,
  icon,
  state,
  setState,
  arr,
  disabled = false,
  className,
}: CheckboxPopoverProps & { className?: string }) {
  const isMobile = useIsMobile();
  const breakpoint = isMobile ? 1 : 2;
  const selectedState = new Set(state);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className={cn("w-full capitalize select-none lg:w-auto", className)}
          disabled={disabled}
        >
          {icon ?? <Filter />}
          {id}
          {selectedState.size > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />

              <div className="space-x-1">
                {selectedState.size > breakpoint ? (
                  <Badge variant="secondary" className="rounded-sm px-1">
                    {selectedState.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedState).map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded px-1"
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

      <PopoverContent className="flex w-fit flex-col gap-y-1 p-1">
        {arr.map((item, index) => {
          const { value, length: itemLength, icon } = item;
          const cbId = `cb${value}`;
          const isSelected = selectedState.has(value);

          return (
            <Label
              htmlFor={cbId}
              key={index}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "justify-start gap-x-4 capitalize",
              )}
            >
              <div className="flex gap-x-3">
                <Checkbox
                  id={cbId}
                  checked={isSelected}
                  onCheckedChange={() =>
                    setState(() => {
                      if (isSelected) selectedState.delete(value);
                      else selectedState.add(value);
                      return Array.from(selectedState);
                    })
                  }
                />
                {icon}
                <small className="font-medium">{value}</small>
              </div>

              <small className="ml-auto font-medium">{itemLength}</small>
            </Label>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
