import { getBoard } from "../actions";
import { PodiumScreen } from "@/components/screen/podium-screen";

export const dynamic = "force-dynamic";
export const metadata = { title: "Supervision — Podium (écran)" };

/** Écran podium : classement live grand format pour projection. */
export default async function ScreenPodiumPage() {
  const initial = await getBoard();
  return <PodiumScreen initial={initial} />;
}
