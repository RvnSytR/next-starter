import { CopyButton, RefreshButton } from "@/components/custom/custom-button";
import {
  AreaChart,
  BarChart,
  PieChart,
} from "@/components/custom/custom-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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

function ComponentCard({
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
}) {
  const copyButtonCn = "absolute top-2 right-2";
  const codeCn =
    "bg-muted/50 relative rounded-xl p-4 font-mono text-sm  break-all whitespace-pre";
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
              <ScrollArea className={codeCn}>
                <CopyButton
                  size="iconsm"
                  variant="outline"
                  className={copyButtonCn}
                  value={importCode}
                />
                {importCode}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}

            <ScrollArea className={codeCn}>
              <CopyButton
                size="iconsm"
                variant="outline"
                className={copyButtonCn}
                value={code}
              />
              {code}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
            <ScrollArea className={codeCn}>
              <CopyButton
                size="iconsm"
                variant="outline"
                className={copyButtonCn}
                value={detailProps ?? ""}
              />
              {detailProps}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

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
          title="Badge Variant"
          code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>

<Badge variant="success">Success</Badge>
<Badge variant="outline_success">Outline Success</Badge>

<Badge variant="warning">Warning</Badge>
<Badge variant="outline_warning">Outline Warning</Badge>

<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline_destructive">Outline Destructive</Badge>`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>

              <Badge variant="success">Success</Badge>
              <Badge variant="outline_success">Outline Success</Badge>

              <Badge variant="warning">Warning</Badge>
              <Badge variant="outline_warning">Outline Warning</Badge>

              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline_destructive">Outline Destructive</Badge>
            </div>
          </div>
        </ComponentCard>

        <ComponentCard
          title="Button Variant"
          code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button variant="success">Success</Button>
<Button variant="outline_success">Outline Success</Button>
<Button variant="ghost_success">Ghost Success</Button>

<Button variant="warning">Warning</Button>
<Button variant="outline_warning">Outline Warning</Button>
<Button variant="ghost_warning">Ghost Warning</Button>

<Button variant="destructive">Destructive</Button>
<Button variant="outline_destructive">Outline Destructive</Button>
<Button variant="ghost_destructive">Ghost Destructive</Button>`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="success">Success</Button>
              <Button variant="outline_success">Outline Success</Button>
              <Button variant="ghost_success">Ghost Success</Button>

              <Button variant="warning">Warning</Button>
              <Button variant="outline_warning">Outline Warning</Button>
              <Button variant="ghost_warning">Ghost Warning</Button>

              <Button variant="destructive">Destructive</Button>
              <Button variant="outline_destructive">Outline Destructive</Button>
              <Button variant="ghost_destructive">Ghost Destructive</Button>
            </div>
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
          detailProps={`export type Media = "all" | "image" | "document" | "archive" | "audio" | "video";`}
          code="-"
        >
          <ExampleForm />
        </ComponentCard>
      </TabsContent>
    </Tabs>
  );
}
