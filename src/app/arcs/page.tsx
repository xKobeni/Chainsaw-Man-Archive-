import { PageMotion } from "@/animations/PageMotion";
import { ArcsExplorer } from "@/components/ArcsExplorer";

export const metadata = { title: "Story Arcs" };
export default function ArcsPage() {
  return <PageMotion page="arcs"><ArcsExplorer /><p className="note">Arc names and boundaries follow the <a href="https://chainsaw-man.fandom.com/wiki/Story_Arcs" target="_blank" rel="noopener noreferrer">Chainsaw Man Wiki story index</a>; these are community arc labels. Publisher links support each short summary. Volume spans include every cover whose chapters overlap an arc.</p></PageMotion>;
}
