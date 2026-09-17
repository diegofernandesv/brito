"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const HERO_SRC = "/images/hero-poster.webp";
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * Intro screen: an odometer counter rolls 000→100 while a small frame of the
 * hero image opens up, then the frame flies into the hero's real position
 * (FLIP) and the loader dissolves around it.
 */
export default function Loader({ onReveal }: { onReveal: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const timecode = q(".loader__timecode")[0] as HTMLElement;
      const frame = q(".loader__frame")[0] as HTMLElement;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // One roller per digit; each strip holds 0–9 stacked vertically.
      const rollers = q(".loader__strip").map((strip) =>
        gsap.quickTo(strip, "yPercent", { duration: 0.22, ease: "expo.out" }),
      );
      const bar = gsap.quickSetter(q(".loader__bar")[0], "scaleX");

      const progress = { value: 0 };
      const imageReady = preload(HERO_SRC);

      const showNumber = (n: number) => {
        String(n)
          .padStart(3, "0")
          .split("")
          .forEach((d, i) => rollers[i](-Number(d) * 10));
      };

      const render = () => {
        bar(progress.value / 100);
        // Fake timecode that runs alongside the counter — REC vibes.
        const frames = Math.floor(progress.value * 2.4);
        timecode.textContent = `00:00:${String(Math.floor(frames / 24)).padStart(2, "0")}:${String(frames % 24).padStart(2, "0")}`;
        // Frame opens from its center as the count climbs.
        const inset = 50 - progress.value / 2;
        frame.style.clipPath = `inset(${inset}% ${inset}% ${inset}% ${inset}%)`;
      };

      gsap.set(q(".loader__meta > *, .loader__count"), { yPercent: 110 });
      gsap.set(q(".loader__frame img"), { scale: 1.8 });
      render();

      const tl = gsap.timeline();
      tl.to(q(".loader__meta > *, .loader__count"), {
        yPercent: 0,
        duration: 0.55,
        ease: "power4.out",
        stagger: 0.04,
      });

      // The count climbs in uneven chunks so every digit gets one clean roll
      // per step; the frame and progress bar follow each step smoothly.
      const steps = reduced ? [100] : [17, 41, 68, 89, 100];
      const stepDuration = reduced ? 0.25 : 0.16;
      const stepGap = reduced ? 0 : 0.03;
      tl.addLabel("count", "<0.15");
      steps.forEach((value, i) => {
        tl.to(
          progress,
          {
            value,
            duration: stepDuration,
            ease: "power3.inOut",
            onStart: () => showNumber(value),
            onUpdate: render,
          },
          i === 0 ? "count" : `+=${stepGap}`,
        );
      });
      const countDuration = tl.duration() - tl.labels.count;
      tl.to(q(".loader__frame img"), { scale: 1.2, duration: countDuration, ease: "power2.inOut" }, "count")
        .add(() => {
          tl.pause();
          imageReady.then(() => tl.play());
        })
        // Let the last digit settle on 100 before leaving.
        .to({}, { duration: 0.18 });

      tl.to(q(".loader__count, .loader__meta > *"), {
        yPercent: -230,
        duration: 0.45,
        ease: "power3.in",
        stagger: 0.02,
      }).to(
        q(".loader__bar"),
        { transformOrigin: "100% 50%", scaleX: 0, duration: 0.45, ease: "power3.inOut" },
        "<",
      );

      tl.add(() => {
        const hero = document.querySelector(".hero__media");
        if (!hero) return;
        const r = hero.getBoundingClientRect();
        const f = frame.getBoundingClientRect();

        gsap
          .timeline({
            onComplete: () => {
              gsap.set(root.current, { display: "none" });
            },
          })
          .to(frame, {
            x: r.left - f.left,
            y: r.top - f.top,
            width: r.width,
            height: r.height,
            duration: reduced ? 0.01 : 0.9,
            ease: "expo.inOut",
          })
          .to(q(".loader__bg"), { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "-=0.6")
          .add(onReveal, "-=0.35")
          // Let the real hero sit underneath before removing the frame.
          .to(frame, { opacity: 0, duration: 0.3 }, "+=0.25");
      });
    },
    { scope: root },
  );

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader__bg" />
      <div className="loader__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="" />
      </div>
      <div className="loader__meta loader__meta--tl">
        <span>esbritoo</span>
      </div>
      <div className="loader__meta loader__meta--tr">
        <span className="loader__rec">
          <i /> REC
        </span>
        <span className="loader__timecode">00:00:00:00</span>
      </div>
      <div className="loader__meta loader__meta--bl">
        <span>Filmmaker &amp; Director Creativo</span>
        <span>Caracas, Venezuela</span>
      </div>
      <div className="loader__count-wrap">
        <div className="loader__count">
          {[0, 1, 2].map((i) => (
            <span key={i} className="loader__digit">
              <span className="loader__strip">
                {DIGITS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ))}
        </div>
      </div>
      <span className="loader__bar" />
    </div>
  );
}
