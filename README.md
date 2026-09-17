# esbritoo — portafolio

Next.js + GSAP. Portafolio de Gabriel Brito (filmmaker).

```bash
npm install
npm run dev
```

## Contenido

Todo el contenido está en [`lib/content.ts`](lib/content.ts).

- **Videos propios** (`/public/videos`): cada trabajo tiene tres archivos con el mismo nombre:
  - `nombre-preview.mp4` — loop de 8s sin audio que se reproduce solo dentro de la tarjeta (~1 MB).
  - `nombre.mp4` — video completo, 720p, se descarga solo al hacer clic.
  - `/public/posters/nombre.webp` — imagen que se ve al instante.
- **Videos de YouTube**: solo se guarda la portada en `/public/posters`; el video se reproduce en YouTube.
- **Fotografías**: por ahora son imágenes de prueba (picsum.photos). Faltan las carpetas de Drive.

### Agregar un video propio

Con `ffmpeg` (vertical: cambia `-2:720` por `720:-2`):

```bash
ffmpeg -i original.mp4 -ss 3 -t 8 -an -r 24 -vf scale=-2:720 -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart public/videos/nombre-preview.mp4
ffmpeg -i original.mp4 -vf scale=-2:720 -c:v libx264 -crf 27 -preset slow -maxrate 2M -bufsize 4M -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart public/videos/nombre.mp4
ffmpeg -i original.mp4 -ss 3 -frames:v 1 -vf scale=-2:720 -c:v libwebp -quality 72 public/posters/nombre.webp
```

Los trabajos verticales llevan `ratio: "9 / 16"` en `lib/content.ts`.
