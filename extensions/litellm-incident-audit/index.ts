import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";
import { promises as fs } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

type Match = {
  repo: string;
  file: string;
  evidence: string;
  affected: boolean;
};

type AuditReport = {
  root: string;
  reportPath: string;
  matches: Match[];
};

const TARGETS = ["1.82.8"];
const CANDIDATE_FILES = [
  "pyproject.toml",
  "requirements.txt",
  "requirements-dev.txt",
  "uv.lock",
  "poetry.lock",
  "Pipfile.lock",
];

async function walk(dir: string, depth = 0): Promise<string[]> {
  if (depth > 4) return [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (["node_modules", ".venv", "venv", "dist", "build", "target"].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walk(full, depth + 1));
    } else if (CANDIDATE_FILES.includes(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function inspect(file: string, content: string, root: string): Match[] {
  const rel = relative(root, file) || file;
  const matches: Match[] = [];
  for (const line of content.split(/\r?\n/)) {
    if (!/litellm/i.test(line)) continue;
    const affected = TARGETS.some((version) => line.includes(version));
    const repo = rel.split("/")[0] || ".";
    matches.push({ repo, file: rel, evidence: line.trim(), affected });
  }
  return matches;
}

function render(report: AuditReport): string {
  const affected = report.matches.filter((m) => m.affected);
  const clean = report.matches.filter((m) => !m.affected);
  const section = (title: string, rows: Match[]) => rows.length
    ? rows.map((m) => `- [${m.repo}] ${m.file}: \`${m.evidence}\``).join("\n")
    : "- none";
  return `# LiteLLM Incident Audit\n\nRoot: ${report.root}\n\n## Affected\n${section("Affected", affected)}\n\n## Litellm references found but not directly matched to the compromised version\n${section("Other", clean)}\n\n## Safe cleanup checklist\n- Pin away from the compromised version before reinstalling.\n- Recreate virtual environments for affected repos.\n- Clear local package caches if the compromised wheel may have been downloaded.\n- Rotate secrets if the affected version was installed or executed.\n`;
}

async function audit(root: string): Promise<AuditReport> {
  const files = await walk(root);
  const matches = (await Promise.all(files.map(async (file) => {
    try {
      const content = await fs.readFile(file, "utf8");
      return inspect(file, content, root);
    } catch {
      return [] as Match[];
    }
  }))).flat();
  const reportPath = resolve(root, "litellm-incident-audit.md");
  const report: AuditReport = { root, reportPath, matches };
  await fs.mkdir(dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, render(report));
  return report;
}

export default function litellm_incident_audit(pi: ExtensionAPI) {
  async function run(ctx: { cwd: string; ui: { setWidget: (id: string, lines: string[]) => void; notify: (msg: string, level: "info" | "success" | "warning" | "error") => void; }; }, root?: string) {
    const target = resolve(ctx.cwd, root || "..");
    const report = await audit(target);
    const affected = report.matches.filter((m) => m.affected).length;
    ctx.ui.setWidget("litellm-incident-audit", [
      `matches: ${report.matches.length}`,
      `affected: ${affected}`,
      relative(ctx.cwd, report.reportPath),
    ]);
    return report;
  }

  pi.registerCommand("litellm-incident-audit", {
    description: "Audit nearby repos for LiteLLM incident exposure and write a markdown report.",
    handler: async (args, ctx) => {
      const report = await run(ctx, args?.trim() || undefined);
      const affected = report.matches.filter((m) => m.affected).length;
      ctx.ui.notify(`LiteLLM audit complete. Affected matches: ${affected}.`, affected ? "warning" : "success");
    },
  });

  pi.registerTool({
    name: "litellm_incident_audit",
    label: "LiteLLM Incident Audit",
    description: "Audit nearby repositories for LiteLLM incident exposure and write a safe cleanup report.",
    promptSnippet: "Audit nearby repos for compromised LiteLLM references when the user asks for supply-chain impact analysis.",
    promptGuidelines: [
      "Use this tool when the user wants to scan many repos for LiteLLM incident exposure or produce a local remediation report.",
    ],
    parameters: Type.Object({
      root: Type.Optional(Type.String({ description: "Root directory to scan. Defaults to the parent of the current repo." })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const report = await run(ctx, params.root);
      const affected = report.matches.filter((m) => m.affected).length;
      return {
        content: [{
          type: "text",
          text: `LiteLLM audit complete. Matches: ${report.matches.length}. Affected: ${affected}. Report: ${relative(ctx.cwd, report.reportPath)}`,
        }],
        details: report,
      };
    },
  });
}
