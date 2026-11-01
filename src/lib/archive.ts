import type { CSSProperties } from "react";
import type { StoryArc, Volume } from "../types/archive";

export const colorStyle = (color: string): CSSProperties => ({ "--c": color } as CSSProperties);

export function arcsForVolume(arcs: StoryArc[], volume: Volume) {
  return arcs.filter((arc) => {
    if (arc.part !== volume.part) return false;
    if (volume.part === "2") return arc.name === "Academy Saga";
    const bounds = arc.volumes.match(/\d+/g)?.map(Number) ?? [];
    return volume.number >= bounds[0] && volume.number <= bounds[bounds.length - 1];
  });
}
