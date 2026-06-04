"use client";

import { useTranslations } from "next-intl";

import { DomainSetupWizard } from "@/components/publishing/domain-setup-wizard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomDomain } from "@/types/publishing";

export function DomainManagement({ domains }: { domains: CustomDomain[] }) {
  const t = useTranslations("dashboard.publishingPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("customDomains")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {domains.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {t("emptyDomains")}
          </p>
        ) : null}
        {domains.map((domain) => (
          <div className="space-y-3" key={domain.id}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{domain.hostname}</p>
                <p className="text-sm text-muted-foreground">
                  {t("ssl")}: {domain.sslStatus}
                </p>
              </div>
              <Badge variant="outline">{domain.status}</Badge>
            </div>
            <div className="overflow-hidden rounded-md border border-border">
              {domain.dnsRecords.map((record) => (
                <div
                  className="grid grid-cols-[70px_1fr_1.6fr] gap-3 border-b border-border px-3 py-2 text-xs last:border-b-0"
                  key={`${record.type}-${record.host}`}
                >
                  <span className="font-medium">{record.type}</span>
                  <span className="text-muted-foreground">{record.host}</span>
                  <span className="break-all">{record.value}</span>
                </div>
              ))}
            </div>
            <DomainSetupWizard domain={domain} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
