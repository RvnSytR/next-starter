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
import ExampleForm from "./example-form";

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
    apiReference,
    exampleCode,
    children,
  }: {
    title: string;
    apiReference?: { name: string; type: string; def?: string }[];
    exampleCode?: string;
    children: ReactNode;
  }) => (
    <Card className="grow basis-1/3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        {children}

        <Accordion
          type="multiple"
          defaultValue={["apiReference", "exampleCode"]}
          className="w-full"
        >
          {apiReference && (
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
              <AccordionTrigger className="text-lg font-semibold">
                Example Code
              </AccordionTrigger>
              <AccordionContent>
                <div className="relative rounded-xl border p-4 font-mono text-sm break-all whitespace-pre">
                  <CopyButton
                    size="iconsm"
                    variant="outline"
                    value={exampleCode}
                    className="absolute top-2 right-2"
                  />
                  {exampleCode}
                </div>
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
            { name: "iconPosition", type: `"left" | "right"`, def: "left" },
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
        <ComponentCard title="Form Example">
          <ExampleForm />
        </ComponentCard>
      </TabsContent>
    </Tabs>
  );
}
