import { cn, formatNumber, formatPhone, sanitizeNumber } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InputWrapper } from "./input-wrapper";

export type FieldProps = {
  type?: "text" | "email" | "password" | "number" | "tel";
  className?: string;
  required?: boolean;

  label: string;
  placeholder?: string;
  icon?: string | LucideIcon;

  classNames?: {
    formItem?: string;
    formMessage?: string;
    label?: string;
    inputWrapper?: string;
  };
};

type FieldWrapperProps = Pick<FieldProps, "required" | "label" | "classNames">;

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

export function InputField({
  field,
  type: inputType = "text",
  icon: Icon,
  placeholder,
  className,
  ...props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: FieldProps & { field: ControllerRenderProps<any> }) {
  const commonProps = { placeholder, className };
  let inputField = <Input type={inputType} {...commonProps} {...field} />;

  if (inputType === "number" || inputType === "tel") {
    const { value, onChange, ...rest } = field;
    inputField = (
      <Input
        type="text"
        inputMode="numeric"
        value={(inputType === "number" ? formatNumber : formatPhone)(value)}
        onChange={(e) => onChange(sanitizeNumber(e.target.value))}
        {...commonProps}
        {...rest}
      />
    );
  }

  return (
    <FieldWrapper {...props}>
      {Icon ? (
        <InputWrapper
          icon={typeof Icon === "string" ? Icon : <Icon />}
          className={props.classNames?.formMessage}
        >
          <FormControl>{inputField}</FormControl>
        </InputWrapper>
      ) : (
        <FormControl>{inputField}</FormControl>
      )}
    </FieldWrapper>
  );
}

export function SelectField({
  field,
  data,
  ...props
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any>;
  data: { value: string; icon?: LucideIcon }[];
} & FieldWrapperProps) {
  return (
    <FieldWrapper {...props}>
      <Select value={field.value} onValueChange={field.onChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </FormControl>

        <SelectContent>
          {data.map(({ value, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              {Icon && <Icon />} {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
