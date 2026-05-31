"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { LandingPageEditableTextOptions } from "@/types/rendering";

type InlineEditableTextProps = LandingPageEditableTextOptions & {
  onCommit: (path: string, value: string) => void;
};

export function InlineEditableText({
  className,
  multiline,
  onCommit,
  path,
  value,
}: InlineEditableTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  return (
    <span
      className={cn(
        "rounded-[3px] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "hover:bg-background/50",
        multiline && "whitespace-pre-wrap",
        className,
      )}
      contentEditable
      onBlur={(event) => {
        onCommit(path, event.currentTarget.textContent ?? "");
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onMouseDown={(event) => event.stopPropagation()}
      ref={ref}
      suppressContentEditableWarning
    >
      {value}
    </span>
  );
}
