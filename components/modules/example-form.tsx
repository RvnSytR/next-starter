"use client";

import { buttonText } from "@/lib/content";
import { formatNumeric, formatPhone, sanitizeNumber } from "@/lib/utils";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    date: z.date(),
    select: z.enum(card),
    radio: z.enum(card),
    file: zodFile("image"),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Some Text",
      numeric: 100000,
      phone: 81234567890,
      date: new Date(),
      select: "Spade",
      radio: "Spade",
      file: [],
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    console.log(formData.file);
    toast(<p>{JSON.stringify(formData, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)} className="w-full">
        <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
          {/* Text */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="label-required">Text</FormLabel>
                <FormFloating icon={<LockKeyhole />}>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                </FormFloating>
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
                <FormLabel className="label-required">Numeric</FormLabel>
                <FormFloating icon="Rp.">
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatNumeric(field.value)}
                      onChange={(e) =>
                        field.onChange(sanitizeNumber(e.target.value))
                      }
                    />
                  </FormControl>
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
                <FormLabel className="label-required">Phone</FormLabel>
                <FormFloating icon="+62" extraPadding>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatPhone(field.value)}
                      onChange={(e) => {
                        field.onChange(sanitizeNumber(e.target.value));
                      }}
                    />
                  </FormControl>
                </FormFloating>
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
                <FormLabel className="label-required">Date</FormLabel>
                <InputDate selected={field.value} onSelect={field.onChange} />
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

        <div className="flex flex-col gap-x-2 gap-y-4 lg:flex-row">
          {/* Custom Radio Group */}
          <FormField
            control={form.control}
            name="radio"
            render={({ field }) => (
              <FormItem className="col-span-3">
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
                    <FormItem key={index} className="flex items-center">
                      <FormControl>
                        <RadioGroupItem value={item.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.value}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* File */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="label-required">File</FormLabel>
              <InputFile accept="image" multiple {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">
            {/* {loading ? <Spinner /> : <Save />} */}
            <Save />
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
