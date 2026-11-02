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
        const heading = gsap.timeline({ defaults: { ease: "expo.out" } })
          .fromTo(".ph h1", { clipPath: "inset(0 0 100% 0)", y: 35 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: .85, clearProps: "clipPath,transform" })
          .fromTo(".ph h1 span", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .8, clearProps: "clipPath" }, .1)
          .fromTo(".ph .jp", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: .65, clearProps: "transform,opacity" }, .15);
        if (select("[data-heading-detail]").length) heading.fromTo("[data-heading-detail]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .7, clearProps: "transform,opacity" }, .25);
      }
      const list = select("#cl button,#at button,.tog button");
      if (list.length) gsap.from(list, { x: -50, opacity: 0, stagger: .05, duration: .8, ease: "expo.out", delay: .3, clearProps: "transform,opacity" });
      if (page === "volumes") gsap.from("[data-volume]", { x: 50, opacity: 0, stagger: .025, duration: .75, ease: "expo.out", delay: .3, clearProps: "transform,opacity" });
      if (page === "lore") {
        gsap.fromTo(".lr em", { scale: 0, rotation: -140 }, { scale: 1, rotation: -12, ease: "back.out(1.8)", duration: .9, stagger: .1, scrollTrigger: { trigger: select(".lr")[0], start: "top 80%" } });
        select(".lr>div").forEach((row: HTMLElement) => {
          for (const [selector, x] of [[".a", -12], [".b", 12]] as const) gsap.fromTo(row.querySelector(selector), { xPercent: x }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: row, start: "top 95%", end: "top 50%", scrub: true } });
        });
      }
      if (page === "home") {
        const throughSplash = document.documentElement.dataset.csmReveal !== "1";
        const offset = throughSplash ? .24 : 0;
        gsap.to(".mq-track", { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
        const intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } })
          .fromTo(".hero .sun", { scale: .65, opacity: 0 }, { scale: 1, opacity: 1, duration: .85, clearProps: "opacity" }, 0)
          .fromTo(".hero .t1", { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: .78, clearProps: "transform,opacity" }, offset)
          .fromTo(".hero .t2", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: .78, clearProps: "transform,opacity" }, offset + .08)
          .fromTo(".hero-slash", { clipPath: "inset(0 100% 0 0)", opacity: 0 }, { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: .75, clearProps: "clipPath,opacity" }, offset + .22)
          .fromTo(".hero-tagline-main .word span", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: .1, duration: .6, clearProps: "transform,opacity" }, offset + .48)
          .fromTo(".hero-tagline-sub", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .55, clearProps: "transform,opacity" }, offset + .85)
          .fromTo(".hero-scroll", { opacity: 0 }, { opacity: 1, duration: .45, clearProps: "opacity" }, offset + 1.05);
        if (!throughSplash) intro.timeScale(1.8);
        onReveal = () => intro.play();
        if (document.documentElement.dataset.csmReveal === "1") onReveal();
        else window.addEventListener("csm:reveal", onReveal, { once: true });
        const indicator = select(".hero-scroll")[0];
        if (indicator) ScrollTrigger.create({
          trigger: select(".hero")[0], start: "top top", end: "bottom top",
          onUpdate: (self) => indicator.classList.toggle("is-past", self.progress > .55),
        });
        select(".part,.end").forEach((section: HTMLElement) => {
          const lines = section.querySelectorAll("[data-home-line]");
          const reveal = section.querySelectorAll("[data-home-reveal]");
          const revealTimeline = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });
          revealTimeline.fromTo(lines, { y: section.classList.contains("p2") ? -24 : 24, opacity: 0, clipPath: "inset(0 0 100% 0)" }, {
            y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", stagger: .045, duration: .68, clearProps: "transform,opacity,clipPath",
          }, 0);
          revealTimeline.fromTo(reveal, { y: 16, opacity: 0 }, {
            y: 0, opacity: 1, stagger: .035, duration: .58, clearProps: "transform,opacity",
          }, .08);
          ScrollTrigger.create({
            trigger: section,
            start: "top 88%",
            once: true,
            onEnter: (self) => {
              if (Math.abs(self.getVelocity()) > 1500) revealTimeline.progress(1);
              else revealTimeline.play();
            },
          });
        });
      }
      ScrollTrigger.refresh();
      return () => { if (onReveal) window.removeEventListener("csm:reveal", onReveal); };
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
    media.add(motionQuery + " and (min-width: 761px)", () => {
      if (page !== "home") return;
      const hero = root.current?.querySelector(".hero");
      if (!hero) return;
      const scrollTrigger = { trigger: hero, start: "top top", end: "bottom top", scrub: .7 };
      gsap.to(".hero .sun", { yPercent: -9, ease: "none", scrollTrigger });
      gsap.to(".hero-artwork", { yPercent: 6, ease: "none", scrollTrigger });
    });
    let active = true;
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; media.revert(); };
  }, { scope: root, dependencies: [page], revertOnUpdate: true });
  return <section ref={root} className="view" id={`v-${page}`}>{children}</section>;
}
