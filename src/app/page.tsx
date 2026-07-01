import Link from "next/link";
import { cookies } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { JoinForm } from "@/components/join-form";
import { leaveTeam } from "@/app/actions";
import { TEAM_COOKIE } from "@/lib/constants";

export default async function HomePage() {
  const c = await cookies();
  const hasTeam = Boolean(c.get(TEAM_COOKIE)?.value);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary text-glow">
          Electra · Network Operations
        </p>
        <h1 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
          OPERATION <span className="text-primary text-glow blink">ALBERT</span>
        </h1>
      </div>

      <Card className="terminal-glow border-primary/30">
        <CardContent className="flex flex-col gap-4 pt-6 font-mono text-sm leading-relaxed text-muted-foreground">
          <p className="text-accent">{"// TRANSMISSION ENTRANTE — 13:37"}</p>
          <p>
            Le code source d&apos;
            <strong className="text-foreground">Albert</strong>, l&apos;agent IA de
            cybersécurité d&apos;Electra, est tombé entre les mains du <em>vrai</em>{" "}
            Albert — un dev senior chez la concurrence.
          </p>
          <p>
            Il détient toutes les données confidentielles de l&apos;entreprise. Pour
            les protéger — et les publier sur le deep web — il a confié le tout à un
            agent IA de sa création. Cet agent est armé : il se défend, il ne se
            laisse pas berner.
          </p>
          <p className="text-foreground">
            Vous avez jusqu&apos;à la fin de la journée pour le neutraliser.
            Construisez vos propres agents, déchiffrez ses énigmes, retirez les
            fusibles un par un, et{" "}
            <span className="text-primary">désamorcez la bombe</span>.
          </p>
        </CardContent>
      </Card>

      {hasTeam ? (
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <p className="font-mono text-sm text-muted-foreground">
              Session détectée. Reprenez là où vous en étiez.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/play"
                className={buttonVariants({
                  className: "font-mono uppercase tracking-wider",
                })}
              >
                Reprendre la mission ▸
              </Link>
              <form action={leaveTeam}>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full font-mono uppercase tracking-wider sm:w-auto"
                >
                  Changer d&apos;équipe
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <JoinForm />
          </CardContent>
        </Card>
      )}

      <p className="text-center font-mono text-xs text-muted-foreground">
        <Link href="/leaderboard" className="hover:text-primary">
          › Voir le classement des équipes
        </Link>
      </p>
    </div>
  );
}
