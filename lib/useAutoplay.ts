"use client";

import { useEffect, type RefObject } from "react";

/**
 * Plays a muted video only while `target` (defaults to the video) is near the
 * viewport, and pauses it otherwise. Pass `enabled: false` to keep it paused.
 */
export function useAutoplay(
  video: RefObject<HTMLVideoElement | null>,
  { target, enabled = true }: { target?: RefObject<HTMLElement | null>; enabled?: boolean } = {},
) {
  useEffect(() => {
    const el = video.current;
    const watched = target?.current ?? el;
    if (!el || !watched) return;
    if (!enabled) {
      el.pause();
      return;
    }

    let inView = false;
    const tryPlay = () => {
      if (inView && el.paused) el.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          if (el.preload === "none") el.preload = "auto";
          tryPlay();
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(watched);
    // A play() fired while the clip is still loading can be aborted; retry once it's ready.
    el.addEventListener("canplay", tryPlay);
    return () => {
      io.disconnect();
      el.removeEventListener("canplay", tryPlay);
    };
  }, [video, target, enabled]);
}
