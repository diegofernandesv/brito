"use client";

import { useRef } from "react";
import { gsap, revealHeading, scrollToSection, useGSAP } from "@/lib/gsap";
import { recentWorks } from "@/lib/content";
import MediaCard from "./MediaCard";
import { animateCard } from "./GridSection";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Pinned horizontal showreel: the section locks to the viewport and vertical
 * scroll pans the works sideways. Phones get stacked grid-style cards; touch
 * tablets get a native swipe carousel.
 */
export default function RecentWorks() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const current = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      revealHeading(root.current!.querySelector(".section__head")!);

      const total = recentWorks.length;
      let active = 0;
      const setActive = (i: number, dir: number) => {
        if (i === active || !current.current) return;
        active = i;
        current.current.textContent = pad(i + 1);
        gsap.fromTo(current.current, { yPercent: dir * 100 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
      };

      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const t = track.current!;
        const cards = gsap.utils.toArray<HTMLElement>(".recent__card");
        const distance = () => t.scrollWidth - viewport.current!.clientWidth;

        let last = 0;
        const pan = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          // Runs on every frame of the scrubbed pan (not just on scroll events),
          // so the counter settles correctly after the smoothing catches up.
          onUpdate(this: gsap.core.Tween) {
            // `this`, not `pan`: the first update can fire before `pan` is assigned.
            const p = this.progress();
            gsap.set(bar.current, { scaleX: p });
            // Active work = the card whose center is closest to the screen center.
            const center = window.innerWidth / 2;
            let best = 0;
            let bestDist = Infinity;
            cards.forEach((c, i) => {
              const r = c.getBoundingClientRect();
              const d = Math.abs(r.left + r.width / 2 - center);
              if (d < bestDist) {
                bestDist = d;
                best = i;
              }
            });
            setActive(best, p >= last ? 1 : -1);
            last = p;
          },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        cards.forEach((card, i) => {
          const media = card.querySelector(".card__media");
          const inner = card.querySelector(".card__inner");

          // Footage pans against the direction of travel inside its frame.
          gsap.fromTo(
            inner,
            { xPercent: 8 },
            {
              xPercent: -8,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: pan, start: "left right", end: "right left", scrub: true },
            },
          );

          // The first frame is already on screen; the rest wipe open as they arrive.
          if (i === 0) return;
          gsap.fromTo(
            media,
            { clipPath: "inset(0% 0% 0% 35%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: pan, start: "left right", end: "left 55%", scrub: true },
            },
          );
          gsap.from(card.querySelectorAll(".card__caption > *"), {
            yPercent: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: card, containerAnimation: pan, start: "left 70%" },
          });
        });

        gsap.from(".recent__end > *", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".recent__end", containerAnimation: pan, start: "left 75%" },
        });
      });

      // Phones: stacked cards, same look and entrance as the campaign / videoclip grids.
      mm.add("(max-width: 900px)", () => {
        gsap.utils.toArray<HTMLElement>(".recent__card").forEach(animateCard);
      });

      // Touch tablets / reduced motion: swipe carousel, counter + bar follow native scroll.
      mm.add("(min-width: 901px) and (hover: none), (min-width: 901px) and (prefers-reduced-motion: reduce)", () => {
        const v = viewport.current!;
        const onScroll = () => {
          const max = v.scrollWidth - v.clientWidth;
          const p = max > 0 ? v.scrollLeft / max : 0;
          gsap.set(bar.current, { scaleX: p });
          const next = Math.min(total - 1, Math.round(p * (total - 1)));
          setActive(next, next > active ? 1 : -1);
        };
        v.addEventListener("scroll", onScroll, { passive: true });
        gsap.from(".recent__card", {
          xPercent: 20,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: v, start: "top 85%" },
        });
        return () => v.removeEventListener("scroll", onScroll);
      });
    },
    { scope: root },
  );

  return (
    <section className="section recent" id="trabajos" ref={root}>
      <div className="recent__head section__head">
        <h2 className="t-heading">Mis trabajos más recientes</h2>
        <div className="recent__status" aria-hidden="true">
          <span className="recent__index">
            <span className="recent__index-mask">
              <span ref={current}>01</span>
            </span>
            &nbsp;/ {pad(recentWorks.length)}
          </span>
          <span className="recent__progress">
            <span ref={bar} />
          </span>
        </div>
      </div>

      <div className="recent__viewport" ref={viewport}>
        <div className="recent__track" ref={track}>
          {recentWorks.map((w, i) => (
            <MediaCard key={i} work={w} caption="below" className="recent__card" />
          ))}
          <div className="recent__end">
            <p className="recent__end-title">¿Tienes un proyecto en mente?</p>
            <button className="pill pill--wide" onClick={() => scrollToSection("contacto")}>
              <span className="pill__roll" data-text="Hablemos">
                Hablemos
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
