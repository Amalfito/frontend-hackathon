import { Fragment, type ReactNode } from "react";

/**
 * Rendu markdown minimal pour le contenu des leçons (source de confiance,
 * stockée en base). Gère : titres #/##/###, listes -, listes numérotées,
 * **gras**, `code`, et paragraphes. Pas de HTML brut → pas d'injection.
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  // Découpe sur **gras** et `code` tout en préservant l'ordre.
  const tokens = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.filter(Boolean).map((tok, i) => {
    const key = `${keyPrefix}-${i}`;
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("`") && tok.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={key}>{tok}</Fragment>;
  });
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items;
    const ordered = list.ordered;
    blocks.push(
      ordered ? (
        <ol
          key={`b${key++}`}
          className="ml-5 flex list-decimal flex-col gap-1.5 text-[0.95rem] leading-relaxed marker:text-primary"
        >
          {items.map((it, i) => (
            <li key={i}>{renderInline(it, `li${key}-${i}`)}</li>
          ))}
        </ol>
      ) : (
        <ul
          key={`b${key++}`}
          className="ml-5 flex list-disc flex-col gap-1.5 text-[0.95rem] leading-relaxed marker:text-primary"
        >
          {items.map((it, i) => (
            <li key={i}>{renderInline(it, `li${key}-${i}`)}</li>
          ))}
        </ul>
      ),
    );
    list = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const ol = line.match(/^\d+\.\s+(.*)$/);
    const ul = line.match(/^[-*]\s+(.*)$/);

    if (ol) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
      }
      list.items.push(ol[1]);
      continue;
    }
    if (ul) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }
    flushList();

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={`b${key++}`} className="mt-4 text-lg font-semibold">
          {renderInline(line.slice(4), `h3${key}`)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={`b${key++}`} className="mt-6 text-xl font-bold">
          {renderInline(line.slice(3), `h2${key}`)}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      blocks.push(
        <h1 key={`b${key++}`} className="text-2xl font-bold">
          {renderInline(line.slice(2), `h1${key}`)}
        </h1>,
      );
    } else if (line.trim() === "") {
      // saut de paragraphe
    } else {
      blocks.push(
        <p key={`b${key++}`} className="text-[0.95rem] leading-relaxed text-muted-foreground">
          {renderInline(line, `p${key}`)}
        </p>,
      );
    }
  }
  flushList();

  return <div className="flex flex-col gap-3">{blocks}</div>;
}
