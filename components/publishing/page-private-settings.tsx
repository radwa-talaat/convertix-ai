"use client";

import * as React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import {
  createPageCustomDomainAction,
  updateMetaPixelSettingsAction,
  updateTrackingPixelSettingsAction,
} from "@/app/dashboard/publishing/actions";
import { PublishStatusBadge } from "@/components/publishing/publish-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  isValidExternalPixelId,
  isValidMetaPixelId,
} from "@/lib/analytics/meta-pixel";
import type { AppLocale } from "@/lib/i18n/config";
import type {
  CustomDomain,
  DomainDnsRecord,
  PublishedPage,
  TrackingPixelSettings,
} from "@/types/publishing";

type PagePrivateSettingsProps = {
  domains: CustomDomain[];
  page: PublishedPage;
};

export function PagePrivateSettings({
  domains,
  page,
}: PagePrivateSettingsProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("dashboard.publishingPage");
  const backHref = `/${locale}/dashboard/publishing`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-luxury-sm md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <Button asChild className="mb-4" size="sm" variant="outline">
            <Link href={backHref}>
              <ArrowLeft className="size-4 rtl:rotate-180" />
              {t("backToPublishing")}
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-normal">
              {page.title}
            </h2>
            <PublishStatusBadge status={page.status} />
          </div>
          <p className="mt-2 break-all text-sm text-muted-foreground">
            {page.publicUrl}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("version")} {page.versions[0]?.version ?? 0} · {t("updated")}{" "}
            {new Date(page.updatedAt).toLocaleDateString(locale)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/preview/${page.slug}`}>
              {t("preview")}
              <ExternalLink className="size-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href={page.publicUrl} rel="noreferrer" target="_blank">
              {t("open")}
              <ExternalLink className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MetaPixelCard page={page} />
        <SocialPixelCard
          description={t("tiktokPixelDescription")}
          initial={page.trackingPixels.tiktok}
          page={page}
          platform="tiktok"
          title={t("tiktokPixel")}
        />
        <SocialPixelCard
          description={t("snapchatPixelDescription")}
          initial={page.trackingPixels.snapchat}
          page={page}
          platform="snapchat"
          title={t("snapchatPixel")}
        />
      </div>

      <DomainSettingsCard domains={domains} page={page} />
    </div>
  );
}

function MetaPixelCard({ page }: { page: PublishedPage }) {
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5" />
          {t("metaPixel")}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("pageMetaPixelDescription")}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            checked={enabled}
            className="size-4 accent-foreground"
            onChange={(event) => setEnabled(event.target.checked)}
            type="checkbox"
          />
          {t("metaPixelEnable")}
        </label>
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
          <p className="text-xs leading-5 text-muted-foreground">
            {t("metaPixelEvents")}
          </p>
        </div>
        <Button disabled={pending || !valid} onClick={save} type="button">
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {t("metaPixelSave")}
        </Button>
      </CardContent>
    </Card>
  );
}

function SocialPixelCard({
  description,
  initial,
  page,
  platform,
  title,
}: {
  description: string;
  initial: TrackingPixelSettings;
  page: PublishedPage;
  platform: "snapchat" | "tiktok";
  title: string;
}) {
  const t = useTranslations("dashboard.publishingPage");
  const { toast } = useToast();
  const [pixelId, setPixelId] = React.useState(initial.pixelId ?? "");
  const [enabled, setEnabled] = React.useState(initial.enabled);
  const [pending, startTransition] = React.useTransition();
  const valid = pixelId.length === 0 || isValidExternalPixelId(pixelId);

  function save() {
    if (!valid || (enabled && !pixelId)) {
      toast({
        description: t("trackingPixelInvalid"),
        title: t("trackingPixelSaveFailed"),
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        await updateTrackingPixelSettingsAction({
          enabled,
          pageId: page.id,
          pixelId: pixelId || null,
          platform,
        });
        toast({
          description: t("trackingPixelSavedDescription"),
          title: t("trackingPixelSaved"),
        });
      } catch (error) {
        toast({
          description:
            error instanceof Error
              ? error.message
              : t("trackingPixelSaveFailed"),
          title: t("trackingPixelSaveFailed"),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="size-5" />
          {title}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            checked={enabled}
            className="size-4 accent-foreground"
            onChange={(event) => setEnabled(event.target.checked)}
            type="checkbox"
          />
          {t("metaPixelEnable")}
        </label>
        <div className="space-y-2">
          <Label htmlFor={`${platform}-pixel-${page.id}`}>
            {t("trackingPixelId")}
          </Label>
          <Input
            aria-invalid={!valid}
            autoComplete="off"
            id={`${platform}-pixel-${page.id}`}
            onChange={(event) =>
              setPixelId(
                event.target.value.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 80),
              )
            }
            placeholder={
              platform === "tiktok" ? "C1234567890ABCDE" : "snap-pixel-id"
            }
            value={pixelId}
          />
          <p className="text-xs leading-5 text-muted-foreground">
            {t("trackingPixelEvents")}
          </p>
        </div>
        <Button disabled={pending || !valid} onClick={save} type="button">
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {t("trackingPixelSave")}
        </Button>
      </CardContent>
    </Card>
  );
}

function DomainSettingsCard({
  domains,
  page,
}: {
  domains: CustomDomain[];
  page: PublishedPage;
}) {
  const t = useTranslations("dashboard.publishingPage");
  const { toast } = useToast();
  const [hostname, setHostname] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  function addDomain(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await createPageCustomDomainAction({
          hostname,
          pageId: page.id,
        });
        setHostname("");
        toast({
          description: t("domainCreatedDescription"),
          title: t("domainCreated"),
        });
      } catch (error) {
        toast({
          description:
            error instanceof Error ? error.message : t("domainCreateFailed"),
          title: t("domainCreateFailed"),
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="size-5" />
          {t("pageDomainSettings")}
        </CardTitle>
        <p className="text-sm leading-6 text-muted-foreground">
          {t("pageDomainDescription")}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          className="grid gap-3 rounded-lg border border-border bg-secondary/20 p-4 md:grid-cols-[1fr_auto]"
          onSubmit={addDomain}
        >
          <div className="space-y-2">
            <Label htmlFor="custom-domain">{t("domainInputLabel")}</Label>
            <Input
              id="custom-domain"
              onChange={(event) => setHostname(event.target.value)}
              placeholder="shop.yourdomain.com"
              required
              value={hostname}
            />
            <p className="text-xs leading-5 text-muted-foreground">
              {t("domainInputHelp")}
            </p>
          </div>
          <Button className="self-end" disabled={pending} type="submit">
            {pending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            {t("addDomain")}
          </Button>
        </form>

        {domains.length === 0 ? (
          <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            {t("emptyDomains")}
          </div>
        ) : null}

        {domains.map((domain) => (
          <DomainInstructionCard domain={domain} key={domain.id} />
        ))}
      </CardContent>
    </Card>
  );
}

function DomainInstructionCard({ domain }: { domain: CustomDomain }) {
  const t = useTranslations("dashboard.publishingPage");

  return (
    <div className="space-y-5 rounded-lg border border-border bg-background p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold">{domain.hostname}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("connectionStatus")}: {domain.status} · {t("ssl")}:{" "}
            {domain.sslStatus}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
          <ShieldCheck className="size-4 text-emerald-500" />
          {domain.status === "active" || domain.status === "verified"
            ? t("domainVerified")
            : t("domainPending")}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-secondary/20 p-4">
        <p className="font-semibold">{t("domainStepsTitle")}</p>
        <ol className="mt-4 grid gap-3 text-sm leading-6">
          <li>{t("domainStepProvider")}</li>
          <li>{t("domainStepDns")}</li>
          <li>{t("domainStepAddRecords")}</li>
          <li>{t("domainStepWait")}</li>
        </ol>
      </div>

      <div className="space-y-3">
        <p className="font-semibold">{t("dnsRecordsTitle")}</p>
        <div className="overflow-hidden rounded-md border border-border">
          {domain.dnsRecords.map((record) => (
            <DnsRecordRow
              key={`${record.type}-${record.host}-${record.value}`}
              record={record}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DnsRecordRow({ record }: { record: DomainDnsRecord }) {
  const t = useTranslations("dashboard.publishingPage");

  return (
    <div className="grid gap-3 border-b border-border p-3 text-sm last:border-b-0 md:grid-cols-[1fr_90px_1.4fr_90px_auto] md:items-center">
      <DnsValue label={t("dnsHost")} value={record.host} />
      <DnsValue label={t("dnsType")} value={record.type} />
      <DnsValue label={t("dnsValue")} value={record.value} />
      <DnsValue label="TTL" value="3600" />
      <CopyDnsValue value={record.value} />
    </div>
  );
}

function DnsValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="break-all font-medium">{value}</p>
    </div>
  );
}

function CopyDnsValue({ value }: { value: string }) {
  const t = useTranslations("dashboard.publishingPage");
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button onClick={copy} size="sm" type="button" variant="outline">
      {copied ? (
        <CheckCircle2 className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
      {copied ? t("copied") : t("copyValue")}
    </Button>
  );
}
