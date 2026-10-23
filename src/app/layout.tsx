import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OfficialCartProvider } from "@/components/official-cart-provider";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Bobby's Pet Shop | Ropa para perros y accesorios para mascotas",
    template: "%s | Bobby's Pet Shop",
  },
  description:
    "Tienda online para mascotas en Chile: ropa para perros, parkas, chalecos y accesorios. Revisa modelos, tallas y precios con envío a todo Chile.",
  openGraph: {
    title: "Bobby's Pet Shop",
    description: "Ropa para perros, parkas, chalecos y accesorios para mascotas con envío a todo Chile.",
    images: ["/images/official/parka-beige-modelo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FBF7F1] text-[#243C3A]">
        <OfficialCartProvider liveInventoryEnabled>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </OfficialCartProvider>
      </body>
    </html>
  );
}
