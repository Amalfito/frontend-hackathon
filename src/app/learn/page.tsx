import { AcademyHome, type ModuleSummary } from "@/components/academy/academy-home";
import { modules } from "@/content/academy";

export const metadata = {
  title: "Electra AI Academy — Apprendre l'IA en la pratiquant",
};

export default function LearnPage() {
  const summaries: ModuleSummary[] = modules.map((m) => ({
    slug: m.slug,
    code: m.code,
    title: m.title,
    tagline: m.tagline,
    icon: m.icon,
    badge: m.badge,
    audience: m.audience,
    required: m.required,
    minutes: m.lessons.reduce((acc, l) => acc + l.minutes, 0),
    lessonKeys: m.lessons.map((l) => `${m.slug}/${l.slug}`),
  }));

  return <AcademyHome modules={summaries} />;
}
