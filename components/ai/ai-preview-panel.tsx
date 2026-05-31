"use client";

import { CheckCircle2, FileText, Loader2, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AiGenerationResult } from "@/types/ai";

type AiPreviewPanelProps = {
  isSaving?: boolean;
  onSaveDraft?: () => void;
  result: AiGenerationResult | null;
  savedPageSlug?: string | null;
};

export function AiPreviewPanel({
  isSaving,
  onSaveDraft,
  result,
  savedPageSlug,
}: AiPreviewPanelProps) {
  if (!result) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            AI Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-96 flex-col items-center justify-center rounded-md border border-dashed border-border bg-secondary/30 p-6 text-center">
            <p className="text-sm font-medium">
              Generated content appears here
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Submit a brief to preview structured landing page copy before it
              moves into future editor workflows.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const content = result.content;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-600" />
            AI Preview
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
              <p className="text-sm font-medium">Ready to save</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save this AI output as a draft landing page in the project.
              </p>
              {savedPageSlug ? (
                <p className="mt-2 text-xs text-emerald-600">
                  Saved as /{savedPageSlug}
                </p>
              ) : null}
            </div>
            <Button
              disabled={isSaving || Boolean(savedPageSlug)}
              onClick={onSaveDraft}
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
              {savedPageSlug ? "Saved" : "Save draft"}
            </Button>
          </div>
        ) : null}

        <section>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Hero
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

        <PreviewList
          items={content.features.map((item) => item.title)}
          title="Features"
        />
        <PreviewList
          items={content.benefits.map((item) => item.title)}
          title="Benefits"
        />
        <PreviewList
          items={content.faq.map((item) => item.question)}
          title="FAQ"
        />

        <section className="rounded-md border border-border bg-secondary/30 p-4">
          <p className="text-sm font-medium">Pricing Copy</p>
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
          Tokens: {result.usage.totalTokens || 0} total
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
