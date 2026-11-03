import type { CSSProperties } from "react";
import type { StoryArc, Volume } from "../types/archive";

export const colorStyle = (color: string): CSSProperties => ({ "--c": color } as CSSProperties);

export function arcsForVolume(arcs: StoryArc[], volume: Volume) {
  const [first, last] = volume.chapters?.match(/\d+/g)?.map(Number) ?? [];
  if (first === undefined || last === undefined) return [];
  return arcs.filter((arc) => {
    if (arc.part !== volume.part) return false;
    const [start, end] = arc.chapters.match(/\d+/g)?.map(Number) ?? [];
    return start <= last && end >= first;
  });
}
