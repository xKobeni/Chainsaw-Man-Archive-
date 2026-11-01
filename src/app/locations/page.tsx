import { PageMotion } from "@/animations/PageMotion";
import { PageHeading } from "@/components/PageHeading";
import { LocationScenery } from "@/components/LocationScenery";
import { CharacterLink } from "@/components/CharacterLink";
import { locations } from "@/data/locations";
import { characters } from "@/data/characters";
import { colorStyle } from "@/lib/archive";

export const metadata = { title: "World & Locations" };
export default function LocationsPage() {
  return <PageMotion page="locations"><PageHeading title="World &" accent="Places" japanese="世界"><p className="mt-3 text-xs">Swipe or scroll sideways →</p></PageHeading><div className="hz" id="hz" tabIndex={0} role="region" aria-label="Location showcase; scroll horizontally">
    {locations.map((location, index) => <article className="loc" key={location.name} style={{ ...colorStyle(location.color), color: location.color === "#111111" ? "var(--w)" : "var(--k)" }}>
      <LocationScenery index={index} /><div className="j">{location.japanese}</div><h3 className="d">{location.name}</h3><div className="relative text-xs tracking-[.2em]">{location.subtitle.toUpperCase()}</div><p>{location.description}</p><div className="tg">{location.characters.map((id) => <CharacterLink key={id} id={id}>{characters.find((item) => item.id === id)!.name}</CharacterLink>)}</div>
    </article>)}
  </div></PageMotion>;
}
