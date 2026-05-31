import { Bell, Shield, UserRound } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const settingsSections = [
  {
    title: "Profile",
    description: "Manage account identity fields.",
    icon: UserRound,
  },
  {
    title: "Security",
    description: "Session and access controls are protected by Supabase.",
    icon: Shield,
  },
  {
    title: "Notifications",
    description: "Product updates and account alerts.",
    icon: Bell,
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description="Account settings UI foundation with accessible form structure and clear sections."
        eyebrow="Workspace"
        title="Settings"
      />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {settingsSections.map((section) => {
            const Icon = section.icon;

            return (
              <Card key={section.title}>
                <CardHeader className="flex-row items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-secondary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Profile details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@company.com" type="email" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button">Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
