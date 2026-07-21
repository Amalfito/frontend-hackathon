"use client";

import { useState } from "react";

/**
 * Lecteur YouTube « façade » : on n'insère l'iframe qu'au clic (perf + RGPD :
 * pas de cookie YouTube avant lecture). Poster = miniature officielle.
 */
export function YouTubeLite({
  id,
  title,
  channel,
}: {
  id: string;
  title: string;
  channel?: string;
}) {
  const [play, setPlay] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <figure className="overflow-hidden rounded-xl border border-primary/30 bg-black shadow-[0_0_40px_rgb(67_245_185/0.12)]">
      <div className="relative aspect-video">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlay(true)}
            aria-label={`Lire la vidéo : ${title}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-85"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground shadow-[0_0_30px_rgb(67_245_185/0.6)] transition-transform duration-300 group-hover:scale-110">
              ▶
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
        <span className="truncate">{title}</span>
        {channel && (
          <span className="shrink-0 text-primary">▶ {channel}</span>
        )}
      </figcaption>
    </figure>
  );
}
