"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionQuery } from "@/animations/gsap";
import styles from "./CustomCursor.module.css";

type CursorTheme = "dark" | "light" | "warm";

function themeAt(x: number, y: number): CursorTheme {
  for (const hit of document.elementsFromPoint(x, y)) {
    for (let element: Element | null = hit; element && element !== document.body; element = element.parentElement) {
      const style = getComputedStyle(element);
      const theme = style.getPropertyValue("--cursor-theme").trim();
      if (theme === "dark" || theme === "light" || theme === "warm") return theme;
      const color = style.backgroundColor.match(/[\d.]+/g)?.map(Number);
      if (!color || color.length < 3 || (color[3] ?? 1) < .85) continue;
      const [red, green, blue] = color;
      if (red > 140 && red > green * 1.3 && red > blue * 1.4) return "warm";
      return (red * 299 + green * 587 + blue * 114) / 1000 >= 140 ? "light" : "dark";
    }
  }
  return "dark";
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQuery + " and (hover: hover) and (pointer: fine)", () => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const moveX = gsap.quickTo(cursor, "x", { duration: .12, ease: "power3.out" });
      const moveY = gsap.quickTo(cursor, "y", { duration: .12, ease: "power3.out" });
      let positioned = false;
      let lastTarget: EventTarget | null = null;
      let x = 0;
      let y = 0;
      let frame = 0;
      const updateTheme = () => {
        frame = 0;
        cursor.dataset.theme = themeAt(x, y);
      };
      const queueTheme = () => { if (!frame) frame = requestAnimationFrame(updateTheme); };
      const hide = () => {
        cursor.dataset.visible = "false";
        cursor.dataset.hover = "false";
        cursor.dataset.pressed = "false";
        positioned = false;
        lastTarget = null;
        cancelAnimationFrame(frame);
        frame = 0;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        x = event.clientX;
        y = event.clientY;
        const target = event.target instanceof Element ? event.target : null;
        const interactive = !!target?.closest("a,button:not(:disabled),[role='button'],[role='tab'],summary");
        const native = !!target?.closest("input,textarea,select,[contenteditable],[role='textbox'],button:disabled") ||
          (!interactive && !!target?.closest("p,small,figcaption"));
        if (!positioned) {
          gsap.set(cursor, { x, y });
          positioned = true;
        } else {
          moveX(x);
          moveY(y);
        }
        cursor.dataset.visible = native ? "false" : "true";
        cursor.dataset.hover = interactive ? "true" : "false";
        if (target !== lastTarget) {
          lastTarget = target;
          queueTheme();
        }
      };
      const press = (event: PointerEvent) => {
        if (event.pointerType !== "touch" && cursor.dataset.visible === "true") cursor.dataset.pressed = "true";
      };
      const release = () => { cursor.dataset.pressed = "false"; queueTheme(); };
      const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
      document.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerout", leave);
      document.addEventListener("pointerdown", press);
      document.addEventListener("scroll", queueTheme, true);
      document.addEventListener("click", queueTheme, true);
      document.addEventListener("keydown", hide);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      window.addEventListener("resize", queueTheme);
      window.addEventListener("blur", hide);
      return () => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerout", leave);
        document.removeEventListener("pointerdown", press);
        document.removeEventListener("scroll", queueTheme, true);
        document.removeEventListener("click", queueTheme, true);
        document.removeEventListener("keydown", hide);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        window.removeEventListener("resize", queueTheme);
        window.removeEventListener("blur", hide);
        moveX.tween.kill();
        moveY.tween.kill();
        hide();
      };
    });
    return () => media.revert();
  }, { scope: cursorRef });

  return <div id="custom-cursor" ref={cursorRef} className={styles.cursor} data-visible="false" data-theme="dark" aria-hidden="true">
    <span className={styles.ring} /><i className={styles.dot} />
  </div>;
}
