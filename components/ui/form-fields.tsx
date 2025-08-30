import {
  CalendarFieldProps,
  CheckboxFieldProps,
  FieldProps,
  FieldWrapperProps,
  FileUploadFieldProps,
  InputFieldProps,
  MultiSelectFieldProps,
  NumericFieldProps,
  RadioFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
} from "@/lib/meta";
import { cn, formatNumber, formatPhone, sanitizeNumber } from "@/lib/utils";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Checkbox } from "./checkbox";
import { DatePicker } from "./date-picker";
import { FileUpload } from "./file-upload";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input, InputWrapper } from "./input";
import { MultiSelect } from "./multi-select";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Textarea } from "./textarea";

type Controller<T extends FieldValues> = { field: ControllerRenderProps<T> };

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
  icon: Icon,
  ...props
}: Controller<T> & InputFieldProps) {
  const iconOrText = Icon && (typeof Icon === "string" ? Icon : <Icon />);

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
  icon: Icon,
  ...props
}: Controller<T> & NumericFieldProps) {
  const iconOrText = Icon && (typeof Icon === "string" ? Icon : <Icon />);
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
}: Controller<T> & Omit<SelectFieldProps, "type">) {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map(({ value, label, icon: Icon, className, disabled }) => (
          <SelectItem
            key={value}
            value={value}
            className={className}
            disabled={disabled}
          >
            {Icon && (typeof Icon === "string" ? Icon : <Icon />)}
            {label ?? value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function MultiSelectField<T extends FieldValues>({
  field,
  placeholder,
  data,
}: Controller<T> & Omit<MultiSelectFieldProps, "type">) {
  const value = Array.from(field.value ?? [undefined])
    .map((v) => data.find(({ value }) => value === v))
    .filter(Boolean) as MultiSelectFieldProps["data"];
  return (
    <MultiSelect
      defaultValue={data}
      placeholder={placeholder}
      value={value}
      onChange={(item) => field.onChange(item.map(({ value }) => value))}
    />
  );
}

function RadioField<T extends FieldValues>({
  field,
  className,
  data,
}: Controller<T> & Omit<RadioFieldProps, "type">) {
  return (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      className={className}
    >
      {data.map(({ value, label, desc, icon: Icon, className, disabled }) => (
        <FormItem
          key={value}
          className={cn(
            "dark:bg-input/30 has-data-[state=checked]:border-primary border-input relative flex-row items-start rounded-md border p-4 shadow-xs",
            disabled && "opacity-50",
            className,
          )}
        >
          <FormControl>
            <RadioGroupItem
              value={value}
              className="order-1 after:absolute after:inset-0"
              disabled={disabled}
            />
          </FormControl>

          <div className="grid grow gap-2">
            <FormLabel className="flex items-center">
              {Icon && (typeof Icon === "string" ? Icon : <Icon />)}
              {label ?? value}
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
  mode = "single",
  required = false,
  ...props
}: Controller<T> & Omit<CalendarFieldProps, "type">) {
  return (
    <DatePicker
      mode={mode}
      required={required}
      selected={field.value}
      onSelect={field.onChange}
      withControl
      {...props}
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
}: Controller<T> & FieldWrapperProps & Omit<CheckboxFieldProps, "type">) {
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
}: Controller<T> & Omit<TextareaFieldProps, "type">) {
  return (
    <FormControl>
      <Textarea {...props} {...field} />
    </FormControl>
  );
}

function FileUploadField<T extends FieldValues>({
  field,
  ...props
}: Controller<T> & Omit<FileUploadFieldProps, "type">) {
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
      comp = <SelectField {...props} />;
      break;

    case "multi-select":
      comp = <MultiSelectField {...props} />;
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
