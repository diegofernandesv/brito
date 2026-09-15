"use client";

import { useRef, useState } from "react";
import { useAutoplay } from "@/lib/useAutoplay";
import type { Work } from "@/lib/content";

export const OPEN_VIDEO_EVENT = "open-video";

/** Opens the full-screen video player (see Lightbox). */
export const openVideo = (work: Work) => window.dispatchEvent(new CustomEvent(OPEN_VIDEO_EVENT, { detail: work }));

type Props = {
  work: Work;
  /** "overlay" puts the caption inside the box (grids), "below" under it (recent works). */
  caption: "overlay" | "below";
  className?: string;
};

/**
 * Gray box from the design. When the work has a video, it lazy-plays muted
 * while on screen and opens full-size with sound on click.
 */
export default function MediaCard({ work, caption, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const isVideo = Boolean(work.video);

  useAutoplay(video, { target: box });

  const open = () => {
    if (isVideo) openVideo(work);
  };

  const text = (
    <div className="card__caption">
      <p className="card__title">{work.title}</p>
      <p className="card__meta">{work.meta}</p>
    </div>
  );

  return (
    <article
      className={`card card--${caption} ${isVideo ? "card--video" : "card--photo"} ${className}`}
      data-reveal
    >
      <div
        ref={box}
        className={`card__media${loaded ? " is-loaded" : ""}`}
        data-cursor={isVideo ? "Ver" : undefined}
        onClick={open}
        role={isVideo ? "button" : undefined}
        tabIndex={isVideo ? 0 : undefined}
        aria-label={isVideo ? `Reproducir ${work.title}` : undefined}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      >
        <div className="card__inner">
          {isVideo && (
            <video
              ref={video}
              src={work.video}
              poster={work.poster}
              muted
              loop
              playsInline
              preload="none"
              onPlaying={() => setLoaded(true)}
            />
          )}
          {!isVideo && work.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={work.poster} alt={work.title} onLoad={() => setLoaded(true)} />
          )}
        </div>
        {caption === "overlay" && text}
      </div>
      {caption === "below" && text}
    </article>
  );
}
