import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { LayoutRenderer } from "@/components/landing-page/layout-renderer";
import { buildLandingPageMetadata } from "@/lib/rendering/seo";
import { getLandingPageTemplateBySlug } from "@/services/rendering";

type PreviewPageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PreviewPageProps): Metadata {
  const template = getLandingPageTemplateBySlug(params.slug);

  if (!template) {
    return {};
  }

  return buildLandingPageMetadata(template);
}

export default function PublicPreviewPage({ params }: PreviewPageProps) {
  const template = getLandingPageTemplateBySlug(params.slug);

  if (!template) {
    notFound();
  }

  return <LayoutRenderer template={template} />;
}
