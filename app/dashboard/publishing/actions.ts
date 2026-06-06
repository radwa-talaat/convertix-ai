"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import {
  publishPage,
  republishPage,
  unpublishPage,
} from "@/services/publishing";
import type { PublishRequest } from "@/types/publishing";

const metaPixelSettingsSchema = z.object({
  enabled: z.boolean(),
  pageId: z.string().uuid(),
  pixelId: z
    .string()
    .trim()
    .regex(/^[0-9]{5,32}$/, "Enter a valid numeric Meta Pixel ID.")
    .nullable(),
});

export async function publishPageAction(request: PublishRequest) {
  const user = await requireUser();
  const supabase = createClient();
  const result = await publishPage(supabase, user.id, request);

  revalidatePath("/dashboard/publishing");

  return result;
}

export async function republishPageAction(pageId: string) {
  const user = await requireUser();
  const supabase = createClient();
  const result = await republishPage(supabase, user.id, pageId);

  revalidatePath("/dashboard/publishing");

  return result;
}

export async function unpublishPageAction(pageId: string) {
  const user = await requireUser();
  const supabase = createClient();
  const page = await unpublishPage(supabase, user.id, pageId);

  revalidatePath("/dashboard/publishing");

  return page;
}

export async function updateMetaPixelSettingsAction(input: {
  enabled: boolean;
  pageId: string;
  pixelId: string | null;
}) {
  const user = await requireUser();
  const parsed = metaPixelSettingsSchema.parse({
    ...input,
    pixelId: input.pixelId?.trim() || null,
  });

  if (parsed.enabled && !parsed.pixelId) {
    throw new Error("A Meta Pixel ID is required before enabling tracking.");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("pages")
    .update({
      meta_pixel_enabled: parsed.enabled,
      meta_pixel_id: parsed.pixelId,
    })
    .eq("id", parsed.pageId)
    .eq("user_id", user.id)
    .select("slug")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ?? "Meta Pixel settings could not be saved.",
    );
  }

  revalidatePath("/dashboard/publishing");
  revalidatePath(`/p/${data.slug}`);
  revalidateTag("published-pages");

  return { success: true };
}
