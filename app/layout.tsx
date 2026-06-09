import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/hooks/use-toast";
import { defaultLocale, getLocaleDirection, locales } from "@/lib/i18n/config";
import { getRequestLocale, getServerMessages } from "@/lib/i18n/server";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const title = siteConfig.name;
  const iconUrl = "/brand/convertix-icon.png";
  const shareImageUrl = "/brand/convertix-wordmark.png";
  const description =
    locale === "ar"
      ? "منصة Convertix لإنشاء وتعديل ونشر صفحات هبوط احترافية بالذكاء الاصطناعي."
      : siteConfig.description;

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}`])),
    },
    description,
    icons: {
      apple: [{ url: iconUrl, type: "image/png" }],
      icon: [{ url: iconUrl, type: "image/png" }],
      shortcut: [{ url: iconUrl, type: "image/png" }],
    },
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      description,
      images: [
        {
          alt: "Convertix - AI landing pages that convert",
          height: 512,
          url: shareImageUrl,
          width: 1024,
        },
      ],
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
      images: [shareImageUrl],
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
        className={`${geistSans.variable} ${geistMono.variable}`}
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
