"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
} from "lucide-react";

import { EditorSectionRenderer } from "@/components/editor/canvas/editor-section-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createDefaultSectionStyle,
  editorSpacingScale,
} from "@/services/editor";
import { useEditorStore } from "@/store/editor";
import type { LandingPageSection } from "@/types/rendering";

type SortableSectionFrameProps = {
  section: LandingPageSection;
};

export function SortableSectionFrame({ section }: SortableSectionFrameProps) {
  const deleteSection = useEditorStore((state) => state.deleteSection);
  const deviceMode = useEditorStore((state) => state.deviceMode);
  const duplicateSection = useEditorStore((state) => state.duplicateSection);
  const moveSection = useEditorStore((state) => state.moveSection);
  const sectionStyles = useEditorStore((state) => state.sectionStyles);
  const selectSection = useEditorStore((state) => state.selectSection);
  const selectedSectionId = useEditorStore((state) => state.selectedSectionId);
  const themeTokens = useEditorStore((state) => state.themeTokens);
  const toggleSectionVisibility = useEditorStore(
    (state) => state.toggleSectionVisibility,
  );
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id });

  const selected = selectedSectionId === section.id;
  const style = sectionStyles[section.id] ?? createDefaultSectionStyle();
  const hiddenOnDevice = style.hiddenOn.includes(deviceMode);
  const spacing = editorSpacingScale.find((item) => item.id === style.padding);

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-transparent transition-all duration-200",
        selected && "border-foreground shadow-2xl",
        isDragging && "z-30 scale-[0.99] opacity-80",
        (!section.visible || hiddenOnDevice) && "opacity-45",
      )}
      data-editor-section-id={section.id}
      onClick={() => selectSection(section.id)}
      ref={setNodeRef}
      style={{
        backgroundColor: style.backgroundColor,
        paddingBottom: spacing?.value,
        paddingTop: spacing?.value,
        textAlign: style.align,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {style.backgroundImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 size-full object-cover"
          src={style.backgroundImageUrl}
        />
      ) : null}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-3 top-3 z-40 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100",
          selected && "opacity-100",
        )}
        data-editor-chrome="true"
      >
        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-md border border-border bg-background/95 p-1 shadow-luxury-sm backdrop-blur">
          <button
            {...attributes}
            {...listeners}
            className="inline-flex size-8 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground active:cursor-grabbing"
            title="Drag section"
            type="button"
          >
            <GripVertical className="size-4" />
          </button>
          <span className="px-2 text-xs font-medium capitalize">
            {section.type}
          </span>
        </div>

        <div className="pointer-events-auto inline-flex items-center gap-1 rounded-md border border-border bg-background/95 p-1 shadow-luxury-sm backdrop-blur">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              moveSection(section.id, "up");
            }}
            size="icon"
            title="Move up"
            type="button"
            variant="ghost"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              moveSection(section.id, "down");
            }}
            size="icon"
            title="Move down"
            type="button"
            variant="ghost"
          >
            <ChevronDown className="size-4" />
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              duplicateSection(section.id);
            }}
            size="icon"
            title="Duplicate section"
            type="button"
            variant="ghost"
          >
            <Copy className="size-4" />
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              toggleSectionVisibility(section.id);
            }}
            size="icon"
            title="Hide section"
            type="button"
            variant="ghost"
          >
            {section.visible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              deleteSection(section.id);
            }}
            size="icon"
            title="Delete section"
            type="button"
            variant="ghost"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {!section.visible || hiddenOnDevice ? (
        <div
          className="absolute left-4 top-16 z-40 rounded bg-background px-2 py-1 text-xs font-medium text-muted-foreground shadow-luxury-sm"
          data-editor-chrome="true"
        >
          Hidden
        </div>
      ) : null}

      <div className="relative z-10">
        <EditorSectionRenderer section={section} />
      </div>

      {style.foregroundImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={`${section.type} media`}
          className="pointer-events-none absolute z-20 max-w-[70%] rounded-lg border border-border bg-background object-contain p-2 shadow-2xl"
          src={style.foregroundImageUrl}
          style={{
            left: `${style.foregroundImageX ?? 82}%`,
            top: `${style.foregroundImageY ?? 72}%`,
            transform: "translate(-50%, -50%)",
            width: `min(${style.foregroundImageWidth ?? 220}px, 70%)`,
          }}
        />
      ) : null}

      {(style.customTexts ?? []).map((text) => (
        <div
          className="pointer-events-none absolute z-30 max-w-[70%] whitespace-pre-wrap break-words rounded-sm px-1 font-semibold leading-tight"
          key={text.id}
          style={{
            color: text.color,
            fontFamily: text.fontFamily ?? themeTokens.typography.heading,
            fontSize: `min(${text.fontSize}px, 12vw)`,
            left: `${text.x}%`,
            textAlign: style.align,
            top: `${text.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {text.text}
        </div>
      ))}
    </div>
  );
}
