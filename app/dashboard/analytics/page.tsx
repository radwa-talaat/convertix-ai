import { AnalyticsDashboard } from "@/components/analytics";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAnalyticsReport } from "@/services/analytics";

export default async function AnalyticsPage() {
  const snapshot = await getAnalyticsReport();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track visits, conversions, devices, traffic sources, funnels, and AI-powered conversion recommendations."
        eyebrow="Growth"
        title="Analytics"
      />
      <AnalyticsDashboard snapshot={snapshot} />
    </div>
  );
}
