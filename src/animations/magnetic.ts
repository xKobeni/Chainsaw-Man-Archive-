import { gsap } from "./gsap";

export function magneticHover(element: HTMLElement) {
  const x = gsap.quickTo(element, "x", { duration: .5, ease: "power3" });
  const y = gsap.quickTo(element, "y", { duration: .5, ease: "power3" });
  const move = (event: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    x((event.clientX - rect.left - rect.width / 2) * .3);
    y((event.clientY - rect.top - rect.height / 2) * .3);
  };
  const leave = () => { x(0); y(0); };
  element.addEventListener("mousemove", move);
  element.addEventListener("mouseleave", leave);
  return () => {
    element.removeEventListener("mousemove", move);
    element.removeEventListener("mouseleave", leave);
  };
}
