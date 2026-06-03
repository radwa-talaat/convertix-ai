import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Json } from "@/types/database";
import type { LeadCaptureInput } from "@/types/leads";

type CaptureLeadOptions = {
  input: LeadCaptureInput;
  ipAddress?: string | null;
  supabase: SupabaseDatabaseClient;
  userAgent?: string | null;
};

export async function captureLandingPageLead({
  input,
  ipAddress,
  supabase,
  userAgent,
}: CaptureLeadOptions) {
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("id, project_id, user_id, title, slug, status")
    .eq("id", input.pageId)
    .eq("project_id", input.projectId)
    .eq("slug", input.pageSlug)
    .single();

  if (pageError || !page) {
    throw new Error(pageError?.message ?? "Landing page not found.");
  }

  if (page.status === "archived") {
    throw new Error("Landing page is not available for lead capture.");
  }

  const { data, error } = await supabase
    .from("leads")
    .insert({
      customer_email: cleanOptional(input.customerEmail),
      customer_name: input.customerName.trim(),
      customer_phone: cleanOptional(input.customerPhone),
      landing_page_title: input.landingPageTitle?.trim() || page.title,
      message: cleanOptional(input.message),
      metadata: {
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      } satisfies Json,
      page_id: page.id,
      page_slug: page.slug,
      product_name: cleanOptional(input.productName),
      project_id: page.project_id,
      source: input.source?.trim() || "landing_page_form",
      user_id: page.user_id,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Lead could not be saved.");
  }

  return data;
}

function cleanOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
