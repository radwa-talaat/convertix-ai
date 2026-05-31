import { Badge } from "@/components/ui/badge";
import { getPublishStatusLabel, getPublishStatusTone } from "@/lib/publishing";
import type { PagePublishStatus } from "@/types/publishing";

export function PublishStatusBadge({ status }: { status: PagePublishStatus }) {
  const tone = getPublishStatusTone(status);

  return (
    <Badge
      className={
        tone === "success"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
          : tone === "danger"
            ? "border-destructive/30 bg-destructive/10 text-destructive"
            : tone === "info"
              ? "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300"
              : undefined
      }
      variant="outline"
    >
      {getPublishStatusLabel(status)}
    </Badge>
  );
}
