"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormatNumeric, FormatPhone, SanitizeNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Club, Diamond, Heart, LockKeyhole, Spade } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import { FormFloating, InputRadioGroup } from "../custom/custom-form-field";
import { Input } from "../ui/input";

export default function ExampleForm() {
  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    radio: z.enum(["spade", "heart", "diamond", "club"]),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      numeric: 0,
      phone: 0,
      radio: "spade",
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
                <FormLabel>Text input</FormLabel>

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
                <FormLabel>Numeric input</FormLabel>

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
                <FormLabel>Phone input</FormLabel>

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
        </div>

        {/* Radio */}
        <FormField
          control={form.control}
          name="radio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Radio</FormLabel>

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

        <CustomButton type="submit" className="w-fit" text="Submit" />
      </form>
    </Form>
  );
}
