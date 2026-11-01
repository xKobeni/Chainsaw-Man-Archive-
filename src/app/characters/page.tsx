import { PageMotion } from "@/animations/PageMotion";
import { CharactersExplorer } from "@/components/CharactersExplorer";

export const metadata = { title: "Characters" };
export default function CharactersPage() {
  return <PageMotion page="characters"><CharactersExplorer /></PageMotion>;
}
