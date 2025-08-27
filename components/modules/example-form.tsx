"use client";

import { actions } from "@/lib/content";
import { fieldsMeta, FileType } from "@/lib/meta";
import { zodSchemas } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ResetButton } from "../other/buttons";
import { DatePicker } from "../other/date-picker";
import { FileUpload } from "../other/file-upload";
import { Field, FieldWrapper } from "../other/form-fields";
import { Button } from "../ui/button";
import { Form, FormField } from "../ui/form";
// import { uploadFiles } from "@/server/s3";

const card = ["Spade", "Heart", "Diamond", "Club"] as const;
const exampleFields = fieldsMeta.example;

export function ExampleForm() {
  const fileType: FileType = "image";
  const schema = z.object({
    text: zodSchemas.string("Text", { min: 1 }),
    numeric: zodSchemas.number("Numeric", { min: 1 }),
    phone: zodSchemas.number("Phone", { min: 1 }),
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
    <Form form={form} onSubmit={formHandler}>
      {/* General */}
      <div className="grid gap-x-2 gap-y-4 md:grid-cols-4">
        {/* Example to dynamically render the form fields */}
        {/* {(["text", "numeric", "phone", "select", "radio"] as const).map(
          (field) => (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field }) => (
                <Field field={field} {...fieldsMeta.example[field]} />
              )}
            />
          ),
        )} */}

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <Field field={field} {...exampleFields.text} />
          )}
        />

        <FormField
          control={form.control}
          name="numeric"
          render={({ field }) => (
            <Field field={field} {...exampleFields.numeric} />
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <Field field={field} {...exampleFields.phone} />
          )}
        />

        <FormField
          control={form.control}
          name="select"
          render={({ field }) => (
            <Field field={field} {...exampleFields.select} />
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
          <Field field={field} {...fieldsMeta.example.radio} />
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
    </Form>
  );
}
