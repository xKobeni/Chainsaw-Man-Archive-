"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import Lenis from "lenis";
import { navigation } from "@/data/navigation";
import { characters } from "@/data/characters";
import { gsap, ScrollTrigger, useGSAP, motionQuery, wipe } from "@/animations/gsap";
import { magneticHover } from "@/animations/magnetic";
import { useModal } from "@/lib/useModal";
import type { Part } from "@/types/archive";
import { CharacterProfile } from "./CharacterProfile";
import { CustomCursor } from "./CustomCursor";
import { TransitionLink } from "./TransitionLink";

interface ArchiveContextValue {
  navigate: (href: string) => void;
  part: Part;
  character: string;
  selectPart: (part: Part) => void;
  selectCharacter: (id: string) => void;
  openProfile: (id: string) => void;
  devil: number;
  setDevil: (index: number) => void;
  arc: number;
  setArc: (index: number) => void;
  volume: number;
  setVolume: (number: number) => void;
}
const ArchiveContext = createContext<ArchiveContextValue | null>(null);
export function useArchive() {
  const value = useContext(ArchiveContext);
  if (!value) throw new Error("Archive components require ArchiveShell");
  return value;
}

export function ArchiveShell({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const [profile, setProfile] = useState<string | null>(null);
  const [part, setPart] = useState<Part>("1");
  const [character, setCharacter] = useState("denji");
  const [devil, setDevil] = useState(0);
  const [arc, setArc] = useState(0);
  const [volume, setVolume] = useState(1);
  const pending = useRef(false);
  const transition = useRef<gsap.core.Timeline | null>(null);
  const lenis = useRef<Lenis | null>(null);
  const modalOpen = useRef(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeProfile = useCallback(() => setProfile(null), []);
  useModal(menuOpen, menu, closeMenu);
  const { contextSafe } = useGSAP({ scope: root });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(`${motionQuery} and (min-width: 761px) and (hover: hover) and (pointer: fine)`, () => {
      const scroll = new Lenis({ lerp: .12, smoothWheel: true, syncTouch: false, allowNestedScroll: true, stopInertiaOnNavigate: true, prevent: (node) => !!node.closest("#mn,#pf") });
      lenis.current = scroll;
      if (modalOpen.current) scroll.stop();
      scroll.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => scroll.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        scroll.off("scroll", ScrollTrigger.update);
        scroll.destroy();
        if (lenis.current === scroll) lenis.current = null;
      };
    });
    return () => media.revert();
  }, { scope: root });

  useEffect(() => {
    modalOpen.current = menuOpen || !!profile;
    if (modalOpen.current) lenis.current?.stop(); else lenis.current?.start();
  }, [menuOpen, profile]);

  useGSAP(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("csm") === "1"; } catch { /* Storage is optional. */ }
    const reduced = !matchMedia(motionQuery).matches;
    const media = gsap.matchMedia();
    let headerEntrance: gsap.core.Tween | null = null;
    media.add(motionQuery, () => {
      headerEntrance = gsap.fromTo("header>*", { y: -24, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .55, ease: "expo.out", paused: true, clearProps: "transform,opacity" });
    });
    media.add(`${motionQuery} and (hover: hover)`, () => {
      const button = root.current?.querySelector<HTMLElement>("#mb");
      if (button) return magneticHover(button);
    });
    let active = true;
    let fallback = 0;
    let stopImageWait = () => {};
    const loader = root.current?.querySelector<HTMLElement>("#ld");
    const blockWheel = (event: WheelEvent) => { event.preventDefault(); event.stopPropagation(); };
    if (reduced) {
      document.documentElement.dataset.csmSeen = "1";
      document.documentElement.dataset.csmReveal = "1";
      gsap.set("#ld", { display: "none" });
      try { sessionStorage.setItem("csm", "1"); } catch { /* Storage is optional. */ }
    } else {
      loader?.addEventListener("wheel", blockWheel, { passive: false });
      let assetsReady = false;
      const splitAt = .85;
      const intro = gsap.timeline({ paused: true, onComplete: () => {
        document.documentElement.dataset.csmSeen = "1";
        try { sessionStorage.setItem("csm", "1"); } catch { /* Storage is optional. */ }
      } }).to("#ld i", { scaleX: 1, duration: seen ? 0 : .28, ease: "power3.out" }, 0);
      if (!seen) intro.fromTo("#ld .ld-word", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .48, ease: "expo.out" }, .14);
      intro
        .call(() => { if (!assetsReady) intro.pause(); }, undefined, splitAt)
        .call(() => {
          document.documentElement.dataset.csmReveal = "1";
          window.dispatchEvent(new Event("csm:reveal"));
          headerEntrance?.play();
        }, undefined, splitAt + .001)
        .to("#ld .ld-top", { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, splitAt + .001)
        .to("#ld .ld-bottom", { yPercent: 100, duration: 1.05, ease: "power4.inOut" }, splitAt + .001)
        .to("#ld i", { scaleX: 0, duration: .2, ease: "power4.inOut" }, splitAt + .001)
        .to("#ld .ld-activity", { opacity: 0, duration: .15 }, splitAt + .001)
        .set("#ld", { display: "none" });
      intro.play();
      const artwork = pathname === "/" ? root.current?.querySelector(".hero-artwork") : null;
      const imageReady = artwork ? new Promise<void>((resolve) => {
        const check = () => {
          const image = artwork.querySelector<HTMLImageElement>("img");
          if (image?.complete && image.naturalWidth > 0) {
            stopImageWait();
            image.decode().then(resolve, resolve);
          }
        };
        artwork.addEventListener("load", check, true);
        stopImageWait = () => artwork.removeEventListener("load", check, true);
        check();
      }) : Promise.resolve();
      const fontsReady = Promise.all([document.fonts.ready, document.fonts.load("1em Anton"), document.fonts.load('1em "Space Mono"'), document.fonts.load('900 1em "Noto Serif JP"')]);
      const release = () => {
        if (!active || assetsReady) return;
        assetsReady = true;
        window.clearTimeout(fallback);
        stopImageWait();
        intro.play();
      };
      fallback = window.setTimeout(release, 5000);
      Promise.all([fontsReady, imageReady]).then(release, release);
    }
    return () => { active = false; window.clearTimeout(fallback); stopImageWait(); loader?.removeEventListener("wheel", blockWheel); media.revert(); };
  }, { scope: root });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      if (!menuOpen) return;
      gsap.fromTo("#ml li a", { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: .9, ease: "expo.out", stagger: .07, delay: .4, clearProps: "transform" });
      gsap.fromTo("#pv b", { yPercent: -30, opacity: 0 }, { yPercent: 0, opacity: .9, duration: 1, ease: "expo.out", delay: .5 });
      gsap.fromTo("#pv span", { opacity: 0 }, { opacity: 1, delay: .8 });
    });
    return () => media.revert();
  }, { scope: root, dependencies: [menuOpen], revertOnUpdate: true });

  useGSAP(() => {
    setMenuOpen(false);
    setProfile(null);
    if (!pending.current) return;
    pending.current = false;
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
    lenis.current?.resize();
    const reduced = !matchMedia(motionQuery).matches;
    transition.current = gsap.timeline({ onComplete: () => {
      gsap.set(["#wp", "#wk"], { pointerEvents: "none" });
      root.current?.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
    } }).to("#wp", { clipPath: wipe.end, duration: reduced ? 0 : .55, ease: "power4.inOut" }, .05)
      .to("#wk", { clipPath: wipe.end, duration: reduced ? 0 : .55, ease: "power4.inOut" }, .15);
  }, { scope: root, dependencies: [pathname], revertOnUpdate: true });

  const navigate = (href: string) => contextSafe(() => {
    setMenuOpen(false);
    setProfile(null);
    if (href === pathname || pending.current) return;
    pending.current = true;
    transition.current?.kill();
    const reduced = !matchMedia(motionQuery).matches;
    transition.current = gsap.timeline({ onComplete: () => router.push(href) })
      .set(["#wp", "#wk"], { pointerEvents: "auto" })
      .fromTo("#wp", { clipPath: wipe.start }, { clipPath: wipe.full, duration: reduced ? 0 : .5, ease: "power4.inOut" })
      .fromTo("#wk", { clipPath: wipe.start }, { clipPath: wipe.full, duration: reduced ? 0 : .5, ease: "power4.inOut" }, reduced ? 0 : .12);
  })();
  const selectCharacter = (id: string) => {
    const selected = characters.find((item) => item.id === id);
    if (!selected) return;
    setCharacter(id);
    if (!selected.parts.includes(part)) setPart(selected.parts[0]);
  };
  const selectPart = (next: Part) => {
    setPart(next);
    if (!characters.find((item) => item.id === character)?.parts.includes(next)) {
      setCharacter(characters.find((item) => item.parts.includes(next))!.id);
    }
  };
  const item = navigation[preview];
  return <ArchiveContext.Provider value={{ navigate, part, character, selectPart, selectCharacter, openProfile: setProfile, devil, setDevil, arc, setArc, volume, setVolume }}>
    <div ref={root}>
      <CustomCursor />
      <div id="ld" role="status" aria-label="Loading archive"><i /><h1 className="d"><span className="ld-half ld-top"><span className="ld-word">Chainsaw</span></span><span className="ld-half ld-bottom"><span className="ld-word">Man</span><span className="ld-activity" aria-hidden="true" /></span></h1></div>
      <div id="wp" aria-hidden="true" /><div id="wk" aria-hidden="true" />
      <a className="skip-link" href="#main">SKIP TO CONTENT</a>
      <header inert={menuOpen || !!profile}>
        <TransitionLink href="/" className="wm" aria-label="Home"><span>CSM</span><b>{"//"}</b><span>ARCHIVE</span></TransitionLink>
        <span id="pt">{pathname === "/" ? "PART 1 — 2 · チェンソーマン" : navigation.find((entry) => entry.href === pathname)?.label ?? pathname.slice(1).toUpperCase()}</span>
        <button id="mb" aria-expanded={menuOpen} aria-controls="mn" onClick={() => setMenuOpen(true)}>MENU</button>
      </header>
      <nav ref={menu} id="mn" className={menuOpen ? "on" : ""} aria-label="Main" aria-modal={menuOpen || undefined} role="dialog" inert={!menuOpen}>
        <button className="menu-close" onClick={closeMenu}>CLOSE <X size={18} aria-hidden="true" /></button>
        <ul id="ml">{navigation.map((entry, index) => <li key={entry.href}>
          <TransitionLink href={entry.href} aria-current={pathname === entry.href ? "page" : undefined} onMouseEnter={() => setPreview(index)} onFocus={() => setPreview(index)} onClick={closeMenu}>
            <small>0{index + 1}</small>{entry.label}<em>{entry.japanese}</em>
          </TransitionLink>
        </li>)}</ul>
        <div id="pv" style={{ background: item.color }} aria-hidden="true"><b>{String(preview + 1).padStart(2, "0")}</b><span>{item.label}</span></div>
      </nav>
      <main id="main" tabIndex={-1} inert={menuOpen || !!profile}>{children}</main>
      <CharacterProfile id={profile} close={closeProfile} />
    </div>
  </ArchiveContext.Provider>;
}
