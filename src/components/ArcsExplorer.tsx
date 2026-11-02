"use client";

import Image from "next/image";
import { useRef, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { arcs } from "@/data/arcs";
import { characters } from "@/data/characters";
import { devils } from "@/data/devils";
import { colorStyle } from "@/lib/archive";
import { usePanelMotion } from "@/animations/usePanelMotion";
import { motionQuery } from "@/animations/gsap";
import { useArchive } from "./ArchiveShell";
import { PageHeading } from "./PageHeading";
import { CharacterLink } from "./CharacterLink";
import { TransitionLink } from "./TransitionLink";
import type { Part } from "@/types/archive";
import styles from "./ArcsExplorer.module.css";

const characterAliases: Record<string, string> = { Aki: "aki", Asa: "asa" };
const locationAliases: Record<string, string> = { "Denji’s apartment": "Denji’s Home", Hotel: "The Hotel", "High school": "Academy", School: "Academy" };
const knownLocations = ["Tokyo", "Public Safety HQ", "The Hotel", "Academy", "Denji’s Home"];

export function ArcsExplorer() {
  const { arc, setArc, setDevil, setVolume } = useArchive();
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const selected = arcs[arc];
  const part = selected.part;
  const visible = arcs.map((item, index) => ({ item, index })).filter(({ item }) => item.part === part);
  const selectPart = (next: Part) => setArc(arcs.findIndex((item) => item.part === next));
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const current = visible.findIndex(({ index }) => index === arc);
    const next = event.key === "ArrowRight" ? (current + 1) % visible.length
      : event.key === "ArrowLeft" ? (current - 1 + visible.length) % visible.length
        : event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    const index = visible[next].index;
    setArc(index);
    const button = rail.current?.querySelector<HTMLButtonElement>(`[data-arc="${index}"]`);
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: matchMedia(motionQuery).matches ? "smooth" : "instant" });
  };
  usePanelMotion(root, "arc", arc);

  const mainCharacters = selected.characters.split(", ");
  const keyLocations = selected.locations.split(", ");
  const numbers = selected.volumes.match(/\d+/g)?.map(Number) ?? [];
  const relatedVolumes = numbers.length === 2
    ? Array.from({ length: numbers[1] - numbers[0] + 1 }, (_, index) => numbers[0] + index)
    : numbers.slice(0, 1);
  const devilIndex = devils.findIndex((item) => item.name === selected.antagonist);

  return <><PageHeading title="Story" accent="Arcs" japanese="物語">
    <div className={`${styles.parts} page-parts`} data-heading-detail role="group" aria-label="Story part">
      {(["1", "2"] as const).map((value) => <button key={value} type="button" aria-pressed={part === value} className={part === value ? styles.activePart : ""} onClick={() => selectPart(value)}>PART {value}<span>{value === "1" ? "PUBLIC SAFETY" : "ACADEMY"}</span></button>)}
    </div>
  </PageHeading><div className={styles.explorer} style={colorStyle(selected.color === "#111111" ? "#F0EEE8" : selected.color)}>
    <div className={styles.selectorHead}>
      <span className={styles.eyebrow}>STORY INDEX / {String(arcs.length).padStart(2, "0")} FILES</span>
    </div>
    <div id="at" className={styles.rail} role="tablist" aria-label={`Part ${part} story arcs`} ref={rail} onKeyDown={onKeyDown}>
      {visible.map(({ item, index }, position) => <button key={item.name} type="button" id={`arc-${index}`} data-arc={index} role="tab" aria-controls="arc-panel" aria-selected={arc === index} tabIndex={arc === index ? 0 : -1} className={arc === index ? styles.activeTab : ""} onClick={() => setArc(index)}>
        <span className={styles.tabNumber}>{String(position + 1).padStart(2, "0")}</span><span className={styles.tabTitle}>{item.name}</span>
      </button>)}
    </div>
    <div id="arc-panel" className={styles.feature} role="tabpanel" aria-labelledby={`arc-${arc}`} ref={root}>
      <div className={styles.featureHead}><span>FILE {String(arc + 1).padStart(2, "0")} / {String(arcs.length).padStart(2, "0")}</span><span>PART {part} · {selected.volumes.toUpperCase()}</span></div>
      <div className={styles.layout}>
        <figure className={styles.artwork} data-arc-art>
          <Image src="/images/placeholders/artwork.png" alt="Arc illustration pending" fill sizes="(max-width: 760px) 90vw, 48vw" priority loading="eager" className={styles.artworkImage} />
          <figcaption><span>{String(arc + 1).padStart(2, "0")}</span><small>ARC ARTWORK PENDING</small></figcaption>
        </figure>
        <div className={styles.story}>
          <span className={styles.kicker} data-arc-copy>THE ARCHIVE / PART {part}</span>
          <h2 className={styles.title} data-arc-title>{selected.name}</h2>
          <p className={styles.synopsis} data-arc-copy>{selected.description}</p>
          <div className={styles.facts} data-arc-copy>
            <div><span>CHAPTER RANGE</span><strong>Not verified</strong></div>
            <div><span>MANGA VOLUMES</span><strong>{selected.volumes}</strong></div>
          </div>
          <div className={styles.related} data-arc-copy>
            <div><h3>MAIN CHARACTERS</h3><p>{mainCharacters.map((name, index) => {
              const id = characterAliases[name] ?? characters.find((item) => item.name === name)?.id;
              return <span key={name}>{index > 0 && <span className={styles.separator}> / </span>}{id ? <CharacterLink id={id}>{name}<ArrowUpRight size={13} aria-hidden="true" /></CharacterLink> : name}</span>;
            })}</p></div>
            <div><h3>ANTAGONIST</h3><p>{devilIndex >= 0 ? <TransitionLink href="/devils" onClick={() => setDevil(devilIndex)}>{selected.antagonist}<ArrowUpRight size={13} aria-hidden="true" /></TransitionLink> : selected.antagonist}</p></div>
            <div><h3>KEY LOCATIONS</h3><p>{keyLocations.map((name, index) => <span key={name}>{index > 0 && <span className={styles.separator}> / </span>}{knownLocations.includes(locationAliases[name] ?? name) ? <TransitionLink href="/locations">{name}<ArrowUpRight size={13} aria-hidden="true" /></TransitionLink> : name}</span>)}</p></div>
            <div><h3>RELATED VOLUMES</h3><p>{relatedVolumes.map((number, index) => <span key={number}>{index > 0 && <span className={styles.separator}> / </span>}<TransitionLink href="/volumes" onClick={() => setVolume(number)}>VOL. {String(number).padStart(2, "0")}<ArrowUpRight size={13} aria-hidden="true" /></TransitionLink></span>)}</p></div>
          </div>
        </div>
      </div>
    </div>
  </div></>;
}
