import type { PagePublishStatus } from "@/types/publishing";

export function getPublishStatusLabel(status: PagePublishStatus): string {
  const labels: Record<PagePublishStatus, string> = {
    draft: "Draft",
    failed: "Failed",
    published: "Published",
    publishing: "Publishing",
    unpublished: "Unpublished",
  };

  return labels[status];
}

export function getPublishStatusTone(status: PagePublishStatus) {
  if (status === "published") {
    return "success";
  }

  if (status === "publishing") {
    return "info";
  }

  if (status === "failed") {
    return "danger";
  }

  return "muted";
}
