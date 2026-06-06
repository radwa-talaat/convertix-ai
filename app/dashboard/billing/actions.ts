"use server";

import { requireUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createCheckoutSession,
  createWalletCheckoutSession,
} from "@/services/payments";
import type {
  CreateCheckoutInput,
  CreateWalletCheckoutInput,
} from "@/types/billing";

export type CreateCheckoutActionResult =
  | { paymentUrl: string; success: true }
  | { error: string; success: false };

export async function createCheckoutAction(
  input: CreateCheckoutInput,
): Promise<CreateCheckoutActionResult> {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    const checkout = await createCheckoutSession(supabase, user.id, input);

    return { paymentUrl: checkout.paymentUrl, success: true };
  } catch (error) {
    console.error("Paymob checkout creation failed", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Payment checkout could not be created.",
      success: false,
    };
  }
}

export async function createWalletCheckoutAction(
  input: CreateWalletCheckoutInput,
): Promise<CreateCheckoutActionResult> {
  try {
    const user = await requireUser();
    const supabase = createAdminClient();
    const checkout = await createWalletCheckoutSession(
      supabase,
      user.id,
      input,
    );

    return { paymentUrl: checkout.paymentUrl, success: true };
  } catch (error) {
    console.error("Paymob wallet checkout creation failed", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Wallet payment could not be created.",
      success: false,
    };
  }
}
