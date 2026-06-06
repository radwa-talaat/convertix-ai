"use client";

import * as React from "react";
import { Loader2, Save, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import { updateMetaPixelSettingsAction } from "@/app/dashboard/publishing/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { isValidMetaPixelId } from "@/lib/analytics/meta-pixel";
import type { MetaPixelPage } from "@/types/publishing";

export function MetaPixelSettingsPanel({ pages }: { pages: MetaPixelPage[] }) {
  const t = useTranslations("dashboard.publishingPage");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5" />
          {t("metaPixel")}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("metaPixelDescription")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {pages.length === 0 ? (
          <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            {t("metaPixelEmpty")}
          </p>
        ) : null}
        {pages.map((page) => (
          <MetaPixelPageSettings key={page.id} page={page} />
        ))}
      </CardContent>
    </Card>
  );
}

function MetaPixelPageSettings({ page }: { page: MetaPixelPage }) {
  const t = useTranslations("dashboard.publishingPage");
  const { toast } = useToast();
  const [pixelId, setPixelId] = React.useState(page.metaPixel.pixelId ?? "");
  const [enabled, setEnabled] = React.useState(page.metaPixel.enabled);
  const [pending, startTransition] = React.useTransition();
  const valid = pixelId.length === 0 || isValidMetaPixelId(pixelId);

  function save() {
    if (!valid || (enabled && !pixelId)) {
      toast({
        description: t("metaPixelInvalid"),
        title: t("metaPixelSaveFailed"),
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        await updateMetaPixelSettingsAction({
          enabled,
          pageId: page.id,
          pixelId: pixelId || null,
        });
        toast({
          description: t("metaPixelSavedDescription"),
          title: t("metaPixelSaved"),
        });
      } catch (error) {
        toast({
          description:
            error instanceof Error ? error.message : t("metaPixelSaveFailed"),
          title: t("metaPixelSaveFailed"),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">{page.title}</p>
          <p className="text-xs text-muted-foreground">/p/{page.slug}</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            checked={enabled}
            className="size-4 accent-foreground"
            onChange={(event) => setEnabled(event.target.checked)}
            type="checkbox"
          />
          {t("metaPixelEnable")}
        </label>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`pixel-${page.id}`}>{t("metaPixelId")}</Label>
        <Input
          aria-invalid={!valid}
          autoComplete="off"
          id={`pixel-${page.id}`}
          inputMode="numeric"
          onChange={(event) =>
            setPixelId(event.target.value.replace(/\D/g, "").slice(0, 32))
          }
          placeholder="123456789012345"
          value={pixelId}
        />
        <p className="text-xs text-muted-foreground">{t("metaPixelEvents")}</p>
      </div>
      <Button
        disabled={pending || !valid}
        onClick={save}
        size="sm"
        type="button"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        {t("metaPixelSave")}
      </Button>
    </div>
  );
}
