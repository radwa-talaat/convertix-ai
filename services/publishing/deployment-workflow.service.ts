import type { DomainDnsRecord } from "@/types/publishing";

export type DeploymentWorkflowStep = {
  description: string;
  status: "automated" | "manual" | "pending";
  title: string;
};

export function getVercelDeploymentWorkflow(
  dnsRecords: DomainDnsRecord[],
): DeploymentWorkflowStep[] {
  return [
    {
      description:
        "Persist the rendered page snapshot, SEO metadata, slug, and version history in Supabase.",
      status: "automated",
      title: "Save publish snapshot",
    },
    {
      description:
        "Revalidate the public route and sitemap so Vercel serves the latest ISR output from the edge cache.",
      status: "automated",
      title: "Revalidate public routes",
    },
    {
      description: `Add DNS records: ${dnsRecords
        .map((record) => `${record.type} ${record.host}`)
        .join(", ")}.`,
      status: "manual",
      title: "Configure DNS",
    },
    {
      description:
        "After DNS verification succeeds, Vercel provisions SSL automatically for the connected domain.",
      status: "pending",
      title: "Issue SSL",
    },
  ];
}
