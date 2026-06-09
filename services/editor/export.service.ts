import type { EditorSectionStyle, EditorThemeTokens } from "@/types/editor";
import type { LandingPageTemplate } from "@/types/rendering";

type EditorExportSnapshot = {
  sectionStyles: Record<string, EditorSectionStyle>;
  template: LandingPageTemplate;
  themeTokens: EditorThemeTokens;
};

const exportRootSelector = "[data-editor-export-root='true']";
const exportSectionSelector = "[data-editor-section-id]";
const editorChromeSelector = "[data-editor-chrome='true']";

export function downloadEditorJson(snapshot: EditorExportSnapshot) {
  const exportTemplate = createPersistedTemplate(snapshot);
  const blob = new Blob([JSON.stringify(exportTemplate, null, 2)], {
    type: "application/json;charset=utf-8",
  });

  downloadBlob(blob, `${sanitizeFileName(exportTemplate.slug)}.json`);
}

export function downloadEditorHtml(snapshot: EditorExportSnapshot) {
  const root = document.querySelector<HTMLElement>(exportRootSelector);

  if (!root) {
    throw new Error("Editor canvas is not ready for export.");
  }

  const exportTemplate = createPersistedTemplate(snapshot);
  const clone = root.cloneNode(true) as HTMLElement;

  clone.querySelectorAll(editorChromeSelector).forEach((node) => node.remove());
  clone
    .querySelectorAll("[contenteditable]")
    .forEach((node) => node.removeAttribute("contenteditable"));

  const html = buildStandaloneHtml({
    body: clone.outerHTML,
    css: collectSameOriginCss(),
    direction: exportTemplate.direction,
    title: exportTemplate.seo.title || exportTemplate.name,
  });

  downloadBlob(
    new Blob([html], { type: "text/html;charset=utf-8" }),
    `${sanitizeFileName(exportTemplate.slug)}.html`,
  );
}

export async function downloadEditorLayerPngs() {
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>(exportSectionSelector),
  );

  if (!sections.length) {
    throw new Error("No editor layers are available for PNG export.");
  }

  const { toPng } = await import("html-to-image");
  const exportHost = createPngExportHost();

  try {
    for (let index = 0; index < sections.length; index += 1) {
      const section = sections[index];
      const sectionId = section.dataset.editorSectionId || `layer-${index + 1}`;
      const clone = createCleanExportSection(section);
      exportHost.appendChild(clone);

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        filter: (node) =>
          !(node instanceof HTMLElement && node.dataset.editorChrome === "true"),
        pixelRatio: 3,
      });

      downloadDataUrl(
        dataUrl,
        `${String(index + 1).padStart(2, "0")}-${sanitizeFileName(sectionId)}.png`,
      );

      clone.remove();
      await wait(250);
    }
  } finally {
    exportHost.remove();
  }
}

function createPersistedTemplate(snapshot: EditorExportSnapshot) {
  return {
    ...snapshot.template,
    editorState: {
      sectionStyles: snapshot.sectionStyles,
      themeTokens: snapshot.themeTokens,
    },
  };
}

function buildStandaloneHtml({
  body,
  css,
  direction,
  title,
}: {
  body: string;
  css: string;
  direction: "ltr" | "rtl";
  title: string;
}) {
  return `<!doctype html>
<html dir="${direction}" lang="${direction === "rtl" ? "ar" : "en"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
${css}
      body { margin: 0; background: #fff; }
      [data-editor-export-root="true"] { width: 100%; max-width: none; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
    </style>
  </head>
  <body>
${body}
  </body>
</html>`;
}

function collectSameOriginCss() {
  const chunks: string[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");
      chunks.push(rules);
    } catch {
      const href = sheet.href;

      if (href) {
        chunks.push(`@import url("${href}");`);
      }
    }
  }

  return chunks.join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadDataUrl(url: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function createPngExportHost() {
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.left = "-10000px";
  host.style.position = "fixed";
  host.style.top = "0";
  host.style.width = "1440px";
  host.style.zIndex = "-1";
  document.body.appendChild(host);

  return host;
}

function createCleanExportSection(section: HTMLElement) {
  const clone = section.cloneNode(true) as HTMLElement;

  clone.querySelectorAll(editorChromeSelector).forEach((node) => node.remove());
  clone
    .querySelectorAll("[contenteditable]")
    .forEach((node) => node.removeAttribute("contenteditable"));

  clone.style.border = "0";
  clone.style.borderRadius = "0";
  clone.style.boxShadow = "none";
  clone.style.maxWidth = "1440px";
  clone.style.transform = "none";
  clone.style.transition = "none";
  clone.style.width = "1440px";

  return clone;
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
