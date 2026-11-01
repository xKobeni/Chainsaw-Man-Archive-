import { PageMotion } from "@/animations/PageMotion";
import { PageHeading } from "@/components/PageHeading";
import { VolumesExplorer } from "@/components/VolumesExplorer";

export const metadata = { title: "Manga Volumes" };
export default function VolumesPage() {
  return <PageMotion page="volumes"><PageHeading title="The" accent="Volumes" japanese="単行本" /><VolumesExplorer /></PageMotion>;
}
