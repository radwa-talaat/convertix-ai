"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableSectionFrame } from "@/components/editor/canvas/sortable-section-frame";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor";

const canvasWidth = {
  desktop: "max-w-6xl",
  mobile: "max-w-[390px]",
  tablet: "max-w-[768px]",
};

export function EditorCanvas() {
  const deviceMode = useEditorStore((state) => state.deviceMode);
  const reorderSections = useEditorStore((state) => state.reorderSections);
  const template = useEditorStore((state) => state.template);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (!template) {
    return (
      <main className="flex min-h-0 flex-1 items-center justify-center bg-secondary/40">
        <div className="h-40 w-96 animate-pulse rounded-lg bg-background" />
      </main>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    reorderSections(String(active.id), String(over.id));
  }

  return (
    <main className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_hsl(var(--border))_1px,_transparent_1px)] [background-size:24px_24px]">
      <div className="mx-auto flex min-h-full w-full justify-center px-4 py-6">
        <div
          className={cn(
            "w-full overflow-hidden rounded-lg border border-border bg-background shadow-2xl transition-all duration-300",
            canvasWidth[deviceMode],
          )}
        >
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={template.sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              {template.sections.map((section) => (
                <SortableSectionFrame key={section.id} section={section} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </main>
  );
}
