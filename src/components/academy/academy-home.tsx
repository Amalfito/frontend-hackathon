"use client";

import Link from "next/link";
import { useState } from "react";
import { ElectraBolt } from "@/components/brand/electra-logo";
import { EnergyField } from "@/components/fx/energy-field";
import { Reveal } from "@/components/fx/reveal";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { XpNumber } from "@/components/fx/xp-number";
import { useAcademyProgress } from "@/lib/academy/progress";
import { paths, pathFor } from "@/content/academy/paths";
import { OrientationQuiz } from "./orientation-quiz";

/** Résumé serialisable d'un module (pas tout le contenu). */
export type ModuleSummary = {
  slug: string;
  code: string;
  title: string;
  tagline: string;
  icon: string;
  badge: string;
  audience: string;
  required?: boolean;
  minutes: number;
  lessonKeys: string[];
};

function ModuleCard({
  m,
  order,
  done,
  lessonsDone,
}: {
  m: ModuleSummary;
  order?: number;
  done: boolean;
  lessonsDone: number;
}) {
  const total = m.lessonKeys.length;
  const pct = total ? Math.round((lessonsDone / total) * 100) : 0;
  return (
    <Link href={`/learn/${m.slug}`} className="group block h-full">
      <SpotlightCard className="h-full">
        <div
          className={`flex h-full flex-col gap-2 rounded-lg border p-4 transition-all group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgb(11_41_54/0.12)] ${
            done
              ? "border-[var(--electra-mint)]/60 bg-[var(--electra-mint)]/6"
              : "border-border bg-card group-hover:border-[var(--electra-mint)]/50"
          }`}
        >
        <div className="flex items-start justify-between gap-2">
          <span className="text-2xl">{m.icon}</span>
          <div className="flex items-center gap-1.5">
            {order !== undefined && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                étape {order + 1}
              </span>
            )}
            {m.required && (
              <span className="rounded-full bg-accent/20 px-2 py-0.5 font-mono text-[10px] font-bold text-accent-foreground">
                requis
              </span>
            )}
            <span className="font-mono text-[10px] text-muted-foreground">{m.code}</span>
          </div>
        </div>
        <h3 className="font-elegant text-lg font-semibold leading-snug">{m.title}</h3>
        <p className="flex-1 text-sm text-muted-foreground">{m.tagline}</p>
        <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
          <span>
            {total} leçons · ≈{m.minutes} min · {m.audience}
          </span>
          {done ? (
            <span className="font-semibold text-emerald-700">🏆 {m.badge}</span>
          ) : (
            <span>{pct}%</span>
          )}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[var(--electra-mint)] shadow-[0_0_8px_rgb(67_245_185/0.4)] transition-all"
            style={{ width: `${done ? 100 : pct}%` }}
          />
        </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}

