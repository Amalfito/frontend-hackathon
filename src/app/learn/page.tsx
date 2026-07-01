import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  agents: "Agents",
  prompting: "Prompting",
  mcp: "Serveurs MCP",
  cowork: "Collaboration",
  design: "Design",
};

const CATEGORY_ORDER = ["agents", "prompting", "mcp", "cowork", "design"];

export default async function LearnPage() {
  const supabase = await createClient();
  const { data: lessons, error } = await supabase
    .from("lessons_public")
    .select("*")
    .order("order_index", { ascending: true })
    .returns<Lesson[]>();

  const byCategory = new Map<string, Lesson[]>();
  for (const l of lessons ?? []) {
    const arr = byCategory.get(l.category) ?? [];
    arr.push(l);
    byCategory.set(l.category, arr);
  }
  const categories = [
    ...CATEGORY_ORDER.filter((c) => byCategory.has(c)),
    ...[...byCategory.keys()].filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="theme-learn -mx-4 -my-8 min-h-[calc(100vh-8rem)] px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Electra · Académie IA
          </p>
          <h1 className="font-elegant text-4xl font-bold text-primary">
            Apprendre, en douceur
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Maîtrise les bases avant d&apos;affronter les défis : créer des agents,
            prompter juste, gérer tes serveurs MCP, collaborer et concevoir avec
            Claude. Chaque module se termine par un petit QCM ludique.
          </p>
        </header>

        {error && (
          <p className="font-mono text-sm text-destructive">
            Base non configurée ({error.message}). Voir README.md.
          </p>
        )}

        {categories.map((cat) => (
          <section key={cat} className="flex flex-col gap-3">
            <h2 className="font-elegant text-2xl font-semibold">
              {CATEGORY_LABEL[cat] ?? cat}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {byCategory.get(cat)?.map((l) => (
                <Link key={l.id} href={`/learn/${l.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-2 pt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-elegant text-lg font-semibold">
                          {l.title}
                        </h3>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                          {l.estimated_minutes} min
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{l.summary}</p>
                      <span className="mt-auto pt-2 text-sm font-medium text-primary">
                        Ouvrir le module →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-lg border border-border bg-card p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Prêt à mettre tout ça en pratique ?
          </p>
          <Link
            href="/play"
            className="mt-2 inline-block font-mono text-sm font-semibold text-primary hover:underline"
          >
            ▸ Passer aux défis (partie notée)
          </Link>
        </div>
      </div>
    </div>
  );
}
