"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, scrollToSection } from "@/lib/gsap";
import { contact } from "@/lib/content";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".footer__big", { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1,
        ease: "power4.out",
        stagger: 0.025,
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });
      gsap.from(".footer__links > *", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <footer className="footer" id="contacto" ref={root}>
      <a
        className="footer__cta"
        href={contact.instagram}
        target="_blank"
        rel="noreferrer"
        data-cursor="Instagram"
        aria-label={`Trabajemos juntos: escríbeme por Instagram, ${contact.handle}`}
      >
        <span className="footer__big">Trabajemos Juntos</span>
        <span className="footer__big">{contact.handle}</span>
        <span className="footer__ig">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
          </svg>
          Escríbeme por Instagram
          <span aria-hidden="true">↗</span>
        </span>
      </a>
      <div className="footer__links">
        <a href={`mailto:${contact.email}`} className="link">
          {contact.email}
        </a>
        <a href={contact.instagram} target="_blank" rel="noreferrer" className="link">
          Instagram
        </a>
        <span>Caracas, Venezuela</span>
        <button className="link" onClick={() => scrollToSection("top")}>
          Volver arriba ↑
        </button>
      </div>
      <p className="footer__legal">© {new Date().getFullYear()} esbritoo. Todos los derechos reservados.</p>
    </footer>
  );
}
