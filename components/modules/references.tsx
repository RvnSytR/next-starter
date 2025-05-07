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
  code: string;
  importCode?: string;
  apiReference?: { name: string; type: string; def?: string }[];
  detailProps?: string;
  children?: ReactNode;
}) {
  const copyButtonCn = "absolute top-2 right-2";
  const codeCn =
    "bg-muted relative rounded-xl p-4 font-mono text-sm  break-all whitespace-pre";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={children ? "Preview" : "Code"} className="gap-4">
          <ScrollArea className="pb-4 lg:pb-0">
            <TabsList>
              <TabsTrigger value="Preview" disabled={!children}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="Code">Code</TabsTrigger>
              <TabsTrigger value="API Reference" disabled={!apiReference}>
                Props
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
      <ScrollArea>
        <TabsList className="min-w-full md:min-w-fit">
          <TabsTrigger value="Custom Chart">Custom Chart</TabsTrigger>
          <TabsTrigger value="Badge and Button">Badge and Button</TabsTrigger>
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

      <TabsContent value="Badge and Button" className="space-y-2">
        <ComponentCard
          title="Badge Variant"
          importCode={`import { Badge } from "@/components/ui/badge";`}
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
          importCode={`import { Button } from "@/components/ui/button";`}
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
            {
              name: "...props",
              type: `Omit<ButtonProps, "onClick" | "children">`,
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
            {
              name: "...props",
              type: `Omit<ButtonProps, "onClick" | "children">`,
            },
          ]}
          importCode={`import { CopyButton } from "@/components/custom/custom-button";`}
          code={`<CopyButton value="Hello World" />`}
        >
          <CopyButton value="Hello World" />
        </ComponentCard>
      </TabsContent>

      <TabsContent value="Form Example" className="space-y-2">
        <ComponentCard title="Form Example" code="-">
          <ExampleForm />
        </ComponentCard>

        <ComponentCard
          title="Text Field"
          code={`<FormField
  control={form.control}
  name="text"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Text *</FormLabel>
      <FormFloating icon={<LockKeyhole />}>
        <FormControl>
          <Input type="text" {...field} />
        </FormControl>
      </FormFloating>
      <FormMessage />
    </FormItem>
  )}
/>`}
        />

        <ComponentCard
          title="Numeric and Phone Field"
          code={`{/* Numeric */}
<FormField
  control={form.control}
  name="numeric"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Numeric *</FormLabel>
      <FormFloating icon="Rp.">
        <FormControl>
          <Input
            type="text"
            inputMode="numeric"
            value={formatNumeric(field.value)}
            onChange={(e) =>
              field.onChange(sanitizeNumber(e.target.value))
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
      <FormLabel>Phone *</FormLabel>
      <FormFloating icon="+62" extraPadding>
        <FormControl>
          <Input
            type="text"
            inputMode="numeric"
            value={formatPhone(field.value)}
            onChange={(e) => {
              field.onChange(sanitizeNumber(e.target.value));
            }}
          />
        </FormControl>
      </FormFloating>
      <FormMessage />
    </FormItem>
  )}
/>`}
        />

        <ComponentCard
          title="Date Field"
          code={`<FormField
  control={form.control}
  name="date"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Date *</FormLabel>
      <InputDate selected={field.value} onSelect={field.onChange} />
      <FormMessage />
    </FormItem>
  )}
/>`}
        />

        <ComponentCard
          title="Select Field"
          code={`<FormField
  control={form.control}
  name="select"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Select *</FormLabel>
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
/>`}
        />

        <ComponentCard
          title="Custom Radio Group Field"
          code={`<FormField
  control={form.control}
  name="radio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Radio Group *</FormLabel>
      <InputRadioGroup
        defaultValue={field.value}
        onValueChange={field.onChange}
        radioItems={selectAndRadioData}
      />
      <FormMessage />
    </FormItem>
  )}
/>`}
        />

        <ComponentCard
          title="Radio Group Field"
          code={`<FormField
  control={form.control}
  name="radio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Radio Group *</FormLabel>
      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
      >
        {selectAndRadioData.map((item, index) => (
          <FormItem key={index}>
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
/>`}
        />

        <ComponentCard
          title="File Field"
          code={`<FormField
  control={form.control}
  name="file"
  render={({ field }) => (
    <FormItem>
      <FormLabel>File *</FormLabel>
      <InputFile accept="image" {...field} />
      <FormMessage />
    </FormItem>
  )}
/>`}
        />
      </TabsContent>
    </Tabs>
  );
}
