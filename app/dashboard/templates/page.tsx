import { Blocks, LayoutTemplate } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const templateCategories = ["SaaS", "Waitlist", "Product", "Agency"];

export default function TemplatesPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description="Browse the template workspace foundation. Template creation and editor flows are intentionally not included yet."
        eyebrow="Template Library"
        title="Templates"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {templateCategories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary">
                <LayoutTemplate className="size-4" />
              </span>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Coming foundation</Badge>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Prepared card structure for future template assets and metadata.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmptyState
        description="Template storage and browsing are ready at the UI layer, with business logic reserved for later phases."
        icon={Blocks}
        title="No custom templates yet"
      />
    </div>
  );
}
