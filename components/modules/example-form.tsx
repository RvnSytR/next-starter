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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomButton } from "../custom/custom-button";
import { FormFloating } from "../custom/custom-form-field";
import { Input } from "../ui/input";

export default function ExampleForm() {
  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      numeric: 0,
      phone: 0,
    },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
    toast(<p>{JSON.stringify(data, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text input</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

        <CustomButton type="submit" className="w-fit" text="Submit" />
      </form>
    </Form>
  );
}
