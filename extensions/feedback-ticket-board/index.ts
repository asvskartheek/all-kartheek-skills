import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { StringEnum } from "@mariozechner/pi-ai";
import { Type } from "@sinclair/typebox";
import { promises as fs } from "node:fs";
import { join, relative, resolve } from "node:path";

type Ticket = {
  id: string;
  title: string;
  source: string;
  sourcePath: string;
  line?: number;
  status: "open" | "planned" | "done";
  tags: string[];
};

type ScanResult = {
  root: string;
  boardDir: string;
  ticketsPath: string;
  markdownPath: string;
  scannedFiles: string[];
  tickets: Ticket[];
};

type Action = "build" | "list" | "close";

const DEFAULT_GLOBS = [
  "user_requests.md",
  ".pi/feedback-ops/consolidated-reports.md",
  ".pi/feedback-ops/VERIFICATION.md",
  ".pi/todos",
  ".pi/handoffs",
  "plan.md",
];

function normalizeTitle(text: string): string {
  return text
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferTags(path: string, line: string): string[] {
  const hay = `${path} ${line}`.toLowerCase();
  const tags: string[] = [];
  for (const [needle, tag] of [
    ["feedback", "feedback"],
    ["todo", "todo"],
    ["handoff", "handoff"],
    ["ui", "ui"],
    ["notif", "notifications"],
    ["observ", "observability"],
    ["agent", "agents"],
    ["ticket", "tickets"],
    ["plan", "plan"],
  ] as const) {
    if (hay.includes(needle) && !tags.includes(tag)) tags.push(tag);
  }
  return tags;
}

async function safeRead(path: string): Promise<string | null> {
  try {
    return await fs.readFile(path, "utf8");
  } catch {
    return null;
  }
}

async function listFiles(root: string): Promise<string[]> {
  const found: string[] = [];
  for (const rel of DEFAULT_GLOBS) {
    const abs = resolve(root, rel);
    try {
      const stat = await fs.stat(abs);
      if (stat.isFile()) {
        found.push(abs);
      } else if (stat.isDirectory()) {
        const entries = await fs.readdir(abs, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile() && /\.(md|txt|json)$/i.test(entry.name)) {
            found.push(join(abs, entry.name));
          }
        }
      }
    } catch {
      // ignore
    }
  }
  return [...new Set(found)].sort();
}

function extractTickets(filePath: string, content: string, root: string): Ticket[] {
  const rel = relative(root, filePath) || filePath;
  const tickets: Ticket[] = [];
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const looksLikeTask =
      /^[-*]\s+/.test(trimmed) ||
      /^\d+[.)]\s+/.test(trimmed) ||
      /\b(todo|fix|implement|add|create|improve|cleanup|investigate|disable|enable)\b/i.test(trimmed);
    if (!looksLikeTask) return;
    const title = normalizeTitle(trimmed);
    if (title.length < 12) return;
    const id = `t${String(tickets.length + 1).padStart(3, "0")}-${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || "item"}`;
    tickets.push({
      id,
      title,
      source: rel,
      sourcePath: filePath,
      line: index + 1,
      status: "open",
      tags: inferTags(rel, trimmed),
    });
  });
  return tickets;
}

