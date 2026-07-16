"use client";

/* ============================================================================
 * Mécaniques de jeu de l'Arcade Albert. Chaque composant reçoit la version
 * PUBLIQUE de la question (sans réponses) et remonte une ArcadeSubmission.
 * Tous jouables au clic (mobile/clavier) même quand le drag est disponible.
 * ========================================================================== */

import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicMechanic, ArcadeSubmission } from "@/lib/arcade/types";

type SubmitFn = (sub: ArcadeSubmission) => void;

/* --- QCM ------------------------------------------------------------------ */
export function QcmPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "qcm" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold">{m.question}</p>
      {m.options.map((o, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onSubmit({ kind: "qcm", index: i })}
          className="rounded-md border border-border bg-card px-4 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/10 disabled:opacity-50"
        >
          <span className="mr-2 font-mono text-xs text-primary">
            {String.fromCharCode(65 + i)}.
          </span>
          {o}
        </button>
      ))}
    </div>
  );
}

/* --- Texte libre ------------------------------------------------------------ */
export function TextPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "text" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  const [text, setText] = useState("");
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) onSubmit({ kind: "text", text });
      }}
    >
      <p className="font-semibold">{m.question}</p>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={m.placeholder ?? "ta réponse…"}
          disabled={disabled}
          autoFocus
          className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 font-mono text-sm outline-none ring-primary/40 focus:ring-2"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="btn-charge rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground disabled:opacity-40"
        >
          Valider
        </button>
      </div>
    </form>
  );
}

