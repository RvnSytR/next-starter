"use client";

import { actions } from "@/lib/content";
import { fieldsMeta, FileType } from "@/lib/meta";
import { zodSchemas } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { Club, Diamond, Heart, Save, Spade } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ResetButton } from "../other/buttons";
import { DatePicker } from "../other/date-picker";
import { FileUpload } from "../other/file-upload";
import { FieldWrapper, InputField, SelectField } from "../other/form-fields";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { uploadFiles } from "@/server/s3";

const card = ["Spade", "Heart", "Diamond", "Club"] as const;
const selectAndRadioData = [
  { value: "Spade", icon: Spade },
  { value: "Heart", icon: Heart },
  { value: "Diamond", icon: Diamond },
  { value: "Club", icon: Club },
];

export function ExampleForm() {
  const fileType: FileType = "image";
  const schema = z.object({
    text: zodSchemas.string("Text field"),
    numeric: z.number(),
    phone: z.number(),
    date: zodSchemas.date,
    dateMultiple: zodSchemas.dateMultiple.min(1),
    dateRange: zodSchemas.dateRange,
    select: z.enum(card),
    radio: z.enum(card),
    file: zodSchemas.file(fileType, {
      optional: true,
      // maxSize: toBytes(1),
      // min: 2,
      // max: 5,
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Hello World",
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
              <InputField field={field} {...fieldsMeta.example.text} />
            )}
          />

          {/* Numeric */}
          <FormField
            control={form.control}
            name="numeric"
            render={({ field }) => (
              <InputField field={field} {...fieldsMeta.example.numeric} />
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <InputField field={field} {...fieldsMeta.example.phone} />
            )}
          />

          {/* Select */}
          <FormField
            control={form.control}
            name="select"
            render={({ field }) => (
              <SelectField
                field={field}
                data={selectAndRadioData}
                {...fieldsMeta.example.select}
              />
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
              <FieldWrapper label="Date" required>
                <DatePicker
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  withControl
                />
              </FieldWrapper>
            )}
          />

          {/* Date Multiple */}
          <FormField
            control={form.control}
            name="dateMultiple"
            render={({ field }) => (
              <FieldWrapper label="Date Multiple" required>
                <DatePicker
                  mode="multiple"
                  selected={field.value}
                  onSelect={field.onChange}
                  withControl
                />
              </FieldWrapper>
            )}
          />

          {/* Date Range */}
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FieldWrapper label="Date Range" required>
                <DatePicker
                  mode="range"
                  selected={field.value}
                  onSelect={field.onChange}
                  withControl
                />
              </FieldWrapper>
            )}
          />
        </div>

        {/* Radio Group */}
        <FormField
          control={form.control}
          name="radio"
          render={({ field }) => (
            <FieldWrapper label="Radio Group" required>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                {selectAndRadioData.map(({ value, icon: Icon }) => (
                  <FormItem
                    key={value}
                    className="dark:bg-input/30 has-data-[state=checked]:border-primary border-input relative flex-row rounded-md border p-4 shadow-xs"
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
            </FieldWrapper>
          )}
        />

        {/* Files */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FieldWrapper label="File Upload">
              <FileUpload
                accept={fileType}
                multiple
                // maxSize={toBytes(1)}
                {...field}
              />
            </FieldWrapper>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">
            {/* <Loader loading={isLoading} icon={{ base: <Save /> }} /> */}
            <Save /> {actions.save}
          </Button>

          <ResetButton fn={form.reset} />
        </div>
      </form>
    </Form>
  );
}
