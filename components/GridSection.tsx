"use client";

import { useRef } from "react";
import { gsap, revealHeading, useGSAP } from "@/lib/gsap";
import type { Work } from "@/lib/content";
import MediaCard from "./MediaCard";

/**
 * Grid card entrance + scroll parallax, shared with the phone layout of
 * "Mis trabajos más recientes". Call inside a useGSAP scope.
 */
export function animateCard(card: HTMLElement, i: number) {
  const media = card.querySelector(".card__media");
  const inner = card.querySelector(".card__inner");

  // Each card wipes open from the bottom while its media settles from a zoom.
  gsap
    .timeline({ scrollTrigger: { trigger: card, start: "top 90%" }, delay: (i % 2) * 0.12 })
    .fromTo(
      media,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" },
    )
    .fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: "expo.out" }, "<0.2")
    .from(
      card.querySelectorAll(".card__caption > *"),
      { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.06 },
      "-=1.1",
    );

  // Footage drifts inside its frame while the card crosses the viewport.
  gsap.fromTo(
    inner,
    { yPercent: -6 },
    {
      yPercent: 6,
      ease: "none",
      scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

export default function GridSection({ id, title, works }: { id: string; title: string; works: Work[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      revealHeading(root.current!.querySelector(".section__head")!);

      gsap.utils.toArray<HTMLElement>(".card").forEach(animateCard);
    },
    { scope: root },
  );

  return (
    <section className="section" id={id} ref={root}>
      <div className="section__head">
        <h2 className="t-heading">{title}</h2>
      </div>
      <div className="grid">
        {works.map((w, i) => (
          <MediaCard key={i} work={w} caption="overlay" />
        ))}
      </div>
    </section>
  );
}
