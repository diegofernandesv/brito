"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const MAGNETIC = ".pill, .icon-btn";

/**
 * Dot that follows the pointer and expands into a label over [data-cursor]
 * elements. Buttons are magnetic: they lean toward the pointer while hovered.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = dot.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    let visible = false;
    let active: string | null = null;
    let magnet: HTMLElement | null = null;

    const release = (target: HTMLElement) =>
      gsap.to(target, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to(el, { opacity: 1, duration: 0.2 });
      }

      const target = e.target as HTMLElement;

      // Magnetic buttons.
      const nextMagnet = target.closest<HTMLElement>(MAGNETIC);
      if (magnet && magnet !== nextMagnet) release(magnet);
      magnet = nextMagnet && !(nextMagnet as HTMLButtonElement).disabled ? nextMagnet : null;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(magnet, { x: dx * 0.35, y: dy * 0.45, duration: 0.5, ease: "power3.out", overwrite: true });
      }

      // Cursor state.
      const next = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? (magnet ? "" : null);
      if (next === active) return;
      active = next;
      if (next) {
        label.current!.textContent = next;
        gsap.to(el, { width: 88, height: 88, backgroundColor: "#fff", duration: 0.5, ease: "expo.out" });
        gsap.to(label.current, { opacity: 1, scale: 1, duration: 0.3, delay: 0.05 });
      } else if (next === "") {
        // Over a button: the dot shrinks away so the button's own hover reads.
        gsap.to(el, { width: 0, height: 0, duration: 0.4, ease: "expo.out" });
        gsap.to(label.current, { opacity: 0, scale: 0.6, duration: 0.2 });
      } else {
        gsap.to(el, { width: 10, height: 10, backgroundColor: "#111", duration: 0.5, ease: "expo.out" });
        gsap.to(label.current, { opacity: 0, scale: 0.6, duration: 0.2 });
      }
    };

    const onDown = () => gsap.to(el, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    const onLeave = () => {
      visible = false;
      gsap.to(el, { opacity: 0, duration: 0.2 });
      if (magnet) release(magnet);
      magnet = null;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="cursor" ref={dot} aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
