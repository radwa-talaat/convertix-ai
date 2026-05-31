"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SeoSettings } from "@/types/publishing";

export function SeoSettingsPanel({ seo }: { seo: SeoSettings }) {
  const [settings, setSettings] = React.useState(seo);

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">SEO settings</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Metadata, Open Graph, Twitter cards, and indexing controls.
          </p>
        </div>
        <Button size="sm" type="button" variant="outline">
          Save SEO
        </Button>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="space-y-2">
          <Label>Meta title</Label>
          <Input
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            value={settings.title}
          />
        </div>
        <div className="space-y-2">
          <Label>Meta description</Label>
          <textarea
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            value={settings.description}
          />
        </div>
        <label className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
          Allow search engine indexing
          <input
            checked={settings.indexing}
            onChange={(event) =>
              setSettings((current) => ({
                ...current,
                indexing: event.target.checked,
              }))
            }
            type="checkbox"
          />
        </label>
      </div>
    </div>
  );
}
