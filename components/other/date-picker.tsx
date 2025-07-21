import { datePickerText } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar, CalendarProps } from "../ui/calendar";
import { FormControl } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function DatePicker({
  placeholder = datePickerText.single.trigger,
  withControl = false,
  ...props
}: CalendarProps & { placeholder?: string; withControl?: boolean }) {
  let isSelected = false;

  if (props.mode) {
    const { mode, selected } = props;
    const { trigger, value } = datePickerText[mode];
    placeholder = trigger;
    if (selected) {
      isSelected = true;
      placeholder = value(selected as never);
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
