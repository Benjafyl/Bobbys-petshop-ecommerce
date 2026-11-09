import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { OfficialCartProvider } from "@/components/official-cart-provider";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { JsonLd } from "@/components/json-ld";
import { MetaPixelConsent } from "@/components/meta-pixel-consent";
import { instagramProfileUrl } from "@/lib/social";
import { SITE_URL, absoluteSiteUrl } from "@/lib/site-url";
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
  metadataBase: new URL(SITE_URL),
  verification: { other: { "facebook-domain-verification": "i4n0apxetnkiyumuns93ty8m68d9aj" } },
  title: {
    default: "Ropa para perros y mascotas en Chile | Bobby's Pet Shop",
    template: "%s | Bobby's Pet Shop",
  },
  description:
    "Tienda online de ropa para perros y accesorios para mascotas en Chile. Descubre parkas, chalecos y diseños de Bobby's; compra con envío a todo Chile o retiro en Viña del Mar.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Bobby's Pet Shop",
    title: "Ropa para perros y mascotas en Chile | Bobby's Pet Shop",
    description: "Parkas, chalecos y accesorios para mascotas con la personalidad de Bobby.",
    images: ["/images/official/parka-beige-modelo.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

const storeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#store`,
      name: "Bobby's Pet Shop",
      url: SITE_URL,
      description: "Tienda online chilena de ropa para perros y accesorios para mascotas, inspirada en Bobby.",
      logo: absoluteSiteUrl("/images/official/logo-bobbys-pet-shop.jpg"),
      sameAs: [instagramProfileUrl],
      foundingDate: "2021",
      areaServed: { "@type": "Country", name: "Chile" },
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+56992970756", availableLanguage: "Spanish" },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        merchantReturnLink: absoluteSiteUrl("/cambios-y-devoluciones"),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Bobby's Pet Shop",
      url: SITE_URL,
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE_URL}/#store` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FBF7F1] text-[#243C3A]">
        <JsonLd data={storeStructuredData} />
        <OfficialCartProvider liveInventoryEnabled>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <WhatsAppFloatingButton />
          <MetaPixelConsent />
        </OfficialCartProvider>
      </body>
    </html>
  );
}
