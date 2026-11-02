import type { Metadata } from "next";
import { PageMotion } from "@/animations/PageMotion";
import { DevilsExplorer } from "@/components/DevilsExplorer";

export const metadata: Metadata = {
  title: "Classified Files",
  description: "Browse the classified devil and fiend dossiers in the Chainsaw Man Archive.",
};

export default function ClassifiedFilesPage() {
  return <PageMotion page="classified-files"><DevilsExplorer /></PageMotion>;
}
