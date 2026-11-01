"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { navigation } from "@/data/navigation";
import { characters } from "@/data/characters";
import { gsap, useGSAP, motionQuery, wipe } from "@/animations/gsap";
import { magneticHover } from "@/animations/magnetic";
import { useModal } from "@/lib/useModal";
import type { Part } from "@/types/archive";
import { CharacterProfile } from "./CharacterProfile";
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
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeProfile = useCallback(() => setProfile(null), []);
  useModal(menuOpen, menu, closeMenu);
  const { contextSafe } = useGSAP({ scope: root });

  useGSAP(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("csm") === "1"; } catch { /* Storage is optional. */ }
    const reduced = !matchMedia(motionQuery).matches;
    if (reduced) {
      document.documentElement.dataset.csmSeen = "1";
      document.documentElement.dataset.csmReveal = "1";
      gsap.set("#ld", { display: "none" });
      try { sessionStorage.setItem("csm", "1"); } catch { /* Storage is optional. */ }
    } else {
      gsap.timeline({ onComplete: () => {
        document.documentElement.dataset.csmSeen = "1";
        try { sessionStorage.setItem("csm", "1"); } catch { /* Storage is optional. */ }
      } })
        .to("#ld i", { scaleX: 1, duration: seen ? 0 : .28, ease: "power3.out" }, 0)
        .fromTo("#ld .ld-word", { y: seen ? 0 : 28, opacity: seen ? 1 : 0 }, { y: 0, opacity: 1, duration: seen ? 0 : .48, ease: "expo.out" }, seen ? 0 : .14)
        .call(() => {
          document.documentElement.dataset.csmReveal = "1";
          window.dispatchEvent(new Event("csm:reveal"));
        }, undefined, seen ? .18 : 1.05)
        .to("#ld .ld-top", { yPercent: -100, duration: 1.05, ease: "power4.inOut" }, seen ? .18 : 1.05)
        .to("#ld .ld-bottom", { yPercent: 100, duration: 1.05, ease: "power4.inOut" }, seen ? .18 : 1.05)
        .to("#ld i", { scaleX: 0, duration: .2, ease: "power4.inOut" }, seen ? .18 : 1.05)
        .set("#ld", { display: "none" });
    }
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      gsap.fromTo("header>*", { y: -24, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .55, ease: "expo.out", delay: seen ? .1 : .78, clearProps: "transform,opacity" });
    });
    media.add(`${motionQuery} and (hover: hover)`, () => {
      const button = root.current?.querySelector<HTMLElement>("#mb");
      if (button) return magneticHover(button);
    });
    return () => media.revert();
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
    window.scrollTo({ top: 0, behavior: "instant" });
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
      <div id="ld" role="status" aria-label="Loading archive"><i /><h1 className="d"><span className="ld-half ld-top"><span className="ld-word">Chainsaw</span></span><span className="ld-half ld-bottom"><span className="ld-word">Man</span></span></h1></div>
      <div id="wp" aria-hidden="true" /><div id="wk" aria-hidden="true" />
      <a className="skip-link" href="#main">SKIP TO CONTENT</a>
      <header inert={menuOpen || !!profile}>
        <TransitionLink href="/" className="wm" aria-label="Home"><span>CSM</span><b>{"//"}</b><span>ARCHIVE</span></TransitionLink>
        <span id="pt">{pathname === "/" ? "PART 1 — 2 · チェンソーマン" : pathname.slice(1).toUpperCase()}</span>
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
