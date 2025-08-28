import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { AreaChart, BarChart, PieChart } from "../other/charts";
import { FormBuilder } from "../other/form-builder";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ExampleForm } from "./example-form";

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

const comp = {
  pieChart: (
    <Card>
      <CardHeader>
        <CardTitle>Pie Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mx-auto aspect-square h-[20rem]">
          <PieChart label="Kategori" data={pieChartData} />
        </div>
      </CardContent>
    </Card>
  ),

  timelineChart: (
    <Card>
      <CardHeader>
        <CardTitle>Timeline Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 md:flex-row">
        <div className="md:basis-1/2">
          <AreaChart
            config={areaAndPieChartConfig}
            data={areaAndPieChartData}
          />
        </div>

        <div className="md:basis-1/2">
          <BarChart config={areaAndPieChartConfig} data={areaAndPieChartData} />
        </div>
      </CardContent>
    </Card>
  ),

  form: (
    <Card>
      <CardContent>
        <ExampleForm />
      </CardContent>
    </Card>
  ),

  formBuilder: <FormBuilder />,
};

const tabs: { section: string; content: (keyof typeof comp)[] }[] = [
  { section: "Form Builder", content: ["formBuilder"] },
  { section: "Chart", content: ["pieChart", "timelineChart"] },
  { section: "Form", content: ["form"] },
];

export function Example() {
  return (
    <Tabs
      defaultValue={tabs[0].section}
      orientation="vertical"
      className="animate-fade w-full gap-x-8 delay-1000 md:flex-row"
    >
      <ScrollArea className="pb-2 md:hidden">
        <TabsList className="w-full rounded-none border-b bg-transparent p-0">
          {tabs.map(({ section }) => (
            <TabsTrigger
              key={section}
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
        {tabs.map(({ section }) => (
          <TabsTrigger
            key={section}
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
        {tabs.map(({ section, content }) => (
          <TabsContent key={section} value={section} className="grid gap-y-4">
            <h3>{section}</h3>
            {content.map((key, index) => (
              <Fragment key={index}>{comp[key]}</Fragment>
            ))}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
