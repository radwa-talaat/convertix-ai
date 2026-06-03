import { Bell, Shield, UserRound } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { SettingsProfileForm } from "@/components/dashboard/settings-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

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

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", user.id)
    .maybeSingle();
  const email = profile?.email ?? user.email ?? "";
  const fullName =
    profile?.full_name ??
    (typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : "");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description="Manage the account identity used across your dashboard."
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
          <CardContent>
            <SettingsProfileForm email={email} fullName={fullName} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
