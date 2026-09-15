import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "esbritoo — Filmmaker & Director Creativo",
  description:
    "Portafolio de Gabriel Brito: filmmaker, productor audiovisual y director creativo de Caracas, Venezuela.",
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
