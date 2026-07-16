// Génère les datasets FICTIFS de l'Electra AI Academy dans public/academy/.
// 100 % synthétique — aucune donnée réelle. RNG seedé : sortie reproductible.
// Usage : node scripts/gen-datasets.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "academy");
mkdirSync(outDir, { recursive: true });

// RNG déterministe (mulberry32).
let seed = 20260716;
function rand() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);

// --- sessions_charge.csv ----------------------------------------------------
const stations = [
  ["Lyon-Confluence", 1.0],
  ["Paris-Bercy", 1.1],
  ["Bordeaux-Lac", 0.95],
  ["Annecy-Nord", 0.9],
  ["Rennes-Alma", 0.55], // sous-performante (uptime dégradé)
  ["Marseille-Prado", 1.05],
  ["Lille-Europe", 0.85],
  ["Toulouse-Blagnac", 0.5], // sous-performante (sessions courtes avortées)
  ["Nantes-Atlantis", 0.95],
  ["Strasbourg-Étoile", 0.45], // sous-performante (faible kWh)
];
const vehicules = ["VE-A", "VE-B", "VE-C", "VE-D", "VE-E", "VE-F"];

let csv = "station,date,duree_min,kwh,vehicule\n";
for (let i = 0; i < 500; i++) {
  const [nom, perf] = pick(stations);
  const day = 1 + Math.floor(rand() * 30);
  const hour = 6 + Math.floor(rand() * 17);
  const date = `2026-06-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(Math.floor(rand() * 60)).padStart(2, "0")}`;
  // Les stations sous-performantes : sessions plus courtes / avortées.
  const aborted = rand() > perf;
  const duree = aborted ? between(1, 6) : between(12, 45);
  const kwh = aborted ? between(0.2, 4) : between(18, 82) * Math.min(perf, 1);
  csv += `${nom},${date},${duree.toFixed(1)},${kwh.toFixed(2)},${pick(vehicules)}\n`;
}
writeFileSync(join(outDir, "sessions_charge.csv"), csv);

// --- tickets_support.json ---------------------------------------------------
const templates = [
  ["facturation", "Je suis facturé {x} € pour une session de {y} minutes, ça me paraît énorme."],
  ["facturation", "Double prélèvement sur ma session du {d} juin à {station}, merci de vérifier."],
  ["panne", "La borne {b} de {station} affiche une erreur E{e}, impossible de charger."],
  ["panne", "Écran noir sur la borne {b} à {station}, le câble est resté verrouillé !"],
  ["appli", "L'appli plante au moment de lancer la charge, iPhone, version d'hier."],
  ["appli", "Impossible de retrouver mes factures dans l'appli depuis la mise à jour."],
  ["roaming", "Ma carte d'opérateur tiers n'est pas reconnue à {station}."],
  ["roaming", "Session lancée via un badge partenaire, jamais apparue dans mon historique."],
];
const tickets = [];
for (let i = 1; i <= 30; i++) {
  const [categorie, tpl] = pick(templates);
  const message = tpl
    .replace("{x}", (between(30, 90)).toFixed(2))
    .replace("{y}", String(Math.floor(between(8, 40))))
    .replace("{d}", String(1 + Math.floor(rand() * 28)))
    .replace("{station}", pick(stations)[0])
    .replace("{b}", String(1 + Math.floor(rand() * 8)))
    .replace("{e}", String(10 + Math.floor(rand() * 89)));
  tickets.push({
    id: `TCK-${String(i).padStart(3, "0")}`,
    date: `2026-07-${String(1 + Math.floor(rand() * 14)).padStart(2, "0")}`,
    canal: pick(["email", "chat", "appli"]),
    message,
    // La catégorie n'est PAS fournie : c'est l'exercice de classification.
    _solution_categorie: categorie,
  });
}
writeFileSync(join(outDir, "tickets_support.json"), JSON.stringify(tickets, null, 2));

console.log(`OK — datasets écrits dans ${outDir}`);
