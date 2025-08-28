import { messages } from "@/lib/content";
import {
  CalendarFieldProps,
  CheckboxFieldProps,
  FieldProps,
  FieldWrapperProps,
  FileUploadFieldProps,
  FormFieldIcon,
  InputFieldProps,
  NumericFieldProps,
  RadioFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
} from "@/lib/meta";
import { cn, formatNumber, formatPhone, sanitizeNumber } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "./date-picker";
import { FileUpload } from "./file-upload";
import { InputWrapper } from "./input-wrapper";

type Controller<T extends FieldValues> = { field: ControllerRenderProps<T> };

function getIconOrText(Icon: FormFieldIcon) {
  return Icon && (typeof Icon === "string" ? Icon : <Icon />);
}

export function FieldWrapper({
  label,
  description,
  classNames,
  required = false,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <FormItem className={classNames?.formItem}>
      <FormLabel
        className={cn(required && "label-required", classNames?.label)}
      >
        {label}
      </FormLabel>

      {children}

      <FormMessage className={classNames?.formMessage} />

      {description && (
        <FormDescription className={classNames?.formDescription}>
          {description}
        </FormDescription>
      )}
    </FormItem>
  );
}

function TextField<T extends FieldValues>({
  field,
  type,
  icon,
  ...props
}: Controller<T> & InputFieldProps) {
  const iconOrText = icon && getIconOrText(icon);

  const inputField = (
    <FormControl>
      <Input type={type} {...props} {...field} />
    </FormControl>
  );

  return iconOrText ? (
    <InputWrapper icon={iconOrText}>{inputField}</InputWrapper>
  ) : (
    inputField
  );
}

function NumberField<T extends FieldValues>({
  field: { value, onChange, ...restField },
  type,
  icon,
  ...props
}: Controller<T> & NumericFieldProps) {
  const iconOrText = icon && getIconOrText(icon);
  const inputField = (
    <FormControl>
      <Input
        type="text"
        inputMode={type === "number" ? "numeric" : "tel"}
        value={(type === "number" ? formatNumber : formatPhone)(value)}
        onChange={(e) => onChange(sanitizeNumber(e.target.value))}
        {...props}
        {...restField}
      />
    </FormControl>
  );

  return iconOrText ? (
    <InputWrapper icon={iconOrText}>{inputField}</InputWrapper>
  ) : (
    inputField
  );
}

function SelectField<T extends FieldValues>({
  field,
  placeholder,
  data,
}: Controller<T> & SelectFieldProps) {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map(({ value, label, icon, className }) => (
          <SelectItem key={value} value={value} className={className}>
            {icon && getIconOrText(icon)} {label ?? value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectWithSearchField<T extends FieldValues>({
  field,
  placeholder,
  data,
}: Controller<T> & SelectFieldProps) {
  const meta = data.find((i) => i.value === field.value);
  return (
    <Popover>
      <FormControl>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className={cn(!meta && "text-muted-foreground")}
          >
            {meta ? (
              <div className="flex items-center gap-x-2">
                {meta.icon && getIconOrText(meta.icon)}
                {meta.label ?? meta.value}
              </div>
            ) : (
              placeholder
            )}

            <ChevronDown aria-hidden="true" className="ml-auto opacity-50" />
          </Button>
        </PopoverTrigger>
      </FormControl>

      <PopoverContent className="border-input min-w-[var(--radix-popper-anchor-width)] p-0">
        <Command>
          <CommandInput placeholder={`${placeholder}...`} />
          <CommandList>
            <CommandEmpty>{messages.empty}</CommandEmpty>
            <CommandGroup>
              {data.map(({ value, label, icon, className }) => (
                <CommandItem
                  key={value}
                  value={value}
                  onSelect={(currentValue) => field.onChange(currentValue)}
                  className={cn("flex items-center gap-x-2", className)}
                >
                  {icon && getIconOrText(icon)} {label ?? value}
                  {field.value === value && (
                    <Check aria-hidden="true" className="ml-auto" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function RadioField<T extends FieldValues>({
  field,
  className,
  data,
}: Controller<T> & RadioFieldProps) {
  return (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      className={className}
    >
      {data.map(({ value, label, desc, icon, className }) => (
        <FormItem
          key={value}
          className={cn(
            "dark:bg-input/30 has-data-[state=checked]:border-primary border-input relative flex-row items-start rounded-md border p-4 shadow-xs",
            className,
          )}
        >
          <FormControl>
            <RadioGroupItem
              value={value}
              className="order-1 after:absolute after:inset-0"
            />
          </FormControl>

          <div className="grid grow gap-2">
            <FormLabel className="flex items-center">
              {icon && getIconOrText(icon)} {label ?? value}
            </FormLabel>

            {desc && (
              <small className="text-muted-foreground text-xs text-balance">
                {desc}
              </small>
            )}
          </div>
        </FormItem>
      ))}
    </RadioGroup>
  );
}

function CalendarField<T extends FieldValues>({
  field,
  mode,
  required,
  placeholder,
}: Controller<T> & CalendarFieldProps) {
  return (
    <DatePicker
      mode={mode}
      selected={field.value}
      onSelect={field.onChange}
      placeholder={placeholder}
      required={required}
      withControl
    />
  );
}

function CheckboxField<T extends FieldValues>({
  field,
  label,
  description,
  required,
  className,
  classNames,
}: Controller<T> & FieldWrapperProps & CheckboxFieldProps) {
  return (
    <FormItem className={classNames?.formItem}>
      <div className="flex gap-x-3">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>

        <div className={cn("grid gap-y-1 pt-0.25", className)}>
          <FormLabel
            className={cn(required && "label-required", classNames?.label)}
          >
            {label}
          </FormLabel>

          {description && (
            <FormDescription className={classNames?.formDescription}>
              {description}
            </FormDescription>
          )}
        </div>
      </div>

      <FormMessage className={classNames?.formMessage} />
    </FormItem>
  );
}

function TextAreaField<T extends FieldValues>({
  field,
  ...props
}: Controller<T> & TextareaFieldProps) {
  return (
    <FormControl>
      <Textarea {...props} {...field} />
    </FormControl>
  );
}

function FileUploadField<T extends FieldValues>({
  field,
  ...props
}: Controller<T> & FileUploadFieldProps) {
  return <FileUpload {...props} {...field} />;
}

export function Field<T extends FieldValues>({
  ...props
}: Controller<T> & FieldProps) {
  let comp: React.ReactNode;

  switch (props.type) {
    case "number":
    case "tel":
      comp = <NumberField {...props} />;
      break;

    case "select":
      const Comp = props.withSearch ? SelectWithSearchField : SelectField;
      comp = <Comp {...props} />;
      break;

    case "radio":
      comp = <RadioField {...props} />;
      break;

    case "calendar":
      comp = <CalendarField {...props} />;
      break;

    case "checkbox":
      return <CheckboxField {...props} />;

    case "textarea":
      comp = <TextAreaField {...props} />;
      break;

    case "file":
      comp = <FileUploadField {...props} />;
      break;

    default:
      comp = <TextField {...props} />;
      break;
  }

  return <FieldWrapper {...props}>{comp}</FieldWrapper>;
}
