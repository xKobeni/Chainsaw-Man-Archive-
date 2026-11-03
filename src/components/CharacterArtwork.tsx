"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./CharacterArtwork.module.css";

export function CharacterArtwork({ name, src, priority = false, fadeIn = false, immediateFallback = false, sizes = "(max-width: 760px) 80vw, 50vw" }: {
  name: string; src?: string | null; priority?: boolean; fadeIn?: boolean; immediateFallback?: boolean; sizes?: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const artworkSource = !src || failedSource === src ? null : src;
  return <div className={styles.artwork}>
    {artworkSource ?
      <Image src={artworkSource} alt={name + " character artwork"} fill sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"} className={[styles.image, fadeIn ? loadedSource === artworkSource ? styles.imageReady : styles.imageLoading : ""].join(" ")} onLoad={() => setLoadedSource(artworkSource)} onError={() => setFailedSource(artworkSource)} /> :
      !immediateFallback && <Image src="/images/placeholders/artwork.png" alt={name + " — artwork pending"} fill sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"} className={[styles.image, styles.placeholderImage].join(" ")} />}
    {immediateFallback && <div className={[styles.placeholder, artworkSource && loadedSource === artworkSource ? styles.placeholderHidden : ""].join(" ")} data-artwork-placeholder data-artwork-ready={artworkSource && loadedSource === artworkSource ? "true" : undefined} aria-hidden="true" />}
    {!artworkSource && <span className={styles.caption}><strong>{name}</strong>ARTWORK PENDING</span>}
  </div>;
}
