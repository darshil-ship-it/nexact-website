"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

export function AmbientVideo({ src, poster, className }: { src: string; poster?: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) { video.pause(); return; }
    let visible = false;
    const syncPlayback = () => {
      if (visible && !document.hidden) void video.play().catch(() => { /* Autoplay may be blocked. */ });
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); }, { threshold: 0.05 });
    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", syncPlayback); video.pause(); };
  }, [reducedMotion]);

  return <video ref={videoRef} className={className} src={src} poster={poster || undefined} autoPlay={!reducedMotion} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} />;
}
