"use client";

import {
  ExternalLink,
  Eye,
  RefreshCw,
  Rocket,
  RotateCcw,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { CopyUrlButton } from "@/components/publishing/copy-url-button";
import { PublishStatusBadge } from "@/components/publishing/publish-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppLocale } from "@/lib/i18n/config";
import type { PublishedPage } from "@/types/publishing";

type PublishedPagesListProps = {
  onPublish: (page: PublishedPage) => void;
  pages: PublishedPage[];
};

export function PublishedPagesList({
  onPublish,
  pages,
}: PublishedPagesListProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("dashboard.publishingPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("publishedPages")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pages.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-6 text-center">
            <p className="font-medium">{t("emptyPages")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("emptyPagesDescription")}
            </p>
          </div>
        ) : null}
        {pages.map((page) => (
          <article
            className="rounded-lg border border-border bg-secondary/20 p-4"
            key={page.id}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{page.title}</h3>
                  <PublishStatusBadge status={page.status} />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {page.publicUrl}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("version")} {page.versions[0]?.version ?? 0} ·{" "}
                  {t("updated")}{" "}
                  {new Date(page.updatedAt).toLocaleDateString(locale)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => onPublish(page)} size="sm" type="button">
                  <Rocket className="size-4" />
                  {t("publish")}
                </Button>
                <Button size="sm" type="button" variant="outline">
                  <RefreshCw className="size-4" />
                  {t("republish")}
                </Button>
                <Button size="sm" type="button" variant="ghost">
                  <RotateCcw className="size-4" />
                  {t("unpublish")}
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href={page.publicUrl} rel="noreferrer" target="_blank">
                    <ExternalLink className="size-4" />
                    {t("open")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/preview/${page.slug}`}>
                    <Eye className="size-4" />
                    {t("preview")}
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/${locale}/dashboard/publishing/${page.id}/settings`}
                  >
                    <Settings2 className="size-4" />
                    {t("privateSettings")}
                  </Link>
                </Button>
                <CopyUrlButton url={page.publicUrl} />
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}
