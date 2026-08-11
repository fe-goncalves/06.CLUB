import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { BottomNav } from "@/components/nav/BottomNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "06CLUB | HOME",
    template: "06CLUB | %s",
  },
  description: "Assista e baixe os destaques dos jogos 06CLUB.",
  applicationName: "06CLUB",
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/brand/mark.svg" }],
    apple: [{ url: "/brand/mark.svg" }],
  },
  openGraph: {
    title: "06CLUB | HOME",
    description: "Assista e baixe os destaques dos jogos 06CLUB.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-dvh bg-black text-[#EEEEEE] antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-lg pb-28">{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
