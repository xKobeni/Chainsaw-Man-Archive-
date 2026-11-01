"use client";

import type { ReactNode } from "react";
import { useArchive } from "./ArchiveShell";
import { TransitionLink } from "./TransitionLink";

export function CharacterLink({ id, children }: { id: string; children: ReactNode }) {
  const { selectCharacter } = useArchive();
  return <TransitionLink href="/characters" onClick={() => selectCharacter(id)}>{children}</TransitionLink>;
}

export function ProfileButton({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const { openProfile } = useArchive();
  return <button className={className} onClick={() => openProfile(id)}>{children}</button>;
}
