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
import { FormatNumeric, FormatPhone, SanitizeNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Club, Diamond, Heart, LockKeyhole, Spade } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import {
  FormFloating,
  InputDate,
  InputRadioGroup,
} from "../custom/custom-field";
import { Input } from "../ui/input";

export default function ExampleForm() {
  const golDarah = ["O", "A", "B", "AB"] as const;

  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    select: z.enum(golDarah),
    radio: z.enum(["spade", "heart", "diamond", "club"]),
    date: z.date(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Some Text",
      numeric: 100000,
      phone: 81234567890,
      select: "O",
      radio: "spade",
      date: new Date(),
    },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
    toast(<p>{JSON.stringify(data, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-4">
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

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {golDarah.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-2 gap-y-4 md:grid-cols-4">
          {/* Radio Group */}
          <FormField
            control={form.control}
            name="radio"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Radio Group</FormLabel>

                <FormControl>
                  <InputRadioGroup
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    radioItems={[
                      { value: "spade", label: "Spade", icon: <Spade /> },
                      {
                        value: "heart",
                        label: "Heart",
                        icon: <Heart />,
                        checkedClassName: "text-pink-500 border-pink-500",
                      },
                      {
                        value: "diamond",
                        label: "Diamond",
                        icon: <Diamond />,
                        checkedClassName: "text-sky-500 border-sky-500",
                      },
                      {
                        value: "club",
                        label: "Club",
                        icon: <Club />,
                        checkedClassName: "text-green-500 border-green-500",
                      },
                    ]}
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

        {/* Files */}

        <CustomButton type="submit" className="w-fit" text="Submit" />
      </form>
    </Form>
  );
}
