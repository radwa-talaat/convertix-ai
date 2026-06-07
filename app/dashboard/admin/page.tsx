import {
  CreditCard,
  FileText,
  PanelsTopLeft,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createLocalizedPathname } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getAdminOverview, requireAdminUser } from "@/services/admin";

function formatMoney(amountCents: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amountCents / 100);
}

function formatDate(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminPage() {
  await requireAdminUser();

  const locale = getRequestLocale();
  const isArabic = locale === "ar";
  const overview = await getAdminOverview();
  const copy = isArabic
    ? {
        createTestProject: "إنشاء مشروع اختبار",
        description:
          "تابع حالة المنصة واختبر إنشاء المشاريع وصفحات الهبوط بدون استهلاك رصيد العملاء.",
        eyebrow: "صلاحيات الإدارة",
        noPayments: "لا توجد مدفوعات حديثة.",
        noProjects: "لا توجد مشاريع حديثة.",
        paidRevenue: "إجمالي المدفوعات",
        paidRevenueDetail: "مدفوعات ناجحة مسجلة",
        pages: "صفحات الهبوط",
        pagesDetail: "كل الصفحات في المنصة",
        projects: "المشاريع",
        projectsDetail: "كل مشاريع المستخدمين",
        recentPayments: "آخر المدفوعات",
        recentPaymentsDescription: "أحدث محاولات الدفع المسجلة في Paymob.",
        recentProjects: "آخر المشاريع",
        recentProjectsDescription: "أحدث مشاريع تم إنشاؤها داخل المنصة.",
        testMode:
          "حساب الأدمن يمكنه إنشاء مشاريع وصفحات هبوط للاختبار بدون دفع. هذا لا يغير قواعد الدفع للمستخدمين العاديين.",
        title: "لوحة تحكم الأدمن",
        users: "المستخدمون",
        usersDetail: "كل الحسابات المسجلة",
      }
    : {
        createTestProject: "Create test project",
        description:
          "Monitor the platform and test project or landing-page creation without consuming customer credits.",
        eyebrow: "Admin access",
        noPayments: "No recent payments yet.",
        noProjects: "No recent projects yet.",
        paidRevenue: "Paid revenue",
        paidRevenueDetail: "Successful payments recorded",
        pages: "Landing pages",
        pagesDetail: "All pages in the platform",
        projects: "Projects",
        projectsDetail: "All customer projects",
        recentPayments: "Recent payments",
        recentPaymentsDescription: "Latest Paymob payment records.",
        recentProjects: "Recent projects",
        recentProjectsDescription: "Latest workspaces created in the platform.",
        testMode:
          "Admin accounts can create test projects and landing pages without payment. Regular customer payment rules stay unchanged.",
        title: "Admin Console",
        users: "Users",
        usersDetail: "All registered accounts",
      };

  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Button asChild>
            <Link href={createLocalizedPathname("/dashboard/projects", locale)}>
              <ShieldCheck className="me-2 size-4" />
              {copy.createTestProject}
            </Link>
          </Button>
        }
        description={copy.description}
        eyebrow={copy.eyebrow}
        title={copy.title}
      />

      <Card className="border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
        <CardContent className="flex items-start gap-3 p-4 text-sm leading-6">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <p>{copy.testMode}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={copy.usersDetail}
          icon={UsersRound}
          label={copy.users}
          value={overview.metrics.users.toLocaleString(locale)}
        />
        <MetricCard
          detail={copy.projectsDetail}
          icon={PanelsTopLeft}
          label={copy.projects}
          value={overview.metrics.projects.toLocaleString(locale)}
        />
        <MetricCard
          detail={copy.pagesDetail}
          icon={FileText}
          label={copy.pages}
          value={overview.metrics.pages.toLocaleString(locale)}
        />
        <MetricCard
          detail={copy.paidRevenueDetail}
          icon={CreditCard}
          label={copy.paidRevenue}
          value={formatMoney(
            overview.metrics.paidRevenueCents,
            overview.metrics.paidRevenueCurrency,
            locale,
          )}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{copy.recentProjects}</CardTitle>
            <CardDescription>{copy.recentProjectsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentProjects.length ? (
              overview.recentProjects.map((project) => (
                <div
                  className="rounded-md border border-border p-4"
                  key={project.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {project.userEmail}
                      </p>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {formatDate(project.updatedAt, locale)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{copy.noProjects}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.recentPayments}</CardTitle>
            <CardDescription>{copy.recentPaymentsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.recentPayments.length ? (
              overview.recentPayments.map((payment) => (
                <div
                  className="rounded-md border border-border p-4"
                  key={payment.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {formatMoney(
                          payment.amountCents,
                          payment.currency,
                          locale,
                        )}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {payment.userEmail}
                      </p>
                    </div>
                    <Badge variant="secondary">{payment.status}</Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {payment.plan} - {formatDate(payment.createdAt, locale)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{copy.noPayments}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
