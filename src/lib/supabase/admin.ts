import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé `service_role`. NE JAMAIS l'importer côté client.
 * Bypasse la RLS — réservé aux Server Actions (RPC `join_team`, `submit_answer`)
 * et au tableau de bord admin. C'est ce client qui garantit que les réponses
 * ne transitent jamais par le navigateur.
 */
export function createAdminClient() {
  // .trim() : évite les surprises d'un retour à la ligne collé dans Vercel.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !serviceKey && "SUPABASE_SERVICE_ROLE_KEY",
    ]
      .filter(Boolean)
      .join(", ");
    throw new Error(`Supabase non configuré — variable(s) manquante(s) : ${missing}`);
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
