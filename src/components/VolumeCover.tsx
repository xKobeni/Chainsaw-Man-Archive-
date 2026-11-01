"use client";

import Image from "next/image";
import { useState } from "react";
import type { Volume } from "@/types/archive";
import styles from "./VolumeCover.module.css";

export function VolumeCover({ volume, featured = false }: { volume: Volume; featured?: boolean }) {
  const [failed, setFailed] = useState(false);
  const pending = !volume.cover || failed;
  return <div className={`${styles.cover} ${featured ? styles.featured : ""}`}>
    <Image
      src={pending ? "/images/placeholders/manga-cover.png" : volume.cover!}
      alt={pending ? `Volume ${volume.number} cover artwork pending` : `Chainsaw Man volume ${volume.number} cover`}
      fill
      sizes={featured ? "(max-width: 760px) 78vw, 40vw" : "(max-width: 760px) 38vw, 180px"}
      priority={featured}
      loading={featured ? "eager" : "lazy"}
      className={styles.image}
      onError={() => setFailed(true)}
    />
    {pending && <div className={styles.pending} aria-hidden="true">
      <span>CHAINSAW MAN / {String(volume.number).padStart(2, "0")}</span>
      <strong>COVER<br />PENDING</strong>
      <span>ARTWORK NOT PROVIDED</span>
    </div>}
  </div>;
}
