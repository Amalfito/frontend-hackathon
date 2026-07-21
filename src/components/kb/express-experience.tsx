"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, stagger } from "animejs";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/fx/reveal";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { ReadingProgress } from "@/components/fx/reading-progress";
import { celebrateBadge } from "@/components/fx/celebrate";
import { InlineQuiz } from "@/components/academy/inline-quiz";
import { FlipCards } from "@/components/academy/flip-cards";
import { SortGame } from "@/components/academy/sort-game";
import { YouTubeLite } from "@/components/kb/youtube-lite";
import { PopIn } from "@/components/kb/pop-in";
import {
  chapters,
  flashcards,
  finalSort,
  totalMinutes,
} from "@/content/kb/express-course";

export function ExpressExperience() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Hero : entrée animée des « points d'énergie » (anime.js v4).
  useEffect(() => {
    if (reduced || !heroRef.current) return;
    const dots = heroRef.current.querySelectorAll(".edot");
    if (!dots.length) return;
    try {
      animate(dots, {
        opacity: [0.15, 1],
        scale: [0.4, 1],
        delay: stagger(70),
        duration: 700,
        ease: "outQuad",
      });
      animate(dots, {
        opacity: [1, 0.45],
        loop: true,
        alternate: true,
        duration: 1600,
        delay: stagger(120),
        ease: "inOutSine",
      });
    } catch {
      /* anime indispo → dégradation silencieuse */
    }
  }, [reduced]);

  // Suivi du chapitre courant pour la pastille de progression.
  useEffect(() => {
    const secs = Array.from(document.querySelectorAll("[data-ch]"));
    if (!secs.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.ch);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    secs.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-16 py-4">
      <ReadingProgress />

      {/* Pastille de progression (chaque page → sur chaque chapitre) */}
      <div className="pointer-events-none fixed right-4 top-20 z-20 hidden sm:block">
        <div className="pointer-events-auto rounded-full border border-primary/40 bg-background/80 px-3 py-1.5 font-mono text-[11px] text-primary backdrop-blur-sm">
          {active + 1}/{chapters.length} · {chapters[active]?.emoji}
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <header ref={heroRef} className="flex flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="edot h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgb(67_245_185/0.6)]"
            />
          ))}
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          ⚡ Charge rapide · ~{totalMinutes} min · une balade guidée
        </p>
        <h1 className="hero-title font-elegant font-semibold text-primary text-glow">
          Recharge tes connaissances
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Albert siphonne le savoir du réseau. En {chapters.length} chapitres —
          histoire, vidéos, quiz éclair — tu récupères tout ce qu&apos;il faut pour
          le neutraliser. Avance à ton rythme, chaque chapitre se termine par un
          petit test.
        </p>
        <a
          href={`#ch-0`}
          className="btn-charge rounded-md bg-primary px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-primary-foreground"
        >
          Commencer la balade ↓
        </a>
      </header>

      {/* ── CHAPITRES ────────────────────────────────────────────────────── */}
      {chapters.map((ch, i) => (
        <section
          key={ch.id}
          id={`ch-${i}`}
          data-ch={i}
          className="flex scroll-mt-24 flex-col gap-6"
        >
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-primary/40 bg-primary/10 text-3xl">
                {ch.emoji}
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  {ch.kicker} · {ch.minutes} min
                </p>
                <h2 className="font-elegant text-3xl font-bold text-primary">
                  {ch.title}
                </h2>
              </div>
            </div>
          </Reveal>

          {ch.story.map((p, j) => (
            <Reveal key={j} delay={0.05 * j}>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {p}
              </p>
            </Reveal>
          ))}

          {ch.video && (
            <Reveal>
              <YouTubeLite
                id={ch.video.youtubeId}
                title={ch.video.title}
                channel={ch.video.channel}
              />
            </Reveal>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {ch.points.map((pt, k) => (
              <Reveal key={k} delay={0.06 * k} className="h-full">
                <SpotlightCard className="h-full border border-border bg-card p-4">
                  <div className="flex h-full flex-col gap-1.5">
                    <p className="flex items-center gap-2 font-semibold">
                      {pt.icon && <span className="text-lg">{pt.icon}</span>}
                      {pt.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {pt.body}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>

          {ch.popIn && <PopIn title={ch.popIn.title} body={ch.popIn.body} />}

          <Reveal>
            <InlineQuiz
              awardKey={`kb-x-${ch.id}`}
              title={`Test éclair — ${ch.title}`}
              questions={ch.quiz}
            />
          </Reveal>
        </section>
      ))}

      {/* ── RÉVISION : FLASHCARDS ────────────────────────────────────────── */}
      <section className="flex scroll-mt-24 flex-col gap-5">
        <Reveal>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              🃏 Révision express
            </p>
            <h2 className="font-elegant text-3xl font-bold text-primary">
              Flashcards — tout le savoir, retourné
            </h2>
            <p className="mx-auto mt-1 max-w-lg text-sm text-muted-foreground">
              Clique pour retourner. Balaye les {flashcards.length} cartes : si tu
              devines le verso avant de retourner, c&apos;est gagné.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <FlipCards cards={flashcards} />
        </Reveal>
      </section>

      {/* ── MINI-JEU FINAL ───────────────────────────────────────────────── */}
      <section className="flex scroll-mt-24 flex-col gap-5">
        <Reveal>
          <div className="text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
              🎮 Entraînement
            </p>
            <h2 className="font-elegant text-3xl font-bold text-primary">
              Le bon outil pour la bonne tâche
            </h2>
          </div>
        </Reveal>
        <Reveal>
          <SortGame
            awardKey="kb-x-sort"
            title={finalSort.title}
            instructions={finalSort.instructions}
            categories={finalSort.categories}
            items={finalSort.items}
          />
        </Reveal>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="terminal-glow flex flex-col items-center gap-3 rounded-2xl border border-accent/50 bg-card p-8 text-center"
      >
        <p className="font-elegant text-2xl font-bold text-primary">
          Chargé à 100 %. Albert n&apos;a aucune chance.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => celebrateBadge()}
            className="rounded-md border border-primary/50 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10"
          >
            🎉 J&apos;ai tout révisé
          </button>
          <Link
            href="/game"
            className="btn-charge rounded-md bg-accent px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wider text-accent-foreground"
          >
            🎮 Entrer dans l&apos;arène
          </Link>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          Envie d&apos;aller au fond des choses ?{" "}
          <Link href="/learn" className="text-primary hover:underline">
            L&apos;académie complète t&apos;attend.
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
