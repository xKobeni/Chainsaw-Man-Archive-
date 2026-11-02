"use client";

import { useRef, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { characters } from "@/data/characters";
import { colorStyle } from "@/lib/archive";
import { usePanelMotion } from "@/animations/usePanelMotion";
import { motionQuery } from "@/animations/gsap";
import { useArchive } from "./ArchiveShell";
import { PageHeading } from "./PageHeading";
import { CharacterArtwork } from "./CharacterArtwork";
import styles from "./CharactersExplorer.module.css";

export function CharactersExplorer() {
  const { part, character, selectPart, selectCharacter, openProfile } = useArchive();
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const selected = characters.find((item) => item.id === character)!;
  const visible = characters.filter((item) => item.parts.includes(part));
  const [classification, affiliation] = selected.role.split(" · ");
  usePanelMotion(root, "character", character);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const current = visible.findIndex((item) => item.id === character);
    const next = event.key === "ArrowDown" || event.key === "ArrowRight" ? (current + 1) % visible.length
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (current - 1 + visible.length) % visible.length
        : event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    const id = visible[next].id;
    selectCharacter(id);
    const button = rail.current?.querySelector<HTMLButtonElement>(`[data-character="${id}"]`);
    button?.focus({ preventScroll: true });
    button?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: matchMedia(motionQuery).matches ? "smooth" : "instant" });
  };
  return <>
    <PageHeading title="The" accent="Cast" japanese="登場人物">
      <div className={`${styles.parts} page-parts`} data-heading-detail role="group" aria-label="Story part">{(["1", "2"] as const).map((value) => <button key={value} type="button" className={part === value ? styles.activePart : ""} aria-pressed={part === value} onClick={() => selectPart(value)}>PART {value}<small>{value === "1" ? "PUBLIC SAFETY" : "ACADEMY"}</small></button>)}</div>
    </PageHeading>
    <div className={styles.explorer} style={colorStyle(selected.color === "#111111" ? "#F0EEE8" : selected.color)}>
      <div className={styles.selectorHead}>
        <span>PERSONNEL INDEX / {String(visible.length).padStart(2, "0")} FILES</span>
      </div>
      <div className={styles.layout}>
        <div id="cl" className={styles.selector} ref={rail} role="group" aria-label={`Part ${part} characters`} onKeyDown={onKeyDown}>
          {visible.map((item, index) => <button key={item.id} type="button" data-character={item.id} className={character === item.id ? styles.selected : ""} aria-pressed={character === item.id} onClick={() => selectCharacter(item.id)}>
            <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><small>{item.japanese}</small>
          </button>)}
        </div>
        <div id="cst" className={styles.spotlight} ref={root}>
          <div className={styles.spotlightHead}><span>SELECTED FILE / {selected.id.toUpperCase()}</span><span>PART {selected.parts.join(" + ")}</span></div>
          <div className={styles.spotlightBody}>
            <figure className={styles.artwork} data-character-art>
              <CharacterArtwork key={selected.id} name={selected.name} src={selected.artwork} priority sizes="(max-width: 760px) 90vw, 43vw" />
              <figcaption>PORTRAIT / {selected.name.toUpperCase()}</figcaption>
            </figure>
            <div className={styles.copy}>
              <span className={styles.japanese} data-character-copy>{selected.japanese}</span>
              <h3 data-character-title>{selected.name}</h3>
              <dl className={styles.facts} data-character-copy>
                <div><dt>CLASSIFICATION</dt><dd>{classification}</dd></div>
                {affiliation && <div><dt>AFFILIATION / IDENTITY</dt><dd>{affiliation}</dd></div>}
              </dl>
              <p data-character-copy>{selected.background}</p>
              <button type="button" className={styles.open} onClick={() => openProfile(selected.id)} data-character-copy>OPEN FILE <ArrowUpRight size={19} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>;
}
