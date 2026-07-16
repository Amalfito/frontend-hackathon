import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale, getDict, type Locale, type Dict } from "@/lib/i18n";

/** Locale courante (cookie), par défaut EN. Server Components / actions. */
export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  return normalizeLocale(c.get(LOCALE_COOKIE)?.value);
}

/** Locale + dictionnaire d'un coup, pour les Server Components. */
export async function getI18n(): Promise<{ locale: Locale; t: Dict }> {
  const locale = await getLocale();
  return { locale, t: getDict(locale) };
}
