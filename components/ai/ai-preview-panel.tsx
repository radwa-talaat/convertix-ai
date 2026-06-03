"use client";

import { CheckCircle2, FileText, ImagePlus, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalizedPathname } from "@/hooks/i18n";
import type { AppLocale } from "@/lib/i18n/config";
import type { AiGenerationResult } from "@/types/ai";

type AiPreviewPanelProps = {
  isSaving?: boolean;
  generatedImageUrl?: string | null;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => void;
  onSaveDraft?: () => void;
  result: AiGenerationResult | null;
  savedPageId?: string | null;
  savedPageSlug?: string | null;
};

export function AiPreviewPanel({
  isSaving,
  generatedImageUrl,
  isGeneratingImage,
  onGenerateImage,
  onSaveDraft,
  result,
  savedPageId,
  savedPageSlug,
}: AiPreviewPanelProps) {
  const locale = useLocale() as AppLocale;
  const localizedPath = useLocalizedPathname();
  const isArabic = locale === "ar";

  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            {isArabic ? "معاينة الذكاء الاصطناعي" : "AI Preview"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-96 flex-col items-center justify-center rounded-md border border-dashed border-border bg-secondary/30 p-6 text-center">
            <p className="text-sm font-medium">
              {isArabic
                ? "سيظهر المحتوى المولد هنا"
                : "Generated content appears here"}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {isArabic
                ? "اكتب بيانات المشروع لمعاينة محتوى صفحة الهبوط قبل حفظه وتعديله."
                : "Submit a brief to preview structured landing page copy before it moves into future editor workflows."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = result.content;
  const design = result.design;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            {isArabic ? "معاينة الذكاء الاصطناعي" : "AI Preview"}
          </CardTitle>
          <Badge variant={result.fallbackUsed ? "secondary" : "success"}>
            {result.fallbackUsed ? "Fallback" : result.model}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {onSaveDraft ? (
          <div className="flex flex-col gap-3 rounded-md border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                {isArabic ? "جاهز للحفظ" : "Ready to save"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isArabic
                  ? "احفظ هذا الناتج كمسودة صفحة هبوط داخل المشروع."
                  : "Save this AI output as a draft landing page in the project."}
              </p>
              {savedPageSlug ? (
                <p className="mt-2 text-xs text-emerald-600">
                  {isArabic ? "تم الحفظ كـ" : "Saved as"} /{savedPageSlug}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                disabled={isSaving || Boolean(savedPageSlug)}
                onClick={onSaveDraft}
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                {savedPageSlug
                  ? isArabic
                    ? "تم الحفظ"
                    : "Saved"
                  : isArabic
                    ? "حفظ المسودة"
                    : "Save draft"}
              </Button>
              {savedPageId ? (
                <Button asChild variant="outline">
                  <Link
                    href={localizedPath(
                      `/dashboard/editor?page=${savedPageId}`,
                    )}
                  >
                    {isArabic ? "فتح المحرر" : "Open editor"}
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <section>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {isArabic ? "الهيرو" : "Hero"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-normal">
            {content.headline}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {content.subheadline}
          </p>
          <Badge className="mt-4" variant="outline">
            CTA: {content.cta}
          </Badge>
        </section>

        <section className="rounded-md border border-border bg-secondary/30 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {isArabic ? "اتجاه التصميم" : "Design Direction"}
              </p>
              <p className="mt-1 text-xs capitalize text-muted-foreground">
                {design.theme} · {design.typographyStyle} ·{" "}
                {design.imagePlacement}
              </p>
            </div>
            <Badge variant="outline">{design.heroBadge}</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {design.backgroundStyle}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(design.colors).map(([name, color]) => (
              <span
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground"
                key={name}
              >
                <span
                  className="size-4 rounded-sm border border-border"
                  style={{ backgroundColor: color }}
                />
                {name}
              </span>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            {design.designNotes.map((note) => (
              <p
                className="rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground"
                key={note}
              >
                {note}
              </p>
            ))}
          </div>
          {onGenerateImage ? (
            <div className="mt-4 rounded-md border border-border bg-background p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    {isArabic ? "صورة الهيرو" : "Hero image"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {design.imagePrompts.heroBackground}
                  </p>
                </div>
                <Button
                  disabled={isGeneratingImage}
                  onClick={onGenerateImage}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {isGeneratingImage ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <ImagePlus />
                  )}
                  {isArabic ? "توليد صورة" : "Generate image"}
                </Button>
              </div>
              {generatedImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Generated landing page hero visual"
                  className="mt-3 aspect-video w-full rounded-md border border-border object-cover"
                  src={generatedImageUrl}
                />
              ) : null}
            </div>
          ) : null}
        </section>

        <PreviewList
          items={content.features.map((item) => item.title)}
          title={isArabic ? "المميزات" : "Features"}
        />
        <PreviewList
          items={content.benefits.map((item) => item.title)}
          title={isArabic ? "الفوائد" : "Benefits"}
        />
        <PreviewList
          items={content.faq.map((item) => item.question)}
          title="FAQ"
        />

        <section className="rounded-md border border-border bg-secondary/30 p-4">
          <p className="text-sm font-medium">
            {isArabic ? "نص السعر" : "Pricing Copy"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {content.pricingCopy}
          </p>
        </section>

        <section className="rounded-md border border-border bg-secondary/30 p-4">
          <p className="text-sm font-medium">SEO</p>
          <p className="mt-2 text-sm">{content.seo.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {content.seo.description}
          </p>
        </section>

        <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
          {isArabic ? "التوكنز" : "Tokens"}: {result.usage.totalTokens || 0}{" "}
          {isArabic ? "إجمالي" : "total"}
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewList({ items, title }: { items: string[]; title: string }) {
  return (
    <section>
      <p className="text-sm font-medium">{title}</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div
            className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
