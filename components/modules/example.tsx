"use client";

import { actions } from "@/lib/content";
import { FileType, languageMeta } from "@/lib/meta";
import { formatNumber, formatPhone, sanitizeNumber } from "@/lib/utils";
import { zodSchemas } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { Club, Diamond, Heart, Save, Spade, TextIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ResetButton } from "../ui/buttons";
import { Checkbox } from "../ui/checkbox";
import { DatePicker } from "../ui/date-picker";
import { FileUpload } from "../ui/file-upload";
import { Form, FormControl, FormField } from "../ui/form";
import { FormFieldWrapper } from "../ui/form-fields";
import { Input, InputWrapper } from "../ui/input";
import { MultiSelect } from "../ui/multi-select";
import { RadioGroupField } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
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
    multiSelect: z.array(z.enum(card)).min(1),
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
      checkbox: false,
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
      <div className="grid gap-x-2 gap-y-4 md:grid-cols-5">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormFieldWrapper label="Text" desc="Deskripsi text field">
              <InputWrapper icon={<TextIcon />}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Masukkan Text"
                    required
                    {...field}
                  />
                </FormControl>
              </InputWrapper>
            </FormFieldWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="numeric"
          render={({ field: { value, onChange, ...field } }) => (
            <FormFieldWrapper label="Numeric">
              <InputWrapper icon={languageMeta.id.symbol}>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Masukkan Text"
                    inputMode="numeric"
                    value={formatNumber(value)}
                    onChange={(e) => onChange(sanitizeNumber(e.target.value))}
                    required
                    {...field}
                  />
                </FormControl>
              </InputWrapper>
            </FormFieldWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field: { value, onChange, ...field } }) => (
            <FormFieldWrapper label="Phone">
              <InputWrapper icon="+62">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Masukkan No HP"
                    inputMode="tel"
                    value={formatPhone(value)}
                    onChange={(e) => onChange(sanitizeNumber(e.target.value))}
                    className="pl-11"
                    required
                    {...field}
                  />
                </FormControl>
              </InputWrapper>
            </FormFieldWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="select"
          render={({ field: { value, onChange } }) => (
            <FormFieldWrapper label="Select">
              <Select defaultValue={value} onValueChange={onChange} required>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kartu" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {selectAndRadioData.map(
                    ({ value, label, icon: Icon, disabled }) => (
                      <SelectItem key={value} value={value} disabled={disabled}>
                        {Icon && <Icon />} {label ?? value}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="multiSelect"
          render={({ field: { value, onChange } }) => (
            <FormFieldWrapper label="Multi Select">
              <MultiSelect
                defaultValue={selectAndRadioData}
                placeholder="Pilih kartu"
                value={value}
                onChange={(item) => onChange(item.map(({ value }) => value))}
                inputProps={{ required: true }}
              />
            </FormFieldWrapper>
          )}
        />
      </div>

      <div className="grid gap-x-2 gap-y-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="date"
          render={({ field: { value, onChange } }) => (
            <FormFieldWrapper
              label="Date Picker with Calendar"
              classNames={{ formLabel: "label-required" }}
            >
              <DatePicker
                mode="single"
                selected={value}
                onSelect={onChange}
                withFormControl
                required
              />
            </FormFieldWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="dateMultiple"
          render={({ field: { value, onChange } }) => (
            <FormFieldWrapper
              label="Multiple Date"
              classNames={{ formLabel: "label-required" }}
            >
              <DatePicker
                mode="multiple"
                selected={value}
                onSelect={onChange}
                withFormControl
                required
              />
            </FormFieldWrapper>
          )}
        />

        <FormField
          control={form.control}
          name="dateRange"
          render={({ field: { value, onChange } }) => (
            <FormFieldWrapper
              label="Date Range"
              classNames={{ formLabel: "label-required" }}
            >
              <DatePicker
                mode="range"
                selected={value}
                onSelect={onChange}
                withFormControl
                required
              />
            </FormFieldWrapper>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="radio"
        render={({ field: { value, onChange } }) => (
          <FormFieldWrapper label="Radio Group">
            <RadioGroupField
              defaultValue={value}
              onValueChange={onChange}
              data={selectAndRadioData}
              required
            />
          </FormFieldWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="textarea"
        render={({ field }) => (
          <FormFieldWrapper label="Text Area">
            <FormControl>
              <Textarea placeholder="Masukkan text area" required {...field} />
            </FormControl>
          </FormFieldWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="checkbox"
        render={({ field: { value, onChange } }) => (
          <FormFieldWrapper
            type="checkbox"
            label="Checkbox"
            desc="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          >
            <FormControl>
              <Checkbox checked={value} onCheckedChange={onChange} />
            </FormControl>
          </FormFieldWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="multiCheckbox"
        render={() => (
          <FormFieldWrapper label="Multi Checkbox">
            {checkboxData.map((item) => (
              <FormField
                key={item}
                control={form.control}
                name="multiCheckbox"
                render={({ field: { value, onChange } }) => (
                  <FormFieldWrapper
                    type="checkbox"
                    label={item}
                    classNames={{
                      formLabel: "capitalize",
                      formMessage: "hidden",
                    }}
                  >
                    <FormControl>
                      <Checkbox
                        checked={value.includes(item)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? onChange([...value, item])
                            : onChange(value.filter((v) => v !== item));
                        }}
                        required
                      />
                    </FormControl>
                  </FormFieldWrapper>
                )}
              />
            ))}
          </FormFieldWrapper>
        )}
      />

      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormFieldWrapper label="File Upload">
            <FileUpload accept="image" multiple required {...field} />
          </FormFieldWrapper>
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

export function ExampleTypography() {
  return (
    <div className="[&>p]:text-foreground/90 mx-auto max-w-4xl space-y-6 py-8 [&>p]:leading-7">
      <h1>The Subtle Shift: How LLMs Are Reshaping Web Development</h1>

      <p>
        Large Language Models (LLMs) are no longer just a research curiosity.
        They&apos;ve quietly slipped into the daily workflow of many developers,
        especially in the realm of <code>frontend</code> and <code>web</code>{" "}
        development. While some fear they might replace engineers, the reality
        is more nuanced: LLMs often function as accelerators, not replacements.
      </p>

      <h2>From Boilerplate to Brainstorming</h2>
      <p>
        Ask any web developer, and they&apos;ll tell you: boilerplate code is
        both a blessing and a burden. With LLMs, setting up a new project
        scaffold or generating a reusable <code>React</code> component can take
        seconds instead of hours.
      </p>

      <blockquote>
        “I don&apos;t use AI to finish my code. I use it to start faster,”{" "}
        <small> — A Frontend Engineer on X</small>
      </blockquote>

      <p>
        This shift means developers can spend more energy on solving real
        product problems rather than wiring up endless configuration files.
      </p>

      <h2>Documentation as Dialogue</h2>
      <p>
        Another overlooked area is documentation. LLMs turn static docs into
        interactive guides. Instead of digging through a 200-page manual,
        developers can ask natural-language questions like{" "}
        <code>“How do I debounce an input in React?”</code> and receive concise,
        context-aware answers.
      </p>

      <h2>Not a Replacement, but a Partner</h2>
      <p>
        Critics often warn that AI tools will deskill developers. In practice,
        many report the opposite. By handling routine code generation, LLMs free
        humans to focus on design patterns, accessibility, and user experience—
        areas where human empathy and creativity remain irreplaceable.
      </p>

      <blockquote>
        “Think of LLMs less as interns who write code and more as senior
        colleagues who never get tired of pair programming.”
        <small> — Tech Blogger, 2024</small>
      </blockquote>

      <h2>Conclusion</h2>
      <p>
        LLMs aren&apos;t rewriting the role of web developers—they&apos;re
        reframing it. The job shifts from writing every line by hand to guiding,
        editing, and curating. In that sense, the craft of development remains
        as human as ever—just faster, more collaborative, and a little more fun.
      </p>
    </div>
  );
}
