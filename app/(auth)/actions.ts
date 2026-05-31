"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createAppUrl } from "@/lib/urls";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from "@/lib/validators/auth";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function authRedirect(pathname: string, message: string): never {
  const searchParams = new URLSearchParams({ message });
  redirect(`${pathname}?${searchParams.toString()}`);
}

function safeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    next: safeNextPath(formValue(formData, "next")),
  });

  if (!parsed.success) {
    authRedirect("/login", "Invalid login details.");
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    authRedirect("/login", error.message);
  }

  redirect(parsed.data.next);
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    fullName: formValue(formData, "fullName"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    authRedirect("/register", "Invalid registration details.");
  }

  const origin = headers().get("origin") ?? env.appUrl;
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
      emailRedirectTo: createAppUrl("/auth/callback?next=/dashboard", origin),
    },
  });

  if (error) {
    authRedirect("/register", error.message);
  }

  authRedirect("/login", "Check your email to confirm your account.");
}

export async function forgotPasswordAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formValue(formData, "email"),
  });

  if (!parsed.success) {
    authRedirect("/forgot-password", "Enter a valid email address.");
  }

  const origin = headers().get("origin") ?? env.appUrl;
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: createAppUrl("/auth/callback?next=/dashboard", origin),
    },
  );

  if (error) {
    authRedirect("/forgot-password", error.message);
  }

  authRedirect("/login", "Password reset instructions were sent.");
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
