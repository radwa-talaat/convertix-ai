"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createCustomDomain } from "@/services/domains";
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

const trackingPixelSettingsSchema = z
  .object({
    enabled: z.boolean(),
    pageId: z.string().uuid(),
    pixelId: z.string().trim().min(5).max(80).nullable(),
    platform: z.enum(["snapchat", "tiktok"]),
  })
  .superRefine((value, context) => {
    if (value.enabled && !value.pixelId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A Pixel ID is required before enabling tracking.",
        path: ["pixelId"],
      });
      return;
    }

    if (value.pixelId && !/^[A-Za-z0-9_-]{5,80}$/.test(value.pixelId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid Pixel ID.",
        path: ["pixelId"],
      });
    }
  });

const customDomainSchema = z.object({
  hostname: z.string().trim().min(4).max(253),
  pageId: z.string().uuid(),
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
  revalidatePath(`/dashboard/publishing/${parsed.pageId}/settings`);
  revalidatePath(`/p/${data.slug}`);
  revalidateTag("published-pages");

  return { success: true };
}

export async function updateTrackingPixelSettingsAction(input: {
  enabled: boolean;
  pageId: string;
  pixelId: string | null;
  platform: "snapchat" | "tiktok";
}) {
  const user = await requireUser();
  const parsed = trackingPixelSettingsSchema.parse({
    ...input,
    pixelId: input.pixelId?.trim() || null,
  });

  const updates =
    parsed.platform === "tiktok"
      ? {
          tiktok_pixel_enabled: parsed.enabled,
          tiktok_pixel_id: parsed.pixelId,
        }
      : {
          snapchat_pixel_enabled: parsed.enabled,
          snapchat_pixel_id: parsed.pixelId,
        };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("pages")
    .update(updates)
    .eq("id", parsed.pageId)
    .eq("user_id", user.id)
    .select("slug")
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ?? "Tracking pixel settings could not be saved.",
    );
  }

  revalidatePath("/dashboard/publishing");
  revalidatePath(`/dashboard/publishing/${parsed.pageId}/settings`);
  revalidatePath(`/p/${data.slug}`);
  revalidateTag("published-pages");

  return { success: true };
}

export async function createPageCustomDomainAction(input: {
  hostname: string;
  pageId: string;
}) {
  try {
    const user = await requireUser();
    const parsed = customDomainSchema.parse(input);
    const supabase = createClient();

    const { data: page, error: pageError } = await supabase
      .from("pages")
      .select("id, project_id, slug")
      .eq("id", parsed.pageId)
      .eq("user_id", user.id)
      .single();

    if (pageError || !page) {
      return {
        error: pageError?.message ?? "Landing page was not found.",
        success: false,
      };
    }

    const { data, error } = await createCustomDomain(
      supabase,
      user.id,
      page.project_id,
      page.id,
      parsed.hostname,
    );

    if (error || !data) {
      return {
        error: error?.message ?? "Custom domain could not be created.",
        success: false,
      };
    }

    revalidatePath("/dashboard/publishing");
    revalidatePath(`/dashboard/publishing/${page.id}/settings`);

    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Custom domain could not be created.",
      success: false,
    };
  }
}
