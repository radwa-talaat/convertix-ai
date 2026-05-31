import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "main";
};

export function Container({
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return <Component className={cn("container", className)} {...props} />;
}
