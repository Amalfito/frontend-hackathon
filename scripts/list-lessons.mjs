// Liste toutes les URL de leçons de l'académie (pour smoke-test).
// Usage : node scripts/list-lessons.mjs
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "content", "academy", "modules");
for (const f of readdirSync(dir).sort()) {
  const src = readFileSync(join(dir, f), "utf8");
  const slugs = [...src.matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
  const [mod, ...lessons] = slugs;
  for (const l of lessons) console.log(`/learn/${mod}/${l}`);
}
