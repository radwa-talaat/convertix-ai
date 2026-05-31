import { PageHeader } from "@/components/dashboard/page-header";
import { PublishingDashboard } from "@/components/publishing";
import { getPublishingDashboardSnapshot } from "@/services/publishing";

export default function PublishingPage() {
  const snapshot = getPublishingDashboardSnapshot();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Publish landing pages, manage public URLs, configure custom domains, and tune SEO metadata for production delivery."
        eyebrow="Publishing"
        title="Publishing & Domains"
      />
      <PublishingDashboard snapshot={snapshot} />
    </div>
  );
}
