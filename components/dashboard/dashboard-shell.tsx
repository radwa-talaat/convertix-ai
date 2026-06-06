import {
  Activity,
  ArrowUpRight,
  MousePointerClick,
  PanelsTopLeft,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  {
    label: "Landing Pages",
    value: "24",
    detail: "Draft, live, and archived surfaces",
    icon: PanelsTopLeft,
  },
  {
    label: "Conversion",
    value: "8.4%",
    detail: "Across active campaigns",
    icon: MousePointerClick,
  },
  {
    label: "Velocity",
    value: "3.2x",
    detail: "Average creation lift",
    icon: Activity,
  },
];

export function DashboardShell() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/dashboard/projects">
              Manage Projects
              <ArrowUpRight />
            </Link>
          </Button>
        }
        description="Track the core workspace health and move quickly into the project surface."
        eyebrow="Workspace Overview"
        title="Build and ship polished pages from one command center."
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Production Pipeline</CardTitle>
            <CardDescription>
              A calm operations view for planning, review, and launch.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {["Brief", "Content", "Review", "Publish"].map((item, index) => (
                <div
                  className="flex items-center justify-between rounded-md border border-border bg-secondary/40 px-4 py-3"
                  key={item}
                >
                  <span className="text-sm font-medium">{item}</span>
                  <span className="text-xs text-muted-foreground">
                    Step {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Foundation signals for a healthy SaaS workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {["TypeScript strict", "Dark mode", "Reusable UI"].map((item) => (
              <div className="flex items-center gap-3" key={item}>
                <span className="size-2 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>AI landing-page generation</CardTitle>
          <CardDescription>
            Create or open a paid project before generating landing-page content
            and images.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/projects">
              Open projects
              <ArrowUpRight />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
