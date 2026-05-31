"use client";

import * as React from "react";

import { DomainManagement } from "@/components/publishing/domain-management";
import { PublishHistory } from "@/components/publishing/publish-history";
import { PublishedPagesList } from "@/components/publishing/published-pages-list";
import { PublishSuccessDialog } from "@/components/publishing/publish-success-dialog";
import { SeoSettingsPanel } from "@/components/publishing/seo-settings-panel";
import type {
  PublishedPage,
  PublishingDashboardSnapshot,
} from "@/types/publishing";

export function PublishingDashboard({
  snapshot,
}: {
  snapshot: PublishingDashboardSnapshot;
}) {
  const [publishedUrl, setPublishedUrl] = React.useState<string | null>(null);
  const latestVersions = snapshot.pages.flatMap((page) => page.versions);

  function handlePublish(page: PublishedPage) {
    setPublishedUrl(page.publicUrl);
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <PublishedPagesList
            onPublish={handlePublish}
            pages={snapshot.pages}
          />
          <SeoSettingsPanel seo={snapshot.seo} />
        </div>
        <div className="space-y-6">
          <DomainManagement domains={snapshot.domains} />
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
