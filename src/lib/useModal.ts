"use client";

import { useEffect, type RefObject } from "react";

export function useModal(open: boolean, root: RefObject<HTMLElement | null>, close: () => void) {
  useEffect(() => {
    if (!open || !root.current) return;
    const element = root.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => [...element.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')];
    focusable()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key !== "Tab") return;
      const list = focusable();
      const first = list[0], last = list[list.length - 1];
      if (!element.contains(document.activeElement)) { event.preventDefault(); first?.focus(); }
      else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open, root, close]);
}
