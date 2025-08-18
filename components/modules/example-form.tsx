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
import { FileUpload } from "../other/file-upload";
import { InputWrapper } from "../other/input-wrapper";
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
    { value: "Spade", icon: Spade },
    {
      value: "Heart",
      icon: Heart,
      cn: "text-pink-500 border-pink-500",
    },
    {
      value: "Diamond",
      icon: Diamond,
      cn: "text-sky-500 border-sky-500",
    },
    {
      value: "Club",
      icon: Club,
      cn: "text-green-500 border-green-500",
    },
  ];

  const fileType = "image";
  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    date: z.date(),
    dateMultiple: z.array(z.date()).min(1),
    dateRange: zodDateRange,
    select: z.enum(card),
    radio: z.enum(card),
    file: zodFile(fileType, {
      optional: true,
      // maxSize: toBytes(1),
      // min: 2,
      // max: 5,
    }),
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
                      inputMode="tel"
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
                    {selectAndRadioData.map(({ value, icon: Icon }) => (
                      <SelectItem key={value} value={value}>
                        <Icon />
                        {value}
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

        {/* Radio Group */}
        <FormField
          control={form.control}
          name="radio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">Radio Group</FormLabel>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                {selectAndRadioData.map(({ value, icon: Icon }) => (
                  <FormItem
                    key={value}
                    className="has-data-[state=checked]:border-primary border-input relative flex-row rounded-md border p-4 shadow-xs"
                  >
                    <FormControl>
                      <RadioGroupItem
                        value={value}
                        className="order-1 after:absolute after:inset-0"
                      />
                    </FormControl>

                    <div className="grid grow gap-2">
                      <FormLabel className="flex items-center">
                        <Icon /> {value}
                      </FormLabel>
                      <small className="text-muted-foreground text-xs">
                        You can use this card with a label and a description.
                      </small>
                    </div>
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
              <FileUpload
                accept={fileType}
                multiple
                // maxSize={toBytes(1)}
                {...field}
              />
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
