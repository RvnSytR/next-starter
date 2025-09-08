import { cn } from "@/lib/utils";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { getIconOrText, IconOrText } from "./icons";
import { Input, InputProps, InputWrapper } from "./input";

export function FormFieldWrapper({
  type = "default",
  label,
  desc,
  className,
  classNames,
  children,
}: {
  type?: "default" | "checkbox";
  label: string;
  desc?: string;
  className?: string;
  classNames?: {
    formLabel?: string;
    formMessage?: string;
    formDescription?: string;
  };
  children: React.ReactNode;
}) {
  const LabelComp = () => (
    <FormLabel
      data-slot="form-field-wrapper-label"
      className={classNames?.formLabel}
    >
      {label}
    </FormLabel>
  );

  return (
    <FormItem
      className={cn(
        "has-required:*:data-[slot=form-field-wrapper-label]:after:text-destructive has-required:*:data-[slot=form-field-wrapper-label]:after:content-['*']",
        className,
      )}
    >
      {type === "checkbox" ? (
        <div className="flex gap-x-3">
          {children}
          <div className={cn("grid gap-y-1 pt-0.25", className)}>
            <LabelComp />
            {desc && (
              <FormDescription className={classNames?.formDescription}>
                {desc}
              </FormDescription>
            )}
          </div>
        </div>
      ) : (
        <>
          <LabelComp /> {children}
        </>
      )}

      <FormMessage className={classNames?.formMessage} />

      {type !== "checkbox" && desc && (
        <FormDescription className={classNames?.formDescription}>
          {desc}
        </FormDescription>
      )}
    </FormItem>
  );
}

// ! Only for traditional text fields that are commonly used
export function TextFields<T extends FieldValues>({
  type,
  label,
  placeholder,
  icon: Icon,
  required = false,
  field,
  ...props
}: Omit<InputProps, keyof Omit<ControllerRenderProps<T>, "disabled">> & {
  field: ControllerRenderProps<T>;
  type: React.HTMLInputTypeAttribute;
  label: string;
  icon?: IconOrText;
}) {
  const comp = (
    <FormControl>
      <Input
        type={type}
        placeholder={placeholder}
        required={required}
        {...field}
        {...props}
      />
    </FormControl>
  );

  return (
    <FormFieldWrapper label={label}>
      {Icon ? (
        <InputWrapper icon={getIconOrText(Icon)}>{comp}</InputWrapper>
      ) : (
        comp
      )}
    </FormFieldWrapper>
  );
}
