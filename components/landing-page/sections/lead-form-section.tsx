"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackMetaPixelEvent } from "@/lib/analytics/meta-pixel";
import type {
  LandingPageSectionProps,
  LeadFormSectionData,
} from "@/types/rendering";

type LeadFormState = "idle" | "loading" | "success" | "error";

export function LeadFormSection({
  data,
  direction,
  editor,
  renderContext,
  sectionId,
  theme,
}: LandingPageSectionProps<LeadFormSectionData>) {
  const renderText = editor?.renderText;
  const textScale = (theme.typography.textScale ?? 100) / 100;
  const [state, setState] = React.useState<LeadFormState>("idle");
  const [errorMessage, setErrorMessage] = React.useState("");
  const isPreviewOnly =
    !renderContext?.pageId ||
    !renderContext.projectId ||
    !renderContext.pageSlug;

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editor || isPreviewOnly) {
      return;
    }

    setState("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify({
          customerEmail: String(formData.get("email") ?? ""),
          customerName: String(formData.get("name") ?? ""),
          customerPhone: String(formData.get("phone") ?? ""),
          landingPageTitle: renderContext.landingPageTitle,
          message: String(formData.get("message") ?? ""),
          pageId: renderContext.pageId,
          pageSlug: renderContext.pageSlug,
          productName: data.productName,
          projectId: renderContext.projectId,
          source: "landing_page_form",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Lead submission failed.");
      }

      form.reset();
      setState("success");
      trackMetaPixelEvent("Lead", {
        content_name: renderContext.landingPageTitle,
        content_type: "landing_page_form",
        page_id: renderContext.pageId,
      });
    } catch {
      setErrorMessage(
        direction === "rtl"
          ? "حصل خطأ أثناء إرسال البيانات. حاول مرة أخرى."
          : "Something went wrong. Please try again.",
      );
      setState("error");
    }
  }

  return (
    <section
      className="px-4 py-16 sm:px-6 lg:px-8"
      dir={direction}
      id={sectionId}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1fr] lg:items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] opacity-70">
            {renderText?.({ path: "eyebrow", value: data.eyebrow }) ??
              data.eyebrow}
          </p>
          <h2
            className="mt-4 text-balance break-words text-[clamp(1.85rem,7vw,2.5rem)] font-semibold leading-tight tracking-normal"
            style={{
              fontFamily: theme.typography.heading,
              fontSize: `calc(clamp(1.85rem, 7vw, 2.5rem) * ${textScale})`,
            }}
          >
            {renderText?.({
              multiline: true,
              path: "title",
              value: data.title,
            }) ?? data.title}
          </h2>
          <p
            className="mt-4 max-w-xl text-base leading-7"
            style={{
              color: theme.colors.muted,
              fontSize: `calc(1rem * ${textScale})`,
            }}
          >
            {renderText?.({
              multiline: true,
              path: "description",
              value: data.description,
            }) ?? data.description}
          </p>
        </div>

        <form
          className="rounded-lg border p-5 shadow-2xl sm:p-6"
          onSubmit={submitLead}
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius,
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={data.nameLabel}>
              <Input
                disabled={Boolean(editor)}
                maxLength={120}
                name="name"
                required
              />
            </Field>
            <Field label={data.phoneLabel}>
              <Input
                disabled={Boolean(editor)}
                maxLength={32}
                name="phone"
                required
                type="tel"
              />
            </Field>
            <Field label={data.emailLabel}>
              <Input
                disabled={Boolean(editor)}
                maxLength={180}
                name="email"
                type="email"
              />
            </Field>
            <Field label={data.productName ?? "Product"}>
              <Input
                disabled
                value={
                  data.productName || renderContext?.landingPageTitle || ""
                }
              />
            </Field>
          </div>

          <label className="mt-4 block text-sm font-medium">
            {data.messageLabel}
            <textarea
              className="mt-2 min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-luxury-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              disabled={Boolean(editor)}
              maxLength={1200}
              name="message"
            />
          </label>

          <Button
            className="mt-5 w-full"
            disabled={Boolean(editor) || state === "loading"}
            type="submit"
          >
            {state === "loading" ? <Loader2 className="animate-spin" /> : null}
            {renderText?.({ path: "submitLabel", value: data.submitLabel }) ??
              data.submitLabel}
          </Button>

          {state === "success" ? (
            <p className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="size-4" />
              {data.successMessage}
            </p>
          ) : null}
          {state === "error" ? (
            <p className="mt-4 text-sm text-destructive">{errorMessage}</p>
          ) : null}
          {isPreviewOnly ? (
            <p className="mt-4 text-xs text-muted-foreground">
              {direction === "rtl"
                ? "سيتم تفعيل تسجيل البيانات بعد نشر الصفحة."
                : "Lead capture activates after publishing this page."}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}
