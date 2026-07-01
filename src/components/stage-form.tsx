"use client";

import { useActionState, useState } from "react";
import { submitAnswer, type SubmitState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StageType } from "@/lib/types";

const initial: SubmitState = {};

const PLACEHOLDER: Record<StageType, string> = {
  quiz: "votre réponse…",
  cipher: "mot déchiffré…",
  password: "mot de passe…",
  final: "code de désamorçage…",
};

export function StageForm({
  slug,
  type,
  hint,
}: {
  slug: string;
  type: StageType;
  hint: string;
}) {
  const [state, formAction, pending] = useActionState(submitAnswer, initial);
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="slug" value={slug} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            name="answer"
            required
            autoComplete="off"
            autoFocus
            placeholder={PLACEHOLDER[type]}
            className="font-mono text-base"
          />
          <Button
            type="submit"
            disabled={pending}
            className="font-mono uppercase tracking-wider whitespace-nowrap"
          >
            {pending ? "Vérification…" : "Valider ▸"}
          </Button>
        </div>
        {state.message && !state.ok && (
          <p className="font-mono text-sm text-destructive">{state.message}</p>
        )}
      </form>

      {hint && (
        <div className="font-mono text-xs">
          {showHint ? (
            <p className="text-accent">
              <span className="text-muted-foreground">{"// indice : "}</span>
              {hint}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="text-muted-foreground underline underline-offset-4 hover:text-accent"
            >
              Révéler l&apos;indice
            </button>
          )}
        </div>
      )}
    </div>
  );
}
