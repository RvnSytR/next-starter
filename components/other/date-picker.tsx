import { cn, formatDate } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar, CalendarProps } from "../ui/calendar";
import { FormControl } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const defaultPlaceholder = "Pilih Tanggal";

export function DatePicker({
  placeholder = defaultPlaceholder,
  withControl = false,
  ...props
}: CalendarProps & { placeholder?: string; withControl?: boolean }) {
  let isSelected = false;

  if (props.mode) {
    const { mode, selected } = props;

    if (mode === "single") {
      isSelected = !!selected;
      placeholder = selected
        ? formatDate(selected, "PPPP")
        : defaultPlaceholder;
    }

    if (mode === "multiple") {
      placeholder = defaultPlaceholder;

      if (selected && selected.length > 0) {
        isSelected = true;
        const max = 1;
        const { length } = selected;
        const dates = selected.map((date) => formatDate(date, "PPP"));

        placeholder = dates.slice(0, max).join(", ");
        if (length > max) placeholder += `, dan ${length - max} lainnya`;
      }
    }

    if (mode === "range") {
      placeholder = "Pilih Rentang Tanggal";

      if (selected?.from) {
        isSelected = true;
        const { from, to } = selected;

        placeholder =
          to && !isSameDay(from, to)
            ? `${formatDate(from, "PPP")} - ${formatDate(to, "PPP")}`
            : formatDate(from, "PPP");
      }
    }
  }

  const trigger = (
    <Button
      variant="outline"
      className={cn(!isSelected && "text-muted-foreground")}
    >
      <CalendarIcon /> {placeholder}
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        {withControl ? <FormControl>{trigger}</FormControl> : trigger}
      </PopoverTrigger>

      <PopoverContent className="size-fit p-0">
        <Calendar {...props} />
      </PopoverContent>
    </Popover>
  );
}
