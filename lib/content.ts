// All site content lives here. Swap the placeholder video URLs for your own
// files (e.g. drop MP4s in /public/videos and use "/videos/clip.mp4").

export type Work = {
  title: string;
  meta: string;
  video?: string;
  poster?: string;
};

const pexels = (id: string, fps: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_1920_1080_${fps}fps.mp4`;

export const recentWorks: Work[] = [
  { title: "El lugar donde empieza el sol", meta: "Documental - 2024", video: pexels("1409899", 25) },
  { title: "Caracas en movimiento", meta: "Documental - 2024", video: pexels("3129671", 30) },
  { title: "Horizonte", meta: "Cortometraje - 2023", video: pexels("2519660", 24) },
];

export const campaigns: Work[] = [
  { title: "Verano sin filtros", meta: "Campaña - 2024", video: pexels("856973", 25) },
  { title: "Ritual de café", meta: "Contenido - 2024", video: pexels("1093662", 30) },
  { title: "Nueva colección", meta: "Campaña - 2023", video: pexels("3045163", 25) },
  { title: "Detrás de cámaras", meta: "Contenido - 2023", video: pexels("5752729", 30) },
];

export const videoclips: Work[] = [
  { title: "Luces de ciudad", meta: "VideoClip - 2024", video: pexels("4763824", 24) },
  { title: "Marea", meta: "VideoClip - 2024", video: pexels("3209828", 25) },
  { title: "Noches largas", meta: "VideoClip - 2023", video: pexels("1851190", 25) },
  { title: "Volver", meta: "VideoClip - 2023", video: pexels("2098989", 30) },
];

export type Photo = {
  src: string;
  title: string;
  place: string;
  year: string;
  /** Shown like contact-sheet notes under each frame. */
  exif: string;
};

// Placeholder photography from picsum.photos — replace `src` with your own
// files, e.g. "/images/fotos/pompeya.jpg".
const picsum = (id: number) => `https://picsum.photos/id/${id}/1400/1750`;

export const photos: Photo[] = [
  { src: picsum(1027), title: "Retrato en luz natural", place: "Caracas, VE", year: "2024", exif: "85mm · f/1.8 · 1/400" },
  { src: picsum(1005), title: "Frente al mar", place: "La Guaira, VE", year: "2024", exif: "35mm · f/2.8 · 1/1000" },
  { src: picsum(1004), title: "Noche en la costa", place: "Choroní, VE", year: "2023", exif: "24mm · f/1.4 · 1/60" },
  { src: picsum(1011), title: "Travesía", place: "Canaima, VE", year: "2023", exif: "50mm · f/4 · 1/800" },
  { src: picsum(1003), title: "Silencio", place: "Mérida, VE", year: "2023", exif: "135mm · f/2 · 1/500" },
  { src: picsum(1026), title: "Vías al atardecer", place: "Valencia, VE", year: "2024", exif: "35mm · f/5.6 · 1/250" },
  { src: picsum(1035), title: "Caída de agua", place: "Salto Ángel, VE", year: "2022", exif: "16mm · f/8 · 1/30" },
];

export const skills: { left: [string, number][]; right: [string, number][] } = {
  left: [
    ["Dirección", 5],
    ["Guion / Storytelling", 5],
    ["Dirección de fotografía", 5],
    ["Producción", 4],
    ["Color grading", 5],
  ],
  right: [
    ["Premiere Pro", 4],
    ["DaVinci Resolve", 5],
    ["After Effects", 4],
    ["Photoshop", 3],
  ],
};

export const contact = {
  handle: "@esbritoo",
  instagram: "https://instagram.com/esbritoo",
  email: "hola@esbritoo.com",
};
