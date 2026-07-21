/* ============================================================================
 * Génère une antisèche maître-du-jeu (Markdown) à partir de la banque de
 * questions de l'arcade — questions + BONNES RÉPONSES, variantes A/B.
 *   node scripts/gen-answer-key.mjs   →  docs/arcade-answer-key.md
 * ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const srcPath = path.join(root, "src/content/arcade/questions.ts");
const outPath = path.join(root, "docs/arcade-answer-key.md");

// La banque est de la donnée pure : on retire les types → module JS importable.
let src = fs.readFileSync(srcPath, "utf8");
src = src
  .replace(/import type[^\n]*\n/, "")
  .replace("export const arcadeQuestions: ArcadeQuestion[] =", "export const arcadeQuestions =");
const tmp = path.join(here, ".arcade-questions.mjs");
fs.writeFileSync(tmp, src);
const { arcadeQuestions } = await import(fileURLToPath(new URL("file://" + tmp)));
fs.rmSync(tmp);

/** Rend la bonne réponse en texte lisible selon la mécanique. */
function answer(m) {
  switch (m.kind) {
    case "qcm":
      return `**${m.options[m.answerIndex]}** _(option ${m.answerIndex + 1})_`;
    case "text":
      return m.answers.map((a) => `\`${a}\``).join(" / ");
    case "prompt":
      return (
        (m.minLength ? `_min. ${m.minLength} caractères._ ` : "") +
        "Doit contenir : " +
        m.mustInclude.map((c) => `${c.label} \`/${c.pattern}/i\``).join(" · ")
      );
    case "drag": {
      const byBox = m.boxes.map((b, i) => {
        const items = m.items.filter((it) => it.box === i).map((it) => it.label);
        return `**${b}** ← ${items.join(", ")}`;
      });
      return byBox.join(" · ");
    }
    case "match":
      return m.pairs.map((p) => `${p.left} → **${p.right}**`).join(" · ");
    case "order":
      return m.steps.map((s, i) => `${i + 1}. ${s}`).join("  ");
    case "target":
      return `Attraper **${m.catches}×** ${m.emoji}`;
    case "hidden":
      return `Code caché : **${m.code}** _(emplacement : ${m.spot})_`;
    case "acronym":
      return (
        (m.needed ? `_${m.needed} bonnes réponses à cliquer._ ` : "") +
        m.items
          .map((it) => `${it.acronym} = **${it.options[it.answerIndex]}**`)
          .join(" · ")
      );
    default:
      return "—";
  }
}

const KIND_LABEL = {
  qcm: "QCM",
  text: "Texte libre",
  prompt: "Prompt (critères)",
  drag: "Glisser-déposer",
  match: "Relier",
  order: "Remettre dans l'ordre",
  target: "Cible mobile",
  hidden: "Énigme cachée",
  acronym: "Acronymes",
};

const slots = [...new Set(arcadeQuestions.map((q) => q.slot))].sort((a, b) => a - b);

let md = `# Opération Albert — Antisèche maître du jeu\n\n`;
md += `> ⚠️ **Confidentiel.** Contient toutes les bonnes réponses de l'escape game.\n`;
md += `> Généré depuis \`src/content/arcade/questions.ts\` — ne pas éditer à la main (relancer \`node scripts/gen-answer-key.mjs\`).\n\n`;
md += `Chaque verrou a 2 variantes : **A** = premier run, **B** = après un reset punitif.\n`;
md += `Verrous piégés (chrono par question) : ceux marqués ⏱.\n\n`;
md += `---\n\n`;

for (const slot of slots) {
  const variants = arcadeQuestions
    .filter((q) => q.slot === slot)
    .sort((a, b) => a.variant - b.variant);
  const first = variants[0];
  const timed = first.timeLimit ? ` ⏱ ${first.timeLimit}s` : "";
  md += `## Verrou ${slot} — ${KIND_LABEL[first.mechanic.kind] ?? first.mechanic.kind} · difficulté ${first.difficulty}${timed}\n\n`;

  for (const q of variants) {
    const tag = q.variant === 0 ? "A" : "B";
    md += `### ${slot}${tag} · ${q.title}\n\n`;
    if (q.intro) md += `_${q.intro}_\n\n`;
    md += `**Question :** ${q.mechanic.question}\n\n`;
    md += `**Réponse :** ${answer(q.mechanic)}\n\n`;
    if (q.hint) md += `**Indice :** ${q.hint}\n\n`;
  }
  md += `---\n\n`;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, md);
console.log(`✓ ${arcadeQuestions.length} questions → ${path.relative(root, outPath)}`);
