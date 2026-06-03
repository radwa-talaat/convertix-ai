"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { createLandingPageFromAiAction } from "@/app/dashboard/projects/actions";
import { AiPreviewPanel } from "@/components/ai/ai-preview-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createApiPath } from "@/lib/api/urls";
import type { AppLocale } from "@/lib/i18n/config";
import type { AiGenerationInput, AiGenerationResult } from "@/types/ai";

type GenerationStatus =
  | "idle"
  | "validating"
  | "generating"
  | "parsing"
  | "saving"
  | "success"
  | "error";

const initialInputDefaults: AiGenerationInput = {
  brandStyle: "Minimal luxury",
  businessName: "",
  businessType: "",
  customerProblem: "",
  dialect: "",
  goal: "",
  keyBenefits: "",
  language: "en",
  offer: "",
  orderMethod: "",
  productCategory: "",
  productPrice: "",
  salesCountry: "",
  targetAudience: "",
  toneOfVoice: "Confident and clear",
};

const progressLabels: Record<GenerationStatus, string> = {
  error: "Generation failed",
  generating: "Generating structured copy",
  idle: "Ready",
  parsing: "Validating JSON output",
  saving: "Saving draft page",
  success: "Content generated",
  validating: "Validating brief",
};

type AiGenerationFormProps = {
  initialInput?: Partial<AiGenerationInput>;
  projectId?: string;
  projectName?: string;
};

