"use client";

import { buttonText } from "@/lib/content";
import {
  formatNumber,
  formatPhone,
  getCurrencySymbol,
  sanitizeNumber,
} from "@/lib/utils";
import { zodDateRange, zodFile } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import {
  Club,
  Diamond,
  Heart,
  LockKeyhole,
  RotateCcw,
  Save,
  Spade,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "../other/date-picker";
import { FileDropzone, InputRadioGroup, InputWrapper } from "../other/inputs";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
// import { uploadFiles } from "@/server/s3";

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

  const fileType = "image";
  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    date: z.date(),
    dateMultiple: z.array(z.date()),
    dateRange: zodDateRange,
    select: z.enum(card),
    radio: z.enum(card),
    file: zodFile(fileType, {
      // optional: true,
      // multiple: true,
      // min: 2,
      // max: 5,
    }),
    // optionalFile: zodFile(fileType, { optional: true }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Some Text",
      numeric: 100000,
      phone: 81234567890,
      date: new Date(),
      dateMultiple: [new Date()],
      dateRange: { from: new Date(), to: addDays(new Date(), 6) },
      select: "Spade",
      radio: "Spade",
      file: [],
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    console.log(formData.file);
    // const res = await uploadFiles({ files: formData.file });
    toast(<p>{JSON.stringify(formData, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        {/* General */}
        <div className="grid gap-x-2 gap-y-4 md:grid-cols-4">
          {/* Text */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">Text</FormLabel>
                <InputWrapper icon={<LockKeyhole />}>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </InputWrapper>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Numeric */}
          <FormField
            control={form.control}
            name="numeric"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel className="label-required">Numeric</FormLabel>
                <InputWrapper icon={getCurrencySymbol("id")}>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatNumber(value)}
                      onChange={(e) => onChange(sanitizeNumber(e.target.value))}
                      {...rest}
                    />
                  </FormControl>
                </InputWrapper>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel className="label-required">Phone</FormLabel>
                <InputWrapper icon="+62">
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatPhone(value)}
                      onChange={(e) => onChange(sanitizeNumber(e.target.value))}
                      className="pl-11"
                      {...rest}
                    />
                  </FormControl>
                </InputWrapper>
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
                <FormLabel className="label-required">Select</FormLabel>
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
        </div>

        {/* Dates */}
        <div className="grid gap-x-2 gap-y-4 md:grid-cols-3">
          {/* Date Single */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">Date Single</FormLabel>
                <DatePicker
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  withControl
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Multiple */}
          <FormField
            control={form.control}
            name="dateMultiple"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">Date Multiple</FormLabel>
                <DatePicker
                  mode="multiple"
                  selected={field.value}
                  onSelect={field.onChange}
                  withControl
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">Date Range</FormLabel>
                <DatePicker
                  mode="range"
                  selected={field.value}
                  onSelect={field.onChange}
                  withControl
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Custom Radio Group */}
        <FormField
          control={form.control}
          name="radio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">
                Custom Radio Group
              </FormLabel>
              <InputRadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 md:flex md:grid-cols-4"
                radioItems={selectAndRadioData}
              />
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
              <FormLabel className="label-required">Radio Group</FormLabel>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                {selectAndRadioData.map((item, index) => (
                  <FormItem key={index} className="flex-row items-center">
                    <FormControl>
                      <RadioGroupItem value={item.value} />
                    </FormControl>
                    <FormLabel>{item.value}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Files */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">File</FormLabel>
              <FileDropzone accept={fileType} multiple {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">
            <Save />
            {/* <Loader loading={isLoading} icon={{ base: <Save /> }} /> */}
            {buttonText.save}
          </Button>

          <Button type="reset" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {buttonText.reset}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ExampleInputFile() {
  return;
}
