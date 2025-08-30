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
import { Button } from "../ui/button";
import { ResetButton } from "../ui/buttons";
import { Form, FormField } from "../ui/form";
import { Field } from "../ui/form-fields";
// import { uploadFiles } from "@/server/s3";

const card = ["spade", "heart", "diamond", "club"] as const;
const exampleFields = fieldsMeta.example;

export function ExampleForm() {
  const fileType: FileType = "image";
  const schema = z.object({
    text: zodSchemas.string("Text", { min: 1 }),
    numeric: zodSchemas.number("Numeric", { min: 1 }),
    phone: zodSchemas.number("Phone", { min: 1 }),
    calendar: zodSchemas.date,
    calendarMultiple: zodSchemas.dateMultiple.min(1),
    calendarRange: zodSchemas.dateRange,
    select: z.enum(card),
    multiSelect: z.array(z.enum(card)),
    radio: z.enum(card),
    textarea: zodSchemas.string("Text Area", { min: 1, max: 255 }),
    file: zodSchemas.file(fileType, {
      optional: true,
      // maxSize: toBytes(1),
      // min: 2,
      // max: 5,
    }),
    checkbox: z.boolean(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Hello World",
      numeric: 100000,
      phone: 81234567890,
      calendar: new Date(),
      calendarMultiple: [new Date()],
      calendarRange: { from: new Date(), to: addDays(new Date(), 6) },
      select: "spade",
      multiSelect: ["spade"],
      radio: "spade",
      textarea: "The Brown Fox Jumping Over The Lazy Dog",
      file: [],
      checkbox: false,
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    console.log(formData.file);
    // const res = await uploadFiles({ files: formData.file });
    toast(<p>{JSON.stringify(formData, null, 2)}</p>);
  };

  return (
    <Form form={form} onSubmit={formHandler}>
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

      {/* General */}
      <div className="grid gap-x-2 gap-y-4 md:grid-cols-5">
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

        <FormField
          control={form.control}
          name="multiSelect"
          render={({ field }) => (
            <Field field={field} {...exampleFields.multiSelect} />
          )}
        />
      </div>

      {/* Dates */}
      <div className="grid gap-x-2 gap-y-4 md:grid-cols-3">
        {/* Date Single */}
        <FormField
          control={form.control}
          name="calendar"
          render={({ field }) => (
            <Field field={field} {...exampleFields.calendar} />
          )}
        />

        {/* Date Multiple */}
        <FormField
          control={form.control}
          name="calendarMultiple"
          render={({ field }) => (
            <Field field={field} {...exampleFields.calendarMultiple} />
          )}
        />

        {/* Date Range */}
        <FormField
          control={form.control}
          name="calendarRange"
          render={({ field }) => (
            <Field field={field} {...exampleFields.calendarRange} />
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

      {/* Text Area */}
      <FormField
        control={form.control}
        name="textarea"
        render={({ field }) => (
          <Field field={field} {...fieldsMeta.example.textarea} />
        )}
      />

      {/* File Upload */}
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <Field field={field} {...fieldsMeta.example.file} />
        )}
      />

      {/* Checkbox */}
      <FormField
        control={form.control}
        name="checkbox"
        render={({ field }) => (
          <Field field={field} {...fieldsMeta.example.checkbox} />
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
