"use client";

import type { ReactNode } from "react";
import type { Part } from "@/types/archive";
import { arcs } from "@/data/arcs";
import { useArchive } from "./ArchiveShell";
import { TransitionLink } from "./TransitionLink";

export function SagaLink({ part, href, className, children }: { part: Part; href: string; className?: string; children: ReactNode }) {
  const { selectPart, setArc } = useArchive();
  return <TransitionLink href={href} className={className} onClick={() => { selectPart(part); if (href === "/arcs") setArc(arcs.findIndex((arc) => arc.part === part)); }}>{children}</TransitionLink>;
}
