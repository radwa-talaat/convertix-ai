"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertCircle, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";

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
import type {
  AiGenerationInput,
  AiGenerationResult,
  AiLandingPageContent,
  AiLandingPageDesign,
  AiLanguage,
} from "@/types/ai";

type GenerationStatus = "idle" | "loading" | "success" | "error";

interface AiGenerationFormProps {
  projectId?: string;
  projectName?: string;
  initialContent?: AiLandingPageContent | null;
  initialDesign?: AiLandingPageDesign | null;
  initialInput?: Partial<AiGenerationInput>;
  savedPageSlug?: string | null;
  showHeader?: boolean;
}

const initialInputDefaults: AiGenerationInput = {
  businessName: "",
  businessType: "",
  targetAudience: "",
  goal: "",
  brandStyle: "Premium conversion-focused landing page",
  language: "en",
  toneOfVoice: "Confident and clear",
  productCategory: "",
  productPrice: "",
  offer: "",
  orderMethod: "Lead form or WhatsApp",
  salesCountry: "",
  dialect: "",
  customerProblem: "",
  keyBenefits: "",
};

const copy = {
  ar: {
    eyebrow: "محرك الذكاء الاصطناعي",
    title: "إنشاء صفحة هبوط",
    description: "املأ أهم بيانات المنتج، وسننشئ محتوى وتسلسل أقسام مناسب للبيع والتحويل.",
    formTitle: "بيانات المنتج",
    businessName: "اسم المنتج / النشاط",
    businessType: "نوع المنتج / الخدمة",
    targetAudience: "الجمهور المستهدف",
    goal: "الهدف من الصفحة",
    toneOfVoice: "نبرة المحتوى",
    offer: "السعر أو عرض المنتج",
    keyBenefits: "أهم فوائد المنتج",
    customerProblem: "مشكلات العميل",
    productImage: "صورة المنتج",
    productImageUrl: "أو الصق رابط صورة المنتج",
    uploadImage: "رفع صورة المنتج",
    imageReady: "تم تجهيز صورة المنتج",
    generate: "إنشاء المحتوى",
    generating: "جاري الإنشاء",
    saveDraft: "حفظ كمسودة",
    placeholders: {
      businessName: "مثال: Stronger With You",
      businessType: "مثال: برفان رجالي فاخر",
      targetAudience: "مثال: شباب ورجال يبحثون عن ثبات وفخامة",
      goal: "مثال: زيادة طلبات الشراء من صفحة الهبوط",
      toneOfVoice: "مثال: فاخر، مباشر، مقنع",
      offer: "مثال: 650 جنيه بدل 850 لفترة محدودة",
      keyBenefits: "اكتب كل فائدة في سطر: ثبات طويل، رائحة فاخرة، مناسب للهدايا",
      customerProblem: "اكتب كل مشكلة في سطر: رائحة لا تثبت، سعر مبالغ فيه، صعوبة اختيار هدية",
      productImageUrl: "https://example.com/product.png",
    },
    alerts: {
      success: "تم إنشاء المحتوى بنجاح.",
      error: "تعذر إنشاء المحتوى.",
      saveSuccess: "تم حفظ صفحة الهبوط كمسودة.",
      saveError: "تعذر حفظ المسودة.",
      imageTooLarge: "الصورة كبيرة. استخدم صورة أقل من 1.5MB.",
    },
    progress: {
      brief: "تحليل المنتج والجمهور",
      copy: "كتابة الرسائل التسويقية",
      design: "اقتراح ألوان وأقسام مناسبة",
      validate: "مراجعة الجودة قبل العرض",
    },
  },
  en: {
    eyebrow: "AI Engine",
    title: "Generate a landing page",
    description: "Add the core product details and Convertix will create conversion-focused copy and a matching section plan.",
    formTitle: "Product brief",
    businessName: "Product / business name",
    businessType: "Product / service type",
    targetAudience: "Target audience",
    goal: "Page goal",
    toneOfVoice: "Tone of content",
    offer: "Price or offer",
    keyBenefits: "Top product benefits",
    customerProblem: "Customer problems",
    productImage: "Product image",
    productImageUrl: "Or paste a product image URL",
    uploadImage: "Upload product image",
    imageReady: "Product image ready",
    generate: "Generate content",
    generating: "Generating",
    saveDraft: "Save draft",
    placeholders: {
      businessName: "Example: Stronger With You",
      businessType: "Example: premium men's perfume",
      targetAudience: "Example: men looking for long-lasting luxury scents",
      goal: "Example: increase landing page purchase requests",
      toneOfVoice: "Example: premium, direct, persuasive",
      offer: "Example: EGP 650 instead of EGP 850 for a limited time",
      keyBenefits: "One benefit per line: long-lasting, premium scent, gift-ready",
      customerProblem: "One problem per line: weak scent, overpriced perfumes, hard gift choices",
      productImageUrl: "https://example.com/product.png",
    },
    alerts: {
      success: "Content generated successfully.",
      error: "Content generation failed.",
      saveSuccess: "Landing page draft saved.",
      saveError: "Draft could not be saved.",
      imageTooLarge: "The image is too large. Use an image under 1.5MB.",
    },
    progress: {
      brief: "Reading the product brief",
      copy: "Writing conversion copy",
      design: "Choosing sections and styling",
      validate: "Validating output quality",
    },
  },
} as const;

