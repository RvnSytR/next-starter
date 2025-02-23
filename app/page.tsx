import { CustomButton } from "@/components/custom/custom-button";
import { ThemeToggle } from "@/components/custom/theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          withLoading
        />

        <CustomButton
          customType="link"
          href="/coverage"
          icon={<FlaskConical />}
          variant="outline"
          text="Go to Testing Page (Coverage)"
          withLoading
        />
      </div>

      <Separator />

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Card Description</CardDescription>
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
          <CardDescription>Card Description</CardDescription>
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

      {/* Button Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Button Sizes</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
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
        </CardContent>
      </Card>

      {/* Button Variant */}
      <Card>
        <CardHeader>
          <CardTitle>Button Variant</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
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
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" className="rounded-md border" />
        </CardContent>
      </Card>
    </div>
  );
}
