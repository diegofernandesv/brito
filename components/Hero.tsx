"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, scrollToSection } from "@/lib/gsap";

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Scroll parallax — the image is scaled 1.2 from its center, so it can
  // drift 8% without ever exposing the edge of the frame.
  useGSAP(
    () => {
      gsap.to(".hero__media img", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: ".hero__media", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.set(".hero__intro [data-split], .hero__intro [data-fade]", { autoAlpha: 0 });
    },
    { scope: root },
  );

  // Text entrance, fired when the loader's frame lands on the hero.
  useGSAP(
    () => {
      if (!ready) return;
      const split = SplitText.create(".hero__intro [data-split]", { type: "lines", mask: "lines" });
      gsap.set(".hero__intro [data-split]", { autoAlpha: 1 });
      gsap
        // Revert once shown so the copy reflows naturally (rotation, resize, late fonts).
        .timeline({ delay: 0.25, onComplete: () => split.revert() })
        .from(split.lines, { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.05 })
        .fromTo(
          ".hero__intro [data-fade]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
          "-=0.8",
        )
        .fromTo(".hero__rule", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0);
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section className="hero" ref={root} id="top">
      <div className="hero__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero.jpg" alt="Gabriel Brito en Pompeya" />
      </div>

      <div className="hero__intro">
        <div className="hero__about">
          <div className="hero__copy">
            <h1 className="t-heading" data-split>
              Filmmaker, Productor Audiovisual &amp; Director Creativo
            </h1>
            <p className="t-body" data-split>
              Me llamo Gabriel, tengo 22 años y soy de Caracas, Venezuela. Soy filmmaker, licenciado en producción
              audiovisual y director creativo de contenido para redes sociales, documentales y videoclips.
            </p>
          </div>
          <button className="pill pill--wide" data-fade onClick={() => scrollToSection("trabajos")}>
            <span className="pill__roll" data-text="Mis trabajos">
              Mis trabajos
            </span>
          </button>
        </div>

        <div className="hero__side">
          <blockquote className="hero__quote" data-split>
            “No podemos cambiar lo que vemos, pero sí nuestra capacidad de ver”
          </blockquote>
          <div className="hero__meta">
            <span className="hero__rule" aria-hidden="true" />
            <span data-fade>Caracas, Venezuela</span>
            <button className="hero__scroll" data-fade onClick={() => scrollToSection("trabajos")}>
              Scroll <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