export function AcademyHome({ modules }: { modules: ModuleSummary[] }) {
  const { progress, ready, setPersona, reset } = useAcademyProgress();
  const [showQuiz, setShowQuiz] = useState(false);

  const path = ready ? pathFor(progress.persona) : null;
  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const orderedForPath = path
    ? (path.modules.map((s) => bySlug.get(s)).filter(Boolean) as ModuleSummary[])
    : [];
  const rest = path ? modules.filter((m) => !path.modules.includes(m.slug)) : [];

  const lessonsDoneIn = (m: ModuleSummary) =>
    ready ? m.lessonKeys.filter((k) => progress.lessons.includes(k)).length : 0;
  const isDone = (m: ModuleSummary) => ready && progress.checkpoints.includes(m.slug);

  const badges = modules.filter(isDone);
  const certModules = path ? [...new Set([...path.modules, "securite"])] : [];
  const certReady =
    path && certModules.every((s) => progress.checkpoints.includes(s));

  const totalLessons = modules.reduce((acc, m) => acc + m.lessonKeys.length, 0);
  const doneLessons = ready ? progress.lessons.length : 0;
  const globalRatio = totalLessons ? doneLessons / totalLessons : 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Hero « le réseau qui apprend » — panneau pétrole, particules menthe. */}
      <header className="relative overflow-hidden rounded-2xl bg-[var(--electra-petrol-deep)] px-6 py-12 sm:px-10 sm:py-16">
        <EnergyField progress={0.3 + globalRatio * 0.7} />
        <div
          aria-hidden="true"
          className="energy-pulse pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgb(67_245_185/0.14),transparent_60%)]"
        />
        <div className="relative flex flex-col gap-4">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-[var(--electra-mint)]">
            <ElectraBolt className="h-4 w-4" /> Electra AI Academy
          </p>
          <h1 className="hero-title font-elegant font-semibold text-[var(--electra-ice)]">
            Apprends l&apos;IA
            <br />
            <span className="text-[var(--electra-mint)] [text-shadow:0_0_28px_rgb(67_245_185/0.45)]">
              en la pratiquant.
            </span>
          </h1>
          <p className="max-w-xl text-[15px] leading-relaxed text-[var(--electra-mint-soft)]/80">
            Pas de vidéo passive, pas de PDF mort : chaque concept est suivi
            d&apos;un exercice réel dans Claude. 12 modules, 3 parcours, des badges
            à gagner. Lis à gauche, pratique à droite. 🔌
          </p>
          <div className="mt-2 flex flex-wrap gap-5 font-mono text-xs text-[var(--electra-mint-soft)]/70">
            <span>
              <span className="text-lg font-bold text-[var(--electra-mint)]">
                <XpNumber value={ready ? progress.xp : 0} />
              </span>{" "}
              XP
            </span>
            <span>
              <span className="text-lg font-bold text-[var(--electra-mint)]">
                <XpNumber value={badges.length} />
              </span>
              /{modules.length} badges
            </span>
            <span>
              <span className="text-lg font-bold text-[var(--electra-mint)]">
                <XpNumber value={Math.round(globalRatio * 100)} />
              </span>
              % du réseau chargé
            </span>
          </div>
        </div>
      </header>

      {/* Orientation / parcours */}
      {!path ? (
        <section className="flex flex-col gap-4">
          {showQuiz ? (
            <OrientationQuiz onDone={() => setShowQuiz(false)} />
          ) : (
            <div className="flex flex-col gap-4 rounded-lg border border-primary/40 bg-primary/5 p-6">
              <h2 className="font-elegant text-2xl font-bold">
                🧭 Par où commencer ? 30 secondes pour le savoir.
              </h2>
              <p className="text-sm text-muted-foreground">
                5 questions pour te recommander ton parcours. Tout reste accessible :
                c&apos;est un ordre conseillé, pas une prison.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuiz(true)}
                  className="rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Lancer le quiz d&apos;orientation
                </button>
                <span className="self-center font-mono text-[11px] text-muted-foreground">
                  ou choisis directement :
                </span>
                {paths.map((p) => (
                  <button
                    key={p.persona}
                    type="button"
                    onClick={() => setPersona(p.persona)}
                    className="rounded-md border border-border bg-card px-3 py-2 text-sm transition-colors hover:border-primary"
                    title={p.description}
                  >
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {paths.map((p) => (
                  <div key={p.persona} className="rounded-md border border-border bg-card p-3">
                    <p className="font-semibold">
                      {p.icon} {p.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-elegant text-2xl font-bold">
              {path.icon} Ton parcours — {path.label}
            </h2>
            <button
              type="button"
              onClick={() => setShowQuiz(true)}
              className="font-mono text-[11px] text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              changer de parcours
            </button>
          </div>
          {showQuiz && <OrientationQuiz onDone={() => setShowQuiz(false)} />}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orderedForPath.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 3) * 0.08} className="h-full">
                <ModuleCard
                  m={m}
                  order={i}
                  done={isDone(m)}
                  lessonsDone={lessonsDoneIn(m)}
                />
              </Reveal>
            ))}
          </div>
          {rest.length > 0 && (
            <>
              <h3 className="mt-4 font-elegant text-xl font-semibold text-muted-foreground">
                Pour aller plus loin (hors parcours)
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((m, i) => (
                  <Reveal key={m.slug} delay={(i % 3) * 0.08} className="h-full">
                    <ModuleCard
                      m={m}
                      done={isDone(m)}
                      lessonsDone={lessonsDoneIn(m)}
                    />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Tous les modules (si pas de parcours choisi) */}
      {!path && (
        <section className="flex flex-col gap-3">
          <h2 className="font-elegant text-2xl font-bold">Les 12 modules</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => (
              <Reveal key={m.slug} delay={(i % 3) * 0.08} className="h-full">
                <ModuleCard
                  m={m}
                  done={isDone(m)}
                  lessonsDone={lessonsDoneIn(m)}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Vitrine badges */}
      <Reveal>
      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-elegant text-xl font-bold">
            🏆 Tes badges ({badges.length}/{modules.length})
          </h2>
          {certReady ? (
            <Link
              href="/learn/certificat"
              className="btn-charge rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground"
            >
              🎓 Obtenir mon certificat
            </Link>
          ) : (
            path && (
              <span className="font-mono text-[11px] text-muted-foreground">
                Certificat : termine ton parcours + le module Sécurité (M11)
              </span>
            )
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {modules.map((m) => {
            const got = isDone(m);
            return (
              <span
                key={m.slug}
                title={`${m.code} — ${m.title}`}
                className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
                  got
                    ? "shine border-[var(--electra-mint)] bg-[var(--electra-mint)]/15 font-semibold shadow-[0_0_10px_rgb(67_245_185/0.25)]"
                    : "border-border text-muted-foreground opacity-50"
                }`}
              >
                {m.icon} {m.badge}
              </span>
            );
          })}
        </div>
      </section>
      </Reveal>

      {/* Pied de page académie */}
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Prêt à mettre tout ça en pratique dans l&apos;arène ?
          </p>
          <Link
            href="/play"
            className="mt-2 inline-block font-mono text-sm font-semibold text-primary hover:underline"
          >
            ▸ Passer aux défis (partie notée)
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted-foreground">
            L&apos;IA évolue vite — contenus revus chaque trimestre.
          </p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Remettre ta progression à zéro ? (XP, badges, leçons)")) reset();
            }}
            className="font-mono text-[10px] text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
          >
            réinitialiser ma progression
          </button>
        </div>
      </div>
    </div>
  );
}
