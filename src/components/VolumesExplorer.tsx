"use client";

import { useRef, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { volumes } from "@/data/volumes";
import { arcs } from "@/data/arcs";
import { arcsForVolume, colorStyle } from "@/lib/archive";
import { usePanelMotion } from "@/animations/usePanelMotion";
import { motionQuery } from "@/animations/gsap";
import { useArchive } from "./ArchiveShell";
import { TransitionLink } from "./TransitionLink";
import { VolumeCover } from "./VolumeCover";
import styles from "./VolumesExplorer.module.css";

export function VolumesExplorer() {
  const { volume, setVolume, setArc } = useArchive();
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const selected = volumes[volume - 1];
  const relatedArcs = arcsForVolume(arcs, selected);
  usePanelMotion(root, "volume", volume);

  const choose = (number: number, fromGallery = false) => {
    if (number < 1 || number > volumes.length) return;
    setVolume(number);
    const container = rail.current;
    const thumb = container?.querySelector<HTMLButtonElement>(`[data-volume="${number}"]`);
    if (container && thumb) container.scrollBy({
      left: thumb.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - thumb.clientWidth) / 2,
      behavior: matchMedia(motionQuery).matches ? "smooth" : "instant",
    });
    if (fromGallery) root.current?.scrollIntoView({ behavior: matchMedia(motionQuery).matches ? "smooth" : "instant", block: "start" });
  };
  const onGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const current = Number(event.target.dataset.volume);
    const next = event.key === "ArrowRight" ? Math.min(volumes.length, current + 1)
      : event.key === "ArrowLeft" ? Math.max(1, current - 1)
        : event.key === "Home" ? 1 : event.key === "End" ? volumes.length : null;
    if (next === null) return;
    event.preventDefault();
    choose(next);
    rail.current?.querySelector<HTMLButtonElement>(`[data-volume="${next}"]`)?.focus({ preventScroll: true });
  };

  return <div className={styles.collection}>
    <div className={styles.topline}><span>THE COLLECTION / 01—24</span><span>SELECT A VOLUME TO EXPLORE</span></div>
    <div className={styles.feature} id="vf" ref={root} style={{ ...colorStyle(selected.color), scrollMarginTop: "80px" }}>
      <div className={styles.coverStage} data-feature-cover>
        <span className={styles.spine} aria-hidden="true" />
        <VolumeCover key={volume} volume={selected} featured />
      </div>
      <div className={`${styles.copy} volume-copy`}>
        <div className={styles.part}>PART {selected.part} / {selected.part === "1" ? "PUBLIC SAFETY" : "ACADEMY SAGA"}</div>
        <div className={styles.number} data-volume-label>VOL. {String(volume).padStart(2, "0")}</div>
        <h2 className={styles.title} aria-live="polite">Chainsaw Man</h2>
        <dl className={styles.details}>
          <div><dt>CHAPTERS</dt><dd>{selected.chapters ?? "Range not verified"}</dd></div>
          <div><dt>STORY</dt><dd>{relatedArcs.length ? relatedArcs.map((arc) => <TransitionLink key={arc.name} href="/arcs" className={styles.arcLink} onClick={() => setArc(arcs.indexOf(arc))}>{arc.name}</TransitionLink>) : "Arc mapping unavailable"}</dd></div>
          {selected.publishedInJapan && <div><dt>JAPAN PRINT RELEASE</dt><dd>{selected.sourceUrl ? <a className={styles.sourceLink} href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">{selected.publishedInJapan}<span className="sr-only"> (publisher source opens in new tab)</span></a> : selected.publishedInJapan}</dd></div>}
        </dl>
        <p className={styles.context}>{selected.part === "1" ? "Public Safety Saga" : "Academy Saga"} · Story arcs overlapping this volume&apos;s chapters.</p>
        <div className={styles.controls}>
          <button disabled={volume === 1} onClick={() => choose(volume - 1)} aria-label="Previous volume"><ArrowLeft size={18} aria-hidden="true" /> PREV</button>
          <button disabled={volume === volumes.length} onClick={() => choose(volume + 1)} aria-label="Next volume">NEXT <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
    <div className={styles.galleryHeading}><h3>ALL VOLUMES</h3><span>SWIPE / SCROLL TO BROWSE</span></div>
    <div className={styles.gallery} id="vs" ref={rail} role="group" aria-label="Manga volume gallery" onKeyDown={onGalleryKeyDown}>
      {volumes.map((item) => <button
        className={`${styles.thumbnail} ${volume === item.number ? styles.selected : ""}`}
        key={item.number}
        data-volume={item.number}
        aria-label={`Volume ${item.number}`}
        aria-pressed={volume === item.number}
        aria-controls="vf"
        onClick={() => choose(item.number, true)}
      >
        <span className={styles.thumbnailCover}><VolumeCover volume={item} /></span>
        <span className={styles.thumbnailMeta}><b>{String(item.number).padStart(2, "0")}</b><span>PART {item.part}</span></span>
      </button>)}
    </div>
    <p className={styles.footnote}>Chapter and arc ranges follow the published volume contents and Chainsaw Man Wiki&apos;s story index.</p>
  </div>;
}
