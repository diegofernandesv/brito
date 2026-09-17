import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.jobTitle}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.personName }],
  creator: site.personName,
  keywords: [
    "filmmaker",
    "videógrafo",
    "producción audiovisual",
    "director creativo",
    "documentales",
    "videoclips",
    "contenido para redes sociales",
    "campañas",
    "fotografía",
    "Caracas",
    "Venezuela",
    "esbritoo",
    "Gabriel Brito",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    locale: "es_ES",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.jobTitle}`,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.personName}, filmmaker` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.jobTitle}`,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1 },
  },
  category: "Video production",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="is-loading">{children}</body>
    </html>
  );
}
