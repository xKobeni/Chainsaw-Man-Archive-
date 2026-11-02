"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionQuery } from "@/animations/gsap";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery + " and (hover: hover) and (pointer: fine)", () => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const moveX = gsap.quickTo(cursor, "x", { duration: .16, ease: "power3.out" });
      const moveY = gsap.quickTo(cursor, "y", { duration: .16, ease: "power3.out" });
      let positioned = false;
      const hide = () => {
        cursor.dataset.visible = "false";
        positioned = false;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const target = event.target instanceof Element ? event.target : null;
        const interactive = !!target?.closest("a,button,[role='button'],[role='tab']");
        const native = !!target?.closest("input,textarea,select,[contenteditable],button:disabled") ||
          (!interactive && !!target?.closest("p,small,figcaption"));
        if (!positioned) {
          gsap.set(cursor, { x: event.clientX, y: event.clientY });
          positioned = true;
        } else {
          moveX(event.clientX);
          moveY(event.clientY);
        }
        cursor.dataset.visible = native ? "false" : "true";
        cursor.dataset.hover = interactive ? "true" : "false";
      };
      const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
      document.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerout", leave);
      window.addEventListener("blur", hide);
      return () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerout", leave);
        window.removeEventListener("blur", hide);
        hide();
      };
    });
    return () => media.revert();
  }, { scope: cursorRef });

  return <div id="custom-cursor" ref={cursorRef} className={styles.cursor} data-visible="false" aria-hidden="true">
    <span className={styles.ring} />
  </div>;
}
