export type LeadStatus = "new" | "contacted" | "converted" | "archived";

export type LeadCaptureInput = {
  customerEmail?: string;
  customerName: string;
  customerPhone?: string;
  landingPageTitle?: string;
  message?: string;
  pageId: string;
  pageSlug: string;
  productName?: string;
  projectId: string;
  source?: string;
};

export type DashboardLead = {
  id: string;
  customerEmail: string | null;
  customerName: string;
  customerPhone: string | null;
  message: string | null;
  productName: string | null;
  status: LeadStatus;
  createdAt: string;
};
