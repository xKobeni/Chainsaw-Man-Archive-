"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
export const motionQuery = "(prefers-reduced-motion: no-preference)";
export const wipe = {
  start: "polygon(-20% 0,-10% 0,-30% 100%,-40% 100%)",
  full: "polygon(-20% 0,140% 0,120% 100%,-40% 100%)",
  end: "polygon(140% 0,140% 0,120% 100%,120% 100%)",
};
