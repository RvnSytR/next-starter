import { CopyButton } from "@/components/other/buttons";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AreaChart, BarChart, PieChart } from "../other/charts";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ExampleForm } from "./example-form";

type Key = keyof typeof code;
type CompCardContent = { title: string; key: Key };

const pieChartData = [
  { nameKey: "Chrome", dataKey: 275, fill: "var(--color-chart-1)" },
  { nameKey: "Safari", dataKey: 200, fill: "var(--color-chart-2)" },
  { nameKey: "Firefox", dataKey: 187, fill: "var(--color-chart-3)" },
  { nameKey: "Edge", dataKey: 173, fill: "var(--color-chart-4)" },
  { nameKey: "Other", dataKey: 90, fill: "var(--color-chart-5)" },
];

const areaAndPieChartData = [
  { xLabel: "Januari", dataKeys: { key1: 186, key2: 80 } },
  { xLabel: "Februari", dataKeys: { key1: 305, key2: 200 } },
  { xLabel: "Maret", dataKeys: { key1: 237, key2: 120 } },
  { xLabel: "April", dataKeys: { key1: 73, key2: 190 } },
  { xLabel: "Mei", dataKeys: { key1: 209, key2: 130 } },
  { xLabel: "Juni", dataKeys: { key1: 214, key2: 140 } },
];

const areaAndPieChartConfig = {
  key1: { label: "Desktop", color: "var(--color-chart-1)" },
  key2: { label: "Mobile", color: "var(--color-chart-2)" },
};

const code = {
  pieChart: `import { PieChart } from "@/components/other/charts";

export default function ExamplePieChart() {
  const data = [
    { xLabel: "Januari", dataKeys: { key1: 186, key2: 80 } },
    { xLabel: "Februari", dataKeys: { key1: 305, key2: 200 } },
    { xLabel: "Maret", dataKeys: { key1: 237, key2: 120 } },
    { xLabel: "April", dataKeys: { key1: 73, key2: 190 } },
    { xLabel: "Mei", dataKeys: { key1: 209, key2: 130 } },
    { xLabel: "Juni", dataKeys: { key1: 214, key2: 140 } },
  ];

  return (
    <div className="mx-auto aspect-square h-[20rem]">
      <PieChart label="Kategori" data={data} />
    </div>
  );
}`,

  timelineChart: `import { AreaChart, BarChart } from "@/components/other/charts";

export function ExampleAreaAndPieChart() {
  const data = [
    { xLabel: "Januari", dataKeys: { key1: 186, key2: 80 } },
    { xLabel: "Februari", dataKeys: { key1: 305, key2: 200 } },
    { xLabel: "Maret", dataKeys: { key1: 237, key2: 120 } },
    { xLabel: "April", dataKeys: { key1: 73, key2: 190 } },
    { xLabel: "Mei", dataKeys: { key1: 209, key2: 130 } },
    { xLabel: "Juni", dataKeys: { key1: 214, key2: 140 } },
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
}`,

  form: `"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { buttonText } from "@/lib/content";
import { zodDateRange, zodFile } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { RotateCcw, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// import { uploadFiles } from "@/server/s3";

export function ExampleForm() {
  const card = ["Spade", "Heart", "Diamond", "Club"] as const;

  const fileType = "image";
  const schema = z.object({
    text: z.string().min(1),
    numeric: z.number(),
    phone: z.number(),
    date: z.date(),
    dateMultiple: z.array(z.date()),
    dateRange: zodDateRange,
    select: z.enum(card),
    radio: z.enum(card),
    file: zodFile(fileType),
    // file: zodFile("file", { optional: true }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "Some Text",
      numeric: 100000,
      phone: 81234567890,
      date: new Date(),
      dateMultiple: [new Date()],
      dateRange: { from: new Date(), to: addDays(new Date(), 6) },
      select: "Spade",
      radio: "Spade",
      file: [],
    },
  });

  const formHandler = async (formData: z.infer<typeof schema>) => {
    console.log(formData.file);
    // const res = await uploadFiles({ files: formData.file, contentType: fileType });

    toast(<p>{JSON.stringify(formData, null, 2)}</p>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formHandler)}>
        {/* Fields */}

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
}`,
};

const comp: Record<Key, React.ReactNode> = {
  pieChart: (
    <div className="mx-auto aspect-square h-[20rem]">
      <PieChart label="Kategori" data={pieChartData} />
    </div>
  ),

  timelineChart: (
    <div className="flex w-full flex-col gap-2 md:flex-row">
      <div className="md:basis-1/2">
        <AreaChart config={areaAndPieChartConfig} data={areaAndPieChartData} />
      </div>

      <div className="md:basis-1/2">
        <BarChart config={areaAndPieChartConfig} data={areaAndPieChartData} />
      </div>
    </div>
  ),

  form: <ExampleForm />,
};

function Comp({ content }: { content: CompCardContent[] }) {
  return content.map(({ title, key }, index) => (
    <Card key={index}>
      <CardContent className="flex flex-col gap-y-4">
        <CardTitle>{title}</CardTitle>
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="Code">Kode</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">{comp[key]}</TabsContent>

          <TabsContent value="Code">
            <ScrollArea className="bg-muted relative rounded-xl font-mono text-sm break-all whitespace-pre">
              <div className="m-4">
                <CopyButton
                  size="iconsm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  value={code[key]}
                />
                {code[key]}
              </div>
              <ScrollBar orientation="horizontal" className="bg-accent" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  ));
}

export function Example() {
  const tabs: { section: string; content: CompCardContent[] }[] = [
    {
      section: "Chart Usage",
      content: [
        { title: "Pie Chart", key: "pieChart" },
        { title: "Area and Bar Chart", key: "timelineChart" },
      ],
    },
    {
      section: "Form Usage",
      content: [{ title: "Contoh penggunaan Form", key: "form" }],
    },
  ];

  return (
    <Tabs
      defaultValue={tabs[0].section}
      orientation="vertical"
      className="animate-fade w-full delay-1000 md:flex-row"
    >
      <ScrollArea className="pb-2 md:hidden">
        <TabsList className="w-full rounded-none border-b bg-transparent p-0">
          {tabs.map(({ section }, index) => (
            <TabsTrigger
              key={index}
              value={section}
              className={cn(
                "relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5",
                "data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent",
              )}
            >
              {section}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsList className="hidden h-full flex-col items-start justify-start rounded-none border-l bg-transparent p-0 md:flex">
        {tabs.map(({ section }, index) => (
          <TabsTrigger
            key={index}
            value={section}
            className={cn(
              "relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:-start-0.5 after:w-0.5",
              "data-[state=active]:after:bg-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent",
            )}
          >
            {section}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="w-full">
        {tabs.map(({ section, content }, index) => (
          <TabsContent key={index} value={section} className="space-y-4">
            <Comp content={content} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
