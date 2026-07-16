"use client";

import { useState } from "react";
import { FlowLab } from "./flow-lab";
import { PromptBox } from "./prompt-box";
import { RoccfLab } from "./roccf-lab";

const DATASETS = [
  {
    file: "sessions_charge.csv",
    desc: "500 sessions de charge fictives (station, date, durée, kWh, véhicule anonymisé). Parfait pour M2.3 et M7.",
  },
  {
    file: "tickets_support.json",
    desc: "30 tickets support variés (facturation, panne, appli, roaming). Parfait pour la classification (M8, M9).",
  },
  {
    file: "cr_visite_fonciere.md",
    desc: "3 comptes-rendus de visites foncières réalistes, avec points bloquants cachés. Parfait pour M1/M2.",
  },
  {
    file: "logs_incident.txt",
    desc: "Extrait de logs avec un pattern d'erreur à trouver. Parfait pour jouer à l'ops de garde.",
  },
];

const TABS = ["🧪 Prompt Lab", "🔀 Flow Lab", "📊 Data Lab"] as const;

export function PlaygroundTabs() {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(i)}
            className={`flex-1 rounded-md px-3 py-2 font-mono text-xs font-semibold transition-colors ${
              tab === i
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && <RoccfLab />}
      {tab === 1 && <FlowLab />}
      {tab === 2 && (
        <div className="flex flex-col gap-4">
          <p className="rounded-md border border-accent/50 bg-accent/10 px-3 py-2 text-sm">
            🔒 <strong>100 % fictif.</strong> Ces jeux de données sont générés pour
            l&apos;entraînement : aucune donnée réelle Electra, aucun client, aucune
            coordonnée véritable.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {DATASETS.map((d) => (
              <a
                key={d.file}
                href={`/academy/${d.file}`}
                download
                className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-sm"
              >
                <span className="font-mono text-sm font-semibold text-primary">
                  ⬇ {d.file}
                </span>
                <span className="text-sm text-muted-foreground">{d.desc}</span>
              </a>
            ))}
          </div>
          <PromptBox
            title="Pour démarrer avec le CSV de sessions"
            prompt={`Tu es data analyst chez Electra (recharge ultra-rapide pour VE). Je te donne un CSV de sessions de charge fictives avec les colonnes : station, date, duree_min, kwh, vehicule.

Objectif : identifie les 3 stations sous-performantes et propose 2 hypothèses d'explication par station.

Critères : réponds en français, format structuré (une section par station), signale explicitement les limites des données si elles ne permettent pas de conclure. N'invente aucun chiffre : tout doit venir du CSV.

[Colle ici le contenu de sessions_charge.csv, ou uploade le fichier]`}
            note="Télécharge le CSV ci-dessus, puis uploade-le dans Claude avec ce prompt."
          />
        </div>
      )}
    </div>
  );
}
