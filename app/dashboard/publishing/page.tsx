import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/dashboard/page-header";
import { PublishingDashboard } from "@/components/publishing";
import { getPublishingDashboardSnapshot } from "@/services/publishing";

export default async function PublishingPage() {
  const t = await getTranslations("dashboard.publishingPage");
  const snapshot = getPublishingDashboardSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        description={t("description")}
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <PublishingDashboard snapshot={snapshot} />
    </div>
  );
}
