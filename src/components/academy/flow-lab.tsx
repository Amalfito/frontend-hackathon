"use client";

import { useState } from "react";
import { toast } from "sonner";
import { celebrateSmall } from "@/components/fx/celebrate";
import { XP } from "@/lib/academy/gamification";
import { useAcademyProgress } from "@/lib/academy/progress";

/* ============================================================================
 * Flow Lab — mini-builder n8n simplifié. Mission : câbler le workflow de
 * triage des tickets Intercom (leçon 9.3) en plaçant le bon node dans chaque
 * slot. La palette contient des pièges.
 * ========================================================================== */

type Slot = {
  id: string;
  label: string;
  expected: string;
  hint: string;
};

const SLOTS: Slot[] = [
  {
    id: "trigger",
    label: "1 · Déclencheur",
    expected: "Webhook — nouveau ticket Intercom",
    hint: "Qu'est-ce qui RÉVEILLE le workflow ?",
  },
  {
    id: "brain",
    label: "2 · Analyse",
    expected: "AI Agent — Claude (API Anthropic)",
    hint: "Qui lit le ticket et produit le JSON {categorie, urgence, resume} ?",
  },
  {
    id: "route",
    label: "3 · Décision",
    expected: "IF — urgence ≥ 4 ?",
    hint: "Comment séparer l'urgent du reste ?",
  },
  {
    id: "urgent",
    label: "4a · Si urgent",
    expected: "Slack — alerte #ops-incidents",
    hint: "L'urgent doit réveiller un humain, vite.",
  },
  {
    id: "archive",
    label: "4b · Sinon",
    expected: "Notion — archiver dans la base tickets",
    hint: "Le non-urgent se range proprement pour le batch hebdo.",
  },
];

const PALETTE = [
  "Webhook — nouveau ticket Intercom",
  "AI Agent — Claude (API Anthropic)",
  "IF — urgence ≥ 4 ?",
  "Slack — alerte #ops-incidents",
  "Notion — archiver dans la base tickets",
  // Pièges :
  "Cron — tous les lundis 8h",
  "Boucle — répéter 100 fois",
  "Gmail — envoyer la clé API au client",
  "Excel — imprimer le ticket",
];

export function FlowLab() {
  const { award, isAwarded } = useAcademyProgress();
  const awardKey = "playground:flow-lab";
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [active, setActive] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const used = new Set(Object.values(placed));
  const allPlaced = SLOTS.every((s) => placed[s.id]);
  const errors = SLOTS.filter((s) => placed[s.id] && placed[s.id] !== s.expected);

  const check = () => {
    setChecked(true);
    if (errors.length === 0 && award(awardKey, XP.exercise)) {
      celebrateSmall();
      toast.success(`+${XP.exercise} XP — workflow câblé, prêt pour la prod (enfin presque) ⚡`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Mission (cf. leçon 9.3) : câble le workflow{" "}
        <strong>« triage automatique des tickets Intercom »</strong>. Choisis un
        node dans la palette, puis clique sur son emplacement. Attention, la
        palette contient des pièges. {isAwarded(awardKey) && "· ✓ déjà validé"}
      </p>

      {/* Palette */}
      <div className="flex flex-wrap gap-2">
        {PALETTE.filter((n) => !used.has(n)).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setActive(active === n ? null : n)}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs transition-colors ${
              active === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            ▣ {n}
          </button>
        ))}
      </div>

      {/* Slots en pipeline */}
      <div className="flex flex-col gap-1.5">
        {SLOTS.map((s, i) => {
          const val = placed[s.id];
          const wrong = checked && val && val !== s.expected;
          const right = checked && val === s.expected;
          return (
            <div key={s.id} className="flex items-stretch gap-2">
              {i > 0 && (
                <span className="flex w-6 items-center justify-center font-mono text-muted-foreground">
                  {s.id === "archive" ? "↳" : "↓"}
                </span>
              )}
              {i === 0 && <span className="w-6" />}
              <button
                type="button"
                onClick={() => {
                  if (active) {
                    setPlaced((p) => ({ ...p, [s.id]: active }));
                    setActive(null);
                    setChecked(false);
                  } else if (val) {
                    setPlaced((p) => {
                      const next = { ...p };
                      delete next[s.id];
                      return next;
                    });
                    setChecked(false);
                  }
                }}
                className={`flex flex-1 items-center justify-between gap-3 rounded-lg border-2 border-dashed px-4 py-3 text-left transition-colors ${
                  wrong
                    ? "border-destructive bg-destructive/10"
                    : right
                      ? "border-emerald-600 bg-emerald-500/10"
                      : val
                        ? "border-primary/60 bg-primary/5"
                        : active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card"
                }`}
              >
                <span>
                  <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                    {s.label}
                  </span>
                  <span className="block text-sm">
                    {val ? (
                      <>
                        {wrong ? "✘ " : right ? "✔ " : ""}
                        {val}
                        <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                          (cliquer pour retirer)
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">{s.hint}</span>
                    )}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={check}
          disabled={!allPlaced}
          className="rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {allPlaced ? "Tester le workflow" : "Complète les 5 emplacements"}
        </button>
        {checked &&
          (errors.length === 0 ? (
            <span className="font-mono text-xs font-semibold text-emerald-700">
              ⚡ Exécution réussie : ticket urgent → Slack en 1,2 s.
            </span>
          ) : (
            <span className="font-mono text-xs text-destructive">
              💥 Le workflow a court-circuité — {errors.length} node
              {errors.length > 1 ? "s" : ""} mal placé{errors.length > 1 ? "s" : ""}.
            </span>
          ))}
      </div>
    </div>
  );
}
