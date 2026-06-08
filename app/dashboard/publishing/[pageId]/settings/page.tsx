import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/dashboard/page-header";
import { PagePrivateSettings } from "@/components/publishing";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { getPagePublishingSettingsSnapshot } from "@/services/publishing";

type PagePublishingSettingsRouteProps = {
  params: {
    pageId: string;
  };
};

export default async function PagePublishingSettingsRoute({
  params,
}: PagePublishingSettingsRouteProps) {
  const t = await getTranslations("dashboard.publishingPage");
  const user = await requireUser();
  const supabase = createClient();
  const snapshot = await getPagePublishingSettingsSnapshot(
    supabase,
    user.id,
    params.pageId,
  );

  if (!snapshot) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description={t("privateSettingsDescription")}
        eyebrow={t("privateSettingsEyebrow")}
        title={t("privateSettingsTitle")}
      />
      <PagePrivateSettings domains={snapshot.domains} page={snapshot.page} />
    </div>
  );
}
