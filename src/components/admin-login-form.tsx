"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n-provider";

const initial: AdminLoginState = {};

export function AdminLoginForm() {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState(adminLogin, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="username"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          {t.adminLogin.username}
        </label>
        <Input
          id="username"
          name="username"
          required
          autoComplete="username"
          autoFocus
          placeholder="admin"
          className="font-mono"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
        >
          {t.adminLogin.password}
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="font-mono"
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="font-mono uppercase tracking-wider"
      >
        {pending ? t.adminLogin.authenticating : t.adminLogin.submit}
      </Button>
      {state.error && (
        <p className="font-mono text-sm text-destructive">/!\ {state.error}</p>
      )}
    </form>
  );
}
