import { randomBytes } from "crypto";

import {
  assertValidHostname,
  getAppHostname,
  getDnsTarget,
} from "@/lib/publishing";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Json, Tables } from "@/types/database";
import type { CustomDomain, DomainDnsRecord } from "@/types/publishing";

export function createDomainDnsRecords(
  hostname: string,
  verificationToken: string,
): DomainDnsRecord[] {
  const appHostname = getAppHostname();
  const isApex = hostname.split(".").length === 2;

  return [
    isApex
      ? {
          host: "@",
          type: "A",
          value: "76.76.21.21",
        }
      : {
          host: hostname.split(".")[0],
          type: "CNAME",
          value: getDnsTarget(appHostname),
        },
    {
      host: "_ai-builder-verify",
      type: "TXT",
      value: `ai-builder-verification=${verificationToken}`,
    },
  ];
}

export async function createCustomDomain(
  supabase: SupabaseDatabaseClient,
  userId: string,
  projectId: string,
  hostnameInput: string,
) {
  const hostname = assertValidHostname(hostnameInput);
  const verificationToken = randomBytes(24).toString("hex");
  const dnsRecords = createDomainDnsRecords(hostname, verificationToken);

  return supabase
    .from("domains")
    .insert({
      dns_records: dnsRecords as unknown as Json,
      hostname,
      project_id: projectId,
      ssl_status: "pending",
      status: "pending",
      user_id: userId,
      verification_token: verificationToken,
    })
    .select("*")
    .single();
}

export async function listCustomDomainsByProject(
  supabase: SupabaseDatabaseClient,
  projectId: string,
) {
  return supabase
    .from("domains")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
}

export async function markDomainVerified(
  supabase: SupabaseDatabaseClient,
  userId: string,
  domainId: string,
) {
  return supabase
    .from("domains")
    .update({
      ssl_status: "issued",
      status: "verified",
      verified_at: new Date().toISOString(),
    })
    .eq("id", domainId)
    .eq("user_id", userId)
    .select("*")
    .single();
}

export function mapDomainRow(row: Tables<"domains">): CustomDomain {
  return {
    dnsRecords: (row.dns_records as unknown as DomainDnsRecord[]) ?? [],
    hostname: row.hostname,
    id: row.id,
    projectId: row.project_id,
    sslStatus: row.ssl_status,
    status:
      row.status === "verified" && row.ssl_status === "issued"
        ? "active"
        : row.status,
    verificationToken: row.verification_token,
    verifiedAt: row.verified_at,
  };
}
