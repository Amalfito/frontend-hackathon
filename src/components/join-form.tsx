"use client";

import { useActionState } from "react";
import { joinTeam, type JoinState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n-provider";

const initial: JoinState = {};

export function JoinForm({ next }: { next?: string }) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(joinTeam, initial);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {next && <input type="hidden" name="next" value={next} />}
      <label
        htmlFor="team"
        className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
      >
        {t.join.label}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id="team"
          name="team"
          required
          maxLength={40}
          autoComplete="off"
          placeholder={t.join.placeholder}
          className="font-mono"
        />
        <Button
          type="submit"
          disabled={pending}
          className="font-mono uppercase tracking-wider whitespace-nowrap"
        >
          {pending ? t.join.connecting : t.join.submit}
        </Button>
      </div>
      {state.error && (
        <p className="font-mono text-sm text-destructive">/!\ {state.error}</p>
      )}
    </form>
  );
}
