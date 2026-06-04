"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function CopyUrlButton({ url }: { url: string }) {
  const t = useTranslations("dashboard.publishingPage");
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button onClick={handleCopy} size="sm" type="button" variant="outline">
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? t("copied") : t("copyUrl")}
    </Button>
  );
}
