"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useArchive } from "./ArchiveShell";

export function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link>) {
  const { navigate } = useArchive();
  return <Link {...props} href={href} onClick={(event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank") return;
    event.preventDefault();
    navigate(String(href));
  }} />;
}
