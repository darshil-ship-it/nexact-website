"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { home } from "@/content/home";
import { media } from "@/content/media";

const ease = [0.22, 1, 0.36, 1] as const;

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.035]);
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 18]);

  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;
    if (reducedMotion) { video.pause(); return; }
    let visible = true;
    const syncPlayback = () => {
      if (visible && !document.hidden) void video.play().catch(() => { /* Autoplay may be blocked. */ });
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); }, { threshold: 0.05 });
    observer.observe(hero);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", syncPlayback); video.pause(); };
  }, [reducedMotion]);

  return (
    <section ref={heroRef} className="home-hero" data-nav-theme="light" aria-labelledby="home-hero-title">
      <motion.div className="home-hero__media" style={reducedMotion ? undefined : { scale: mediaScale, y: mediaY }} aria-hidden="true">
        <video
          ref={videoRef}
          className="home-hero__video"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.home.heroPoster || undefined}
          tabIndex={-1}
        >
          <source src={media.home.heroVideo} type="video/mp4" />
        </video>
      </motion.div>
      <div className="home-hero__overlay" aria-hidden="true" />

      <div className="container home-hero__content">
        <motion.p className="home-hero__label" initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease, delay: 0.08 }}>
          {home.hero.label}
        </motion.p>
        <motion.h1 id="home-hero-title" initial={reducedMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.14 }}>
          {home.hero.titleLines.map((line) => <span key={line}>{line}</span>)}
        </motion.h1>
        <motion.p className="home-hero__description" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease, delay: 0.24 }}>
          {home.hero.description}
        </motion.p>
        <motion.div className="home-hero__actions" initial={reducedMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.32 }}>
          <Link className="hero-button hero-button--primary" href={home.hero.primary.href}>{home.hero.primary.label}</Link>
          <Link className="hero-button hero-button--secondary" href={home.hero.secondary.href}>{home.hero.secondary.label}</Link>
        </motion.div>
      </div>

      <motion.div className="home-hero__scroll" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.65 }} aria-hidden="true">
        <span>Scroll to explore</span>
        <ArrowDown size={16} strokeWidth={1.5} />
      </motion.div>
    </section>
  );
}
