/**
 * Single place for the site's public identity, used by metadata, the sitemap
 * and the structured data. Set NEXT_PUBLIC_SITE_URL in Vercel to the real
 * domain once it is live.
 */
export const site = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://esbritoo.vercel.app",
  name: "esbritoo",
  personName: "Gabriel Brito",
  jobTitle: "Filmmaker, productor audiovisual y director creativo",
  city: "Caracas",
  country: "Venezuela",
  description:
    "Gabriel Brito (esbritoo) es filmmaker, licenciado en producción audiovisual y director creativo en Caracas, Venezuela. Documentales, videoclips, campañas y contenido para redes sociales.",
  ogImage: "/og.jpg",
};
