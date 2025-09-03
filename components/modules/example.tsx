"use client";

import { actions } from "@/lib/content";
import { FileType, languageMeta } from "@/lib/meta";
import { zodSchemas } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { Club, Diamond, Heart, Save, Spade, Text } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ResetButton } from "../ui/buttons";
import { Form, FormField } from "../ui/form";
import { Field, FieldWrapper } from "../ui/form-fields";
// import { uploadFiles } from "@/server/s3";

const card = ["spade", "heart", "diamond", "club"] as const;
const selectAndRadioData = [
  {
    value: "spade",
    label: "Spade",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Spade,
    color: "var(--primary)",
    fixed: true,
    group: "Card 1",
  },
  {
    value: "heart",
    label: "Heart",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Heart,
    color: "var(--color-red-500)",
    group: "Card 1",
    disabled: true,
  },
  {
    value: "diamond",
    label: "Diamond",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Diamond,
    color: "var(--color-cyan-500)",
    group: "Card 1",
  },
  {
    value: "club",
    label: "Club",
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    icon: Club,
    color: "var(--color-green-500)",
    group: "Card 1",
  },
];
const checkboxData = ["firefox", "chrome", "safari", "edge"] as const;

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
    multiCheckbox: z
      .array(z.enum(checkboxData))
      .refine((v) => v.some((i) => i), {
        error: "At least one checkbox must be selected",
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
      select: "spade",
      multiSelect: ["spade"],
      radio: "spade",
      textarea: "The Brown Fox Jumping Over The Lazy Dog",
      file: [],
      multiCheckbox: ["firefox"],
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

      <div className="grid gap-x-2 gap-y-4 md:grid-cols-5">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <Field
              field={field}
              type="text"
              label="Text"
              placeholder="Masukkan text"
              description="Deskripsi text field"
              icon={Text}
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="numeric"
          render={({ field }) => (
            <Field
              field={field}
              type="number"
              label="Numeric"
              placeholder="Masukkan nomor"
              icon={languageMeta.id.symbol}
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <Field
              field={field}
              type="tel"
              label="Phone"
              placeholder="Masukkan no telp"
              icon="+62"
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="select"
          render={({ field }) => (
            <Field
              field={field}
              type="select"
              label="Select"
              placeholder="Pilih kartu"
              data={selectAndRadioData}
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="multiSelect"
          render={({ field }) => (
            <Field
              field={field}
              type="multi-select"
              label="Multi Select"
              placeholder="Pilih beberapa kartu"
              data={selectAndRadioData}
              required
            />
          )}
        />
      </div>

      <div className="grid gap-x-2 gap-y-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <Field
              field={field}
              type="calendar"
              mode="single"
              label="Date Picker with Calendar"
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="dateMultiple"
          render={({ field }) => (
            <Field
              field={field}
              type="calendar"
              mode="multiple"
              label="Multiple Date Picker"
              required
            />
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <Field
              field={field}
              type="calendar"
              mode="range"
              label="Date Range"
              required
            />
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="radio"
        render={({ field }) => (
          <Field
            field={field}
            type="radio"
            label="Radio"
            data={selectAndRadioData}
            required
          />
        )}
      />

      <FormField
        control={form.control}
        name="textarea"
        render={({ field }) => (
          <Field
            field={field}
            type="textarea"
            label="Text Area"
            placeholder="Masukkan text area"
            required
          />
        )}
      />

      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <Field
            field={field}
            type="file"
            label="File Upload"
            accept="image"
            required
          />
        )}
      />

      <FormField
        control={form.control}
        name="checkbox"
        render={({ field }) => (
          <Field
            field={field}
            type="checkbox"
            label="Checkbox"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          />
        )}
      />

      <FormField
        control={form.control}
        name="multiCheckbox"
        render={() => (
          <FieldWrapper label="Multi Checkbox">
            {checkboxData.map((item) => (
              <FormField
                key={item}
                control={form.control}
                name="multiCheckbox"
                render={({ field }) => (
                  <Field
                    field={field}
                    type="multi-checkbox"
                    label={item}
                    id={item}
                    classNames={{ label: "capitalize" }}
                  />
                )}
              />
            ))}
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
