// All site content lives here.
//
// Local videos: `preview` is a short muted loop that autoplays inside the card
// (small, so the page stays fast) and `video` is the full compressed version,
// only downloaded when someone clicks. YouTube works use `youtube` instead and
// open in the YouTube player. Every card shows `poster` first, so nothing is
// fetched until it is needed.

export type Work = {
  title: string;
  meta: string;
  /** Frame proportion, e.g. "9 / 16" for vertical social pieces. */
  ratio?: string;
  poster?: string;
  preview?: string;
  video?: string;
  youtube?: string;
};

const VERTICAL = "9 / 16";

/** Local pair built by the compression step: poster + preview + full video. */
const local = (slug: string) => ({
  poster: `/posters/${slug}.webp`,
  preview: `/videos/${slug}-preview.mp4`,
  video: `/videos/${slug}.mp4`,
});

/** YouTube work: poster is stored locally, playback happens on YouTube. */
const yt = (slug: string, id: string) => ({
  poster: `/posters/${slug}.webp`,
  youtube: id,
});

export const recentWorks: Work[] = [
  { title: "HYM x @diogeriik", meta: "Contenido de marca", ratio: VERTICAL, ...local("recent-hym") },
  { title: "Video para pantallas", meta: "Contenido audiovisual", ...local("recent-pantallas") },
  { title: "Edición rápida para eventos", meta: "Eventos", ratio: VERTICAL, ...local("recent-eventos") },
];

export const campaigns: Work[] = [
  { title: "La Ele", meta: "Campaña", ratio: VERTICAL, ...local("camp-la-ele") },
  { title: "HEAD x Belisario Academy", meta: "Campaña", ratio: VERTICAL, ...local("camp-head-belisario") },
  { title: "Nexus", meta: "Contenido de marca", ratio: VERTICAL, ...local("camp-nexus") },
  { title: "CAF", meta: "Corto documental", ...local("camp-caf") },
];

export const documentaries: Work[] = [
  { title: "Mi vida tras la adversidad", meta: "Juan Pablo Dos Santos — 2025", ...yt("doc-adversidad", "swXnpMNNOHU") },
  { title: "Morrocoy, una vista más allá del turista", meta: "Documental — 2026", ...yt("doc-morrocoy", "pgKCN_PLVo0") },
];

export const videoclips: Work[] = [
  { title: "A quién le mientes", meta: "SarahMusicah & Joshua — 2026", ...yt("clip-a-quien-le-mientes", "9wyv2PLmT9Y") },
  { title: "Un Mondo A Parte (Live Session)", meta: "Vincenzo Ferro — 2025", ...yt("clip-un-mondo-a-parte", "kTI_wVBdkU8") },
  { title: "Sorry", meta: "Kimara — 2025", ...yt("clip-sorry", "tm2fC1ja9oM") },
  { title: "Oportunidad", meta: "Joshua — 2024", ...yt("clip-oportunidad", "YY2vPmJRRWg") },
];

export type Photo = {
  src: string;
  /** Natural proportion, so nothing gets cropped in the collage. */
  ratio: string;
};

export type PhotoCategory = {
  title: string;
  photos: Photo[];
};

const P = "3 / 4";
const L = "4 / 3";
const foto = (n: number, ratio = P): Photo => ({ src: `/fotos/foto-${String(n).padStart(2, "0")}.webp`, ratio });

export const photoCategories: PhotoCategory[] = [
  {
    title: "Eventos",
    photos: [foto(11), foto(13), foto(14), foto(12), foto(15)],
  },
  {
    title: "Gastronomía",
    photos: [foto(4), foto(2, L), foto(9), foto(7, L), foto(5, L)],
  },
  {
    title: "Deportes",
    photos: [foto(1), foto(8), foto(3), foto(10), foto(6)],
  },
];

/** Flat list in display order, used by the full-screen viewer. */
export const photos: Photo[] = photoCategories.flatMap((c) => c.photos);

export type SkillColumn = {
  title: string;
  /** Either a 0–5 rating (stars) or a written level. */
  rows: { name: string; stars?: number; level?: string }[];
};

export const skills: SkillColumn[] = [
  {
    title: "Software",
    rows: [
      { name: "Adobe Premiere", stars: 5 },
      { name: "Adobe Photoshop", stars: 5 },
      { name: "Adobe Lightroom", stars: 5 },
      { name: "DaVinci Resolve", stars: 3 },
      { name: "Notion", stars: 3 },
    ],
  },
  {
    title: "Idiomas",
    rows: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "Avanzado (C1)" },
      { name: "Francés", level: "Básico (A1–A2)" },
    ],
  },
];

export const contact = {
  handle: "@esbritoo",
  instagram: "https://instagram.com/esbritoo",
  email: "hola@esbritoo.com",
};
