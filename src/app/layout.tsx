import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "WVU Basketball Transfer Portal Tracker | Morgantown AI",
  description:
    "Live WVU Mountaineers basketball transfer portal tracker. Incoming targets, outgoing transfers, roster status, and news — updated automatically by AI.",
  openGraph: {
    title: "WVU Basketball Transfer Portal Tracker",
    description:
      "Live tracking of WVU basketball transfer portal activity. Incoming targets, outgoing transfers, and the latest news.",
    type: "website",
    url: "https://wvu-portal.morgantown.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "WVU Basketball Transfer Portal Tracker",
    description:
      "Live tracking of WVU basketball transfer portal activity — powered by AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FXWLMCKKNL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FXWLMCKKNL');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
