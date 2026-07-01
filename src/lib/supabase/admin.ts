import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec la clé `service_role`. NE JAMAIS l'importer côté client.
 * Bypasse la RLS — réservé aux Server Actions (RPC `join_team`, `submit_answer`)
 * et au tableau de bord admin. C'est ce client qui garantit que les réponses
 * ne transitent jamais par le navigateur.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase non configuré : renseigne NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local",
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
