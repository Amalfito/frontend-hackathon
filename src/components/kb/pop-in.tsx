"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Aparté « pop-in » qui surgit au scroll avec un petit ressort — interaction
 * bonus pour rythmer la lecture. Style accent (ambre) pour trancher.
 */
export function PopIn({ title, body }: { title: string; body: string }) {
  const reduced = useReducedMotion();

  const content = (
    <div className="relative flex flex-col gap-1.5 rounded-xl border border-accent/50 bg-accent/10 p-4 pl-5">
      <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-accent" />
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground">
        {title}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );

  if (reduced) return content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {content}
    </motion.div>
  );
}
