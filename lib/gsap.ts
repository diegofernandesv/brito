"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, useGSAP);
  (window as any).__gsap = gsap; // TEMP-DEBUG
}

export { gsap, ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText, useGSAP };

/**
 * Section title entrance: characters rise out of a mask, trailing extras
 * (counters, arrows) fade in after. Call inside a useGSAP scope.
 */
export function revealHeading(head: Element) {
  const title = head.querySelector("h2");
  if (!title) return;
  const split = SplitText.create(title, { type: "words,chars", mask: "chars" });
  gsap
    .timeline({ scrollTrigger: { trigger: head, start: "top 88%" } })
    .from(split.chars, { yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.018 })
    .from(
      Array.from(head.children).filter((c) => c !== title),
      { opacity: 0, x: 12, duration: 0.7, ease: "power3.out" },
      "-=0.6",
    );
}

/** Scroll to a section id, through ScrollSmoother when it is active. */
export function scrollToSection(id: string) {
  const target = id === "top" ? 0 : document.getElementById(id);
  if (target === null) return;
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(target, true, "top 80px");
  } else {
    gsap.to(window, {
      duration: 1.2,
      ease: "power3.inOut",
      scrollTo: target === 0 ? 0 : { y: target, offsetY: 80 },
    });
  }
}
