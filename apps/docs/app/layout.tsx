import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vestrapay Docs",
    template: "%s. Vestrapay Docs",
  },
  description:
    "Complete API reference, guides, and SDK documentation for integrating Vestrapay payment infrastructure into your applications.",
  keywords: ["Vestrapay", "payments API", "documentation", "fintech", "payment gateway"],
  openGraph: {
    title: "Vestrapay Developer Documentation",
    description: "Build powerful payment experiences with the Vestrapay API.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
