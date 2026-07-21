import { getBoard } from "./actions";
import { RaceBoard } from "@/components/screen/race-board";

export const dynamic = "force-dynamic";
export const metadata = { title: "Supervision — La course (écran)" };

/** Écran de contrôle principal : barres de progression par équipe, temps réel. */
export default async function ScreenPage() {
  const initial = await getBoard();
  return <RaceBoard initial={initial} />;
}