/* --- Prompter dans le site --------------------------------------------------- */
export function PromptPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "prompt" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  const [text, setText] = useState("");
  const checks = m.criteria.map((c) => ({
    label: c.label,
    ok: new RegExp(c.pattern, "i").test(text),
  }));
  const lengthOk = !m.minLength || text.length >= m.minLength;
  const allOk = checks.every((c) => c.ok) && lengthOk;

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{m.question}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        disabled={disabled}
        placeholder="Écris ton prompt ici — les critères s'allument en direct…"
        className="w-full rounded-md border border-border bg-card p-4 font-mono text-sm leading-relaxed outline-none ring-primary/40 focus:ring-2"
      />
      <div className="flex flex-wrap gap-2">
        {checks.map((c, i) => (
          <span
            key={i}
            className={`rounded-full border px-3 py-1 font-mono text-[11px] transition-colors ${
              c.ok
                ? "border-[var(--electra-mint)] bg-[var(--electra-mint)]/15 font-semibold"
                : "border-border text-muted-foreground"
            }`}
          >
            {c.ok ? "✓ " : "○ "}
            {c.label}
          </span>
        ))}
        {m.minLength && (
          <span
            className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
              lengthOk
                ? "border-[var(--electra-mint)] bg-[var(--electra-mint)]/15 font-semibold"
                : "border-border text-muted-foreground"
            }`}
          >
            {lengthOk ? "✓" : "○"} ≥ {m.minLength} caractères ({text.length})
          </span>
        )}
      </div>
      <button
        type="button"
        disabled={disabled || !allOk}
        onClick={() => onSubmit({ kind: "prompt", text })}
        className="btn-charge self-start rounded-md bg-primary px-5 py-2.5 font-mono text-xs font-semibold text-primary-foreground disabled:opacity-40"
      >
        {allOk ? "Envoyer le prompt ⚡" : "Complète tous les critères"}
      </button>
    </div>
  );
}

/* --- Drag & drop dans des boîtes ---------------------------------------------- */
export function DragPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "drag" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  const [assignment, setAssignment] = useState<Record<string, number>>({});
  const [active, setActive] = useState<string | null>(null);

  const remaining = m.items.filter((it) => !(it in assignment));
  const place = (item: string, box: number) => {
    setAssignment((a) => ({ ...a, [item]: box }));
    setActive(null);
  };
  const remove = (item: string) =>
    setAssignment((a) => {
      const next = { ...a };
      delete next[item];
      return next;
    });

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{m.question}</p>
      <p className="font-mono text-[11px] text-muted-foreground">
        Glisse chaque étiquette dans sa boîte (ou clique l&apos;étiquette puis la
        boîte).
      </p>
      <div className="flex min-h-10 flex-wrap gap-2">
        {remaining.map((it) => (
          <button
            key={it}
            type="button"
            draggable={!disabled}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", it)}
            onClick={() => setActive(active === it ? null : it)}
            className={`cursor-grab rounded-md border px-3 py-1.5 text-sm transition-colors active:cursor-grabbing ${
              active === it
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/60"
            }`}
          >
            {it}
          </button>
        ))}
        {remaining.length === 0 && (
          <span className="font-mono text-[11px] text-muted-foreground">
            Tout est placé — vérifie puis valide.
          </span>
        )}
      </div>
      <div
        className={`grid gap-3 ${m.boxes.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}
      >
        {m.boxes.map((box, bi) => (
          <div
            key={bi}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const it = e.dataTransfer.getData("text/plain");
              if (it) place(it, bi);
            }}
            onClick={() => active && place(active, bi)}
            className={`flex min-h-24 flex-col gap-1.5 rounded-lg border-2 border-dashed p-3 transition-colors ${
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
              {box}
            </span>
            {Object.entries(assignment)
              .filter(([, b]) => b === bi)
              .map(([it]) => (
                <button
                  key={it}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(it);
                  }}
                  className="rounded border border-border bg-background px-2 py-1 text-left text-xs hover:border-destructive"
                  title="Retirer"
                >
                  {it} ✕
                </button>
              ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled || remaining.length > 0}
        onClick={() => onSubmit({ kind: "drag", assignment })}
        className="btn-charge self-start rounded-md bg-primary px-5 py-2.5 font-mono text-xs font-semibold text-primary-foreground disabled:opacity-40"
      >
        Valider le tri
      </button>
    </div>
  );
}

/* --- Relier (paires) ----------------------------------------------------------- */
const PAIR_COLORS = [
  "border-[var(--electra-mint)] bg-[var(--electra-mint)]/15",
  "border-[var(--electra-orange)] bg-[var(--electra-orange)]/15",
  "border-sky-500 bg-sky-500/15",
  "border-violet-500 bg-violet-500/15",
  "border-rose-500 bg-rose-500/15",
  "border-amber-500 bg-amber-500/15",
];

export function MatchPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "match" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  const [pairs, setPairs] = useState<[string, string][]>([]);
  const [activeLeft, setActiveLeft] = useState<string | null>(null);

  const pairedLeft = new Set(pairs.map(([l]) => l));
  const pairedRight = new Set(pairs.map(([, r]) => r));
  const colorOf = (side: 0 | 1, v: string) => {
    const i = pairs.findIndex((p) => p[side] === v);
    return i >= 0 ? PAIR_COLORS[i % PAIR_COLORS.length] : null;
  };
  const unpair = (l: string) => setPairs((p) => p.filter(([pl]) => pl !== l));

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{m.question}</p>
      <p className="font-mono text-[11px] text-muted-foreground">
        Clique un élément à gauche, puis son partenaire à droite. Reclique une
        paire pour la défaire.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          {m.left.map((l) => {
            const color = colorOf(0, l);
            return (
              <button
                key={l}
                type="button"
                disabled={disabled}
                onClick={() =>
                  pairedLeft.has(l)
                    ? unpair(l)
                    : setActiveLeft(activeLeft === l ? null : l)
                }
                className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  color ??
                  (activeLeft === l
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/60")
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {m.right.map((r) => {
            const color = colorOf(1, r);
            return (
              <button
                key={r}
                type="button"
                disabled={disabled || (!activeLeft && !pairedRight.has(r))}
                onClick={() => {
                  if (pairedRight.has(r)) {
                    setPairs((p) => p.filter(([, pr]) => pr !== r));
                  } else if (activeLeft) {
                    setPairs((p) => [...p, [activeLeft, r]]);
                    setActiveLeft(null);
                  }
                }}
                className={`rounded-md border px-3 py-2 text-left text-sm transition-colors disabled:opacity-60 ${
                  color ?? "border-border bg-card hover:border-primary/60"
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        disabled={disabled || pairs.length !== m.left.length}
        onClick={() => onSubmit({ kind: "match", pairs })}
        className="btn-charge self-start rounded-md bg-primary px-5 py-2.5 font-mono text-xs font-semibold text-primary-foreground disabled:opacity-40"
      >
        Valider les liaisons ({pairs.length}/{m.left.length})
      </button>
    </div>
  );
}

/* --- Remettre dans l'ordre -------------------------------------------------------- */
export function OrderPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "order" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  const [ordered, setOrdered] = useState<string[]>([]);
  const remaining = m.steps.filter((s) => !ordered.includes(s));

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{m.question}</p>
      <div className="flex min-h-10 flex-wrap gap-2">
        {remaining.map((s) => (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => setOrdered((o) => [...o, s])}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:border-primary/60"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-lg border-2 border-dashed border-border bg-card p-3">
        {ordered.length === 0 && (
          <span className="font-mono text-[11px] text-muted-foreground">
            Clique les étapes dans l&apos;ordre — elles s&apos;empilent ici.
          </span>
        )}
        {ordered.map((s, i) => (
          <span key={s} className="flex items-center gap-1.5">
            {i > 0 && <span className="font-mono text-primary">→</span>}
            <button
              type="button"
              onClick={() => setOrdered((o) => o.filter((x) => x !== s))}
              className="rounded-md border border-primary/50 bg-primary/10 px-2.5 py-1 text-sm hover:border-destructive"
              title="Retirer"
            >
              {s}
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={disabled || ordered.length !== m.steps.length}
          onClick={() => onSubmit({ kind: "order", steps: ordered })}
          className="btn-charge rounded-md bg-primary px-5 py-2.5 font-mono text-xs font-semibold text-primary-foreground disabled:opacity-40"
        >
          Valider l&apos;ordre
        </button>
        <button
          type="button"
          onClick={() => setOrdered([])}
          className="rounded-md border border-border px-4 py-2 font-mono text-xs hover:border-primary"
        >
          Recommencer
        </button>
      </div>
    </div>
  );
}

/* --- Cible mobile ------------------------------------------------------------------ */
export function TargetPlay({
  m,
  onSubmit,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "target" }>;
  onSubmit: SubmitFn;
  disabled: boolean;
}) {
  const [caught, setCaught] = useState(0);
  const [pos, setPos] = useState({ x: -8, y: 45, speed: 0.18 });
  const areaRef = useRef<HTMLDivElement>(null);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const catchTarget = () => {
    const next = caught + 1;
    setCaught(next);
    if (next >= m.catches) {
      onSubmit({ kind: "target", caught: next });
      return;
    }
    // Respawn : reduced-motion → nouvelle position fixe ; sinon retour à gauche.
    setPos(
      reduced
        ? { x: 20 + Math.random() * 55, y: 20 + Math.random() * 55, speed: 0 }
        : { x: -10, y: 25 + Math.random() * 45, speed: 0.18 + next * 0.08 },
    );
  };

  useEffect(() => {
    if (reduced || caught >= m.catches) return;
    let raf = 0;
    const step = () => {
      setPos((p) => {
        let x = p.x + p.speed;
        let y = p.y;
        let speed = p.speed;
        if (x > 110) {
          x = -10;
          y = 25 + Math.random() * 45;
          speed = 0.16 + Math.random() * 0.14 + caught * 0.03; // léger, à peine plus vif
        }
        return { x, y, speed };
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [caught, reduced, m.catches]);

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{m.question}</p>
      <p className="font-mono text-[11px] text-muted-foreground">
        Clique sur {m.emoji} {m.catches} fois pour l&apos;attraper. {caught}/
        {m.catches}
      </p>
      <div
        ref={areaRef}
        className="relative h-56 overflow-hidden rounded-lg border border-border bg-[var(--electra-petrol-deep)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgb(67 245 185 / 8%) 1px, transparent 1px), linear-gradient(90deg, rgb(67 245 185 / 8%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <button
          type="button"
          disabled={disabled || caught >= m.catches}
          onClick={catchTarget}
          aria-label="Attraper la cible"
          className="absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent/70 bg-accent/15 text-5xl shadow-[0_0_28px_rgb(255_122_0/0.4)] transition-transform hover:scale-110 focus-visible:scale-110 disabled:opacity-40"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          {m.emoji}
        </button>
        {Array.from({ length: caught }).map((_, i) => (
          <span
            key={i}
            className="absolute bottom-2 text-sm"
            style={{ left: `${8 + i * 24}px` }}
          >
            ✓
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- Énigme cachée -------------------------------------------------------------------- */
export function HiddenPlay({
  m,
  onSubmit,
  onSpotFound,
  revealedCode,
  disabled,
}: {
  m: Extract<PublicMechanic, { kind: "hidden" }>;
  onSubmit: SubmitFn;
  /** Appelé quand le joueur clique l'élément dissimulé (révèle le code). */
  onSpotFound: () => void;
  revealedCode: string | null;
  disabled: boolean;
}) {
  // Le champ affiche le code révélé tant que le joueur n'a rien tapé lui-même.
  const [typed, setTyped] = useState("");
  const code = typed || revealedCode || "";

  const spotClass: Record<string, string> = {
    "corner-tl": "left-3 top-16",
    "corner-tr": "right-3 top-16",
    "corner-bl": "left-3 bottom-3",
    "corner-br": "right-3 bottom-3",
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="font-semibold">{m.question}</p>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) onSubmit({ kind: "hidden", code });
        }}
      >
        <input
          value={code}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="code d'Albert…"
          disabled={disabled}
          className="flex-1 rounded-md border border-border bg-card px-4 py-2.5 font-mono text-sm outline-none ring-primary/40 focus:ring-2"
        />
        <button
          type="submit"
          disabled={disabled || !code.trim()}
          className="btn-charge rounded-md bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground disabled:opacity-40"
        >
          Déverrouiller
        </button>
      </form>
      {revealedCode && (
        <p className="font-mono text-xs text-[var(--electra-mint)]">
          ⚡ Élément trouvé ! Code : <strong>{revealedCode}</strong>
        </p>
      )}
      {/* L'éclair dissimulé — presque invisible, il pulse à peine. */}
      {!revealedCode && (
        <button
          type="button"
          onClick={onSpotFound}
          aria-label="Un éclair presque invisible…"
          className={`fixed z-40 text-2xl opacity-[0.13] transition-opacity duration-700 hover:opacity-90 focus-visible:opacity-90 ${spotClass[m.spot] ?? "right-3 bottom-3"}`}
        >
          ⚡
        </button>
      )}
    </div>
  );
}
