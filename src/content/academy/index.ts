import type { AcademyModule } from "@/lib/academy/types";
import { m0Decoder } from "./modules/m0-decoder";
import { m1PriseEnMain } from "./modules/m1-prise-en-main";
import { m2Prompting } from "./modules/m2-prompting";
import { m3Contexte } from "./modules/m3-contexte";
import { m4Mcp } from "./modules/m4-mcp";
import { m5ClaudeCode } from "./modules/m5-claude-code";
import { m6Cowork } from "./modules/m6-cowork";
import { m7Python } from "./modules/m7-python";
import { m8Api } from "./modules/m8-api";
import { m9N8n } from "./modules/m9-n8n";
import { m10Agents } from "./modules/m10-agents";
import { m11Securite } from "./modules/m11-securite";

/** Curriculum complet, dans l'ordre canonique M0 → M11. */
export const modules: AcademyModule[] = [
  m0Decoder,
  m1PriseEnMain,
  m2Prompting,
  m3Contexte,
  m4Mcp,
  m5ClaudeCode,
  m6Cowork,
  m7Python,
  m8Api,
  m9N8n,
  m10Agents,
  m11Securite,
];

export function moduleBySlug(slug: string): AcademyModule | undefined {
  return modules.find((m) => m.slug === slug);
}

/** Sources officielles affichées en pied de module. */
export const officialSources = [
  { label: "Docs Claude & API", url: "https://docs.claude.com" },
  { label: "Claude Code", url: "https://docs.claude.com/en/docs/claude-code/overview" },
  { label: "Aide Claude.ai", url: "https://support.claude.com" },
  { label: "MCP", url: "https://modelcontextprotocol.io" },
  { label: "Cours Anthropic", url: "https://anthropic.skilljar.com" },
  { label: "n8n", url: "https://docs.n8n.io" },
  { label: "Nouveautés", url: "https://www.anthropic.com/news" },
];

export const LAST_REVIEW = "juillet 2026";
