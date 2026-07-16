"use client";

import {
  gameArm,
  gamePause,
  gameResume,
  gameStop,
  gameDefuse,
  gameReset,
  gameSetMessage,
  gameSetLock,
} from "@/app/actions";
import { BombTimer } from "@/components/bomb-timer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/components/i18n-provider";
import type { GameState } from "@/lib/types";

export function AdminControls({ state }: { state: GameState | null }) {
  const { t } = useI18n();
  const status = state?.status ?? "idle";
  const running = status === "running";
  const paused = status === "paused" || status === "stopped";

  return (
    <div className="flex flex-col gap-5">
      <BombTimer initial={state} variant="full" />

      {/* Armement */}
      <form action={gameArm} className="flex flex-col gap-2">
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {t.admin.armLabel}
        </label>
        <div className="flex gap-2">
          <Input
            name="minutes"
            type="number"
            min={1}
            defaultValue={60}
            className="w-32 font-mono"
          />
          <Button type="submit" className="font-mono uppercase tracking-wider">
            {t.admin.arm}
          </Button>
        </div>
      </form>

      {/* Contrôles temps réel */}
      <div className="flex flex-wrap gap-2">
        <form action={gamePause}>
          <Button
            type="submit"
            variant="outline"
            disabled={!running}
            className="font-mono uppercase tracking-wider"
          >
            {t.admin.pause}
          </Button>
        </form>
        <form action={gameResume}>
          <Button
            type="submit"
            variant="outline"
            disabled={!paused}
            className="font-mono uppercase tracking-wider"
          >
            {t.admin.resume}
          </Button>
        </form>
        <form action={gameStop}>
          <Button
            type="submit"
            variant="destructive"
            className="font-mono uppercase tracking-wider"
          >
            {t.admin.stop}
          </Button>
        </form>
        <form action={gameDefuse}>
          <Button
            type="submit"
            variant="outline"
            className="border-primary/50 font-mono uppercase tracking-wider text-primary"
          >
            {t.admin.defuse}
          </Button>
        </form>
        <form action={gameReset}>
          <Button
            type="submit"
            variant="ghost"
            className="font-mono uppercase tracking-wider text-muted-foreground"
          >
            {t.admin.reset}
          </Button>
        </form>
      </div>

      {/* Verrou manuel */}
      <div className="flex gap-2">
        <form action={gameSetLock}>
          <input type="hidden" name="locked" value="true" />
          <Button
            type="submit"
            variant="outline"
            className="font-mono text-xs uppercase tracking-wider"
          >
            {t.admin.lock}
          </Button>
        </form>
        <form action={gameSetLock}>
          <input type="hidden" name="locked" value="false" />
          <Button
            type="submit"
            variant="outline"
            className="font-mono text-xs uppercase tracking-wider"
          >
            {t.admin.unlock}
          </Button>
        </form>
      </div>

      {/* Message diffusé */}
      <form action={gameSetMessage} className="flex flex-col gap-2">
        <label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {t.admin.messageLabel}
        </label>
        <div className="flex gap-2">
          <Input
            name="message"
            defaultValue={state?.message ?? ""}
            placeholder={t.admin.messagePlaceholder}
            className="font-mono"
          />
          <Button type="submit" variant="outline" className="font-mono uppercase">
            {t.admin.broadcast}
          </Button>
        </div>
      </form>
    </div>
  );
}
