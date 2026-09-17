import Site from "@/components/Site";
import { contact } from "@/lib/content";
import { site } from "@/lib/site";

/** Structured data so search engines understand who the site belongs to. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${site.url}#page`,
      url: site.url,
      name: `${site.name} — ${site.jobTitle}`,
      description: site.description,
      inLanguage: "es",
      primaryImageOfPage: `${site.url}${site.ogImage}`,
      mainEntity: { "@id": `${site.url}#person` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}#person`,
      name: site.personName,
      alternateName: site.name,
      jobTitle: site.jobTitle,
      description: site.description,
      url: site.url,
      image: `${site.url}${site.ogImage}`,
      email: `mailto:${contact.email}`,
      sameAs: [contact.instagram],
      knowsLanguage: ["es", "en", "fr"],
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressCountry: site.country,
      },
      knowsAbout: [
        "Dirección audiovisual",
        "Producción audiovisual",
        "Documentales",
        "Videoclips",
        "Contenido para redes sociales",
        "Fotografía",
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Site />
    </>
  );
}
