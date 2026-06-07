import "server-only";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/auth";
import type { PaymentStatus, UserRole } from "@/types/database";

export type AdminOverview = {
  metrics: {
    paidRevenueCents: number;
    paidRevenueCurrency: string;
    pages: number;
    projects: number;
    users: number;
  };
  recentPayments: Array<{
    amountCents: number;
    createdAt: string;
    currency: string;
    id: string;
    plan: string;
    status: PaymentStatus;
    userEmail: string;
  }>;
  recentProjects: Array<{
    id: string;
    name: string;
    status: string;
    updatedAt: string;
    userEmail: string;
  }>;
};

export async function getUserRole(userId: string): Promise<UserRole> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role === "admin" ? "admin" : "user";
}

export async function isAdminUser(userId: string) {
  return (await getUserRole(userId)) === "admin";
}

export async function requireAdminUser() {
  const user = await requireUser();

  if (!(await isAdminUser(user.id))) {
    redirect("/dashboard");
  }

  return user;
}

export async function getAdminOverview(): Promise<AdminOverview> {
  const admin = createAdminClient();

  const [
    usersResult,
    projectsResult,
    pagesResult,
    revenuePaymentsResult,
    recentPaymentsResult,
    recentProjectsResult,
  ] = await Promise.all([
    admin.from("users").select("id", { count: "exact", head: true }),
    admin.from("projects").select("id", { count: "exact", head: true }),
    admin.from("pages").select("id", { count: "exact", head: true }),
    admin
      .from("payments")
      .select("amount_cents, currency")
      .eq("status", "paid")
      .limit(1000),
    admin
      .from("payments")
      .select("id, user_id, plan, status, amount_cents, currency, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("projects")
      .select("id, user_id, name, status, updated_at")
      .order("updated_at", { ascending: false })
      .limit(8),
  ]);

  const revenuePayments = revenuePaymentsResult.data ?? [];
  const paidRevenueCents = revenuePayments.reduce(
    (total, payment) => total + payment.amount_cents,
    0,
  );
  const paidRevenueCurrency = revenuePayments[0]?.currency ?? "EGP";
  const userIds = Array.from(
    new Set([
      ...(recentPaymentsResult.data ?? []).map((payment) => payment.user_id),
      ...(recentProjectsResult.data ?? []).map((project) => project.user_id),
    ]),
  );

  const { data: users } = userIds.length
    ? await admin.from("users").select("id, email").in("id", userIds)
    : { data: [] };

  const emailByUserId = new Map(
    (users ?? []).map((user) => [user.id, user.email]),
  );

  return {
    metrics: {
      paidRevenueCents,
      paidRevenueCurrency,
      pages: pagesResult.count ?? 0,
      projects: projectsResult.count ?? 0,
      users: usersResult.count ?? 0,
    },
    recentPayments: (recentPaymentsResult.data ?? []).map((payment) => ({
      amountCents: payment.amount_cents,
      createdAt: payment.created_at,
      currency: payment.currency,
      id: payment.id,
      plan: payment.plan,
      status: payment.status,
      userEmail: emailByUserId.get(payment.user_id) ?? "Unknown account",
    })),
    recentProjects: (recentProjectsResult.data ?? []).map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      updatedAt: project.updated_at,
      userEmail: emailByUserId.get(project.user_id) ?? "Unknown account",
    })),
  };
}
