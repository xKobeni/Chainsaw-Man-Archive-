import type { ReactNode } from "react";

export function PageHeading({ title, accent, japanese, children }: {
  title: string; accent: string; japanese: string; children?: ReactNode;
}) {
  return <div className="ph"><div className="ph-copy"><h1 className="d">{title} <span>{accent}</span></h1><div className="jp j" aria-hidden="true">{japanese}</div></div>{children}</div>;
}
