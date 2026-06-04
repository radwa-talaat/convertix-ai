import { AnalyticsDashboard } from "@/components/analytics";
import { PageHeader } from "@/components/dashboard/page-header";
import { getServerTranslator } from "@/lib/i18n/server";
import { getAnalyticsReport } from "@/services/analytics";

export default async function AnalyticsPage() {
  const t = await getServerTranslator("dashboard");
  const snapshot = await getAnalyticsReport();

  return (
    <div className="space-y-6">
      <PageHeader
        description={t("analyticsPage.description")}
        eyebrow={t("analyticsPage.eyebrow")}
        title={t("analyticsPage.title")}
      />
      <AnalyticsDashboard snapshot={snapshot} />
    </div>
  );
}
