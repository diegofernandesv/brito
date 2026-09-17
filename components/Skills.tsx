"use client";

import { useRef } from "react";
import { gsap, revealHeading, useGSAP } from "@/lib/gsap";
import { skills } from "@/lib/content";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="skill__stars" aria-label={`${rating} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "is-on" : "is-off"}>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      revealHeading(root.current!.querySelector(".section__head")!);
      gsap.utils.toArray<HTMLElement>(".skills__col").forEach((col, c) => {
        const rows = col.querySelectorAll(".skill");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: col, start: "top 85%" },
          delay: c * 0.15,
        });
        // Border lines draw in, names rise, then ratings appear one after another.
        tl.fromTo(rows, { "--line": 0 }, { "--line": 1, duration: 1.2, ease: "expo.inOut", stagger: 0.08 })
          .from(col.querySelectorAll(".skills__title, .skill__name"), { yPercent: 60, opacity: 0, duration: 0.7, stagger: 0.08 }, "<0.2")
          .from(
            col.querySelectorAll(".skill__stars .is-on"),
            { scale: 0, rotate: -90, opacity: 0, duration: 0.5, ease: "back.out(3)", stagger: 0.03 },
            "<0.2",
          )
          .from(col.querySelectorAll(".skill__stars .is-off, .skill__level"), { opacity: 0, duration: 0.4, stagger: 0.03 }, "<0.4");
      });
    },
    { scope: root },
  );

  return (
    <section className="section" id="habilidades" ref={root}>
      <div className="section__head">
        <h2 className="t-heading">Habilidades</h2>
      </div>
      <div className="skills">
        {skills.map((col) => (
          <div className="skills__col" key={col.title}>
            <p className="skills__title">{col.title}</p>
            {col.rows.map((row) => (
              <div className="skill" key={row.name}>
                <span className="skill__name">{row.name}</span>
                {row.stars !== undefined ? <Stars rating={row.stars} /> : <span className="skill__level">{row.level}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
