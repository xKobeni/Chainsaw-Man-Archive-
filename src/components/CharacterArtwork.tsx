"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./CharacterArtwork.module.css";

export function CharacterArtwork({ name, src, priority = false, sizes = "(max-width: 760px) 80vw, 50vw" }: {
  name: string; src?: string | null; priority?: boolean; sizes?: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const placeholder = !src || failedSource === src;
  return <div className={styles.artwork}>
    <Image src={placeholder ? "/images/placeholders/artwork.png" : src} alt={placeholder ? `${name} — artwork pending` : `${name} character artwork`} fill sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"} className={`${styles.image} ${placeholder ? styles.placeholder : ""}`} onError={() => src && setFailedSource(src)} />
    {placeholder && <span className={styles.caption}><strong>{name}</strong>ARTWORK PENDING</span>}
  </div>;
}
