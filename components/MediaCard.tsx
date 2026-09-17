"use client";

import { useRef, useState, type CSSProperties } from "react";
import { useAutoplay } from "@/lib/useAutoplay";
import type { Work } from "@/lib/content";

export const OPEN_VIDEO_EVENT = "open-video";

/** Opens the full-screen player (see Lightbox). */
export const openVideo = (work: Work) => window.dispatchEvent(new CustomEvent(OPEN_VIDEO_EVENT, { detail: work }));

type Props = {
  work: Work;
  /** "overlay" puts the caption inside the box (grids), "below" under it (recent works). */
  caption: "overlay" | "below";
  className?: string;
};

/**
 * Work card. The poster shows immediately; the short muted preview loop is only
 * fetched once the card is near the viewport. Clicking opens the full video
 * (local file or YouTube) in the player.
 */
export default function MediaCard({ work, caption, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const playable = Boolean(work.video || work.youtube);

  useAutoplay(video, { target: box });

  const open = () => {
    if (playable) openVideo(work);
  };

  const text = (
    <div className="card__caption">
      <p className="card__title">{work.title}</p>
      <p className="card__meta">{work.meta}</p>
    </div>
  );

  return (
    <article
      className={`card card--${caption} ${playable ? "card--video" : "card--photo"} ${className}`}
      style={work.ratio ? ({ "--ratio": work.ratio } as CSSProperties) : undefined}
      data-reveal
    >
      <div
        ref={box}
        className={`card__media${work.poster || playing ? " is-loaded" : ""}`}
        data-cursor={playable ? "Ver" : undefined}
        onClick={open}
        role={playable ? "button" : undefined}
        tabIndex={playable ? 0 : undefined}
        aria-label={playable ? `Reproducir ${work.title}` : undefined}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      >
        <div className="card__inner">
          {work.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="card__poster" src={work.poster} alt={work.title} loading="lazy" />
          )}
          {work.preview && (
            <video
              ref={video}
              className={`card__video${playing ? " is-playing" : ""}`}
              src={work.preview}
              muted
              loop
              playsInline
              preload="none"
              onPlaying={() => setPlaying(true)}
            />
          )}
        </div>
        {work.youtube && (
          <span className="card__play" aria-hidden="true">
            ▶
          </span>
        )}
        {caption === "overlay" && text}
      </div>
      {caption === "below" && text}
    </article>
  );
}
