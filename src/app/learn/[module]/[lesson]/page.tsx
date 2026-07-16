import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress } from "@/components/fx/reading-progress";
import { LessonFooter } from "@/components/academy/lesson-footer";
import { LessonRenderer } from "@/components/academy/lesson-renderer";
import { moduleBySlug, modules } from "@/content/academy";

export function generateStaticParams() {
  return modules.flatMap((m) =>
    m.lessons.map((l) => ({ module: m.slug, lesson: l.slug })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;
  const mod = moduleBySlug(moduleSlug);
  if (!mod) notFound();
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx < 0) notFound();
  const lesson = mod.lessons[idx];

  const prev = mod.lessons[idx - 1];
  const next = mod.lessons[idx + 1];
  const prevHref = prev ? `/learn/${mod.slug}/${prev.slug}` : `/learn/${mod.slug}`;
  const nextHref = next
    ? `/learn/${mod.slug}/${next.slug}`
    : `/learn/${mod.slug}#checkpoint`;
  const nextLabel = next ? "Leçon suivante" : "Checkpoint du module 🏆";

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <ReadingProgress />
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/learn/${mod.slug}`}
          className="font-mono text-xs text-muted-foreground hover:text-primary"
        >
          ← {mod.code} · {mod.title}
        </Link>
        <span className="font-mono text-[11px] text-muted-foreground">
          leçon {idx + 1}/{mod.lessons.length} · {lesson.minutes} min
        </span>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="font-elegant text-3xl font-bold text-primary">
          {lesson.title}
        </h1>
        <p className="text-muted-foreground">{lesson.summary}</p>
      </header>

      <LessonRenderer
        keyPrefix={`${mod.slug}/${lesson.slug}`}
        blocks={lesson.blocks}
      />

      <LessonFooter
        moduleSlug={mod.slug}
        lessonSlug={lesson.slug}
        prevHref={prevHref}
        nextHref={nextHref}
        nextLabel={nextLabel}
      />
    </div>
  );
}