function renderMarkdown(result: ScanResult): string {
  const counts = result.tickets.reduce<Record<string, number>>((acc, ticket) => {
    for (const tag of ticket.tags) acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  const tagSummary =
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => `- ${tag}: ${count}`)
      .join("\n") || "- none";
  const rows = result.tickets
    .map(
      (ticket) =>
        `| ${ticket.id} | ${ticket.title.replace(/\|/g, "\\|")} | ${ticket.tags.join(", ") || "-"} | ${ticket.source}${ticket.line ? `:${ticket.line}` : ""} |`,
    )
    .join("\n");
  return `# Feedback Ticket Board\n\nGenerated from repo feedback artifacts.\n\n## Scanned files\n${result.scannedFiles.map((f) => `- ${f}`).join("\n") || "- none"}\n\n## Tag summary\n${tagSummary}\n\n## Tickets\n| ID | Title | Tags | Source |\n|---|---|---|---|\n${rows || "| - | No tickets found | - | - |"}\n`;
}

async function buildBoard(root: string): Promise<ScanResult> {
  const files = await listFiles(root);
  const tickets = (
    await Promise.all(
      files.map(async (file) => {
        const content = await safeRead(file);
        return content ? extractTickets(file, content, root) : [];
      }),
    )
  ).flat();
  const boardDir = resolve(root, ".pi/feedback-ops");
  const ticketsPath = resolve(boardDir, "tickets.json");
  const markdownPath = resolve(boardDir, "tickets.md");
  await fs.mkdir(boardDir, { recursive: true });
  const result: ScanResult = {
    root,
    boardDir,
    ticketsPath,
    markdownPath,
    scannedFiles: files.map((f) => relative(root, f) || f),
    tickets,
  };
  await fs.writeFile(ticketsPath, JSON.stringify(result, null, 2));
  await fs.writeFile(markdownPath, renderMarkdown(result));
  return result;
}

function listText(result: ScanResult, cwd: string): string {
  if (!result.tickets.length) {
    return `No tickets found. Markdown: ${relative(cwd, result.markdownPath)}`;
  }
  const lines = result.tickets.slice(0, 50).map((ticket) => {
    const where = `${ticket.source}${ticket.line ? `:${ticket.line}` : ""}`;
    return `${ticket.id} [${ticket.tags.join(",") || "-"}] ${ticket.title} -> ${where}`;
  });
  return [...lines, `Markdown: ${relative(cwd, result.markdownPath)}`].join("\n");
}

export default function feedback_ticket_board(pi: ExtensionAPI) {
  async function closeWidget(ctx: {
    ui: { setWidget: (id: string, lines: string[]) => void; notify: (msg: string, level: "info" | "success" | "warning" | "error") => void };
  }) {
    ctx.ui.setWidget("feedback-ticket-board", []);
  }

  async function refresh(ctx: {
    cwd: string;
    ui: { setWidget: (id: string, lines: string[]) => void; notify: (msg: string, level: "info" | "success" | "warning" | "error") => void };
  }, root?: string) {
    const scanRoot = resolve(ctx.cwd, root || ".");
    const result = await buildBoard(scanRoot);
    ctx.ui.setWidget("feedback-ticket-board", [
      `tickets: ${result.tickets.length}`,
      `files: ${result.scannedFiles.length}`,
      relative(ctx.cwd, result.markdownPath),
    ]);
    return result;
  }

  pi.registerCommand("feedback-ticket-board", {
    description: "Build or list a repo-local feedback ticket board under .pi/feedback-ops/.",
    handler: async (args, ctx) => {
      const trimmed = args?.trim() || "build";
      if (trimmed === "close") {
        await closeWidget(ctx);
        ctx.ui.notify("Closed feedback ticket board widget.", "success");
        return;
      }
      const result = await refresh(ctx);
      if (trimmed === "list") {
        ctx.ui.notify(`Listed ${result.tickets.length} feedback tickets.`, "info");
      } else {
        ctx.ui.notify(`Built feedback ticket board with ${result.tickets.length} tickets.`, "success");
      }
    },
  });

  pi.registerCommand("feedback-ticket-board-close", {
    description: "Hide the feedback ticket board widget.",
    handler: async (_args, ctx) => {
      await closeWidget(ctx);
      ctx.ui.notify("Closed feedback ticket board widget.", "success");
    },
  });

  pi.registerTool({
    name: "feedback_ticket_board",
    label: "Feedback Ticket Board",
    description: "Scan repo feedback artifacts, normalize them into tickets, and manage a local board under .pi/feedback-ops/.",
    promptSnippet: "Build, list, or close a local ticket board from repo feedback artifacts when the user asks to turn feedback or todos into actionable tasks.",
    promptGuidelines: [
      "Use this tool when a repo has user_requests, .pi/todos, feedback-ops files, or handoffs that should be normalized into tickets.",
      "Use action=close when the user wants the ticket board widget hidden or closed.",
    ],
    parameters: Type.Object({
      action: Type.Optional(StringEnum(["build", "list", "close"] as const)),
      root: Type.Optional(Type.String({ description: "Root directory to scan. Defaults to the current repo." })),
    }),
    async execute(_toolCallId, params: { action?: Action; root?: string }, _signal, _onUpdate, ctx) {
      const action = params.action || "build";
      if (action === "close") {
        await closeWidget(ctx);
        return {
          content: [{ type: "text", text: "Closed feedback ticket board widget." }],
          details: { action: "close" },
        };
      }
      const result = await refresh(ctx, params.root);
      return {
        content: [{
          type: "text",
          text: action === "list"
            ? listText(result, ctx.cwd)
            : `Built feedback ticket board with ${result.tickets.length} tickets. Markdown: ${relative(ctx.cwd, result.markdownPath)} JSON: ${relative(ctx.cwd, result.ticketsPath)}`,
        }],
        details: result,
      };
    },
  });
}
