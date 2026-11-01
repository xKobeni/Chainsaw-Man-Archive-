"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, motionQuery } from "./gsap";
import { magneticHover } from "./magnetic";

export function PageMotion({ page, children }: { page: string; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (page === "home") {
      document.documentElement.dataset.headerDark = "0";
      ScrollTrigger.create({
        trigger: ".p1",
        start: "top 50px",
        end: "bottom 50px",
        onToggle: (self) => { document.documentElement.dataset.headerDark = self.isActive ? "1" : "0"; },
      });
    }
    const media = gsap.matchMedia();
    media.add(motionQuery, () => {
      const select = gsap.utils.selector(root);
      let onReveal: (() => void) | undefined;
      select(".rv").forEach((element: HTMLElement) => gsap.fromTo(element,
        { y: 70, opacity: 0, clipPath: "inset(0 0 45% 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: element, start: "top 90%", once: true } }));
      if (select(".ph h1").length) {
        gsap.timeline({ defaults: { ease: "expo.out" }, delay: .2 })
          .fromTo(".ph h1", { clipPath: "inset(0 0 100% 0)", y: 50 }, { clipPath: "inset(0 0 -10% 0)", y: 0, duration: 1.1 })
          .fromTo(".ph h1 span", { scaleX: 0, transformOrigin: "0 50%" }, { scaleX: 1, duration: .9 }, .15)
          .fromTo(".ph .jp", { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: .9 }, .1);
      }
      const list = select("#cl button,#dl button,#at button,.tog button");
      if (list.length) gsap.from(list, { x: -50, opacity: 0, stagger: .05, duration: .8, ease: "expo.out", delay: .3, clearProps: "transform,opacity" });
      if (page === "locations") {
        gsap.from(".loc", { y: 90, opacity: 0, stagger: .12, duration: 1.1, ease: "expo.out", delay: .3 });
        select(".loc").forEach((location: HTMLElement) => {
          gsap.fromTo(location.querySelector("svg"), { x: -50 }, { x: 50, ease: "none", scrollTrigger: { trigger: location, scroller: select(".hz")[0], horizontal: true, start: "left right", end: "right left", scrub: true } });
        });
      }
      if (page === "volumes") gsap.from("[data-volume]", { x: 50, opacity: 0, stagger: .025, duration: .75, ease: "expo.out", delay: .3, clearProps: "transform,opacity" });
      if (page === "lore") {
        gsap.fromTo(".lr em", { scale: 0, rotation: -140 }, { scale: 1, rotation: -12, ease: "back.out(1.8)", duration: .9, stagger: .1, scrollTrigger: { trigger: select(".lr")[0], start: "top 80%" } });
        select(".lr>div").forEach((row: HTMLElement) => {
          for (const [selector, x] of [[".a", -12], [".b", 12]] as const) gsap.fromTo(row.querySelector(selector), { xPercent: x }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: row, start: "top 95%", end: "top 50%", scrub: true } });
        });
      }
      if (page === "home") {
        let seenLoader = false;
        try { seenLoader = sessionStorage.getItem("csm") === "1"; } catch { /* Storage is optional. */ }
        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
          .fromTo(".hero .sun", { scale: .82, opacity: 0 }, { scale: 1, opacity: 1, duration: .7 }, 0)
          .fromTo(".hero .t1", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .7, clearProps: "transform,opacity" }, 0)
          .fromTo(".hero .t2", { y: 42, opacity: 0 }, { y: 0, opacity: 1, duration: .7, clearProps: "transform,opacity" }, .12)
          .fromTo(".hero-artwork", { clipPath: "inset(18% 0 0 0)", y: 24, opacity: 0 }, { clipPath: "inset(0 0 0 0)", y: 0, opacity: 1, duration: .8, clearProps: "clipPath,transform,opacity" }, .1)
          .fromTo("[data-hero-copy]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .55, clearProps: "transform,opacity" }, .28)
          .fromTo(".hero-footer", { opacity: 0 }, { opacity: 1, duration: .5, clearProps: "opacity" }, .4);
        if (seenLoader) intro.timeScale(1.8);
        onReveal = () => intro.play();
        if (document.documentElement.dataset.csmReveal === "1") onReveal();
        else window.addEventListener("csm:reveal", onReveal, { once: true });
        select(".part,.end").forEach((section: HTMLElement) => {
          const reveal = section.querySelectorAll("[data-home-reveal]");
          gsap.fromTo(reveal, { y: 34, opacity: 0 }, {
            y: 0, opacity: 1, stagger: .1, duration: .72, ease: "expo.out", clearProps: "transform,opacity",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          });
          const art = section.querySelector("[data-home-art]");
          if (art) gsap.fromTo(art, { clipPath: "inset(12% 0 0 0)", y: 28, opacity: 0 }, {
            clipPath: "inset(0 0 0 0)", y: 0, opacity: 1, duration: .9, ease: "power3.out", clearProps: "clipPath,transform,opacity",
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
          });
        });
      }
      ScrollTrigger.refresh();
      return () => { if (onReveal) window.removeEventListener("csm:reveal", onReveal); };
    });
    media.add(`${motionQuery} and (min-width: 761px)`, () => {
      if (page !== "home") return;
      const hero = root.current?.querySelector(".hero");
      if (hero) gsap.to(".hero-visual", { y: -24, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .6 } });
      gsap.to(".mq div", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    });
    media.add(`${motionQuery} and (hover: hover) and (pointer: fine)`, () => {
      const hero = root.current?.querySelector<HTMLElement>(".hero");
      const buttons = [...root.current?.querySelectorAll<HTMLElement>(".btn") ?? []];
      const cleanup: (() => void)[] = [];
      if (hero) {
        const sun = gsap.quickTo(hero.querySelector(".sun"), "x", { duration: 1, ease: "power3" });
        const artwork = gsap.quickTo(hero.querySelector(".hero-artwork"), "x", { duration: 1.4, ease: "power3" });
        const move = (event: MouseEvent) => { const p = event.clientX / innerWidth - .5; sun(p * -18); artwork(p * 12); };
        hero.addEventListener("mousemove", move);
        cleanup.push(() => hero.removeEventListener("mousemove", move));
      }
      buttons.forEach((button) => cleanup.push(magneticHover(button)));
      return () => cleanup.forEach((fn) => fn());
    });
    let active = true;
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; media.revert(); };
  }, { scope: root, dependencies: [page], revertOnUpdate: true });
  return <section ref={root} className="view" id={`v-${page}`}>{children}</section>;
}
