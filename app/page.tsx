import { CustomButton } from "@/components/custom/custom-button";
import {
  AreaChart,
  BarChart,
  PieChart,
} from "@/components/custom/custom-chart";
import { ThemeToggle } from "@/components/custom/theme";
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

  const PropTable = ({
    data,
  }: {
    data: { name: string; type: string; default?: string }[];
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Prop Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Default</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <code>{item.name}</code>
            </TableCell>
            <TableCell>
              <code>{item.type}</code>
            </TableCell>
            <TableCell>{item.default && <code>{item.default}</code>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container flex flex-col gap-y-4 py-8">
      <div className="flex gap-2">
        <ThemeToggle size="icon" variant="outline" />

        <CustomButton
          customType="link"
          href="/dashboard"
          icon={<LayoutDashboard />}
          variant="outline"
          text="Go To Dashboard"
          onClickLoading
        />
      </div>

      <Separator />

      <Tabs defaultValue="Typography">
        <TabsList>
          <TabsTrigger value="Custom Button" disabled>
            Custom Button
          </TabsTrigger>
          <TabsTrigger value="Custom Chart">Custom Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="Custom Chart" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Pie Chart</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 lg:flex-row">
              <div className="basis-1/3">
                <PieChart label="Kategori" data={pieChartData} />
              </div>

              <div className="flex basis-2/3 items-center">
                <PropTable
                  data={[
                    { name: "label", type: "string" },
                    {
                      name: "data",
                      type: "{ nameKey: string; dataKey: number; fill: string }[]",
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Area and Pie Chart</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="basis-1/2">
                  <AreaChart
                    config={areaAndPieChartConfig}
                    data={areaAndPieChartData}
                  />
                </div>

                <div className="basis-1/2">
                  <BarChart
                    config={areaAndPieChartConfig}
                    data={areaAndPieChartData}
                  />
                </div>
              </div>

              <div className="flex basis-2/3 items-center">
                <PropTable
                  data={[
                    { name: "config", type: "ChartConfig (rechart)" },
                    {
                      name: "dataKeys",
                      type: "Record<string, number>",
                    },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
