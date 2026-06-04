"use client";

"use client";

import { CheckCircle2, Circle, Lock, Server } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { CustomDomain } from "@/types/publishing";

export function DomainSetupWizard({ domain }: { domain: CustomDomain }) {
  const t = useTranslations("dashboard.publishingPage");
  const steps = [
    {
      done: true,
      icon: Server,
      title: t("addDnsRecords"),
    },
    {
      done: domain.status === "active" || domain.status === "verified",
      icon: CheckCircle2,
      title: t("verifyOwnership"),
    },
    {
      done: domain.sslStatus === "issued",
      icon: Lock,
      title: t("issueSsl"),
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">{domain.hostname}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("connectionStatus")}: {domain.status}
          </p>
        </div>
        <Button size="sm" type="button" variant="outline">
          {t("checkDns")}
        </Button>
      </div>
      <div className="mt-4 grid gap-2">
        {steps.map((step) => {
          const Icon = step.done ? step.icon : Circle;

          return (
            <div className="flex items-center gap-3 text-sm" key={step.title}>
              <Icon
                className={
                  step.done
                    ? "size-4 text-emerald-500"
                    : "size-4 text-muted-foreground"
                }
              />
              {step.title}
            </div>
          );
        })}
      </div>
    </div>
  );
}
