import { EditorShell } from "@/components/editor";
import { PageHeader } from "@/components/dashboard/page-header";
import { getSampleLandingPageTemplate } from "@/services/rendering";

export default function EditorPage() {
  const template = getSampleLandingPageTemplate();

  return (
    <div className="space-y-6">
      <PageHeader
        description="Edit generated landing pages with drag and drop sections, live text editing, style controls, responsive previews, and local draft autosave."
        eyebrow="Editor"
        title="Landing Page Editor"
      />
      <EditorShell template={template} />
    </div>
  );
}
