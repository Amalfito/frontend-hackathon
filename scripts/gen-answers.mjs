/* Génère docs/ARCADE-ANSWERS.md à partir de la vraie base de questions.
 * Node 24 strippe les types → on peut importer le .ts directement.
 * Usage : node scripts/gen-answers.mjs
 */
import { writeFileSync } from "node:fs";
import { arcadeQuestions } from "../src/content/arcade/questions.ts";

const SERIE = ["A", "B", "C", "D"];
const L = (i) => String.fromCharCode(65 + i); // 0→A

function mech(m) {
  switch (m.kind) {
    case "qcm":
      return [
        `**Q :** ${m.question}`,
        ...m.options.map((o, i) => `- ${i === m.answerIndex ? "✅" : "◻︎"} ${L(i)}. ${o}`),
      ].join("\n");
    case "text":
      return `**Q :** ${m.question}\n- ✅ Réponses acceptées : ${m.answers.join(" · ")}`;
    case "prompt":
      return `**Prompt à rédiger :** ${m.question}\n- Critères : ${m.mustInclude
        .map((c) => c.label)
        .join(" · ")}${m.minLength ? `\n- Longueur min : ${m.minLength}` : ""}`;
    case "drag":
      return `**Q :** ${m.question}\n- Boîtes : ${m.boxes.join(" | ")}\n${m.items
        .map((it) => `  - ✅ « ${it.label} » → ${m.boxes[it.box]}`)
        .join("\n")}`;
    case "match":
      return `**Q :** ${m.question}\n${m.pairs
        .map((p) => `  - ✅ ${p.left} ⟷ ${p.right}`)
        .join("\n")}`;
    case "order":
      return `**Q :** ${m.question}\n- Ordre correct :\n${m.steps
        .map((s, i) => `  ${i + 1}. ${s}`)
        .join("\n")}`;
    case "target":
      return `**Mini-jeu cible :** ${m.question} (attraper ${m.catches}× ${m.emoji})`;
    case "acronym":
      return [
        `**Acronymes (valider ${m.needed}) :** ${m.question}`,
        ...m.items.map(
          (it) =>
            `  - **${it.acronym}** — ${it.prompt}\n${it.options
              .map((o, i) => `    - ${i === it.answerIndex ? "✅" : "◻︎"} ${o}`)
              .join("\n")}`,
        ),
      ].join("\n");
    case "hidden":
      return `**Énigme cachée :** ${m.question}\n- ✅ Code : \`${m.code}\` (élément caché : ${m.spot})`;
    default:
      return "(mécanique inconnue)";
  }
}

const bySlot = new Map();
for (const q of arcadeQuestions) {
  if (!bySlot.has(q.slot)) bySlot.set(q.slot, []);
  bySlot.get(q.slot).push(q);
}

const lines = [
  "# Arcade Albert — Toutes les questions & réponses",
  "",
  "> Généré automatiquement (`node scripts/gen-answers.mjs`) depuis " +
    "`src/content/arcade/questions.ts`. ✅ = bonne réponse. " +
    "4 séries A/B/C/D par slot ; on change de série à chaque reset punitif.",
  "",
  `Total : **${arcadeQuestions.length} questions** sur ${bySlot.size} slots.`,
  "",
];

for (const slot of [...bySlot.keys()].sort((a, b) => a - b)) {
  const qs = bySlot.get(slot).sort((a, b) => a.variant - b.variant);
  lines.push(`## Slot ${slot} — difficulté ${qs[0].difficulty}${qs[0].timeLimit ? ` · ⏱ PUNITIF ${qs[0].timeLimit}s` : ""}`);
  for (const q of qs) {
    lines.push("");
    lines.push(`### Série ${SERIE[q.variant] ?? q.variant} — ${q.title}  \`[${q.mechanic.kind}]\``);
    if (q.intro) lines.push(`_${q.intro}_`);
    lines.push("");
    lines.push(mech(q.mechanic));
  }
  lines.push("");
}

writeFileSync("docs/ARCADE-ANSWERS.md", lines.join("\n"), "utf8");
console.log(
  `OK — docs/ARCADE-ANSWERS.md (${arcadeQuestions.length} questions, ${bySlot.size} slots)`,
);