export function AiGenerationForm({
  projectId,
  projectName,
  initialContent,
  initialDesign,
  initialInput,
  savedPageSlug,
  showHeader = true,
}: AiGenerationFormProps) {
  const locale = useLocale();
  const activeLanguage: AiLanguage = locale === "ar" ? "ar" : "en";
  const isArabic = locale === "ar";
  const t = isArabic ? copy.ar : copy.en;
  const { toast } = useToast();
  const [input, setInput] = React.useState<AiGenerationInput>(() => ({
    ...initialInputDefaults,
    ...initialInput,
    businessName: initialInput?.businessName ?? projectName ?? "",
    language: activeLanguage,
  }));
  const [result, setResult] = React.useState<AiGenerationResult | null>(
    initialContent && initialDesign
      ? {
          content: initialContent,
          design: initialDesign,
          fallbackUsed: false,
          model: "saved",
          usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
        }
      : null,
  );
  const [status, setStatus] = React.useState<GenerationStatus>(initialContent ? "success" : "idle");
  const [error, setError] = React.useState<string | null>(null);
  const [progressStep, setProgressStep] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [generatedHeroImageUrl, setGeneratedHeroImageUrl] = React.useState<string | null>(null);

  const progressLabels = React.useMemo(
    () => [t.progress.brief, t.progress.copy, t.progress.design, t.progress.validate],
    [t],
  );

  React.useEffect(() => {
    setInput((current) => ({
      ...current,
      language: activeLanguage,
      dialect: activeLanguage === "ar" ? "Arabic, clear and locally persuasive" : "",
      orderMethod: activeLanguage === "ar" ? "نموذج طلب أو واتساب" : "Lead form or WhatsApp",
    }));
  }, [activeLanguage]);

  React.useEffect(() => {
    if (status !== "loading") {
      return;
    }

    setProgressStep(0);
    const interval = window.setInterval(() => {
      setProgressStep((step) => Math.min(step + 1, progressLabels.length - 1));
    }, 900);

    return () => window.clearInterval(interval);
  }, [progressLabels.length, status]);

  function updateField(field: keyof AiGenerationInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
  }

  function updateOffer(value: string) {
    setInput((current) => ({
      ...current,
      offer: value,
      productPrice: value,
    }));
  }

  function buildPayload(): AiGenerationInput {
    return {
      ...input,
      businessName: input.businessName.trim(),
      businessType: input.businessType.trim(),
      productCategory: input.businessType.trim(),
      targetAudience: input.targetAudience.trim(),
      goal: input.goal.trim(),
      toneOfVoice: input.toneOfVoice.trim(),
      productPrice: (input.offer ?? "").trim(),
      offer: (input.offer ?? "").trim(),
      keyBenefits: input.keyBenefits?.trim(),
      customerProblem: input.customerProblem?.trim(),
      brandStyle: "Premium, mobile-first, conversion-focused, visually tailored to the product",
      language: activeLanguage,
      dialect: activeLanguage === "ar" ? "Arabic copy suitable for Egyptian and Gulf audiences" : "",
    };
  }

  async function handleProductImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 1_500_000) {
      toast({
        variant: "destructive",
        title: t.alerts.imageTooLarge,
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("productImageUrl", String(reader.result));
      toast({ title: t.imageReady });
    };
    reader.readAsDataURL(file);
  }

  async function generateHeroImage(content: AiLandingPageContent) {
    try {
      const response = await fetch(createApiPath("/ai/images"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: [
            `Product: ${input.businessName}`,
            `Type: ${input.businessType}`,
            `Offer: ${input.offer ?? input.productPrice ?? "premium offer"}`,
            `Style: premium ecommerce landing page hero background, clean composition, product-focused, high contrast, no readable text`,
            `Language direction: ${locale === "ar" ? "RTL Arabic layout" : "LTR English layout"}`,
            `Headline context: ${content.headline}`,
          ].join("\n"),
          size: "1024x1024",
        }),
      });

      const payload = (await response.json()) as { imageUrl?: string };
      if (payload.imageUrl) {
        setGeneratedHeroImageUrl(payload.imageUrl);
      }
    } catch {
      setGeneratedHeroImageUrl(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setGeneratedHeroImageUrl(null);

    try {
      const payload = buildPayload();
      const response = await fetch(createApiPath("/ai/generate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, projectId }),
      });
      const data = (await response.json()) as AiGenerationResult & { error?: string };

      if (!response.ok || data.error) {
        throw new Error(data.error ?? t.alerts.error);
      }

      setResult(data);
      setStatus("success");
      toast({ title: t.alerts.success });
      void generateHeroImage(data.content);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : t.alerts.error;
      setError(message);
      setStatus("error");
      toast({
        variant: "destructive",
        title: t.alerts.error,
        description: message,
      });
    }
  }

  async function saveDraftPage() {
    if (!projectId || !result) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await createLandingPageFromAiAction(
        projectId,
        result.content,
        input.language,
        input.productImageUrl,
        result.design,
        generatedHeroImageUrl ?? undefined,
      );

      if (!response?.id) {
        throw new Error(t.alerts.saveError);
      }

      toast({
        title: t.alerts.saveSuccess,
        description: response.slug ? `/${response.slug}` : undefined,
      });
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : t.alerts.saveError;
      toast({
        variant: "destructive",
        title: t.alerts.saveError,
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {showHeader ? (
        <PageHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>{t.formTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <FormInput
                label={t.businessName}
                value={input.businessName}
                placeholder={t.placeholders.businessName}
                onChange={(value) => updateField("businessName", value)}
                required
              />
              <FormInput
                label={t.businessType}
                value={input.businessType}
                placeholder={t.placeholders.businessType}
                onChange={(value) => updateField("businessType", value)}
                required
              />
              <FormInput
                label={t.targetAudience}
                value={input.targetAudience}
                placeholder={t.placeholders.targetAudience}
                onChange={(value) => updateField("targetAudience", value)}
                required
              />
              <FormInput
                label={t.goal}
                value={input.goal}
                placeholder={t.placeholders.goal}
                onChange={(value) => updateField("goal", value)}
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormInput
                  label={t.toneOfVoice}
                  value={input.toneOfVoice}
                  placeholder={t.placeholders.toneOfVoice}
                  onChange={(value) => updateField("toneOfVoice", value)}
                />
                <FormInput
                  label={t.offer}
                  value={input.offer ?? ""}
                  placeholder={t.placeholders.offer}
                  onChange={updateOffer}
                />
              </div>
              <FormTextarea
                label={t.keyBenefits}
                value={input.keyBenefits ?? ""}
                placeholder={t.placeholders.keyBenefits}
                onChange={(value) => updateField("keyBenefits", value)}
              />
              <FormTextarea
                label={t.customerProblem}
                value={input.customerProblem ?? ""}
                placeholder={t.placeholders.customerProblem}
                onChange={(value) => updateField("customerProblem", value)}
              />

              <div className="rounded-md border border-border bg-muted/20 p-4">
                <Label className="text-sm font-semibold">{t.productImage}</Label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr]">
                  <Button type="button" variant="outline" asChild>
                    <label className="cursor-pointer">
                      <ImagePlus className="me-2 h-4 w-4" />
                      {t.uploadImage}
                      <input className="hidden" type="file" accept="image/*" onChange={handleProductImageUpload} />
                    </label>
                  </Button>
                  <Input
                    value={input.productImageUrl ?? ""}
                    placeholder={t.productImageUrl}
                    onChange={(event) => updateField("productImageUrl", event.target.value)}
                  />
                </div>
                {input.productImageUrl ? (
                  <p className="mt-2 text-xs text-muted-foreground">{t.imageReady}</p>
                ) : null}
              </div>

              {status === "loading" ? (
                <motion.div
                  className="rounded-md border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-muted-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    {t.generating}
                  </div>
                  <p className="mt-2">{progressLabels[progressStep]}</p>
                </motion.div>
              ) : null}

              {status === "error" && error ? (
                <Alert className="border-red-200 bg-red-50 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <p className="font-medium">{t.alerts.error}</p>
                  <p className="mt-1">{error}</p>
                </Alert>
              ) : null}

              <Button className="w-full" size="lg" type="submit" disabled={status === "loading"}>
                {status === "loading" ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Sparkles className="me-2 h-4 w-4" />}
                {status === "loading" ? t.generating : t.generate}
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiPreviewPanel
          result={result}
          onSaveDraft={saveDraftPage}
          isSaving={isSaving}
          generatedImageUrl={generatedHeroImageUrl}
          savedPageSlug={savedPageSlug}
        />
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  placeholder,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const id = React.useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const id = React.useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        placeholder={placeholder}
        rows={4}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
      />
    </div>
  );
}
