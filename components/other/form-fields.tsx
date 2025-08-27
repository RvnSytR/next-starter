import {
  CalendarFieldProps,
  CheckboxFieldProps,
  FieldProps,
  FieldWrapperProps,
  FormFieldIcon,
  InputFieldProps,
  NumericFieldProps,
  RadioFieldProps,
  SelectFieldProps,
} from "@/lib/meta";
import { cn, formatNumber, formatPhone, sanitizeNumber } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DatePicker } from "./date-picker";
import { InputWrapper } from "./input-wrapper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Controller = { field: ControllerRenderProps<any> };

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
    <FormItem className={classNames?.item}>
      <FormLabel
        className={cn(required && "label-required", classNames?.label)}
      >
        {label}
      </FormLabel>

      {children}

      <FormMessage className={classNames?.message} />

      {description && (
        <FormDescription className={classNames?.description}>
          {description}
        </FormDescription>
      )}
    </FormItem>
  );
}

function TextField({
  field,
  type,
  icon,
  ...props
}: Controller & InputFieldProps) {
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

function NumberField({
  field: { value, onChange, ...restField },
  type,
  icon,
  ...props
}: Controller & NumericFieldProps) {
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

function SelectField({
  field,
  placeholder,
  data,
}: Controller & SelectFieldProps) {
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

function RadioField({ field, className, data }: Controller & RadioFieldProps) {
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

function CalendarField({
  field,
  mode,
  required,
  placeholder,
}: Controller & CalendarFieldProps) {
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

function CheckboxField({
  field,
  label,
  description,
  required,
  className,
  classNames,
}: Controller & FieldWrapperProps & CheckboxFieldProps) {
  return (
    <FormItem className={classNames?.item}>
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
            <FormDescription className={classNames?.description}>
              {description}
            </FormDescription>
          )}
        </div>
      </div>

      <FormMessage className={classNames?.message} />
    </FormItem>
  );
}

export function Field({ ...props }: Controller & FieldProps) {
  let comp: React.ReactNode;

  switch (props.type) {
    case "number":
    case "tel":
      comp = <NumberField {...props} />;
      break;

    case "select":
      comp = <SelectField {...props} />;
      break;

    case "radio":
      comp = <RadioField {...props} />;
      break;

    case "calendar":
      comp = <CalendarField {...props} />;
      break;

    case "checkbox":
      return <CheckboxField {...props} />;

    default:
      comp = <TextField {...props} />;
      break;
  }

  return <FieldWrapper {...props}>{comp}</FieldWrapper>;
}
