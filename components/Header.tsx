"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollSmoother, ScrollTrigger, useGSAP, scrollToSection } from "@/lib/gsap";
import { contact } from "@/lib/content";

const links = [
  { id: "trabajos", label: "Trabajos" },
  { id: "campanas", label: "Contenido y campañas" },
  { id: "documentales", label: "Documentales" },
  { id: "videoclips", label: "VideoClips" },
  { id: "fotografias", label: "Fotografías" },
  { id: "habilidades", label: "Habilidades" },
  { id: "contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const header = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(menu);
      tl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(
          menu.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" },
        )
        .fromTo(
          q(".menu__link span"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.05 },
          "-=0.35",
        )
        .fromTo(q(".menu__foot > *"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, "-=0.5");

      // Tuck the header away while scrolling down, bring it back on scroll up.
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const hide = self.direction === 1 && self.scroll() > 300 && !document.body.classList.contains("menu-open");
          header.current?.classList.toggle("is-hidden", hide);
        },
      });
    },
    { scope: menu },
  );

  useEffect(() => {
    if (!tl.current) return;
    document.body.classList.toggle("menu-open", open);
    if (!document.body.classList.contains("is-loading")) ScrollSmoother.get()?.paused(open);
    if (open) header.current?.classList.remove("is-hidden");
    if (open) tl.current.timeScale(1).play();
    else tl.current.timeScale(1.6).reverse();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    // Give the menu a moment to start closing before scrolling.
    setTimeout(() => scrollToSection(id), open ? 350 : 0);
  };

  return (
    <>
      <header ref={header} className={`header${open ? " is-open" : ""}`}>
        <button className="header__logo" onClick={() => go("top")}>
          esbritoo
        </button>
        <div className="header__actions">
          <button className="pill" onClick={() => go("contacto")}>
            <span className="pill__roll" data-text="Contacto">
              Contacto
            </span>
          </button>
          <button
            className="icon-btn burger"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>

      <div className="menu" ref={menu} aria-hidden={!open}>
        <nav className="menu__nav">
          {links.map((l, i) => (
            <button key={l.id} className="menu__link" onClick={() => go(l.id)} tabIndex={open ? 0 : -1}>
              <span>
                <sup>{String(i + 1).padStart(2, "0")}</sup>
                {l.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={contact.instagram} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
            Instagram
          </a>
          <a href={`mailto:${contact.email}`} tabIndex={open ? 0 : -1}>
            {contact.email}
          </a>
          <span>Caracas, Venezuela</span>
        </div>
      </div>
    </>
  );
}
