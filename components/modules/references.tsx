import {
  CopyButton,
  CustomButton,
  RefreshButton,
} from "@/components/custom/custom-button";
import {
  AreaChart,
  BarChart,
  PieChart,
} from "@/components/custom/custom-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ExampleForm } from "./example-form";

export function References() {
  const pieChartData = [
    { nameKey: "Chrome", dataKey: 275, fill: "var(--color-chart-1)" },
    { nameKey: "Safari", dataKey: 200, fill: "var(--color-chart-2)" },
    { nameKey: "Firefox", dataKey: 187, fill: "var(--color-chart-3)" },
    { nameKey: "Edge", dataKey: 173, fill: "var(--color-chart-4)" },
    { nameKey: "Other", dataKey: 90, fill: "var(--color-chart-5)" },
  ];

  const areaAndPieChartData = [
    { xLabel: "January", dataKeys: { key1: 186, key2: 80 } },
    { xLabel: "February", dataKeys: { key1: 305, key2: 200 } },
    { xLabel: "March", dataKeys: { key1: 237, key2: 120 } },
    { xLabel: "April", dataKeys: { key1: 73, key2: 190 } },
    { xLabel: "May", dataKeys: { key1: 209, key2: 130 } },
    { xLabel: "June", dataKeys: { key1: 214, key2: 140 } },
  ];

  const areaAndPieChartConfig = {
    key1: { label: "Desktop", color: "var(--color-chart-1)" },
    key2: { label: "Mobile", color: "var(--color-chart-2)" },
  };

  const ComponentCard = ({
    title,
    importCode,
    code,
    apiReference,
    detailProps,
    children,
  }: {
    title: string;
    importCode?: string;
    code: string;
    apiReference?: { name: string; type: string; def?: string }[];
    detailProps?: string;
    children: ReactNode;
  }) => {
    const copyButtonCn = "absolute top-2 right-2";
    const codeCn =
      "bg-muted relative rounded-xl p-4 font-mono text-sm break-all whitespace-pre";
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="Preview" className="gap-4">
            <ScrollArea className="pb-4 lg:pb-0">
              <TabsList>
                <TabsTrigger value="Preview">Preview</TabsTrigger>
                <TabsTrigger value="Code">Code</TabsTrigger>
                <TabsTrigger value="API Reference" disabled={!!!apiReference}>
                  API Reference
                </TabsTrigger>
                <TabsTrigger value="Detail Props" disabled={!!!detailProps}>
                  Detail Props
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <TabsContent value="Preview" className="flex justify-center">
              {children}
            </TabsContent>

            <TabsContent value="Code" className="space-y-2">
              {importCode && (
                <div className={codeCn}>
                  <CopyButton
                    size="iconsm"
                    variant="ghost"
                    className={copyButtonCn}
                    value={importCode}
                  />
                  {importCode}
                </div>
              )}

              <div className={codeCn}>
                <CopyButton
                  size="iconsm"
                  variant="ghost"
                  className={copyButtonCn}
                  value={code}
                />
                {code}
              </div>
            </TabsContent>

            <TabsContent value="API Reference">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prop</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiReference &&
                    apiReference.map(({ name, type, def }, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <code className="bg-sky-500/20 text-sky-500">
                            {name}
                          </code>
                        </TableCell>
                        <TableCell>
                          <code>{type}</code>
                        </TableCell>
                        <TableCell>
                          <code>{def ?? "-"}</code>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="Detail Props">
              <div className={codeCn}>
                <CopyButton
                  size="iconsm"
                  variant="ghost"
                  className={copyButtonCn}
                  value={detailProps ?? ""}
                />
                {detailProps}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs defaultValue="Custom Chart">
      <ScrollArea className="pb-4 lg:pb-0">
        <TabsList>
          <TabsTrigger value="Custom Chart">Custom Chart</TabsTrigger>
          <TabsTrigger value="Custom Button">Custom Button</TabsTrigger>
          <TabsTrigger value="Form Example">Form Example</TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsContent value="Custom Chart" className="space-y-2">
        <ComponentCard
          title="Pie Chart"
          apiReference={[
            { name: "label", type: "string" },
            {
              name: "data",
              type: "{ nameKey: string; dataKey: number; fill: string }[]",
            },
          ]}
          importCode={`import { PieChart } from "@/components/custom/custom-chart";`}
          code={`export default function ExamplePieChart() {
  const data = [
    { nameKey: "Chrome", dataKey: 275, fill: "var(--color-chart-1)" },
    { nameKey: "Safari", dataKey: 200, fill: "var(--color-chart-2)" },
    { nameKey: "Firefox", dataKey: 187, fill: "var(--color-chart-3)" },
    { nameKey: "Edge", dataKey: 173, fill: "var(--color-chart-4)" },
    { nameKey: "Other", dataKey: 90, fill: "var(--color-chart-5)" },
  ];

  return (
    <div className="mx-auto aspect-square h-[20rem]">
      <PieChart label="Kategori" data={data} />
    </div>
  );
}`}
        >
          <div className="mx-auto aspect-square h-[20rem]">
            <PieChart label="Kategori" data={pieChartData} />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Area and Pie Chart"
          apiReference={[
            { name: "config", type: "ChartConfig (rechart)" },
            {
              name: "data",
              type: "{ xLabel: string; dataKeys: Record<string, number> }[]",
            },
          ]}
          importCode={`import { AreaChart, BarChart } from "@/components/custom/custom-chart";`}
          code={`export function ExampleAreaAndPieChart() {
  const data = [
    { xLabel: "January", dataKeys: { key1: 186, key2: 80 } },
    { xLabel: "February", dataKeys: { key1: 305, key2: 200 } },
    { xLabel: "March", dataKeys: { key1: 237, key2: 120 } },
    { xLabel: "April", dataKeys: { key1: 73, key2: 190 } },
    { xLabel: "May", dataKeys: { key1: 209, key2: 130 } },
    { xLabel: "June", dataKeys: { key1: 214, key2: 140 } },
  ];

  const config = {
    key1: { label: "Desktop", color: "var(--color-chart-1)" },
    key2: { label: "Mobile", color: "var(--color-chart-2)" },
  };

  return (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <div className="md:basis-1/2">
        <AreaChart config={config} data={data} />
      </div>

      <div className="md:basis-1/2">
        <BarChart config={config} data={data} />
      </div>
    </div>
  );
}`}
        >
          <div className="flex w-full flex-col gap-2 md:flex-row">
            <div className="md:basis-1/2">
              <AreaChart
                config={areaAndPieChartConfig}
                data={areaAndPieChartData}
              />
            </div>

            <div className="md:basis-1/2">
              <BarChart
                config={areaAndPieChartConfig}
                data={areaAndPieChartData}
              />
            </div>
          </div>
        </ComponentCard>
      </TabsContent>

      <TabsContent value="Custom Button" className="space-y-2">
        <ComponentCard
          title="Custom Button"
          apiReference={[
            { name: "text", type: "string" },
            { name: "icon", type: "ReactNode" },
            { name: "iconPosition", type: `"left" | "right"`, def: `"left"` },
            { name: "loading", type: "boolean", def: "false" },
            { name: "onClickLoading", type: "boolean", def: "false" },
            { name: "inSidebar", type: "boolean", def: "false" },
            { name: "hideTextOnMobile", type: "boolean", def: "false" },
            { name: "customLoader", type: "ReactNode", def: "LoaderCircle" },
            { name: "href", type: "string | URL" },
            { name: "...props", type: `CustomButtonProps` },
          ]}
          importCode={`import { CustomButton } from "@/components/custom/custom-button";`}
          code={`<CustomButton icon={<Sparkles />} text="Custom Button" />

<CustomButton text="On Click Loading" onClickLoading />

<CustomButton href="/coverage" icon={<FlaskConical />} text="On Click Loading With Link" onClickLoading />

<CustomButton text="Hide Text On Mobile" icon={<ArrowRight />} iconPosition="right" hideTextOnMobile />`}
          detailProps={`type RequiredChildrenProps =
  | { text: string; icon?: ReactNode }
  | { text?: string; icon: ReactNode };

type OptionalChildrenProps = Omit<
  CustomButtonProps,
  keyof RequiredChildrenProps
> & { text?: string; icon?: ReactNode };

export type CustomButtonProps = Omit<ButtonProps, "children"> &
  Partial<LinkProps> &
  RequiredChildrenProps & {
    iconPosition?: "left" | "right";
    loading?: boolean;
    onClickLoading?: boolean;
    inSidebar?: boolean;
    hideTextOnMobile?: boolean;
    customLoader?: ReactNode;
  };`}
        >
          <div className="flex flex-wrap gap-2">
            <CustomButton icon={<Sparkles />} text="Custom Button" />
            <CustomButton text="On Click Loading" onClickLoading />
            <CustomButton
              href="/coverage"
              icon={<FlaskConical />}
              text="On Click Loading With Link"
              onClickLoading
            />
            <CustomButton
              text="Hide Text On Mobile"
              icon={<ArrowRight />}
              iconPosition="right"
              hideTextOnMobile
            />
          </div>
        </ComponentCard>

        <ComponentCard
          title="Refresh Button"
          apiReference={[
            { name: "text", type: "string", def: "label.button.refresh" },
            { name: "icon", type: "ReactNode", def: "RefreshCw" },
            { name: "customLoader", type: "ReactNode", def: "RefreshCw" },
            {
              name: "...props",
              type: `Omit<OptionalChildrenProps, "loading" | "onClick">`,
            },
          ]}
          importCode={`import { RefreshButton } from "@/components/custom/custom-button";`}
          code={`<RefreshButton />`}
        >
          <RefreshButton />
        </ComponentCard>

        <ComponentCard
          title="Copy Button"
          apiReference={[
            { name: "value", type: "string" },
            { name: "icon", type: "ReactNode", def: "Copy" },
            { name: "customLoader", type: "ReactNode", def: "Check" },
            {
              name: "...props",
              type: `Omit<OptionalChildrenProps, "loading" | "onClick"> & { value: string }`,
            },
          ]}
          importCode={`import { CopyButton } from "@/components/custom/custom-button";`}
          code={`<CopyButton value="Hello World" />`}
        >
          <CopyButton value="Hello World" />
        </ComponentCard>
      </TabsContent>

      <TabsContent value="Form Example" className="space-y-2">
        <ComponentCard
          title="Form Example"
          code={`"use client";

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
    file: zodFile.image,
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
    },
  });

  const formHandler = async (data: z.infer<typeof schema>) => {
    console.log(data.file);
    toast(<p>{JSON.stringify(data, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        <div className="grid grid-cols-1 gap-x-2 gap-y-4 lg:grid-cols-5">
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
                <FormFloating icon={"Rp."}>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={FormatNumeric(field.value)}
                      onChange={(e) =>
                        field.onChange(SanitizeNumber(e.target.value))
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
                <FormFloating icon={"+62"}>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={FormatPhone(field.value)}
                      onChange={(e) => {
                        field.onChange(SanitizeNumber(e.target.value));
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

          {/* Custom Radio Group */}
          <FormField
            control={form.control}
            name="radio"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel className="label-required">Radio Group</FormLabel>
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
              <FormItem className="col-span-2">
                <FormLabel className="label-required">Radio Group</FormLabel>

                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="size-full gap-4"
                >
                  {selectAndRadioData.map((item, index) => (
                    <FormItem
                      key={index}
                      className="flex-row items-center space-x-2"
                    >
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
          render={({ field: { onChange, ...restField } }) => (
            <FormItem>
              <FormLabel className="label-required">File</FormLabel>
              <InputFile
                onChange={(e) => onChange(e.target.files)}
                {...restField}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          {/* You can add a loading state to the submit button using CustomButton component, for example: */}
          <CustomButton
            type="submit"
            icon={<Save />}
            text={label.button.save}
            // loading={isLoading}
          />

          <Button type="reset" variant="outline" onClick={() => form.reset()}>
            <RotateCcw />
            {label.button.reset}
          </Button>
        </div>
      </form>
    </Form>
  );
}`}
        >
          <ExampleForm />
        </ComponentCard>
      </TabsContent>
    </Tabs>
  );
}
