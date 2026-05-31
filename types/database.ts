export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectStatus = "draft" | "active" | "archived";
export type PageStatus = "draft" | "published" | "archived";
export type TemplateVisibility = "private" | "team" | "public";
export type AiGenerationStatus = "queued" | "running" | "completed" | "failed";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";
export type DomainStatus = "pending" | "verified" | "failed";
export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "voided";
export type InvoiceStatus = "draft" | "open" | "paid" | "void" | "failed";
export type PublishStatus =
  | "draft"
  | "publishing"
  | "published"
  | "unpublished"
  | "failed";
export type AnalyticsEventType =
  | "page_view"
  | "cta_click"
  | "form_submission"
  | "custom"
  | "performance";
export type AnalyticsDeviceType = "desktop" | "mobile" | "tablet";
export type TrafficSourceType = "direct" | "google" | "referral" | "social";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          slug: string;
          description: string | null;
          status: ProjectStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          slug: string;
          description?: string | null;
          status?: ProjectStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          status?: ProjectStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      pages: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          slug: string;
          status: PageStatus;
          content: Json;
          seo: Json;
          published_content: Json;
          published_url: string | null;
          published_at: string | null;
          version: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          title: string;
          slug: string;
          status?: PageStatus;
          content?: Json;
          seo?: Json;
          published_content?: Json;
          published_url?: string | null;
          published_at?: string | null;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          title?: string;
          slug?: string;
          status?: PageStatus;
          content?: Json;
          seo?: Json;
          published_content?: Json;
          published_url?: string | null;
          published_at?: string | null;
          version?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pages_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pages_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      templates: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          description: string | null;
          visibility: TemplateVisibility;
          thumbnail_path: string | null;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          description?: string | null;
          visibility?: TemplateVisibility;
          thumbnail_path?: string | null;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          description?: string | null;
          visibility?: TemplateVisibility;
          thumbnail_path?: string | null;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      ai_generations: {
        Row: {
          id: string;
          user_id: string;
          project_id: string | null;
          page_id: string | null;
          prompt: string;
          status: AiGenerationStatus;
          input: Json;
          output: Json | null;
          input_tokens: number;
          output_tokens: number;
          total_tokens: number;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id?: string | null;
          page_id?: string | null;
          prompt: string;
          status?: AiGenerationStatus;
          input?: Json;
          output?: Json | null;
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string | null;
          page_id?: string | null;
          prompt?: string;
          status?: AiGenerationStatus;
          input?: Json;
          output?: Json | null;
          input_tokens?: number;
          output_tokens?: number;
          total_tokens?: number;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ai_generations_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_generations_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ai_generations_page_id_fkey";
            columns: ["page_id"];
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          status: SubscriptionStatus;
          plan: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          trial_ends_at: string | null;
          canceled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider?: string;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          status?: SubscriptionStatus;
          plan?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: string;
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          status?: SubscriptionStatus;
          plan?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
          canceled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          page_id: string | null;
          event_name: string;
          event_data: Json;
          visitor_id: string | null;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          page_id?: string | null;
          event_name: string;
          event_data?: Json;
          visitor_id?: string | null;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          page_id?: string | null;
          event_name?: string;
          event_data?: Json;
          visitor_id?: string | null;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "analytics_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "analytics_page_id_fkey";
            columns: ["page_id"];
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      domains: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          hostname: string;
          status: DomainStatus;
          ssl_status: "pending" | "issued" | "failed";
          dns_records: Json;
          verification_token: string;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          hostname: string;
          status?: DomainStatus;
          ssl_status?: "pending" | "issued" | "failed";
          dns_records?: Json;
          verification_token?: string;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          hostname?: string;
          status?: DomainStatus;
          ssl_status?: "pending" | "issued" | "failed";
          dns_records?: Json;
          verification_token?: string;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "domains_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "domains_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      publish_versions: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          page_id: string;
          version: number;
          status: PublishStatus;
          snapshot: Json;
          published_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          page_id: string;
          version: number;
          status?: PublishStatus;
          snapshot?: Json;
          published_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          page_id?: string;
          version?: number;
          status?: PublishStatus;
          snapshot?: Json;
          published_url?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "publish_versions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "publish_versions_project_id_user_id_fkey";
            columns: ["project_id", "user_id"];
            referencedRelation: "projects";
            referencedColumns: ["id", "user_id"];
          },
          {
            foreignKeyName: "publish_versions_page_id_user_id_fkey";
            columns: ["page_id", "user_id"];
            referencedRelation: "pages";
            referencedColumns: ["id", "user_id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          invoice_id: string | null;
          provider: string;
          provider_intention_id: string | null;
          provider_order_id: string | null;
          provider_transaction_id: string | null;
          plan: string;
          amount_cents: number;
          currency: string;
          status: PaymentStatus;
          raw_payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          invoice_id?: string | null;
          provider?: string;
          provider_intention_id?: string | null;
          provider_order_id?: string | null;
          provider_transaction_id?: string | null;
          plan: string;
          amount_cents: number;
          currency?: string;
          status?: PaymentStatus;
          raw_payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          invoice_id?: string | null;
          provider?: string;
          provider_intention_id?: string | null;
          provider_order_id?: string | null;
          provider_transaction_id?: string | null;
          plan?: string;
          amount_cents?: number;
          currency?: string;
          status?: PaymentStatus;
          raw_payload?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_subscription_id_fkey";
            columns: ["subscription_id"];
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_invoice_id_fkey";
            columns: ["invoice_id"];
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          payment_id: string | null;
          provider: string;
          plan: string;
          amount_cents: number;
          currency: string;
          status: InvoiceStatus;
          due_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          payment_id?: string | null;
          provider?: string;
          plan: string;
          amount_cents: number;
          currency?: string;
          status?: InvoiceStatus;
          due_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          payment_id?: string | null;
          provider?: string;
          plan?: string;
          amount_cents?: number;
          currency?: string;
          status?: InvoiceStatus;
          due_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey";
            columns: ["subscription_id"];
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoices_payment_id_fkey";
            columns: ["payment_id"];
            referencedRelation: "payments";
            referencedColumns: ["id"];
          },
        ];
      };
      usage_tracking: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          metric: string;
          used: number;
          limit_value: number;
          period_start: string;
          period_end: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          metric: string;
          used?: number;
          limit_value: number;
          period_start?: string;
          period_end: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subscription_id?: string | null;
          metric?: string;
          used?: number;
          limit_value?: number;
          period_start?: string;
          period_end?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "usage_tracking_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "usage_tracking_subscription_id_fkey";
            columns: ["subscription_id"];
            referencedRelation: "subscriptions";
            referencedColumns: ["id"];
          },
        ];
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          project_id: string;
          page_id: string | null;
          page_slug: string;
          event_type: AnalyticsEventType;
          visitor_id: string;
          session_id: string;
          device_type: AnalyticsDeviceType;
          source: TrafficSourceType;
          utm: Json;
          metadata: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          project_id: string;
          page_id?: string | null;
          page_slug: string;
          event_type: AnalyticsEventType;
          visitor_id: string;
          session_id: string;
          device_type: AnalyticsDeviceType;
          source?: TrafficSourceType;
          utm?: Json;
          metadata?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          project_id?: string;
          page_id?: string | null;
          page_slug?: string;
          event_type?: AnalyticsEventType;
          visitor_id?: string;
          session_id?: string;
          device_type?: AnalyticsDeviceType;
          source?: TrafficSourceType;
          utm?: Json;
          metadata?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_events_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "analytics_events_page_id_fkey";
            columns: ["page_id"];
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      page_views: {
        Row: {
          id: string;
          user_id: string | null;
          project_id: string;
          page_id: string | null;
          page_slug: string;
          visitor_id: string;
          session_id: string;
          device_type: AnalyticsDeviceType;
          source: TrafficSourceType;
          referrer: string | null;
          utm: Json;
          time_on_page_seconds: number;
          bounced: boolean;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          project_id: string;
          page_id?: string | null;
          page_slug: string;
          visitor_id: string;
          session_id: string;
          device_type: AnalyticsDeviceType;
          source?: TrafficSourceType;
          referrer?: string | null;
          utm?: Json;
          time_on_page_seconds?: number;
          bounced?: boolean;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          project_id?: string;
          page_id?: string | null;
          page_slug?: string;
          visitor_id?: string;
          session_id?: string;
          device_type?: AnalyticsDeviceType;
          source?: TrafficSourceType;
          referrer?: string | null;
          utm?: Json;
          time_on_page_seconds?: number;
          bounced?: boolean;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "page_views_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "page_views_page_id_fkey";
            columns: ["page_id"];
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      conversions: {
        Row: {
          id: string;
          user_id: string | null;
          project_id: string;
          page_id: string | null;
          page_slug: string;
          visitor_id: string;
          session_id: string;
          conversion_type: string;
          value: number | null;
          metadata: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          project_id: string;
          page_id?: string | null;
          page_slug: string;
          visitor_id: string;
          session_id: string;
          conversion_type: string;
          value?: number | null;
          metadata?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          project_id?: string;
          page_id?: string | null;
          page_slug?: string;
          visitor_id?: string;
          session_id?: string;
          conversion_type?: string;
          value?: number | null;
          metadata?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversions_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conversions_page_id_fkey";
            columns: ["page_id"];
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
      traffic_sources: {
        Row: {
          id: string;
          project_id: string;
          page_id: string | null;
          page_slug: string;
          source: TrafficSourceType;
          referrer_host: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          visits: number;
          first_seen_at: string;
          last_seen_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          page_id?: string | null;
          page_slug: string;
          source: TrafficSourceType;
          referrer_host?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          visits?: number;
          first_seen_at?: string;
          last_seen_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          page_id?: string | null;
          page_slug?: string;
          source?: TrafficSourceType;
          referrer_host?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          visits?: number;
          first_seen_at?: string;
          last_seen_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "traffic_sources_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "traffic_sources_page_id_fkey";
            columns: ["page_id"];
            referencedRelation: "pages";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      project_status: ProjectStatus;
      page_status: PageStatus;
      template_visibility: TemplateVisibility;
      ai_generation_status: AiGenerationStatus;
      subscription_status: SubscriptionStatus;
      domain_status: DomainStatus;
      publish_status: PublishStatus;
      payment_status: PaymentStatus;
      invoice_status: InvoiceStatus;
      analytics_event_type: AnalyticsEventType;
      analytics_device_type: AnalyticsDeviceType;
      traffic_source_type: TrafficSourceType;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
