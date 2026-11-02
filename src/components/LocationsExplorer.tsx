"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, motionQuery } from "@/animations/gsap";
import { arcs } from "@/data/arcs";
import { characters } from "@/data/characters";
import { locations } from "@/data/locations";
import { colorStyle } from "@/lib/archive";
import { useArchive } from "./ArchiveShell";
import { CharacterLink } from "./CharacterLink";
import { PageHeading } from "./PageHeading";
import { TransitionLink } from "./TransitionLink";
import styles from "./LocationsExplorer.module.css";

const locationAliases: Record<string, string> = {
  "Denji’s apartment": "Denji’s Home",
  Hotel: "The Hotel",
  "High school": "Academy",
  School: "Academy",
};

export function LocationsExplorer() {
  const { setArc } = useArchive();
  const root = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    const rail = gallery.current;
    const slide = rail?.querySelectorAll<HTMLElement>(".loc")[Math.max(0, Math.min(index, locations.length - 1))];
    if (!rail || !slide) return;
    const left = rail.scrollLeft + slide.getBoundingClientRect().left - rail.getBoundingClientRect().left - parseFloat(getComputedStyle(rail).scrollPaddingLeft);
    rail.scrollTo({ left, behavior: matchMedia(motionQuery).matches ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    const rail = gallery.current;
    if (!rail) return;
    let frame = 0;
    let wheelIdle = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const snapLine = rail.getBoundingClientRect().left + parseFloat(getComputedStyle(rail).scrollPaddingLeft);
        let nearest = 0;
        let distance = Infinity;
        rail.querySelectorAll<HTMLElement>(".loc").forEach((slide, index) => {
          const next = Math.abs(slide.getBoundingClientRect().left - snapLine);
          if (next < distance) { nearest = index; distance = next; }
        });
        activeRef.current = nearest;
        setActive((current) => current === nearest ? current : nearest);
      });
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        rail.style.scrollSnapType = "none";
        window.clearTimeout(wheelIdle);
        wheelIdle = window.setTimeout(() => { rail.style.scrollSnapType = ""; }, 300);
        return;
      }
      if (!event.shiftKey && document.activeElement !== rail) return;
      if (Math.abs(event.deltaY) < 12 || (event.deltaY < 0 && activeRef.current === 0) || (event.deltaY > 0 && activeRef.current === locations.length - 1)) return;
      event.preventDefault();
      goTo(activeRef.current + Math.sign(event.deltaY));
    };
    rail.addEventListener("scroll", sync, { passive: true });
    rail.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(wheelIdle);
      rail.style.scrollSnapType = "";
      rail.removeEventListener("scroll", sync);
      rail.removeEventListener("wheel", wheel);
      window.removeEventListener("resize", sync);
    };
  }, [goTo]);

  useGSAP(() => {
    const slide = gallery.current?.querySelectorAll<HTMLElement>(".loc")[active];
    if (!slide) return;
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      gsap.fromTo(slide.querySelector("[data-location-image]"), { opacity: .65, clipPath: "inset(0 3% 0 3%)" }, { opacity: 1, clipPath: "inset(0 0% 0 0%)", duration: .55, ease: "power2.out", clearProps: "opacity,clipPath" });
      gsap.fromTo(slide.querySelectorAll("[data-location-copy]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .07, ease: "expo.out", clearProps: "transform,opacity" });
    });
    media.add(motionQuery + " and (min-width: 761px) and (hover: hover) and (pointer: fine)", () => {
      const image = slide.querySelector("img");
      if (!image) return;
      const moveX = gsap.quickTo(image, "x", { duration: .7, ease: "power2.out" });
      const move = (event: PointerEvent) => moveX((event.clientX - slide.getBoundingClientRect().left) / slide.clientWidth * 20 - 10);
      const reset = () => moveX(0);
      slide.addEventListener("pointermove", move);
      slide.addEventListener("pointerleave", reset);
      return () => { slide.removeEventListener("pointermove", move); slide.removeEventListener("pointerleave", reset); };
    });
    return () => media.revert();
  }, { scope: root, dependencies: [active], revertOnUpdate: true });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== gallery.current || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
    event.preventDefault();
    goTo(active + (event.key === "ArrowRight" ? 1 : -1));
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.target instanceof Element && !event.target.closest("a,button")) gallery.current?.focus({ preventScroll: true });
  };

  return <div ref={root} className={styles.explorer}>
    <PageHeading title="World &" accent="Places" japanese="世界">
      <div className={styles.headingMeta} data-heading-detail>
        <p>{String(locations.length).padStart(2, "0")} LOCATIONS / FIELD GUIDE <span>FROM TOKYO TO HELL, FOLLOW THE STORY.</span></p>
        <div className={styles.navigation}>
          <span className={styles.counter} aria-live="polite">{String(active + 1).padStart(2, "0")} <b>/ {String(locations.length).padStart(2, "0")}</b></span>
          <button type="button" aria-label="Previous location" disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft size={21} aria-hidden="true" /></button>
          <button type="button" aria-label="Next location" disabled={active === locations.length - 1} onClick={() => goTo(active + 1)}><ArrowRight size={21} aria-hidden="true" /></button>
        </div>
      </div>
      <div className={styles.progress} role="progressbar" aria-label="Location progress" aria-valuemin={1} aria-valuemax={locations.length} aria-valuenow={active + 1}><span style={{ width: (active + 1) / locations.length * 100 + "%" }} /></div>
    </PageHeading>
    <div ref={gallery} className={[styles.gallery, "hz"].join(" ")} id="hz" tabIndex={0} role="region" aria-label="Location showcase; use left and right arrow keys or swipe horizontally" onKeyDown={onKeyDown} onPointerDown={onPointerDown}>
      {locations.map((location, index) => {
        const related = arcs.map((arc, arcIndex) => ({ arc, arcIndex })).filter(({ arc }) => arc.locations.split(", ").some((name) => (locationAliases[name] ?? name) === location.name));
        return <article key={location.name} className={[styles.panel, "loc"].join(" ")} style={colorStyle(location.color)} aria-label={String(index + 1).padStart(2, "0") + " " + location.name}>
          <div className={styles.image} data-location-image><Image src={location.image ?? "/images/placeholders/artwork.png"} alt={location.image ? location.name + " environment" : location.name + " environment artwork pending"} fill sizes="(max-width: 760px) 90vw, 86vw" priority={index === 0} loading={index === 0 ? "eager" : "lazy"} /></div>
          <div className={styles.topline}><span>WORLD FILE / {String(index + 1).padStart(2, "0")}</span><span className="j">{location.japanese}</span><span className={styles.pending}>{location.image ? "ARCHIVE LOCATION" : "ENVIRONMENT ARTWORK PENDING"}</span></div>
          <div className={styles.body}>
            <div className={styles.copy}>
              <span data-location-copy>{location.subtitle.toUpperCase()}</span>
              <h2 className="d" data-location-copy>{location.name}</h2>
              <p data-location-copy>{location.description}</p>
            </div>
            <div className={styles.related} data-location-copy>
              <div><h3>CONNECTED PEOPLE</h3><div>{location.characters.map((id) => <CharacterLink key={id} id={id}>{characters.find((item) => item.id === id)!.name}<ArrowUpRight size={13} aria-hidden="true" /></CharacterLink>)}</div></div>
              <div><h3>STORY ARCS</h3><div>{related.length ? related.map(({ arc, arcIndex }) => <TransitionLink key={arc.name} href="/arcs" onClick={() => setArc(arcIndex)}>{arc.name}<ArrowUpRight size={13} aria-hidden="true" /></TransitionLink>) : <span>NO LINKED ARC FILE</span>}</div></div>
            </div>
          </div>
        </article>;
      })}
    </div>
    <p className={styles.hint}>DRAG / SWIPE / TRACKPAD HORIZONTALLY · FOCUS THE GALLERY TO USE ARROW KEYS OR THE MOUSE WHEEL</p>
  </div>;
}
