"use client";

import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyUrlButton } from "@/components/publishing/copy-url-button";

type PublishSuccessDialogProps = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  url: string;
};

export function PublishSuccessDialog({
  onOpenChange,
  open,
  url,
}: PublishSuccessDialogProps) {
  const t = useTranslations("dashboard.publishingPage");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("pagePublished")}</DialogTitle>
          <DialogDescription>{t("pagePublishedDescription")}</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
          {url}
        </div>
        <CopyUrlButton url={url} />
      </DialogContent>
    </Dialog>
  );
}
