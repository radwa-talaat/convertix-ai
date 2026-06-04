"use client";

import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/i18n/config";
import type { PublishVersion } from "@/types/publishing";

export function PublishHistory({ versions }: { versions: PublishVersion[] }) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("dashboard.publishingPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("publishHistory")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {versions.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {t("emptyHistory")}
          </p>
        ) : null}
        {versions.map((version) => (
          <div
            className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
            key={version.id}
          >
            <div>
              <p className="font-medium">
                {t("version")} {version.version}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(version.createdAt).toLocaleString(locale)}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {t(`status.${version.status}`)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
