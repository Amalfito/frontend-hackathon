import { AcademyNav } from "@/components/academy/academy-nav";

/**
 * Enveloppe commune de l'académie : surface claire `.theme-learn`
 * (annule le padding du <main> global) + sous-navigation avec XP.
 */
export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-learn -mx-4 -my-8 min-h-[calc(100vh-8rem)] px-4 pb-14">
      <AcademyNav />
      <div className="mx-auto max-w-4xl pt-8">{children}</div>
    </div>
  );
}