export function AiGenerationForm({
  initialInput,
  projectId,
  projectName,
}: AiGenerationFormProps = {}) {
  const locale = useLocale() as AppLocale;
  const commonT = useTranslations("common");
  const { toast } = useToast();
  const [input, setInput] = React.useState<AiGenerationInput>({
    ...initialInputDefaults,
    ...initialInput,
    businessName: initialInput?.businessName ?? projectName ?? "",
    brandStyle: initialInput?.brandStyle ?? initialInputDefaults.brandStyle,
    businessType: initialInput?.businessType ?? "",
    goal: initialInput?.goal ?? "",
    language: initialInput?.language ?? locale,
    targetAudience: initialInput?.targetAudience ?? "",
    toneOfVoice: initialInput?.toneOfVoice ?? initialInputDefaults.toneOfVoice,
  });
  const [result, setResult] = React.useState<AiGenerationResult | null>(null);
  const [status, setStatus] = React.useState<GenerationStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [savedPageId, setSavedPageId] = React.useState<string | null>(null);
  const [savedPageSlug, setSavedPageSlug] = React.useState<string | null>(null);
  const [imageName, setImageName] = React.useState<string | null>(null);

  const isLoading =
    status === "validating" ||
    status === "generating" ||
    status === "parsing" ||
    status === "saving";

  function updateInput<Key extends keyof AiGenerationInput>(
    key: Key,
    value: AiGenerationInput[Key],
  ) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function submitGeneration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("validating");

    try {
      setStatus("generating");
      const response = await fetch(createApiPath("/ai/generate"), {
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json()) as
        | AiGenerationResult
        | { message?: string };

      if (!response.ok) {
        throw new Error(
          "message" in payload && payload.message
            ? payload.message
            : "AI generation failed.",
        );
      }

      setStatus("parsing");
      setResult(payload as AiGenerationResult);
      setSavedPageId(null);
      setSavedPageSlug(null);
      setStatus("success");
      toast({
        description: "Structured JSON content is ready for review.",
        title: "AI content generated",
      });
    } catch (generationError) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "AI generation failed.";
      setError(message);
      setStatus("error");
      toast({
        description: message,
        title: "Generation failed",
        variant: "destructive",
      });
    }
  }

  async function saveDraftPage() {
    if (!projectId || !result) {
      return;
    }

    setError(null);
    setStatus("saving");

    try {
      const page = await createLandingPageFromAiAction(
        projectId,
        result.content,
        input.language,
        input.productImageUrl,
        result.design,
      );
      setSavedPageId(page.id);
      setSavedPageSlug(page.slug);
      setStatus("success");
      toast({
        description: "The generated landing page was saved as a draft.",
        title: "Draft page saved",
      });
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Draft page could not be saved.";
      setError(message);
      setStatus("error");
      toast({
        description: message,
        title: "Save failed",
        variant: "destructive",
      });
    }
  }

  function handleProductImageUpload(file?: File) {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 900_000) {
      setError("Image is too large. Please upload an image under 900KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      updateInput("productImageUrl", value);
      setImageName(file.name);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description={
          locale === "ar"
            ? "أنشئ محتوى صفحة هبوط منظم من وصف بسيط للمشروع. الناتج JSON فقط وليس HTML."
            : "Generate structured landing page copy from a concise business brief. Output is JSON only and never HTML."
        }
        eyebrow={locale === "ar" ? "محرك الذكاء الاصطناعي" : "AI Engine"}
        title={
          projectName
            ? locale === "ar"
              ? `منشئ ${projectName} بالذكاء الاصطناعي`
              : `${projectName} AI Builder`
            : locale === "ar"
              ? "إنشاء المحتوى"
              : "Content Generation"
        }
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>
                {locale === "ar" ? "بيانات التوليد" : "Generation Brief"}
              </CardTitle>
              <GenerationProgress locale={locale} status={status} />
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert className="mb-4 border-destructive/30 text-destructive">
                <AlertCircle className="mr-2 inline size-4" />
                {error}
              </Alert>
            ) : null}
            <form className="space-y-4" onSubmit={submitGeneration}>
              <Field
                label={locale === "ar" ? "اسم النشاط" : "Business Name"}
                name="businessName"
                onChange={(value) => updateInput("businessName", value)}
                placeholder="Acme Growth"
                value={input.businessName}
              />
              <Field
                label={locale === "ar" ? "نوع النشاط" : "Business Type"}
                name="businessType"
                onChange={(value) => updateInput("businessType", value)}
                placeholder="B2B SaaS analytics platform"
                value={input.businessType}
              />
              <Field
                label={locale === "ar" ? "الجمهور المستهدف" : "Target Audience"}
                name="targetAudience"
                onChange={(value) => updateInput("targetAudience", value)}
                placeholder="Marketing teams at mid-market SaaS companies"
                value={input.targetAudience}
              />
              <Field
                label={locale === "ar" ? "الهدف" : "Goal"}
                name="goal"
                onChange={(value) => updateInput("goal", value)}
                placeholder="Increase demo bookings"
                value={input.goal}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={locale === "ar" ? "ستايل البراند" : "Brand Style"}
                  name="brandStyle"
                  onChange={(value) => updateInput("brandStyle", value)}
                  value={input.brandStyle}
                />
                <Field
                  label={locale === "ar" ? "نبرة الصوت" : "Tone of Voice"}
                  name="toneOfVoice"
                  onChange={(value) => updateInput("toneOfVoice", value)}
                  value={input.toneOfVoice}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={locale === "ar" ? "فئة المنتج" : "Product Category"}
                  name="productCategory"
                  onChange={(value) => updateInput("productCategory", value)}
                  placeholder="Perfume, supplement, clinic, course"
                  required={false}
                  value={input.productCategory ?? ""}
                />
                <Field
                  label={locale === "ar" ? "سعر المنتج" : "Product Price"}
                  name="productPrice"
                  onChange={(value) => updateInput("productPrice", value)}
                  placeholder="50 EGP, 1 USD, 99 SAR"
                  required={false}
                  value={input.productPrice ?? ""}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={locale === "ar" ? "العرض" : "Offer"}
                  name="offer"
                  onChange={(value) => updateInput("offer", value)}
                  placeholder="Free delivery, limited discount, bundle"
                  required={false}
                  value={input.offer ?? ""}
                />
                <Field
                  label={locale === "ar" ? "طريقة الطلب" : "Order Method"}
                  name="orderMethod"
                  onChange={(value) => updateInput("orderMethod", value)}
                  placeholder="WhatsApp, form submission, call now"
                  required={false}
                  value={input.orderMethod ?? ""}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={locale === "ar" ? "بلد البيع" : "Sales Country"}
                  name="salesCountry"
                  onChange={(value) => updateInput("salesCountry", value)}
                  placeholder="Egypt, Saudi Arabia, UAE"
                  required={false}
                  value={input.salesCountry ?? ""}
                />
                <Field
                  label={locale === "ar" ? "اللهجة" : "Dialect"}
                  name="dialect"
                  onChange={(value) => updateInput("dialect", value)}
                  placeholder="Egyptian Arabic, Saudi Arabic, formal"
                  required={false}
                  value={input.dialect ?? ""}
                />
              </div>
              <TextareaField
                label={locale === "ar" ? "مشكلة العميل" : "Customer Problem"}
                name="customerProblem"
                onChange={(value) => updateInput("customerProblem", value)}
                placeholder="What pain or desire should the page speak to?"
                value={input.customerProblem ?? ""}
              />
              <TextareaField
                label={locale === "ar" ? "أهم الفوائد" : "Key Benefits"}
                name="keyBenefits"
                onChange={(value) => updateInput("keyBenefits", value)}
                placeholder="List the strongest product benefits in plain language."
                value={input.keyBenefits ?? ""}
              />
              <div className="space-y-2">
                <Label htmlFor="productImage">
                  {locale === "ar" ? "صورة المنتج" : "Product image"}
                </Label>
                <div className="flex flex-col gap-3 rounded-md border border-dashed border-border bg-secondary/30 p-4">
                  <label
                    className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-luxury-sm transition-colors hover:bg-secondary"
                    htmlFor="productImage"
                  >
                    <ImagePlus className="size-4" />
                    {locale === "ar"
                      ? "رفع صورة المنتج"
                      : "Upload product image"}
                  </label>
                  <input
                    accept="image/*"
                    className="sr-only"
                    id="productImage"
                    onChange={(event) =>
                      handleProductImageUpload(event.target.files?.[0])
                    }
                    type="file"
                  />
                  <Input
                    onChange={(event) => {
                      updateInput("productImageUrl", event.target.value);
                      setImageName(null);
                    }}
                    placeholder={
                      locale === "ar"
                        ? "أو الصق رابط صورة"
                        : "Or paste an image URL"
                    }
                    value={
                      input.productImageUrl?.startsWith("data:image/")
                        ? ""
                        : (input.productImageUrl ?? "")
                    }
                  />
                  {imageName ? (
                    <p className="text-xs text-muted-foreground">
                      {locale === "ar" ? "تم الرفع" : "Uploaded"}: {imageName}
                    </p>
                  ) : null}
                  {input.productImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt="Product preview"
                      className="h-32 w-full rounded-md border border-border object-cover"
                      src={input.productImageUrl}
                    />
                  ) : null}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">{commonT("language")}</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-luxury-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  id="language"
                  onChange={(event) =>
                    updateInput(
                      "language",
                      event.target.value === "ar" ? "ar" : "en",
                    )
                  }
                  value={input.language}
                >
                  <option value="en">{commonT("english")}</option>
                  <option value="ar">{commonT("arabic")}</option>
                </select>
              </div>
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                {commonT("generate")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiPreviewPanel
          isSaving={status === "saving"}
          onSaveDraft={projectId && result ? saveDraftPage : undefined}
          result={result}
          savedPageId={savedPageId}
          savedPageSlug={savedPageSlug}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  onChange,
  placeholder,
  required = true,
  value,
}: {
  label: string;
  name: keyof AiGenerationInput;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        minLength={required ? 2 : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </div>
  );
}

function TextareaField({
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  name: keyof AiGenerationInput;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <textarea
        className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-luxury-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        id={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

function GenerationProgress({
  locale,
  status,
}: {
  locale: AppLocale;
  status: GenerationStatus;
}) {
  const active = status !== "idle" && status !== "error";
  const labels: Record<GenerationStatus, string> =
    locale === "ar"
      ? {
          error: "فشل التوليد",
          generating: "جاري إنشاء المحتوى",
          idle: "جاهز",
          parsing: "مراجعة JSON",
          saving: "حفظ المسودة",
          success: "تم إنشاء المحتوى",
          validating: "مراجعة البيانات",
        }
      : progressLabels;

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground">
      {active ? (
        <motion.span
          animate={{ opacity: [0.45, 1, 0.45] }}
          className="size-2 rounded-full bg-accent"
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      ) : (
        <span className="size-2 rounded-full bg-muted-foreground/40" />
      )}
      {labels[status]}
    </div>
  );
}
