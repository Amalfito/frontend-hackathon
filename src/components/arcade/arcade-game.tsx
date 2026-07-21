"use client";

/* ============================================================================
 * Moteur de l'Arcade Albert : orchestre les 20 questions, le timer punitif,
 * le sabotage inter-équipes et les écrans de reset / victoire.
 * Toute vérification de réponse passe par les server actions.
 * ========================================================================== */

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  arcadeTimeout,
  revealHidden,
  sabotage,
  springTrap,
  submitArcade,
  type ArcadeView,
} from "@/app/game/actions";
import { AlbertSpeech } from "@/components/albert";
import { celebrateBadge, celebrateSmall } from "@/components/fx/celebrate";
import { XpNumber } from "@/components/fx/xp-number";
import { useI18n } from "@/components/i18n-provider";
import type { ArcadeSubmission } from "@/lib/arcade/types";
import { Countdown } from "./countdown";
import {
  AcronymPlay,
  DragPlay,
  HiddenPlay,
  MatchPlay,
  OrderPlay,
  PromptPlay,
  QcmPlay,
  TargetPlay,
  TextPlay,
} from "./mechanics";

export function ArcadeGame({ initial }: { initial: ArcadeView }) {
  const { t } = useI18n();
  const [view, setView] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [shake, setShake] = useState(false);
  // Remonte la mécanique acronyme sur mauvaise réponse (repart à la 1re sous-question).
  const [attempt, setAttempt] = useState(0);
  const [resetScreen, setResetScreen] = useState<"timeout" | null>(null);
  const [sabotageOpen, setSabotageOpen] = useState(false);
  const [hiddenCode, setHiddenCode] = useState<string | null>(null);
  // Piège d'Albert : le 1er finisher clique « voir le podium » → révélation.
  const [revealTrap, setRevealTrap] = useState(false);
  // Notification one-shot renvoyée par le serveur au chargement.
  const [struckBy] = useState(initial.sabotagedBy);

  const q = view.question;
  const eg = view.endgame;

  // Décharge de confettis quand la victoire collective tombe.
  useEffect(() => {
    if (eg.victory) celebrateBadge();
  }, [eg.victory]);

  /** Le 1er finisher réactive la bombe (le piège se referme). */
  const doSpringTrap = () => {
    startTransition(async () => {
      const res = await springTrap();
      if (!("error" in res)) {
        setView((v) => ({ ...v, endgame: res.endgame }));
      }
      setRevealTrap(true);
    });
  };

  const submit = (sub: ArcadeSubmission) => {
    startTransition(async () => {
      const res = await submitArcade(sub);
      if ("error" in res) {
        toast.error(res.error);
        return;
      }
      setHiddenCode(null);
      if (res.correct) {
        if (res.finished) celebrateBadge();
        else celebrateSmall();
        toast.success(`⚡ +${res.points} pts — accès accordé.`);
        setView(res.view);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 450);
        setAttempt((a) => a + 1);
        toast.error("ACCÈS REFUSÉ — Albert ricane. Réessaie.");
        setView(res.view);
      }
    });
  };

  const onTimeout = () => {
    setResetScreen("timeout");
    startTransition(async () => {
      const res = await arcadeTimeout();
      if (!("error" in res)) setView(res);
    });
  };

  const doSabotage = (targetId: string, targetName: string) => {
    if (
      !window.confirm(
        `Saboter « ${targetName} » ? Ils perdront 5 questions. Un seul sabotage par session — pas de retour en arrière.`,
      )
    )
      return;
    startTransition(async () => {
      const res = await sabotage(targetId);
      if ("error" in res) {
        toast.error(res.error);
      } else {
        toast.success(`😈 Sabotage envoyé — « ${res.target} » recule de 5 questions.`);
        setView(res.view);
        setSabotageOpen(false);
      }
    });
  };

  /* --- Écran de reset punitif ------------------------------------------- */
  if (resetScreen) {
    return (
      <div className="bomb-critical flex flex-col items-center gap-5 rounded-2xl border-2 border-destructive bg-card p-10 text-center">
        <p className="text-5xl">💥</p>
        <h2 className="font-elegant text-3xl font-bold text-destructive">
          SURCHARGE SYSTÈME
        </h2>
        <p className="max-w-md text-muted-foreground">
          Trop lent. Albert a purgé votre progression et régénéré{" "}
          <strong>de nouvelles questions</strong>. Tout est à refaire — plus
          vite, cette fois.
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => setResetScreen(null)}
          className="btn-charge rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground"
        >
          Reprendre au niveau 1
        </button>
      </div>
    );
  }

  /* --- Fin de partie (les 20 verrous sont tombés) -------------------------- */
  if (view.finished || !q) {
    const scoreLine = (
      <p className="font-mono text-sm text-muted-foreground">
        Score :{" "}
        <strong className="text-primary">
          <XpNumber value={view.score} /> pts
        </strong>
        {view.restarts > 0 &&
          ` (malgré ${view.restarts} reset${view.restarts > 1 ? "s" : ""}…)`}
      </p>
    );

    // 1) VICTOIRE COLLECTIVE — toutes les équipes ont terminé à temps.
    if (eg.victory) {
      return (
        <AlbertSpeech
          tone="victory"
          tag={t.albert.victoryTag}
          title={t.albert.victoryTitle}
          lines={t.albert.victoryLines}
        >
          <div className="flex flex-col items-center gap-4">
            {scoreLine}
            <Link
              href="/leaderboard"
              className="btn-charge rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground"
            >
              {t.albert.victoryCta}
            </Link>
          </div>
        </AlbertSpeech>
      );
    }

    // 2) FAUSSE VICTOIRE — le 1er finisher, piège armé, avant le clic fatal.
    if (eg.isFirstFinisher && eg.trapArmed && !revealTrap) {
      return (
        <AlbertSpeech
          tone="friendly"
          tag={t.albert.fakeTag}
          title={t.albert.fakeTitle}
          lines={t.albert.fakeLines}
        >
          <div className="flex flex-col items-center gap-4">
            {scoreLine}
            <button
              type="button"
              disabled={pending}
              onClick={doSpringTrap}
              className="btn-charge rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {t.albert.fakeCta}
            </button>
          </div>
        </AlbertSpeech>
      );
    }

    // 3) RÉVÉLATION — le piège se referme, la bombe repart.
    if (revealTrap) {
      return (
        <AlbertSpeech
          tone="evil"
          tag={t.albert.revealTag}
          title={t.albert.revealTitle}
          lines={t.albert.revealLines}
        >
          <Link
            href="/leaderboard"
            className="mx-auto block w-fit rounded-md border border-destructive/60 px-6 py-3 font-mono text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            {t.albert.revealCta}
          </Link>
        </AlbertSpeech>
      );
    }

    // 4) EN ATTENTE — équipe sortie, mais le chrono tourne pour les autres.
    return (
      <div className="terminal-glow flex flex-col items-center gap-5 rounded-2xl border border-primary/60 bg-card p-10 text-center">
        <p className="text-5xl">🕳️</p>
        <h2 className="font-elegant text-3xl font-bold text-primary text-glow">
          {t.albert.waitTitle}
        </h2>
        <p className="max-w-md text-muted-foreground">{t.albert.waitBody}</p>
        {eg.totalCount > 0 && (
          <p className="font-mono text-sm text-accent">
            {eg.finishedCount}/{eg.totalCount} {t.leaderboard.teamsDone}
          </p>
        )}
        {scoreLine}
        <Link
          href="/leaderboard"
          className="btn-charge rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold text-primary-foreground"
        >
          {t.albert.waitCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Alerte sabotage subie */}
      {struckBy && (
        <div className="bomb-frame flex items-center gap-3 rounded-lg border border-[var(--electra-orange)] bg-[var(--electra-orange)]/10 px-4 py-3">
          <span className="text-2xl">😈</span>
          <p className="text-sm">
            <strong>Vous avez été sabotés par « {struckBy} » !</strong> Votre
            progression a reculé de 5 questions. La vengeance est un plat qui se
            mange chargé.
          </p>
        </div>
      )}

      {/* Barre de statut */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="font-bold text-primary">◢ {view.teamName}</span>
          <span className="text-muted-foreground">
            Verrou {view.q + 1}/{view.total}
          </span>
          <span className="text-muted-foreground">
            <XpNumber value={view.score} /> pts
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Jauge de progression */}
          <div className="h-2 w-36 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[var(--electra-mint)] shadow-[0_0_8px_rgb(67_245_185/0.5)] transition-all duration-500"
              style={{ width: `${(view.q / view.total) * 100}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setSabotageOpen((o) => !o)}
            disabled={view.sabotageUsed}
            className={`rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold transition-colors ${
              view.sabotageUsed
                ? "border-border text-muted-foreground opacity-50"
                : "border-[var(--electra-orange)] text-[var(--electra-orange)] hover:bg-[var(--electra-orange)]/10"
            }`}
          >
            {view.sabotageUsed ? "😈 sabotage utilisé" : "😈 Saboter une équipe"}
          </button>
        </div>
      </div>

      {/* Panneau sabotage */}
      {sabotageOpen && !view.sabotageUsed && (
        <div className="flex flex-col gap-2 rounded-lg border border-[var(--electra-orange)]/60 bg-[var(--electra-orange)]/5 p-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--electra-orange)]">
            😈 Frappe unique — choisis ta cible (-5 questions)
          </p>
          {view.rivals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune équipe rivale connectée pour l&apos;instant.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {view.rivals.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  disabled={pending}
                  onClick={() => doSabotage(r.id, r.name)}
                  className="rounded-md border border-border bg-card px-3 py-1.5 font-mono text-xs hover:border-[var(--electra-orange)] hover:bg-[var(--electra-orange)]/10"
                >
                  🎯 {r.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Carte question */}
      <div
        className={`flex flex-col gap-4 rounded-2xl border p-6 transition-colors sm:p-8 ${
          q.timeLimit
            ? "bomb-frame border-[var(--electra-orange)]/70 bg-card"
            : "terminal-glow border-primary/40 bg-card"
        } ${shake ? "shake" : ""}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Verrou {q.slot}/20 · difficulté {"⚡".repeat(q.difficulty)}
            </p>
            <h2 className="font-elegant text-2xl font-bold text-primary">
              {q.title}
            </h2>
          </div>
          {q.timeLimit && (
            <Countdown
              key={q.id}
              seconds={q.timeLimit}
              onExpire={onTimeout}
              paused={pending}
            />
          )}
        </div>

        {q.intro && (
          <p className="border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
            {q.intro}
          </p>
        )}

        {q.mechanic.kind === "qcm" && (
          <QcmPlay m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "text" && (
          <TextPlay m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "prompt" && (
          <PromptPlay m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "drag" && (
          <DragPlay key={q.id} m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "match" && (
          <MatchPlay key={q.id} m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "order" && (
          <OrderPlay key={q.id} m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "target" && (
          <TargetPlay key={q.id} m={q.mechanic} onSubmit={submit} disabled={pending} />
        )}
        {q.mechanic.kind === "acronym" && (
          <AcronymPlay
            key={`acr-${q.id}-${attempt}`}
            m={q.mechanic}
            onSubmit={submit}
            disabled={pending}
          />
        )}
        {q.mechanic.kind === "hidden" && (
          <HiddenPlay
            key={q.id}
            m={q.mechanic}
            onSubmit={submit}
            disabled={pending}
            revealedCode={hiddenCode}
            onSpotFound={() =>
              startTransition(async () => {
                const res = await revealHidden();
                if ("code" in res) {
                  celebrateSmall();
                  setHiddenCode(res.code);
                } else toast.error(res.error);
              })
            }
          />
        )}

        {q.hint && (
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider hover:text-primary">
              💡 Indice
            </summary>
            <p className="mt-1 pl-1">{q.hint}</p>
          </details>
        )}
      </div>

      <p className="text-center font-mono text-[11px] text-muted-foreground">
        Bloqué ? La{" "}
        <Link href="/kb/express" className="text-primary hover:underline">
          Knowledge Base Express
        </Link>{" "}
        contient tout ce qu&apos;il faut. ⚡
      </p>

    </div>
  );
}
