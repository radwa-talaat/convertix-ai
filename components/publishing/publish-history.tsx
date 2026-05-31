import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublishVersion } from "@/types/publishing";

export function PublishHistory({ versions }: { versions: PublishVersion[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publish history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {versions.map((version) => (
          <div
            className="flex items-center justify-between rounded-md border border-border p-3 text-sm"
            key={version.id}
          >
            <div>
              <p className="font-medium">Version {version.version}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(version.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {version.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
