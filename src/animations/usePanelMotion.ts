"use client";

import type { RefObject } from "react";
import { gsap, useGSAP, motionQuery } from "./gsap";

export function usePanelMotion(root: RefObject<HTMLElement | null>, kind: "character" | "devil" | "arc" | "volume" | "profile", selection: string | number | null) {
  useGSAP(() => {
    if (selection === null) return;
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      const timeline = gsap.timeline({ defaults: { ease: "expo.out" } });
      if (kind === "character") {
        timeline.fromTo("[data-character-art]", { clipPath: "inset(0 100% 0 0)", opacity: .4 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: .8, ease: "power4.inOut" }, 0)
          .fromTo("[data-character-title]", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: .65 }, .15)
          .fromTo("[data-character-copy]", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .55 }, .25);
      } else if (kind === "devil") {
        timeline.fromTo("[data-devil-art]", { clipPath: "inset(0 100% 0 0)", opacity: .5 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: .65, ease: "power4.inOut", clearProps: "clipPath,opacity" })
          .fromTo("[data-devil-copy]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .045, duration: .5, clearProps: "transform,opacity" }, .1);
      } else if (kind === "arc") {
        timeline.fromTo("[data-arc-art]", { clipPath: "inset(0 100% 0 0)", opacity: .4 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: .85, ease: "power4.inOut" }, 0)
          .fromTo("[data-arc-title]", { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .12)
          .fromTo("[data-arc-copy]", { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .6 }, .25);
      } else if (kind === "volume") {
        timeline.fromTo("[data-feature-cover]", { x: -22, rotation: -4, scale: .97, opacity: 0 }, { x: 0, rotation: -2, scale: 1, opacity: 1, duration: .75 })
          .fromTo(".volume-copy>*", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .55 }, .1);
      } else {
        timeline.delay(.15).fromTo("[data-profile-art]", { x: -35, opacity: 0 }, { x: 0, opacity: 1, duration: .8 }, 0)
          .fromTo("[data-profile-title]", { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: .75 }, .1)
          .fromTo("[data-profile-copy]", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: .6 }, .2);
      }
    });
    return () => media.revert();
  }, { scope: root, dependencies: [selection, kind], revertOnUpdate: true });
}
