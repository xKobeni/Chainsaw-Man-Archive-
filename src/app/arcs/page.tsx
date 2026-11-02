import { PageMotion } from "@/animations/PageMotion";
import { ArcsExplorer } from "@/components/ArcsExplorer";

export const metadata = { title: "Story Arcs" };
export default function ArcsPage() {
  return <PageMotion page="arcs"><ArcsExplorer /><p className="note">Arc names follow common fan convention; chapter and volume spans are approximate. Part 2 entries retain the prototype snapshot — check official releases.</p></PageMotion>;
}
