import Link from "next/link";
import { Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";

export function BrandMark() {
  return (
    <Link className="flex items-center gap-3" href="/">
      <span className="flex size-9 items-center justify-center rounded-md border border-border bg-primary text-primary-foreground shadow-luxury-sm">
        <Sparkles className="size-4" />
      </span>
      <span className="text-sm font-semibold tracking-normal">
        {siteConfig.name}
      </span>
    </Link>
  );
}
