import { PageMotion } from "@/animations/PageMotion";
import { PageHeading } from "@/components/PageHeading";
import { ProfileButton } from "@/components/CharacterLink";
import { connections } from "@/data/lore";
import { characters } from "@/data/characters";

export const metadata = { title: "Lore & Connections" };
export default function LorePage() {
  return <PageMotion page="lore"><PageHeading title="Lore &" accent="Links" japanese="関係" /><div className="lr" id="lr">{connections.map((connection) => <div className="rv" key={`${connection.from}-${connection.to}`}><ProfileButton id={connection.from} className="a d">{characters.find((item) => item.id === connection.from)!.name}</ProfileButton><em>{connection.label}</em><ProfileButton id={connection.to} className="b d">{characters.find((item) => item.id === connection.to)!.name}</ProfileButton></div>)}</div></PageMotion>;
}
