export type Part = "1" | "2";
export interface Character {
  id: string;
  name: string;
  japanese: string;
  parts: Part[];
  role: string;
  color: string;
  background: string;
  powers: string;
  relationships: string[];
  contracts: string;
  artwork: string | null;
}
export interface Devil {
  id: string;
  name: string;
  japanese: string;
  type: "devil" | "fiend";
  subcategory?: string;
  artwork?: string | null;
  contractor: string;
  threat: string;
  description: string;
  redacted?: string;
}
export interface StoryArc {
  name: string;
  part: Part;
  chapters: string;
  volumes: string;
  characters: string;
  antagonist: string;
  locations: string;
  description: string;
  sourceUrl: string;
  artwork?: string;
  artworkFit?: "cover" | "contain";
  color: string;
}
export interface ArchiveLocation {
  name: string;
  japanese: string;
  subtitle: string;
  description: string;
  color: string;
  characters: string[];
  image?: string | null;
}
export interface LoreConnection {
  from: string;
  label: string;
  to: string;
}
export interface Volume {
  number: number;
  part: Part;
  chapters: string | null;
  color: string;
  cover: string | null;
  publishedInJapan?: string;
  sourceUrl?: string;
}
export interface NavigationItem {
  href: string;
  label: string;
  japanese: string;
  color: string;
}
