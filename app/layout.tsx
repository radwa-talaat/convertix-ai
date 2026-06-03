import type { Metadata, Viewport } from "next";
import { Cairo, Inter } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/hooks/use-toast";
import { defaultLocale, getLocaleDirection, locales } from "@/lib/i18n/config";
import { getRequestLocale, getServerMessages } from "@/lib/i18n/server";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const title =
    locale === "ar" ? "منشئ صفحات هبوط بالذكاء الاصطناعي" : siteConfig.name;
  const description =
    locale === "ar"
      ? "منصة SaaS لإنشاء وتعديل ونشر صفحات هبوط احترافية بالذكاء الاصطناعي."
      : siteConfig.description;

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}`])),
    },
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      description,
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: siteConfig.name,
      title,
      type: "website",
      url: `/${locale}`,
    },
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#11100f" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = getRequestLocale();
  const messages = await getServerMessages();

  return (
    <html
      dir={getLocaleDirection(locale)}
      lang={locale}
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${cairo.variable} ${geistMono.variable}`}
        data-default-locale={defaultLocale}
        data-locale={locale}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
