"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(fullName: string) {
  const user = await requireUser();
  const trimmedName = fullName.trim();

  if (trimmedName.length < 2 || trimmedName.length > 120) {
    throw new Error("Name must be between 2 and 120 characters.");
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("users")
    .update({
      full_name: trimmedName,
    })
    .eq("id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/settings");
}
