import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export function BrandMark() {
  return (
    <Link
      aria-label={siteConfig.name}
      className="flex items-center gap-3"
      href="/"
    >
      <span className="flex size-10 items-center justify-center rounded-md border border-border bg-background shadow-luxury-sm">
        <Image
          alt=""
          className="size-7 object-contain"
          height={28}
          src="/brand/convertix-icon.png"
          width={28}
        />
      </span>
      <span className="text-base font-semibold tracking-normal">
        {siteConfig.name}
      </span>
    </Link>
  );
}
