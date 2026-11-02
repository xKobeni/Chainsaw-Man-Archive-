"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { devils } from "@/data/devils";
import { usePanelMotion } from "@/animations/usePanelMotion";
import { useArchive } from "./ArchiveShell";
import { PageHeading } from "./PageHeading";

function Redaction({ children }: { children: string }) {
  const [revealed, setRevealed] = useState(false);
  return <button className={`red ${revealed ? "revealed" : ""}`} aria-label={revealed ? `Hide redaction: ${children}` : "Reveal redacted text"} aria-pressed={revealed} onClick={() => setRevealed(!revealed)}>{children}</button>;
}
export function DevilsExplorer() {
  const { devil, setDevil } = useArchive();
  const root = useRef<HTMLElement>(null);
  const selected = devils[devil];
  usePanelMotion(root, "devil", devil);
  const [before, after] = selected.description.split("[redacted]");
  return <><PageHeading title="Classified" accent="Files" japanese="機密">
    <div className="devil-intro-copy" data-heading-detail><span>FEATURED DOSSIER / {selected.id}</span><p>Fictional Public Safety archive. Threat ratings are this site&apos;s own invention; focus or tap redactions to reveal.</p></div>
    <figure className="devil-intro-art" data-heading-detail><Image src="/images/placeholders/artwork.png" alt={`${selected.name} illustration pending`} fill sizes="(max-width: 760px) 120px, 230px" /><figcaption>{selected.id} / ARTWORK PENDING</figcaption></figure>
  </PageHeading><div className="dv">
    <div className="dl" id="dl" aria-label="Devil dossiers">{devils.map((item, index) => <button key={item.id} className={index === devil ? "on" : ""} aria-pressed={index === devil} onClick={() => setDevil(index)}><b>{item.id}</b>{item.name}</button>)}</div>
    <article className="fl" id="df" ref={root} aria-live="polite" aria-atomic="true">
      <div className="no">FILE {selected.id} · CLASSIFIED</div><h3 className="d">{selected.name}</h3><div className="jp j">{selected.japanese}</div>
      <dl><dt>THREAT</dt><dd>{selected.threat} (site rating)</dd><dt>CONTRACTOR</dt><dd>{selected.contractor}</dd><dt>TYPE</dt><dd>{selected.name.includes("Fiend") ? "FIEND" : "DEVIL"}</dd></dl>
      <p>{before}{selected.redacted && <Redaction key={selected.id}>{selected.redacted}</Redaction>}{after}</p><p className="mt-3.5"><Redaction key={`${selected.id}-note`}>NOTE REDACTED</Redaction></p>
    </article>
  </div></>;
}
