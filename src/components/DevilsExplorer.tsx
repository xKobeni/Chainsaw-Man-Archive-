"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ImageOff, Search } from "lucide-react";
import { devils } from "@/data/devils";
import { usePanelMotion } from "@/animations/usePanelMotion";
import type { Devil } from "@/types/archive";
import { useArchive } from "./ArchiveShell";
import { PageHeading } from "./PageHeading";
import styles from "./DevilsExplorer.module.css";

type Category = "all" | Devil["type"];
const categories: { value: Category; label: string }[] = [
  { value: "all", label: "ALL FILES" },
  { value: "devil", label: "DEVILS" },
  { value: "fiend", label: "FIENDS" },
];

function Redaction({ children }: { children: string }) {
  const [revealed, setRevealed] = useState(false);
  return <button className={"red " + (revealed ? "revealed" : "")} aria-label={revealed ? "Hide redaction: " + children : "Reveal redacted text"} aria-pressed={revealed} onClick={() => setRevealed(!revealed)}>{children}</button>;
}

function DossierArtwork({ file }: { file: Devil }) {
  const [failed, setFailed] = useState(false);
  const available = !!file.artwork && !failed;
  return <figure className={styles.artwork} data-devil-art>
    {available ? <Image src={file.artwork!} alt={file.name} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 32vw, 360px" onError={() => setFailed(true)} /> :
      <div className={styles.artworkFallback} role="img" aria-label={"No image available for " + file.name}>
        <ImageOff size={36} strokeWidth={1.2} aria-hidden="true" />
        <strong>NO IMAGE AVAILABLE</strong>
        <span>{file.id} / {file.name.toUpperCase()}</span>
      </div>}
    <figcaption>{file.id} / VISUAL RECORD</figcaption>
  </figure>;
}

export function DevilsExplorer() {
  const { devil, setDevil } = useArchive();
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visible = devils.map((file, index) => ({ file, index })).filter(({ file }) =>
    (category === "all" || file.type === category) &&
    (!normalizedQuery || [file.name, file.japanese, file.id].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)))
  );
  const selectedIndex = visible.some(({ index }) => index === devil) ? devil : visible[0]?.index ?? -1;
  const selected = selectedIndex < 0 ? null : devils[selectedIndex];
  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex !== devil) setDevil(selectedIndex);
  }, [devil, selectedIndex, setDevil]);
  usePanelMotion(root, "devil", selected?.id ?? null);

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) || !visible.length) return;
    event.preventDefault();
    const current = visible.findIndex(({ index }) => index === selectedIndex);
    const next = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 :
      Math.max(0, Math.min(visible.length - 1, current + (event.key === "ArrowDown" ? 1 : -1)));
    setDevil(visible[next].index);
    list.current?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };

  return <><PageHeading title="Classified" accent="Files" japanese="機密">
    <div className="devil-intro-copy" data-heading-detail><span>PUBLIC SAFETY / RESTRICTED ARCHIVE</span><p>Devil and fiend case files. Threat ratings are unofficial archive estimates. Focus or tap redactions to reveal.</p></div>
  </PageHeading>
    <div className={styles.explorer}>
      <aside className={styles.sidebar} aria-label="Classified file index">
        <div className={styles.sidebarHead}><span>FILE INDEX</span><span>{visible.length} / {devils.length}</span></div>
        <div className={styles.tabs} aria-label="File category">
          {categories.map(({ value, label }) => <button key={value} type="button" className={category === value ? styles.activeTab : ""} aria-pressed={category === value} onClick={() => setCategory(value)}>{label}<small>{value === "all" ? devils.length : devils.filter((file) => file.type === value).length}</small></button>)}
        </div>
        <label className={styles.search}><Search size={16} aria-hidden="true" /><span className={styles.visuallyHidden}>Search files by name, Japanese name, or ID</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH FILES / ID" /></label>
        <div className={styles.list} ref={list} onKeyDown={onListKeyDown} aria-label="Matching files">
          {visible.map(({ file, index }) => <button key={file.id} type="button" className={index === selectedIndex ? styles.selected : ""} aria-current={index === selectedIndex ? "true" : undefined} onClick={() => setDevil(index)}><b>{file.id}</b><span>{file.name}</span><small>{file.type.toUpperCase()}</small></button>)}
          {!visible.length && <p className={styles.noResults}>NO MATCHING FILES<br /><small>TRY ANOTHER NAME OR ID</small></p>}
        </div>
      </aside>
      {selected ? <article className={"fl " + styles.dossier} id="df" ref={root} aria-live="polite" aria-atomic="true">
        <div className="no" data-devil-copy>FILE {selected.id} · {selected.type.toUpperCase()} {selected.subcategory ? " / " + selected.subcategory.toUpperCase() : ""}</div>
        <h3 className="d" data-devil-copy>{selected.name}</h3>
        <div className="jp j" data-devil-copy>{selected.japanese}</div>
        <div className={styles.dossierBody}>
          <div className={styles.dossierCopy}>
            <dl data-devil-copy><dt>THREAT</dt><dd>{selected.threat} <small>UNOFFICIAL RATING</small></dd><dt>IDENTITY / ASSOCIATION</dt><dd>{selected.contractor}</dd><dt>CLASSIFICATION</dt><dd>{selected.type.toUpperCase()}{selected.subcategory ? " · " + selected.subcategory : ""}</dd></dl>
            <p data-devil-copy>{selected.description.split("[redacted]")[0]}{selected.redacted && <Redaction key={selected.id}>{selected.redacted}</Redaction>}{selected.description.split("[redacted]")[1]}</p>
            <p className={styles.note} data-devil-copy><Redaction key={selected.id + "-note"}>NOTE REDACTED</Redaction></p>
          </div>
          <DossierArtwork key={selected.id} file={selected} />
        </div>
      </article> : <div className={"fl " + styles.emptyDossier} aria-live="polite"><span>NO FILE SELECTED</span><p>Adjust your search or category to view a dossier.</p></div>}
    </div>
  </>;
}
