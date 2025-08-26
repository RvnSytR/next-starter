import {
  FieldIcon,
  FieldProps,
  FieldWrapperProps,
  NumberFieldProps,
  RadioFieldProps,
  SelectFieldProps,
  TextFieldProps,
} from "@/lib/meta";
import { cn, formatNumber, formatPhone, sanitizeNumber } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InputWrapper } from "./input-wrapper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormField = { field: ControllerRenderProps<any> };

export function FieldWrapper({
  label,
  required = false,
  classNames,
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
    </FormItem>
  );
}

function getIconOrText(Icon: FieldIcon) {
  return Icon && (typeof Icon === "string" ? Icon : <Icon />);
}

function TextField({
  field,
  type,
  icon,
  ...props
}: FormField & TextFieldProps) {
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
}: FormField & NumberFieldProps) {
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
}: FormField & SelectFieldProps) {
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {data.map(({ value, icon }) => (
          <SelectItem key={value} value={value}>
            {icon && getIconOrText(icon)} {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RadioField({ field, className, data }: FormField & RadioFieldProps) {
  return (
    <RadioGroup
      value={field.value}
      onValueChange={field.onChange}
      className={className}
    >
      {data.map(({ value, desc, icon }) => (
        <FormItem
          key={value}
          className="dark:bg-input/30 has-data-[state=checked]:border-primary border-input relative flex-row items-start rounded-md border p-4 shadow-xs"
        >
          <FormControl>
            <RadioGroupItem
              value={value}
              className="order-1 after:absolute after:inset-0"
            />
          </FormControl>
          <div className="grid grow gap-2">
            <FormLabel className="flex items-center">
              {icon && getIconOrText(icon)} {value}
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

export function Field({ ...props }: FormField & FieldProps) {
  const { label, required, classNames, ...restProps } = props;

  let comp: React.ReactNode;
  const fieldWrapperProps = { label, required, classNames };

  switch (restProps.type) {
    case "number":
    case "tel":
      return (
        <FieldWrapper {...fieldWrapperProps}>
          <NumberField {...restProps} />
        </FieldWrapper>
      );

    case "select":
      return (
        <FieldWrapper {...fieldWrapperProps}>
          <SelectField {...restProps} />
        </FieldWrapper>
      );

    case "radio": {
      comp = <RadioField {...restProps} />;
      break;
    }

    default: {
      comp = <TextField {...restProps} />;
      break;
    }
  }

  return <FieldWrapper {...fieldWrapperProps}>{comp}</FieldWrapper>;
}
