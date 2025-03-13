"use client";

import { label } from "@/lib/content";
import { cn, FormatNumeric, FormatPhone, SanitizeNumber } from "@/lib/utils";
import { zodFile } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Club,
  Diamond,
  Heart,
  LockKeyhole,
  RotateCcw,
  Save,
  Spade,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import {
  FormFloating,
  InputDate,
  InputFile,
  InputRadioGroup,
} from "../custom/custom-field";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function ReplicaFormItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-2 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ExampleForm() {
  const card = ["Spade", "Heart", "Diamond", "Club"] as const;
  const selectAndRadioData = [
    { value: "Spade", icon: <Spade /> },
    {
      value: "Heart",
      icon: <Heart />,
      checkedClassName: "text-pink-500 border-pink-500",
    },
    {
      value: "Diamond",
      icon: <Diamond />,
      checkedClassName: "text-sky-500 border-sky-500",
    },
    {
      value: "Club",
      icon: <Club />,
      checkedClassName: "text-green-500 border-green-500",
    },
  ];

  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    select: z.enum(card),
    radio: z.enum(card),
    date: z.date(),
    file: zodFile.image,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Some Text",
      numeric: 100000,
      phone: 81234567890,
      select: "Spade",
      radio: "Spade",
      date: new Date(),
    },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
    console.log(data.file);
    toast(<p>{JSON.stringify(data, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <div className="grid grid-cols-1 gap-x-2 gap-y-4 lg:grid-cols-3">
          {/* Text */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text</FormLabel>
                <FormControl>
                  <FormFloating icon={<LockKeyhole />}>
                    <Input type="text" {...field} />
                  </FormFloating>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Numeric */}
          <FormField
            control={form.control}
            name="numeric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numeric</FormLabel>
                <FormFloating icon={"Rp."}>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={FormatNumeric(field.value)}
                    onChange={(e) =>
                      field.onChange(SanitizeNumber(e.target.value))
                    }
                  />
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormFloating icon={"+62"}>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={FormatPhone(field.value)}
                    onChange={(e) => {
                      field.onChange(SanitizeNumber(e.target.value));
                    }}
                  />
                </FormFloating>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select */}
          <FormField
            control={form.control}
            name="select"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {selectAndRadioData.map((item, index) => (
                      <SelectItem key={index} value={item.value}>
                        {item.icon}
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Radio Group */}
          <FormField
            control={form.control}
            name="radio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Radio Group</FormLabel>

                <FormControl>
                  <InputRadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 md:flex md:grid-cols-4"
                    radioItems={selectAndRadioData}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <InputDate selected={field.value} onSelect={field.onChange} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* File */}
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, ...restField } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <InputFile
                onChange={(e) => onChange(e.target.files)}
                {...restField}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <CustomButton
            type="submit"
            icon={<Save />}
            text={label.button.save}
          />
          <Button type="reset" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {label.button.reset}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function TextAndNumericField() {
  const [numericValue, setNumericValue] = useState<number>(0);
  const [phoneValue, setPhoneValue] = useState<number>(0);
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <ReplicaFormItem>
        <Label>Text</Label>
        <Input type="text" placeholder="Enter your text" />
      </ReplicaFormItem>

      <ReplicaFormItem>
        <Label>Numeric</Label>
        <Input
          type="text"
          inputMode="numeric"
          value={FormatNumeric(numericValue)}
          onChange={(e) => setNumericValue(SanitizeNumber(e.target.value))}
        />
      </ReplicaFormItem>

      <ReplicaFormItem>
        <Label>With form floating</Label>
        <FormFloating icon={<LockKeyhole />}>
          <Input type="text" placeholder="Enter your text" />
        </FormFloating>
      </ReplicaFormItem>

      <ReplicaFormItem>
        <Label>Phone Input</Label>
        <FormFloating icon="+62">
          <Input
            type="text"
            inputMode="numeric"
            value={FormatPhone(phoneValue)}
            onChange={(e) => setPhoneValue(SanitizeNumber(e.target.value))}
          />
        </FormFloating>
      </ReplicaFormItem>
    </div>
  );
}
