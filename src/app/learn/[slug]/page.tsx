import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import { QuizRunner, type QuizItem } from "@/components/quiz-runner";
import { createClient } from "@/lib/supabase/server";
import type { Lesson, Quiz, QuizOption, QuizQuestion } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<Lesson>();

  if (!lesson) notFound();

  // Quiz lié à cette leçon (s'il existe).
  const { data: quiz } = await supabase
    .from("quizzes_public")
    .select("*")
    .eq("lesson_slug", slug)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle<Quiz>();

  let items: QuizItem[] = [];
  if (quiz) {
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

    items = (questions ?? []).map((q) => ({
      question: q,
      options: (options ?? []).filter((o) => o.question_id === q.id),
    }));
  }

  return (
    <div className="theme-learn -mx-4 -my-8 min-h-[calc(100vh-8rem)] px-4 py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Link
          href="/learn"
          className="font-mono text-xs text-muted-foreground hover:text-primary"
        >
          ← Tous les modules
        </Link>

        <article className="rounded-lg border border-border bg-card p-6 sm:p-8">
          <Markdown content={lesson.content} />
        </article>

        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-elegant text-2xl">
                {quiz?.title ?? "Quiz"}
              </CardTitle>
              {quiz?.description && (
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <QuizRunner items={items} />
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between text-sm">
          <Link href="/learn" className="text-muted-foreground hover:text-primary">
            ← Modules
          </Link>
          <Link href="/play" className="font-semibold text-primary hover:underline">
            Passer aux défis →
          </Link>
        </div>
      </div>
    </div>
  );
}
