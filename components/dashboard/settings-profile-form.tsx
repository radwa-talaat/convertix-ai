"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { updateProfileAction } from "@/app/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SettingsProfileFormProps = {
  email: string;
  fullName: string;
};

export function SettingsProfileForm({
  email,
  fullName,
}: SettingsProfileFormProps) {
  const t = useTranslations("dashboard.settingsPage");
  const [name, setName] = React.useState(fullName);
  const [isPending, startTransition] = React.useTransition();
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = React.useState("");

  function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    startTransition(async () => {
      try {
        await updateProfileAction(name);
        setStatus("success");
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : t("profileSaveFailed"),
        );
      }
    });
  }

  return (
    <form className="space-y-4" onSubmit={submitProfile}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            maxLength={120}
            minLength={2}
            onChange={(event) => setName(event.target.value)}
            placeholder={t("namePlaceholder")}
            required
            value={name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input disabled id="email" type="email" value={email} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite" className="text-sm">
          {status === "success" ? (
            <span className="inline-flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="size-4" />
              {t("profileSaved")}
            </span>
          ) : null}
          {status === "error" ? (
            <span className="text-destructive">{errorMessage}</span>
          ) : null}
        </div>
        <Button disabled={isPending} type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : null}
          {t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}
