import { PageMotion } from "@/animations/PageMotion";
import { DevilsExplorer } from "@/components/DevilsExplorer";

export const metadata = { title: "Devils & Fiends" };
export default function DevilsPage() {
  return <PageMotion page="devils"><DevilsExplorer /></PageMotion>;
}
