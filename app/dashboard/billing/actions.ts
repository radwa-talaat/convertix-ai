"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/services/payments";
import type { CreateCheckoutInput } from "@/types/billing";

export async function createCheckoutAction(input: CreateCheckoutInput) {
  const user = await requireUser();
  const supabase = createClient();
  const checkout = await createCheckoutSession(supabase, user.id, input);

  redirect(checkout.paymentUrl);
}
