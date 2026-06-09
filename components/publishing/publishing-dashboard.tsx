"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  republishPageAction,
  unpublishPageAction,
} from "@/app/dashboard/publishing/actions";
import { PublishHistory } from "@/components/publishing/publish-history";
import { PublishedPagesList } from "@/components/publishing/published-pages-list";
import { PublishSuccessDialog } from "@/components/publishing/publish-success-dialog";
import { SeoSettingsPanel } from "@/components/publishing/seo-settings-panel";
import { useToast } from "@/hooks/use-toast";
import type {
  PublishedPage,
  PublishingDashboardSnapshot,
} from "@/types/publishing";

export function PublishingDashboard({
  snapshot,
}: {
  snapshot: PublishingDashboardSnapshot;
}) {
  const router = useRouter();
  const t = useTranslations("dashboard.publishingPage");
  const { toast } = useToast();
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);
  const latestVersions = snapshot.pages.flatMap((page) => page.versions);

  function handlePublish(page: PublishedPage) {
    setPublishedUrl(page.publicUrl);
  }

  async function handleRepublish(page: PublishedPage) {
    try {
      const result = await republishPageAction(page.id);
      setPublishedUrl(result.page.publicUrl);
      router.refresh();
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : t("republishFailed"),
        title: t("republishFailed"),
        variant: "destructive",
      });
    }
  }

  async function handleUnpublish(page: PublishedPage) {
    try {
      await unpublishPageAction(page.id);
      router.refresh();
      toast({
        description: t("pageUnpublishedDescription"),
        title: t("pageUnpublished"),
      });
    } catch (error) {
      toast({
        description:
          error instanceof Error ? error.message : t("unpublishFailed"),
        title: t("unpublishFailed"),
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <PublishedPagesList
            onPublish={handlePublish}
            onRepublish={handleRepublish}
            onUnpublish={handleUnpublish}
            pages={snapshot.pages}
          />
          <SeoSettingsPanel seo={snapshot.seo} />
        </div>
        <div className="space-y-6">
          <PublishHistory versions={latestVersions} />
        </div>
      </div>
      <PublishSuccessDialog
        onOpenChange={(open) => {
          if (!open) {
            setPublishedUrl(null);
          }
        }}
        open={Boolean(publishedUrl)}
        url={publishedUrl ?? ""}
      />
    </>
  );
}
