"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { characters } from "@/data/characters";
import { useModal } from "@/lib/useModal";
import { colorStyle } from "@/lib/archive";
import { usePanelMotion } from "@/animations/usePanelMotion";
import { useArchive } from "./ArchiveShell";
import { CharacterArtwork } from "./CharacterArtwork";
import styles from "./CharacterProfile.module.css";

export function CharacterProfile({ id, close }: { id: string | null; close: () => void }) {
  const root = useRef<HTMLElement>(null);
  const [lastId, setLastId] = useState(id);
  const { openProfile } = useArchive();
  if (id && id !== lastId) setLastId(id);
  const character = characters.find((item) => item.id === (id ?? lastId));
  useModal(!!id, root, close);
  usePanelMotion(root, "profile", id);
  return <aside ref={root} id="pf" className={id ? "on" : ""} role="dialog" aria-modal={!!id || undefined} aria-label="Character profile" inert={!id}>
    <button className="x" onClick={close} type="button" aria-label="Close character profile">CLOSE <X size={18} aria-hidden="true" /></button>
    {character && <div id="pc" key={character.id} className={styles.profile} style={colorStyle(character.color === "#111111" ? "#F0EEE8" : character.color)}>
      <div className={styles.hero}>
        <figure className={styles.artwork} data-profile-art>
          <CharacterArtwork name={character.name} src={character.artwork} priority sizes="(max-width: 760px) 95vw, 42vw" />
          <figcaption>PORTRAIT / {character.name.toUpperCase()}</figcaption>
        </figure>
        <div className={styles.intro}>
          <span className={styles.serial} data-profile-copy>PERSONNEL FILE / {character.id.toUpperCase()}</span>
          <span className={styles.japanese} data-profile-copy>{character.japanese}</span>
          <h2 data-profile-title>{character.name}</h2>
          <p className={styles.role} data-profile-copy>{character.role}</p>
          <p className={styles.lede} data-profile-copy><span>BIOGRAPHY</span>{character.background}</p>
        </div>
      </div>
      <div className={styles.details} data-profile-copy>
        <div><h3>01 / POWERS</h3><p>{character.powers}</p></div>
        <div><h3>02 / AFFILIATION</h3><p>{character.role} · Part {character.parts.join(" + ")}</p></div>
        <div><h3>03 / DEVILS &amp; CONTRACTS</h3><p>{character.contracts}</p></div>
        <div className={styles.connections}><h3>04 / RELATIONSHIPS</h3><div>{character.relationships.map((related) => <button type="button" key={related} onClick={() => { openProfile(related); root.current?.scrollTo({ top: 0 }); root.current?.querySelector<HTMLButtonElement>(".x")?.focus({ preventScroll: true }); }}>{characters.find((item) => item.id === related)!.name}</button>)}</div></div>
      </div>
    </div>}
  </aside>;
}
