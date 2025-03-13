import { CopyButton, CustomButton } from "@/components/custom/custom-button";
import {
  AreaChart,
  BarChart,
  PieChart,
} from "@/components/custom/custom-chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  ExampleForm,
  SelectAndRadioField,
  TextAndNumericField,
} from "./example-form";

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
    trigger,
    apiReference,
    exampleCode,
    children,
  }: {
    title: string;
    trigger?: { apiReference?: string; exampleCode?: string };
    apiReference?: { name: string; type: string; def?: string }[];
    exampleCode?: string;
    children: ReactNode;
  }) => (
    <Card className="grow basis-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {children}

        <Separator className="mt-6" />

        <Accordion
          type="multiple"
          defaultValue={["apiReference", "exampleCode"]}
          className="w-full"
        >
          {apiReference && (
            <AccordionItem value="apiReference">
              <AccordionTrigger className="text-base">
                {`${trigger?.apiReference} API Reference`}
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prop</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Default</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiReference.map(({ name, type, def }, index) => (
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
              </AccordionContent>
            </AccordionItem>
          )}

          {exampleCode && (
            <AccordionItem value="exampleCode">
              <AccordionTrigger className="text-base">
                {trigger?.exampleCode ?? "Example Code"}
              </AccordionTrigger>
              <AccordionContent>
                <ScrollArea className="relative rounded-xl border p-4 font-mono text-sm break-all whitespace-pre">
                  <CopyButton
                    size="iconsm"
                    variant="outline"
                    value={exampleCode}
                    className="bg-background absolute top-2 right-2"
                  />
                  {exampleCode}
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="Custom Chart">
      <TabsList>
        <TabsTrigger value="Custom Chart">Custom Chart</TabsTrigger>
        <TabsTrigger value="Custom Button">Custom Button</TabsTrigger>
        <TabsTrigger value="Form Example">Form Example</TabsTrigger>
        <TabsTrigger value="Text and Number">Text and Number</TabsTrigger>
        <TabsTrigger value="Select and Radio">Select and Radio</TabsTrigger>
      </TabsList>

      <TabsContent value="Custom Chart" className="space-y-2">
        <ComponentCard
          title="Area and Pie Chart"
          apiReference={[
            { name: "config", type: "ChartConfig (rechart)" },
            {
              name: "data",
              type: "{ xLabel: string; dataKeys: Record<string, number> }[]",
            },
          ]}
          exampleCode={`import { AreaChart, BarChart } from "@/components/custom/custom-chart";

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

<AreaChart config={config} data={data} />
<BarChart config={config} data={data} />`}
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

        <ComponentCard
          title="Pie Chart"
          apiReference={[
            { name: "label", type: "string" },
            {
              name: "data",
              type: "{ nameKey: string; dataKey: number; fill: string }[]",
            },
          ]}
          exampleCode={`import { PieChart } from "@/components/custom/custom-chart";

const data = [
  { nameKey: "Chrome", dataKey: 275, fill: "var(--color-chart-1)" },
  { nameKey: "Safari", dataKey: 200, fill: "var(--color-chart-2)" },
  { nameKey: "Firefox", dataKey: 187, fill: "var(--color-chart-3)" },
  { nameKey: "Edge", dataKey: 173, fill: "var(--color-chart-4)" },
  { nameKey: "Other", dataKey: 90, fill: "var(--color-chart-5)" },
];

<PieChart label="Kategori" data={data} />`}
        >
          <div className="mx-auto aspect-square h-[20rem]">
            <PieChart label="Kategori" data={pieChartData} />
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
            {
              name: "...props",
              type: `Omit<ButtonProps, "children"> & Omit<LinkProps, keyof ButtonProps | "href">`,
            },
          ]}
          exampleCode={`import { CustomButton } from "@/components/custom/custom-button";

<CustomButton icon={<Sparkles />} text="Custom Button" />

<CustomButton text="On Click Loading" onClickLoading />

<CustomButton href="/coverage" icon={<FlaskConical />} text="On Click Loading With Link" onClickLoading />

<CustomButton text="Hide Text On Mobile" icon={<ArrowRight />} iconPosition="right" hideTextOnMobile />`}
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
      </TabsContent>

      <TabsContent value="Form Example" className="space-y-2">
        <ComponentCard
          title="Form Example"
          trigger={{ exampleCode: "Form Setup" }}
          exampleCode={`import { CustomButton } from "@/components/custom/custom-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { label } from "@/lib/content";
import { zodFile } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function ExampleForm() {
  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    select: z.enum(["Spade", "Heart", "Diamond", "Club"]),
    radio: z.enum(["Spade", "Heart", "Diamond", "Club"]),
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
        {/* Form Field Goes Here */}

        {/* You can add a loading state to the submit button using CustomButton component, for example: */}
        <CustomButton
          type="submit"
          // loading={isLoading}
          text={label.button.save}
        />

        <Button type="reset" variant="outline" onClick={() => form.reset()}>
          <RotateCcw />
          {label.button.reset}
        </Button>
      </form>
    </Form>
  );
}`}
        >
          <ExampleForm />
        </ComponentCard>
      </TabsContent>

      <TabsContent value="Text and Number" className="space-y-2">
        <ComponentCard
          title="Text and Number Field"
          trigger={{ apiReference: "Form Floating" }}
          apiReference={[
            { name: "icon", type: "ReactNode" },
            { name: "...props", type: `ComponentProps<"div">` },
          ]}
          exampleCode={`{/* Text */}
<FormField
  control={form.control}
  name="text"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Text</FormLabel>
      <FormControl>
        <Input type="text" placeholder="Enter some text" {...field} />
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
      <FormMessage />
    </FormItem>
  )}
/>

{/* With Form Floating */}
<FormField
  control={form.control}
  name="text"
  render={({ field }) => (
    <FormItem>
      <FormLabel>With Form Floating</FormLabel>
      <FormControl>
        <FormFloating icon={<LockKeyhole />}>
          <Input type="text" placeholder="Enter some text" {...field} />
        </FormFloating>
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
      <FormControl>
        <FormFloating icon={"+62"}>
          <Input
            type="text"
            inputMode="numeric"
            value={FormatPhone(field.value)}
            onChange={(e) => {
              field.onChange(SanitizeNumber(e.target.value));
            }}
          />
        </FormFloating>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>`}
        >
          <TextAndNumericField />
        </ComponentCard>
      </TabsContent>

      <TabsContent value="Select and Radio" className="space-y-2">
        <ComponentCard
          title="Text and Number Field"
          trigger={{ apiReference: "Input Radio" }}
          apiReference={[
            {
              name: "radioItems",
              type: "{ value: string; label?: string; icon?: ReactNode; checkedClassName?: string; }[]",
            },
            { name: "...props", type: `RadioGroupProps` },
          ]}
          exampleCode={`const selectAndRadioData = [
  { value: "Spade", icon: <Spade /> },
  { value: "Heart", icon: <Heart />, checkedClassName: "text-pink-500 border-pink-500" },
  { value: "Diamond", icon: <Diamond />, checkedClassName: "text-sky-500 border-sky-500" },
  { value: "Club", icon: <Club />, checkedClassName: "text-green-500 border-green-500" },
];

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

{/* Custom Radio */}
<FormField
  control={form.control}
  name="radio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Custom Radio</FormLabel>
      <InputRadioGroup
        defaultValue={field.value}
        onValueChange={field.onChange}
        className="grid grid-cols-2 md:flex md:grid-cols-4"
        radioItems={selectAndRadioData}
      />
      <FormMessage />
    </FormItem>
  )}
/>`}
        >
          <SelectAndRadioField />
        </ComponentCard>
      </TabsContent>
    </Tabs>
  );
}
