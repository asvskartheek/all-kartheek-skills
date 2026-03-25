import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { StringEnum } from "@mariozechner/pi-ai";
import { Type } from "@sinclair/typebox";
import { mkdir, access, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

type Mode = "auto" | "skill" | "extension";
type Kind = "skill" | "extension";

type ToolParams = {
  request: string;
  mode?: Mode;
  name?: string;
  targetDir?: string;
  writeFiles?: boolean;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 64) || "new-item";
}

function titleCaseFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeForDoubleQuotedYaml(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeForTsString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function decideKind(request: string, mode: Mode = "auto"): { kind: Kind; reason: string } {
  if (mode === "skill") {
    return { kind: "skill", reason: "Forced to skill mode." };
  }
  if (mode === "extension") {
    return { kind: "extension", reason: "Forced to extension mode." };
  }

  const text = request.toLowerCase();
  const extensionSignals = [
    "command",
    "slash command",
    "tool",
    "lifecycle",
    "event",
    "intercept",
    "hook",
    "status bar",
    "widget",
    "ui",
    "theme",
    "keyboard shortcut",
    "keybinding",
    "reload",
    "runtime",
    "custom tool",
    "extension",
  ];
  const skillSignals = [
    "skill",
    "workflow",
    "playbook",
    "instructions",
    "guide",
    "reference",
    "research",
    "summarize",
    "analyze",
    "use when",
    "checklist",
    "process",
  ];

  const extensionScore = extensionSignals.filter((term) => text.includes(term)).length;
  const skillScore = skillSignals.filter((term) => text.includes(term)).length;

  if (extensionScore >= skillScore) {
    return {
      kind: "extension",
      reason: "Needs active runtime behavior, commands, tools, or UI hooks; that fits an extension best.",
    };
  }

  return {
    kind: "skill",
    reason: "Looks like reusable task instructions and workflow guidance; that fits a skill best.",
  };
}

function makeSkillTemplate(name: string, request: string): string {
  const summary = `${request.replace(/\n+/g, " ").trim()}. Use when the user asks for this workflow.`;
  return `---
name: ${name}
description: "${escapeForDoubleQuotedYaml(summary)}"
---

# ${titleCaseFromSlug(name)}

## Purpose

${request.trim()}

## When to use this skill

- Use this when the user needs ${request.trim().replace(/\.$/, "").toLowerCase()}.
- Prefer an extension instead if you need runtime hooks, custom tools, slash commands, or TUI behavior.

## Suggested workflow

1. Clarify the user goal and inputs.
2. Inspect the relevant files or environment.
3. Execute the workflow step by step.
4. Report results crisply and list any follow-up actions.

## Notes

- Put helper scripts beside this skill if needed.
- Use relative paths from this skill directory.
- Keep instructions specific and actionable.
`;
}

function makeExtensionTemplate(name: string, request: string): string {
  const description = escapeForTsString(request.replace(/\n+/g, " ").trim());
  const title = escapeForTsString(titleCaseFromSlug(name));
  return `import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

export default function ${name.replace(/-/g, "_")}(pi: ExtensionAPI) {
  pi.registerCommand("${name}", {
    description: "${description}",
    handler: async (args, ctx) => {
      const detail = args?.trim() ? " Args: " + args.trim() : "";
      ctx.ui.notify("${title} loaded." + detail, "info");
    },
  });
}
`;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function scaffold(params: ToolParams, cwd: string) {
  const request = params.request.trim();
  if (!request) throw new Error("request is required");

  const decision = decideKind(request, params.mode ?? "auto");
  const name = slugify(params.name || request);
  const targetDir = resolve(cwd, params.targetDir || ".");
  const shouldWrite = params.writeFiles !== false;

  const relativeDir = decision.kind === "skill" ? `skills/${name}` : `extensions/${name}`;
  const filePath = resolve(targetDir, relativeDir, decision.kind === "skill" ? "SKILL.md" : "index.ts");
  const content = decision.kind === "skill"
    ? makeSkillTemplate(name, request)
    : makeExtensionTemplate(name, request);

  let status = "Preview only. No files written.";
  if (shouldWrite) {
    if (await exists(filePath)) {
      throw new Error(`Refusing to overwrite existing file: ${filePath}`);
    }
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf8");
    status = `Created ${filePath}`;
  }

  return {
    kind: decision.kind,
    reason: decision.reason,
    name,
    filePath,
    content,
    status,
  };
}

export default function (pi: ExtensionAPI) {
  pi.registerCommand("skill-or-extension-creator", {
    description: "Decide whether a new capability should be a pi skill or extension and scaffold it.",
    handler: async (args, ctx) => {
      const request = args?.trim() || await ctx.ui.input("Skill or extension?", "Describe what you want to build");
      if (!request?.trim()) {
        ctx.ui.notify("Cancelled: no request provided.", "warning");
        return;
      }

      const result = await scaffold({ request, writeFiles: true }, ctx.cwd);
      ctx.ui.notify(`${result.kind}: ${result.status}`, "success");
    },
  });

  pi.registerTool({
    name: "skill_or_extension_creator",
    label: "Skill Or Extension Creator",
    description: "Decide whether a requested pi customization should be a skill or extension, and optionally scaffold it.",
    promptSnippet: "Choose between creating a pi skill or extension and scaffold the starter files when helpful.",
    promptGuidelines: [
      "Use this tool when the user wants a new pi capability and it is unclear whether it should be a skill or an extension.",
    ],
    parameters: Type.Object({
      request: Type.String({ description: "What the new capability should do" }),
      mode: Type.Optional(StringEnum(["auto", "skill", "extension"] as const)),
      name: Type.Optional(Type.String({ description: "Optional explicit slug name" })),
      targetDir: Type.Optional(Type.String({ description: "Optional target directory, relative to cwd" })),
      writeFiles: Type.Optional(Type.Boolean({ description: "Write files if true, otherwise return a preview" })),
    }),
    async execute(_toolCallId, params: ToolParams, _signal, _onUpdate, ctx) {
      const result = await scaffold(params, ctx.cwd);
      return {
        content: [{
          type: "text",
          text: [
            `Recommendation: ${result.kind}`,
            `Reason: ${result.reason}`,
            `Name: ${result.name}`,
            `Path: ${result.filePath}`,
            result.status,
          ].join("\n"),
        }],
        details: result,
      };
    },
  });
}
