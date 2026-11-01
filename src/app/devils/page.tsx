import { PageMotion } from "@/animations/PageMotion";
import { PageHeading } from "@/components/PageHeading";
import { DevilsExplorer } from "@/components/DevilsExplorer";

export const metadata = { title: "Devils & Fiends" };
export default function DevilsPage() {
  return <PageMotion page="devils"><PageHeading title="Classified" accent="Files" japanese="機密"><p className="max-w-[520px] mt-3 text-[13px]">Fictional Public Safety archive. Threat ratings are this site&apos;s own invention; hover, focus or tap redactions to reveal.</p></PageHeading><DevilsExplorer /></PageMotion>;
}
