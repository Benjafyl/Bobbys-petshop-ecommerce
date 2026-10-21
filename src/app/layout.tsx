import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OfficialCartProvider } from "@/components/official-cart-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Bobby's Pet Shop | Ropa para perros y collares para gatos",
    template: "%s | Bobby's Pet Shop",
  },
  description:
    "Inventario de ropa para perros y collares para gatos en Chile, con precios y existencias por talla.",
  openGraph: {
    title: "Bobby's Pet Shop",
    description: "Ropa para perros y collares para gatos, con precios y existencias por talla.",
    images: ["/images/official/parka-beige-modelo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FBF7F1] text-[#243C3A]">
        <OfficialCartProvider liveInventoryEnabled={Boolean(process.env.DATABASE_URL)}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </OfficialCartProvider>
      </body>
    </html>
  );
}
