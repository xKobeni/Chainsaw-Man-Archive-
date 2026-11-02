import { PageMotion } from "@/animations/PageMotion";
import { LocationsExplorer } from "@/components/LocationsExplorer";

export const metadata = { title: "World & Locations" };
export default function LocationsPage() {
  return <PageMotion page="locations"><LocationsExplorer /></PageMotion>;
}
