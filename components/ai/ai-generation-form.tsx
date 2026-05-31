"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

import { AiPreviewPanel } from "@/components/ai/ai-preview-panel";
import { PageHeader } from "@/components/dashboard/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { AiGenerationInput, AiGenerationResult } from "@/types/ai";

type GenerationStatus =
  | "idle"
  | "validating"
  | "generating"
  | "parsing"
  | "success"
  | "error";

const initialInput: AiGenerationInput = {
  brandStyle: "Minimal luxury",
  businessName: "",
  businessType: "",
  goal: "",
  language: "en",
  targetAudience: "",
  toneOfVoice: "Confident and clear",
};

const progressLabels: Record<GenerationStatus, string> = {
  error: "Generation failed",
  generating: "Generating structured copy",
  idle: "Ready",
  parsing: "Validating JSON output",
  success: "Content generated",
  validating: "Validating brief",
};

export function AiGenerationForm() {
  const { toast } = useToast();
  const [input, setInput] = React.useState<AiGenerationInput>(initialInput);
  const [result, setResult] = React.useState<AiGenerationResult | null>(null);
  const [status, setStatus] = React.useState<GenerationStatus>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const isLoading =
    status === "validating" || status === "generating" || status === "parsing";

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
      const response = await fetch("/api/ai/generate", {
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description="Generate structured landing page copy from a concise business brief. Output is JSON only and never HTML."
        eyebrow="AI Engine"
        title="Content Generation"
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Generation Brief</CardTitle>
              <GenerationProgress status={status} />
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
                label="Business Name"
                name="businessName"
                onChange={(value) => updateInput("businessName", value)}
                placeholder="Acme Growth"
                value={input.businessName}
              />
              <Field
                label="Business Type"
                name="businessType"
                onChange={(value) => updateInput("businessType", value)}
                placeholder="B2B SaaS analytics platform"
                value={input.businessType}
              />
              <Field
                label="Target Audience"
                name="targetAudience"
                onChange={(value) => updateInput("targetAudience", value)}
                placeholder="Marketing teams at mid-market SaaS companies"
                value={input.targetAudience}
              />
              <Field
                label="Goal"
                name="goal"
                onChange={(value) => updateInput("goal", value)}
                placeholder="Increase demo bookings"
                value={input.goal}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Brand Style"
                  name="brandStyle"
                  onChange={(value) => updateInput("brandStyle", value)}
                  value={input.brandStyle}
                />
                <Field
                  label="Tone of Voice"
                  name="toneOfVoice"
                  onChange={(value) => updateInput("toneOfVoice", value)}
                  value={input.toneOfVoice}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
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
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Generate Content
              </Button>
            </form>
          </CardContent>
        </Card>

        <AiPreviewPanel result={result} />
      </div>
    </div>
  );
}

function Field({
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
      <Input
        id={name}
        minLength={2}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        value={value}
      />
    </div>
  );
}

function GenerationProgress({ status }: { status: GenerationStatus }) {
  const active = status !== "idle" && status !== "error";

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
      {progressLabels[status]}
    </div>
  );
}
