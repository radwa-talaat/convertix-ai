"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import {
  publishPage,
  republishPage,
  unpublishPage,
} from "@/services/publishing";
import type { PublishRequest } from "@/types/publishing";

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
