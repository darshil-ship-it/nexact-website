"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { navigation, primaryAction } from "@/content/navigation";
import { site } from "@/content/site";

const menuTransition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] } as const;

function BrandMark({ onClick }: { onClick?: () => void }) {
  return (
    <Link className="nav-wordmark" href="/" aria-label="NexAct Global home" onClick={onClick}>
      <span>NexAct</span>
      <small>GLOBAL</small>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const previousScroll = useRef(0);
  const frame = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    previousScroll.current = window.scrollY;
    const updateNavigation = () => {
      const currentScroll = Math.max(window.scrollY, 0);
      const delta = currentScroll - previousScroll.current;
      setScrolled(currentScroll > 24);
      if (currentScroll <= 80 || menuOpen) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -4) setHidden(false);
      previousScroll.current = currentScroll;
      frame.current = null;
    };
    const onScroll = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(updateNavigation);
    };
    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [menuOpen]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1180px)");
    const closeAtDesktop = () => {
      if (!query.matches) return;
      setMenuOpen(false);
      dialog.current?.close();
      document.body.style.overflow = "";
    };
    query.addEventListener("change", closeAtDesktop);
    return () => query.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => () => { document.body.style.overflow = ""; }, []);

  function openMenu() {
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    setMenuOpen(true);
    setHidden(false);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    setMenuOpen(false);
    document.body.style.overflow = "";
    dialog.current?.close();
    if (restoreFocus) trigger.current?.focus();
  }

  const navLink = (item: (typeof navigation)[number], mobile = false) => (
    <Link
      key={item.href}
      className={mobile ? "mobile-nav-link" : "desktop-nav-link"}
      href={item.href}
      aria-current={pathname === item.href ? "page" : undefined}
      onClick={mobile ? () => closeMenu({ restoreFocus: false }) : undefined}
    >
      {item.label}
    </Link>
  );

  const headerClassName = [
    "site-header",
    isHome ? "is-home" : "is-inner-page",
    scrolled ? "is-scrolled" : "is-at-top",
    !isHome || scrolled ? "has-glass" : "",
    hidden ? "is-hidden" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <header className={headerClassName}>
        <div className="nav-frame">
          <button ref={trigger} className="nav-icon-button mobile-menu-trigger nav-contrast" type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={openMenu}>
            <Menu aria-hidden="true" strokeWidth={1.7} />
          </button>
          <nav className="desktop-nav desktop-nav--left nav-contrast" aria-label="Primary left">
            {navigation.slice(0, 3).map((item) => navLink(item))}
          </nav>
          <div className="nav-logo nav-contrast"><BrandMark /></div>
          <div className="nav-right">
            <nav className="desktop-nav desktop-nav--right nav-contrast" aria-label="Primary right">
              {navigation.slice(3).map((item) => navLink(item))}
            </nav>
            <Link className="nav-book-button" href={primaryAction.href}>
              <span className="desktop-book">Book a Meeting</span><span className="mobile-book">Book</span>
            </Link>
          </div>
        </div>
      </header>

      <dialog ref={dialog} className="mobile-menu" aria-label="Site navigation" onCancel={(event) => { event.preventDefault(); closeMenu(); }} onClose={() => { setMenuOpen(false); document.body.style.overflow = ""; }}>
        <motion.div className="mobile-menu__inner" initial={reducedMotion ? false : { opacity: 0, y: -12 }} animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }} transition={reducedMotion ? { duration: 0 } : menuTransition}>
          <div className="mobile-menu__top">
            <BrandMark onClick={() => closeMenu({ restoreFocus: false })} />
            <button className="nav-icon-button" type="button" aria-label="Close navigation" onClick={() => closeMenu()}><X aria-hidden="true" strokeWidth={1.7} /></button>
          </div>
          <motion.nav className="mobile-menu__nav" aria-label="Mobile primary" initial="closed" animate={menuOpen ? "open" : "closed"} variants={{ open: { transition: { staggerChildren: reducedMotion ? 0 : 0.045, delayChildren: reducedMotion ? 0 : 0.08 } } }}>
            {navigation.map((item) => (
              <motion.div key={item.href} variants={{ closed: { opacity: 0, y: reducedMotion ? 0 : 10 }, open: { opacity: 1, y: 0 } }} transition={reducedMotion ? { duration: 0 } : menuTransition}>
                {navLink(item, true)}
              </motion.div>
            ))}
          </motion.nav>
          <div className="mobile-menu__bottom">
            <Link className="mobile-menu__book" href={primaryAction.href} onClick={() => closeMenu({ restoreFocus: false })}>{primaryAction.label}</Link>
            <div className="mobile-menu__utility">
              <Link href="/contact" onClick={() => closeMenu({ restoreFocus: false })}>Contact</Link>
              {(["instagram", "linkedin"] as const).map((network) => site.social[network]
                ? <a key={network} href={site.social[network]} rel="noreferrer">{network}</a>
                : <span key={network} aria-disabled="true">{network}</span>)}
            </div>
          </div>
        </motion.div>
      </dialog>
    </>
  );
}
