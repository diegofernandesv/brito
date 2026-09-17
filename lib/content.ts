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

const P = "3 / 4";
const L = "4 / 3";

export const photos: Photo[] = [
  { src: "/fotos/foto-01.webp", ratio: P },
  { src: "/fotos/foto-02.webp", ratio: L },
  { src: "/fotos/foto-03.webp", ratio: P },
  { src: "/fotos/foto-04.webp", ratio: P },
  { src: "/fotos/foto-05.webp", ratio: L },
  { src: "/fotos/foto-06.webp", ratio: P },
  { src: "/fotos/foto-07.webp", ratio: L },
  { src: "/fotos/foto-08.webp", ratio: P },
  { src: "/fotos/foto-09.webp", ratio: P },
  { src: "/fotos/foto-10.webp", ratio: P },
];

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
