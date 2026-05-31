import { LivePreview } from "@/components/dashboard/live-preview";
import { PageHeader } from "@/components/dashboard/page-header";
import { getSampleLandingPageTemplate } from "@/services/rendering";

export default function DashboardPreviewPage() {
  const template = getSampleLandingPageTemplate();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <PageHeader
        description="Preview structured AI landing page JSON across desktop, tablet, and mobile without entering editor mode."
        eyebrow="Rendering System"
        title="Live Preview"
      />
      <LivePreview template={template} />
    </div>
  );
}
