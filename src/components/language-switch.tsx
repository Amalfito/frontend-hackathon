"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/actions";
import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";

/** Petit bouton EN/FR présent dans l'en-tête (donc sur chaque page). */
export function LanguageSwitch() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();

  const choose = (l: Locale) => {
    if (l === locale) return;
    start(async () => {
      await setLocale(l);
      router.refresh();
    });
  };

  const base =
    "px-2 py-0.5 rounded font-mono text-[11px] uppercase tracking-wider transition-colors";
  const active = "bg-primary text-primary-foreground";
  const idle = "text-muted-foreground hover:text-primary";

  return (
    <div
      className="flex items-center gap-1 rounded-md border border-border/60 p-0.5"
      aria-label={t.lang.switch}
      data-pending={pending}
    >
      <button
        type="button"
        onClick={() => choose("en")}
        className={`${base} ${locale === "en" ? active : idle}`}
      >
        {t.lang.en}
      </button>
      <button
        type="button"
        onClick={() => choose("fr")}
        className={`${base} ${locale === "fr" ? active : idle}`}
      >
        {t.lang.fr}
      </button>
    </div>
  );
}
