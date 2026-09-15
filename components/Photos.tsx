"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { gsap, revealHeading, ScrollSmoother, SplitText, useGSAP } from "@/lib/gsap";
import { photos } from "@/lib/content";

/**
 * Editorial collage slots, reused in order if more photos are added.
 * `col` is a 12-column grid placement, `mt` pushes a frame down off the row,
 * `speed` is its parallax depth (>1 drifts up faster, <1 lags behind).
 */
const LAYOUT = [
  { col: "1 / span 5", ratio: "4 / 5", mt: "0px", speed: 0.9 },
  { col: "7 / span 6", ratio: "3 / 2", mt: "clamp(80px, 22vh, 240px)", speed: 1.15 },
  { col: "2 / span 4", ratio: "1 / 1", mt: "0px", speed: 1.1 },
  { col: "7 / span 4", ratio: "4 / 5", mt: "clamp(40px, 12vh, 160px)", speed: 0.92 },
  { col: "11 / span 2", ratio: "3 / 4", mt: "clamp(120px, 34vh, 380px)", speed: 1.3 },
  { col: "1 / span 7", ratio: "3 / 2", mt: "clamp(24px, 6vh, 80px)", speed: 1 },
  { col: "9 / span 4", ratio: "4 / 5", mt: "clamp(60px, 18vh, 200px)", speed: 0.85 },
];

/** The statement line is dropped into the collage after this many photos. */
const STATEMENT_AFTER = 2;

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

export default function Photos() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      revealHeading(root.current!.querySelector(".section__head")!);

      const figures = gsap.utils.toArray<HTMLElement>(".photo");

      // Shutter reveal: the frame opens from its center with a camera flash.
      figures.forEach((fig) => {
        gsap
          .timeline({ scrollTrigger: { trigger: fig, start: "top 88%" } })
          .fromTo(
            fig.querySelector(".photo__frame"),
            { clipPath: "inset(14% 14% 14% 14%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" },
          )
          .fromTo(fig.querySelector("img"), { scale: 1.35 }, { scale: 1, duration: 1.6, ease: "expo.out" }, "<")
          .fromTo(
            fig.querySelector(".photo__flash"),
            { opacity: 0 },
            { opacity: 0.9, duration: 0.08, ease: "none", yoyo: true, repeat: 1, repeatDelay: 0.04 },
            "<0.35",
          )
          .from(
            fig.querySelectorAll(".photo__caption > *"),
            { yPercent: 100, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 },
            "-=0.9",
          );
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        // Depth: every frame drifts at its own speed.
        figures.forEach((fig, i) => {
          const k = (LAYOUT[i % LAYOUT.length].speed - 1) * 320;
          if (k === 0) return;
          gsap.fromTo(
            fig,
            { y: k },
            { y: -k, ease: "none", scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });

      // Statement words ink in as you scroll past.
      const split = SplitText.create(".photos__statement p", { type: "words" });
      gsap.fromTo(
        split.words,
        { color: "#d9d9d9" },
        {
          color: "#000000",
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ".photos__statement", start: "top 80%", end: "bottom 50%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  const figures = photos.map((photo, i) => {
    const slot = LAYOUT[i % LAYOUT.length];
    return (
      <figure
        key={photo.src}
        className="photo"
        style={{ "--col": slot.col, "--ratio": slot.ratio, "--mt": slot.mt } as CSSProperties}
      >
        <button
          className="photo__frame"
          data-cursor="Ampliar"
          aria-label={`Ampliar ${photo.title}`}
          onClick={() => setOpen(i)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} alt={photo.title} loading="lazy" />
          <span className="photo__flash" aria-hidden="true" />
        </button>
        <figcaption className="photo__caption">
          <span className="photo__title">
            <b>#{pad(i + 1, 3)}</b> {photo.title}
          </span>
          <span className="photo__place">
            {photo.place} — {photo.year}
          </span>
          <span className="photo__exif">{photo.exif}</span>
        </figcaption>
      </figure>
    );
  });

  return (
    <section className="section photos" id="fotografias" ref={root}>
      <div className="section__head">
        <h2 className="t-heading">Fotografías</h2>
        <span className="section__count">({pad(photos.length)})</span>
      </div>

      <div className="photos__grid">
        {figures.slice(0, STATEMENT_AFTER)}
        <div className="photos__statement">
          <p>La cámara no inventa nada: solo espera, con paciencia, el instante en que la luz dice la verdad.</p>
        </div>
        {figures.slice(STATEMENT_AFTER)}
      </div>

      {/* Portal: the smooth-scroll content is transformed, which would break position: fixed. */}
      {open !== null &&
        createPortal(<PhotoViewer index={open} onChange={setOpen} onClose={() => setOpen(null)} />, document.body)}
    </section>
  );
}

function PhotoViewer({
  index,
  onChange,
  onClose,
}: {
  index: number;
  onChange: (i: number) => void;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(index);
  const touchX = useRef<number | null>(null);
  const photo = photos[index];
  const total = photos.length;

  const go = useCallback((dir: number) => onChange((index + dir + total) % total), [index, onChange, total]);

  const close = useCallback(() => {
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        ScrollSmoother.get()?.paused(false);
        onClose();
      },
    });
  }, [onClose]);

  // Open.
  useGSAP(
    () => {
      ScrollSmoother.get()?.paused(true);
      gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        ".viewer__bar > *, .viewer__nav",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, delay: 0.15 },
      );
    },
    { scope: root },
  );

  // Each photo change: shutter open from the travel direction.
  useGSAP(
    () => {
      const dir = Math.sign(index - prevIndex.current) || 0;
      prevIndex.current = index;
      gsap.fromTo(
        ".viewer__img",
        { clipPath: dir ? `inset(0% ${dir < 0 ? 100 : 0}% 0% ${dir > 0 ? 100 : 0}%)` : "inset(8% 8% 8% 8%)", scale: 1.08 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1, ease: "expo.inOut" },
      );
      gsap.fromTo(
        ".viewer__meta > *",
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.05, delay: 0.3, overwrite: true },
      );
    },
    { scope: root, dependencies: [index] },
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go]);

  return (
    <div
      className="viewer"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="viewer__bar">
        <span className="viewer__count">
          {pad(index + 1)} / {pad(total)}
        </span>
        <button className="pill pill--wide" onClick={close}>
          <span className="pill__roll" data-text="Cerrar">
            Cerrar
          </span>
        </button>
      </div>

      <div className="viewer__stage" onClick={close}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.src}
          className="viewer__img"
          src={photo.src}
          alt={photo.title}
        />
      </div>

      <div className="viewer__foot">
        <div className="viewer__meta">
          <p className="card__title">{photo.title}</p>
          <p className="card__meta">
            {photo.place} — {photo.year} · {photo.exif}
          </p>
        </div>
        <div className="viewer__nav">
          <button className="icon-btn" aria-label="Foto anterior" onClick={() => go(-1)}>
            ←
          </button>
          <button className="icon-btn" aria-label="Foto siguiente" onClick={() => go(1)}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
