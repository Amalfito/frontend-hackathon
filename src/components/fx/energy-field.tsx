"use client";

import { useEffect, useRef } from "react";

/* ============================================================================
 * « Le réseau qui apprend » — champ de particules connectées (canvas 2D).
 * Nœuds = stations, liens = flux d'énergie menthe. Parallax souris légère,
 * densité liée à `progress` (0..1 : la constellation se densifie avec l'XP).
 * Léger par design : ~100 nœuds, pause hors écran, figé si reduced-motion.
 * ========================================================================== */

type Node = { x: number; y: number; vx: number; vy: number; r: number };

export function EnergyField({
  progress = 0.35,
  className,
}: {
  /** 0..1 — densifie la constellation (progression de l'apprenant). */
  progress?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const count = Math.round(70 + 60 * Math.min(1, Math.max(0, progress)));
    const LINK_DIST = 110;

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const mouse = { x: 0.5, y: 0.5 };
    let nodes: Node[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) {
        nodes = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: 1 + Math.random() * 1.8,
        }));
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      // Parallax douce : tout le champ glisse vers la souris (lerp implicite).
      const ox = (mouse.x - 0.5) * 14;
      const oy = (mouse.y - 0.5) * 10;

      // Liens.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.35;
            ctx.strokeStyle = `rgba(67, 245, 185, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x + ox, a.y + oy);
            ctx.lineTo(b.x + ox, b.y + oy);
            ctx.stroke();
          }
        }
      }
      // Nœuds.
      for (const n of nodes) {
        ctx.fillStyle = "rgba(185, 255, 230, 0.9)";
        ctx.beginPath();
        ctx.arc(n.x + ox, n.y + oy, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      if (!visible) return;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
      if (reduced) draw(); // en reduced-motion : rendu statique, pas de boucle
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("mousemove", onMouse);

    // Pause quand le hero sort de l'écran (budget INP/batterie).
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(canvas);

    if (!reduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", onMouse);
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
    />
  );
}
