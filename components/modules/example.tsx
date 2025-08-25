import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AreaChart, BarChart, PieChart } from "../other/charts";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ExampleForm } from "./example-form";

type CompCardContent = { title: string; key: keyof typeof comp };

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

const tabs: { section: string; content: CompCardContent[] }[] = [
  {
    section: "Chart",
    content: [
      { title: "Pie Chart", key: "pieChart" },
      { title: "Area and Bar Chart", key: "timelineChart" },
    ],
  },
  {
    section: "Form",
    content: [{ title: "Contoh penggunaan Form", key: "form" }],
  },
];

function Comp({ content }: { content: CompCardContent[] }) {
  return content.map(({ title, key }) => (
    <Card key={key}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">{comp[key]}</CardContent>
    </Card>
  ));
}

export function Example() {
  return (
    <Tabs
      defaultValue={tabs[0].section}
      orientation="vertical"
      className="animate-fade w-full delay-1000 md:flex-row"
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
          <TabsContent key={section} value={section} className="space-y-4">
            <Comp content={content} />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
