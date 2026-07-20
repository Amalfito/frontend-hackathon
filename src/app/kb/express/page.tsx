import Link from "next/link";
import { ExpressExperience } from "@/components/kb/express-experience";

export const metadata = {
  title: "Knowledge Express — la balade guidée (~20 min)",
};

/**
 * Express Knowledge v2 : une expérience narrative guidée (chapitres animés,
 * vidéos, quiz éclair, flashcards, mini-jeu) dans la DA Electra.
 */
export default function KbExpressPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/kb"
        className="mx-auto w-full max-w-3xl font-mono text-xs text-muted-foreground hover:text-primary"
      >
        ← Knowledge Base
      </Link>
      <ExpressExperience />
    </div>
  );
}
