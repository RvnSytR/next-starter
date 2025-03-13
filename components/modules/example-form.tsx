"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { label } from "@/lib/content";
import { FormatNumeric, FormatPhone, SanitizeNumber } from "@/lib/utils";
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
import { CustomButton } from "../custom/custom-button";
import {
  FormFloating,
  InputDate,
  InputFile,
  InputRadioGroup,
} from "../custom/custom-field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ExampleForm() {
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
                    onChange={(e) => {
                      field.onChange(Number(SanitizeNumber(e.target.value)));
                    }}
                  />
                </FormFloating>

                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>

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
                      field.onChange(Number(SanitizeNumber(e.target.value)));
                    }}
                  />
                </FormFloating>

                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>

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
