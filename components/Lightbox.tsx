"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollSmoother } from "@/lib/gsap";
import type { Work } from "@/lib/content";
import { OPEN_VIDEO_EVENT } from "./MediaCard";

export default function Lightbox() {
  const [work, setWork] = useState<Work | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setWork((e as CustomEvent<Work>).detail);
    window.addEventListener(OPEN_VIDEO_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_VIDEO_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!work || !root.current) return;
    ScrollSmoother.get()?.paused(true);
    const q = gsap.utils.selector(root);
    gsap
      .timeline()
      .fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
      .fromTo(
        q(".lightbox__player"),
        { clipPath: "inset(12% 12% 12% 12%)", scale: 1.05 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.9, ease: "expo.out" },
        "<",
      )
      .from(q(".lightbox__bar > *"), { y: 16, opacity: 0, stagger: 0.05, duration: 0.5 }, "-=0.6");

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work]);

  const close = () => {
    if (!root.current) return;
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        setWork(null);
        ScrollSmoother.get()?.paused(false);
      },
    });
  };

  if (!work) return null;

  return (
    <div className="lightbox" ref={root} role="dialog" aria-modal="true" aria-label={work.title} onClick={close}>
      <div className="lightbox__bar" onClick={(e) => e.stopPropagation()}>
        <div>
          <p className="card__title">{work.title}</p>
          <p className="card__meta">{work.meta}</p>
        </div>
        <button className="pill pill--light" onClick={close}>
          Cerrar
        </button>
      </div>
      <div className="lightbox__player" onClick={(e) => e.stopPropagation()}>
        <video src={work.video} autoPlay controls playsInline />
      </div>
    </div>
  );
}
