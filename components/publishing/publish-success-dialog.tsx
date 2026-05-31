"use client";

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
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Page published</DialogTitle>
          <DialogDescription>
            Your landing page is live and ready to share.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
          {url}
        </div>
        <CopyUrlButton url={url} />
      </DialogContent>
    </Dialog>
  );
}
