import type { EditorSectionStyle } from "@/types/editor";
import type {
  LandingPageSection,
  LandingPageTemplate,
} from "@/types/rendering";

type MutableRecord = Record<string, unknown>;

export function reorderTemplateSections(
  template: LandingPageTemplate,
  activeId: string,
  overId: string,
): LandingPageTemplate {
  const activeIndex = template.sections.findIndex(
    (section) => section.id === activeId,
  );
  const overIndex = template.sections.findIndex(
    (section) => section.id === overId,
  );

  if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
    return template;
  }

  const nextSections = [...template.sections];
  const [activeSection] = nextSections.splice(activeIndex, 1);
  nextSections.splice(overIndex, 0, activeSection);

  return {
    ...template,
    sections: withNormalizedOrder(nextSections),
  };
}

export function updateSectionTextValue(
  template: LandingPageTemplate,
  sectionId: string,
  path: string,
  value: string,
): LandingPageTemplate {
  return {
    ...template,
    sections: template.sections.map((section) => {
      if (section.id !== sectionId) {
        return section;
      }

      return {
        ...section,
        data: setValueAtPath(section.data, path, value),
      };
    }),
  };
}

export function toggleSectionVisibility(
  template: LandingPageTemplate,
  sectionId: string,
): LandingPageTemplate {
  return {
    ...template,
    sections: template.sections.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            visible: !section.visible,
          }
        : section,
    ),
  };
}

export function duplicateTemplateSection(
  template: LandingPageTemplate,
  sectionId: string,
): LandingPageTemplate {
  const sectionIndex = template.sections.findIndex(
    (section) => section.id === sectionId,
  );

  if (sectionIndex < 0) {
    return template;
  }

  const source = template.sections[sectionIndex];
  const duplicate: LandingPageSection = {
    ...source,
    data: cloneData(source.data),
    id: `${source.id}-copy-${Date.now()}`,
  };
  const nextSections = [...template.sections];
  nextSections.splice(sectionIndex + 1, 0, duplicate);

  return {
    ...template,
    sections: withNormalizedOrder(nextSections),
  };
}

export function deleteTemplateSection(
  template: LandingPageTemplate,
  sectionId: string,
): LandingPageTemplate {
  const nextSections = template.sections.filter(
    (section) => section.id !== sectionId,
  );

  return {
    ...template,
    sections: withNormalizedOrder(nextSections),
  };
}

export function moveTemplateSection(
  template: LandingPageTemplate,
  sectionId: string,
  direction: "up" | "down",
): LandingPageTemplate {
  const index = template.sections.findIndex(
    (section) => section.id === sectionId,
  );
  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || targetIndex < 0 || targetIndex >= template.sections.length) {
    return template;
  }

  const nextSections = [...template.sections];
  const [section] = nextSections.splice(index, 1);
  nextSections.splice(targetIndex, 0, section);

  return {
    ...template,
    sections: withNormalizedOrder(nextSections),
  };
}

export function createDefaultSectionStyle(): EditorSectionStyle {
  return {
    align: "start",
    hiddenOn: [],
    padding: "comfortable",
  };
}

function withNormalizedOrder(
  sections: LandingPageSection[],
): LandingPageSection[] {
  return sections.map((section, order) => ({ ...section, order }));
}

function setValueAtPath(data: unknown, path: string, value: string): unknown {
  const parts = path.split(".").filter(Boolean);
  const root = cloneData(data);
  let cursor: unknown = root;

  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;

    if (isLast) {
      assignPathPart(cursor, part, value);
      return;
    }

    const currentValue = readPathPart(cursor, part);
    const nextValue = cloneData(currentValue);
    assignPathPart(cursor, part, nextValue);
    cursor = nextValue;
  });

  return root;
}

function readPathPart(target: unknown, part: string): unknown {
  if (Array.isArray(target)) {
    return target[Number(part)];
  }

  return (target as MutableRecord)[part];
}

function assignPathPart(target: unknown, part: string, value: unknown) {
  if (Array.isArray(target)) {
    target[Number(part)] = value;
    return;
  }

  (target as MutableRecord)[part] = value;
}

function cloneData<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.map((item) => cloneData(item)) as T;
  }

  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, cloneData(value)]),
    ) as T;
  }

  return data;
}
