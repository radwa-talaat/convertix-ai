import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { typography } from "@/styles/typography";

type TypographyProps = HTMLAttributes<HTMLElement>;

export function DisplayText({ className, ...props }: TypographyProps) {
  return <h1 className={cn(typography.display, className)} {...props} />;
}

export function SectionTitle({ className, ...props }: TypographyProps) {
  return <h2 className={cn(typography.title, className)} {...props} />;
}

export function BodyText({ className, ...props }: TypographyProps) {
  return <p className={cn(typography.body, className)} {...props} />;
}

export function Eyebrow({ className, ...props }: TypographyProps) {
  return <p className={cn(typography.label, className)} {...props} />;
}
