import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/fx/reveal";
import { CheckpointPanel } from "@/components/academy/checkpoint-panel";
import { ModuleLessons } from "@/components/academy/module-lessons";
import { QuizRunner, type QuizItem } from "@/components/quiz-runner";
import { LAST_REVIEW, moduleBySlug, officialSources } from "@/content/academy";
import { createClient } from "@/lib/supabase/server";
import type { Quiz, QuizOption, QuizQuestion } from "@/lib/types";

export const dynamic = "force-dynamic";

/** QCM Supabase noté (learn_score d'équipe) lié au checkpoint, s'il existe. */
async function loadTeamQuiz(lessonSlug: string) {
  try {
    const supabase = await createClient();
    const { data: quiz } = await supabase
      .from("quizzes_public")
      .select("*")
      .eq("lesson_slug", lessonSlug)
      .order("order_index", { ascending: true })
      .limit(1)
      .maybeSingle<Quiz>();
    if (!quiz) return null;

    const { data: questions } = await supabase
      .from("quiz_questions_public")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("order_index", { ascending: true })
      .returns<QuizQuestion[]>();

    const qIds = (questions ?? []).map((q) => q.id);
    const { data: options } = qIds.length
      ? await supabase
          .from("quiz_options_public")
          .select("*")
          .in("question_id", qIds)
          .order("order_index", { ascending: true })
          .returns<QuizOption[]>()
      : { data: [] as QuizOption[] };

    const items: QuizItem[] = (questions ?? []).map((q) => ({
      question: q,
      options: (options ?? []).filter((o) => o.question_id === q.id),
    }));
    return items.length ? { quiz, items } : null;
  } catch {
    // Base non configurée : l'académie reste 100 % fonctionnelle sans.
    return null;
  }
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleSlug } = await params;
  const mod = moduleBySlug(moduleSlug);
  if (!mod) notFound();

  const teamQuiz = mod.checkpoint.dbQuizLessonSlug
    ? await loadTeamQuiz(mod.checkpoint.dbQuizLessonSlug)
    : null;

  const totalMinutes = mod.lessons.reduce((acc, l) => acc + l.minutes, 0);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/learn"
        className="font-mono text-xs text-muted-foreground hover:text-primary"
      >
        ← Tous les modules
      </Link>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent-foreground">
          {mod.code} · {mod.audience}
          {mod.required ? " · requis pour le certificat" : ""}
        </p>
        <h1 className="font-elegant text-4xl font-bold text-primary">
          {mod.icon} {mod.title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{mod.tagline}</p>
        <p className="font-mono text-[11px] text-muted-foreground">
          {mod.lessons.length} leçons · ≈{totalMinutes} min · badge à gagner :
          🏆 « {mod.badge} »
        </p>
      </header>

      <ModuleLessons
        moduleSlug={mod.slug}
        lessons={mod.lessons.map((l) => ({
          slug: l.slug,
          title: l.title,
          summary: l.summary,
          minutes: l.minutes,
        }))}
      />

      <Reveal>
        <CheckpointPanel
          moduleSlug={mod.slug}
          badge={mod.badge}
          checkpoint={mod.checkpoint}
        />
      </Reveal>

      {teamQuiz && (
        <Card>
          <CardHeader>
            <CardTitle className="font-elegant text-2xl">
              🏁 {teamQuiz.quiz.title} — QCM noté d&apos;équipe
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {teamQuiz.quiz.description} Les points gagnés ici alimentent le
              score « apprentissage » de ton équipe au classement.
            </p>
          </CardHeader>
          <CardContent>
            <QuizRunner items={teamQuiz.items} />
          </CardContent>
        </Card>
      )}

      <footer className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sources officielles
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {officialSources.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] text-primary hover:underline"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">
          L&apos;IA évolue vite — ces contenus sont revus chaque trimestre.
          Dernière revue : {LAST_REVIEW}.
        </p>
      </footer>
    </div>
  );
}
