import { CopyButton, CustomButton } from "@/components/custom/custom-button";
import {
  AreaChart,
  BarChart,
  PieChart,
} from "@/components/custom/custom-chart";
import { ThemeToggle } from "@/components/custom/theme";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";

// export const metadata: Metadata = { title: "Current Page" };

export default function Page() {
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
    apiReference,
    exampleCode,
    children,
  }: {
    title: string;
    apiReference: { name: string; type: string; defaultProp?: string }[];
    exampleCode: string;
    children: ReactNode;
  }) => (
    <Card className="grow basis-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {children}

        <Accordion type="multiple" defaultValue={["apiReference"]}>
          <AccordionItem value="apiReference">
            <AccordionTrigger className="text-lg font-semibold">
              API Reference
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
                  {apiReference.map(({ name, type, defaultProp }, index) => (
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
                        <code>{defaultProp ?? "-"}</code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="exampleCode">
            <AccordionTrigger className="text-lg font-semibold">
              Example Code
            </AccordionTrigger>
            <AccordionContent>
              <div className="relative rounded-xl border p-4 font-mono text-sm break-all whitespace-pre">
                <CopyButton
                  variant="outline"
                  value={exampleCode}
                  className="absolute top-2 right-2"
                />
                {exampleCode}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );

  return (
    <div className="container flex flex-col gap-y-4 py-8">
      <div className="flex gap-2">
        <ThemeToggle size="icon" variant="outline" />

        <CustomButton
          href="/dashboard"
          icon={<LayoutDashboard />}
          variant="outline"
          text="Go To Dashboard"
          onClickLoading
        />
      </div>

      <Separator />

      <Tabs defaultValue="Custom Button">
        <TabsList>
          <TabsTrigger value="Custom Chart">Custom Chart</TabsTrigger>
          <TabsTrigger value="Custom Button">Custom Button</TabsTrigger>
        </TabsList>

        <TabsContent value="Custom Button" className="space-y-2">
          <ComponentCard
            title="Custom Button"
            apiReference={[{ name: "label", type: "string" }]}
            exampleCode={`Hello World`}
          >
            <CustomButton
              href="/dashboard"
              text="Go To Dashboard"
              onClickLoading
            />
          </ComponentCard>
        </TabsContent>

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
            <div className="flex flex-col gap-2 md:flex-row">
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
      </Tabs>
    </div>
  );
}
