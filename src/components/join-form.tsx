"use client";

import { useActionState } from "react";
import { joinTeam, type JoinState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initial: JoinState = {};

export function JoinForm() {
  const [state, formAction, pending] = useActionState(joinTeam, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label
        htmlFor="team"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        &gt; Identifiant d&apos;équipe
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="team"
          name="team"
          required
          maxLength={40}
          autoComplete="off"
          placeholder="ex: les-decrypteurs"
          className="font-mono"
        />
        <Button
          type="submit"
          disabled={pending}
          className="font-mono uppercase tracking-wider whitespace-nowrap"
        >
          {pending ? "Connexion…" : "Initialiser ▸"}
        </Button>
      </div>
      {state.error && (
        <p className="font-mono text-sm text-destructive">/!\ {state.error}</p>
      )}
    </form>
  );
}
