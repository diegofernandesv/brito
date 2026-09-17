"use client";

import { useState } from "react";
import { ScrollSmoother, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { campaigns, documentaries, videoclips } from "@/lib/content";
import Loader from "./Loader";
import Header from "./Header";
import Hero from "./Hero";
import RecentWorks from "./RecentWorks";
import GridSection from "./GridSection";
import Skills from "./Skills";
import Photos from "./Photos";
import Footer from "./Footer";
import Lightbox from "./Lightbox";
import Cursor from "./Cursor";

export default function Site() {
  const [ready, setReady] = useState(false);

  useGSAP(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const smoothOk =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const smoother = smoothOk
      ? ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 1.1, effects: true })
      : null;
    smoother?.paused(true);
    return () => smoother?.kill();
  });

  useGSAP(
    () => {
      if (!ready) return;
      document.body.classList.remove("is-loading");
      ScrollSmoother.get()?.paused(false);
      ScrollTrigger.refresh();
    },
    { dependencies: [ready] },
  );

  return (
    <>
      <Loader onReveal={() => setReady(true)} />
      <Cursor />
      <Header />
      <Lightbox />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main className={`page${ready ? " is-ready" : ""}`}>
            <Hero ready={ready} />
            <RecentWorks />
            <GridSection id="campanas" title="Contenido y campañas" works={campaigns} />
            <GridSection id="documentales" title="Documentales" works={documentaries} />
            <GridSection id="videoclips" title="VideoClips" works={videoclips} />
            <Photos />
            <Skills />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
