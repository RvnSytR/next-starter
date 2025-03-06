import { CustomButton } from "@/components/custom/custom-button";
import {
  AreaChart,
  BarChart,
  PieChart,
} from "@/components/custom/custom-chart";
import { ThemeToggle } from "@/components/custom/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  FlaskConical,
  LayoutDashboard,
  Settings,
  UserRoundPlus,
} from "lucide-react";

// export const metadata: Metadata = {
//   title: "Current Page",
// };

export default function Page() {
  const pieChartData = [
    { nameKey: "Chrome", dataKey: 275, fill: "var(--color-chart-1)" },
    { nameKey: "Safari", dataKey: 200, fill: "var(--color-chart-2)" },
    { nameKey: "Firefox", dataKey: 187, fill: "var(--color-chart-3)" },
    { nameKey: "Edge", dataKey: 173, fill: "var(--color-chart-4)" },
    { nameKey: "Other", dataKey: 90, fill: "var(--color-chart-5)" },
    { nameKey: "Other2", dataKey: 190, fill: "var(--primary)" },
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
    <div className="container space-y-4 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <ThemeToggle size="icon" variant="outline" />

        <CustomButton
          customType="link"
          href="/dashboard"
          icon={<LayoutDashboard />}
          variant="outline"
          text="Go To Dashboard"
          onClickLoading
        />

        <CustomButton
          customType="link"
          href="/coverage"
          icon={<FlaskConical />}
          variant="outline"
          text="Go to Testing Page (Coverage)"
          onClickLoading
        />
      </div>

      <Separator />

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>Paragraph</p>
          <small>Small</small>
          <code>console.log(&quot;Code&quot;)</code>
          <blockquote>Blockquote ~</blockquote>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="outline_success">Success Outline</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline_warning">Warning Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline_destructive">Destructive Outline</Badge>
        </CardContent>
      </Card>

      {/* Button */}
      <Card>
        <CardHeader>
          <CardTitle>Button</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>

            <Separator orientation="vertical" className="h-8" />

            <Button size="iconsm">
              <Settings />
            </Button>
            <Button size="icon">
              <Settings />
            </Button>
            <Button size="iconlg">
              <Settings />
            </Button>

            <Separator orientation="vertical" className="h-8" />

            <Button size="sm">
              <UserRoundPlus />
              Small with Icon
            </Button>
            <Button>
              <UserRoundPlus />
              Default with Icon
            </Button>
            <Button size="lg">
              <UserRoundPlus />
              Large with Icon
            </Button>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>

            <Separator orientation="vertical" className="h-8" />

            <Button variant="success">Success</Button>
            <Button variant="outline_success">SuccessOutline</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="outline_warning">Warning Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline_destructive">Destructive Outline</Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="basis-1/3">
            <PieChart label="Kategori" data={pieChartData} />
          </div>

          <div className="basis-2/3 space-y-4">
            <AreaChart
              config={areaAndPieChartConfig}
              data={areaAndPieChartData}
            />
            <BarChart
              config={areaAndPieChartConfig}
              data={areaAndPieChartData}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
