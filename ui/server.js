const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
loadEnvFile(path.join(ROOT, ".env"));

const PUBLIC_DIR = path.join(__dirname, "public");
const PORT = Number(process.env.PORT || 4173);
const PYTHON = process.env.PYTHON || "python3";
const AZURE_OPENAI_ENDPOINT = (process.env.AZURE_OPENAI_ENDPOINT || "").replace(/\/+$/, "");
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || "";
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || "";
const USE_AZURE_OPENAI = Boolean(AZURE_OPENAI_ENDPOINT && AZURE_OPENAI_DEPLOYMENT);
const LLM_API_KEY = USE_AZURE_OPENAI ? AZURE_OPENAI_API_KEY : process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "";
const LLM_BASE_URL = (process.env.LLM_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/+$/, "");
const LLM_MODEL = process.env.LLM_MODEL || process.env.OPENAI_MODEL || AZURE_OPENAI_DEPLOYMENT || "gpt-4.1-mini";
const OBSIDIAN_APP_PATHS = ["/Applications/Obsidian.app", path.join(process.env.HOME || "", "Applications", "Obsidian.app")];
const OBSIDIAN_APP_CONFIG = path.join(process.env.HOME || "", "Library", "Application Support", "obsidian", "obsidian.json");

const DEFAULT_CSV = path.join(ROOT, "data", "weekly_terms.csv");
const OBSIDIAN_CSV = path.join(ROOT, "data", "weekly_terms.from_obsidian.csv");
const PROMPT_OUT = path.join(ROOT, "output", "book-draft-prompt.md");
const RUN_STATE = path.join(ROOT, "output", "last-run.json");
const CSV_FIELDS = [
  "registered_at",
  "type",
  "term",
  "description",
  "context",
  "source",
  "tags",
  "importance",
  "project_id",
  "project_name",
  "book_title",
];

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};
const PANDOC = process.env.PANDOC || (fs.existsSync("/opt/anaconda3/bin/pandoc") ? "/opt/anaconda3/bin/pandoc" : "pandoc");
const CUPSFILTER = process.env.CUPSFILTER || "/usr/sbin/cupsfilter";
const SWIFT = process.env.SWIFT || "/usr/bin/swift";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) {
      continue;
    }

    let value = rawValue.trim();
    const quote = value[0];
    if ((quote === "\"" || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
      if (quote === "\"") {
        value = value
          .replace(/\\n/g, "\n")
          .replace(/\\r/g, "\r")
          .replace(/\\t/g, "\t")
          .replace(/\\"/g, "\"")
          .replace(/\\\\/g, "\\");
      }
    }

    process.env[key] = value;
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, text, contentType = "text/plain; charset=utf-8") {
  response.writeHead(status, { "Content-Type": contentType });
  response.end(text);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

async function readJson(request) {
  const body = await readBody(request);
  if (!body.trim()) {
    return {};
  }
  return JSON.parse(body);
}

function childEnv() {
  const moduleCache = path.join(ROOT, "output", ".clang-module-cache");
  fs.mkdirSync(moduleCache, { recursive: true });
  return {
    ...process.env,
    CLANG_MODULE_CACHE_PATH: moduleCache,
  };
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env: childEnv(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      const error = new Error(stderr || stdout || `${command} exited with ${code}`);
      error.stdout = stdout;
      error.stderr = stderr;
      error.code = code;
      reject(error);
    });
  });
}

function runCommandToFile(command, args, outputPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const child = spawn(command, args, {
      cwd: ROOT,
      env: childEnv(),
      stdio: ["ignore", "pipe", "pipe"],
    });
    const output = fs.createWriteStream(outputPath);
    let stderr = "";

    child.stdout.pipe(output);
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      output.end();
      if (code === 0) {
        resolve({ stdout: outputPath, stderr });
        return;
      }
      const error = new Error(stderr || `${command} exited with ${code}`);
      error.stderr = stderr;
      error.code = code;
      reject(error);
    });
  });
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath);
}

function readTextIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function detectObsidianConnection() {
  const installed = OBSIDIAN_APP_PATHS.some((appPath) => appPath && fs.existsSync(appPath));
  const vaults = [];

  const config = readJsonIfExists(OBSIDIAN_APP_CONFIG);
  for (const [id, vault] of Object.entries(config?.vaults || {})) {
    const vaultPath = String(vault?.path || "");
    if (!vaultPath) {
      continue;
    }
    vaults.push({
      id,
      path: vaultPath,
      open: Boolean(vault.open),
      exists: fs.existsSync(vaultPath) && fs.statSync(vaultPath).isDirectory(),
      hasObsidianConfig: fs.existsSync(path.join(vaultPath, ".obsidian")),
      ts: vault.ts || 0,
    });
  }

  const defaultVault =
    vaults.find((vault) => vault.open && vault.exists && vault.hasObsidianConfig) ||
    vaults.find((vault) => vault.exists && vault.hasObsidianConfig) ||
    vaults.find((vault) => vault.exists) ||
    null;

  return {
    installed,
    configPath: OBSIDIAN_APP_CONFIG,
    connected: Boolean(defaultVault),
    defaultVaultPath: defaultVault?.path || "",
    vaults,
  };
}

function resolveObsidianVault(rawVault) {
  const trimmed = String(rawVault || "").trim();
  if (trimmed) {
    return path.isAbsolute(trimmed) ? trimmed : path.resolve(ROOT, trimmed);
  }

  const connection = detectObsidianConnection();
  if (!connection.defaultVaultPath) {
    throw new Error("연결된 Obsidian vault를 찾지 못했습니다. Vault 경로를 입력해 주세요.");
  }
  return connection.defaultVaultPath;
}

function checkObsidianSettings(payload = {}) {
  const connection = detectObsidianConnection();
  const rawVault = String(payload.vault || "").trim();
  let vaultPath = "";
  let vaultExists = false;
  let vaultHasConfig = false;
  let importFolder = "";
  let importFolderExists = false;
  let savePreview = "";

  try {
    vaultPath = rawVault ? (path.isAbsolute(rawVault) ? rawVault : path.resolve(ROOT, rawVault)) : connection.defaultVaultPath;
    vaultExists = Boolean(vaultPath && fs.existsSync(vaultPath) && fs.statSync(vaultPath).isDirectory());
    vaultHasConfig = Boolean(vaultExists && fs.existsSync(path.join(vaultPath, ".obsidian")));
    if (vaultExists) {
      const folder = String(payload.folder || "").trim();
      importFolder = folder ? path.join(vaultPath, folder) : vaultPath;
      importFolderExists = fs.existsSync(importFolder) && fs.statSync(importFolder).isDirectory();
      const chapterFolder = String(payload.chapterFolder || "Book Drafts").trim();
      const title = String(payload.chapterTitle || "챕터 제목").trim();
      savePreview = path.join(projectOutputDir(vaultPath, chapterFolder, payload), `${safeFileName(title)}.md`);
    }
  } catch {
    vaultExists = false;
  }

  const connected = Boolean(vaultExists && vaultHasConfig);
  const message = connected
    ? "Obsidian vault 연결을 확인했습니다."
    : "Obsidian vault 경로나 .obsidian 설정 폴더를 확인해 주세요.";

  return {
    obsidianConnection: connection,
    connected,
    vaultPath,
    vaultExists,
    vaultHasConfig,
    importFolder,
    importFolderExists,
    savePreview,
    message,
  };
}

function writeRunState(payload) {
  const state = {
    action: payload.action || "unknown",
    status: payload.status || "success",
    updatedAt: new Date().toISOString(),
    message: String(payload.message || "").trim(),
    stdout: String(payload.stdout || "").trim(),
    stderr: String(payload.stderr || "").trim(),
    manualRows: csvRowCount(DEFAULT_CSV),
    obsidianRows: csvRowCount(OBSIDIAN_CSV),
    promptPath: PROMPT_OUT,
    obsidianCsvPath: OBSIDIAN_CSV,
  };
  fs.mkdirSync(path.dirname(RUN_STATE), { recursive: true });
  fs.writeFileSync(RUN_STATE, JSON.stringify(state, null, 2), "utf8");
  return state;
}

function csvRowCount(filePath) {
  if (!fs.existsSync(filePath)) {
    return 0;
  }
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) {
    return 0;
  }
  return Math.max(0, text.split(/\r?\n/).length - 1);
}

function csvEscape(value) {
  const text = String(value || "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function appendCsvRow(filePath, row) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (!fs.existsSync(filePath) || !fs.readFileSync(filePath, "utf8").trim()) {
    fs.writeFileSync(filePath, `${CSV_FIELDS.join(",")}\n`, "utf8");
  } else {
    ensureCsvSchema(filePath);
  }
  fs.appendFileSync(
    filePath,
    `${CSV_FIELDS.map((field) => csvEscape(row[field])).join(",")}\n`,
    "utf8",
  );
}

function ensureCsvSchema(filePath) {
  if (!fs.existsSync(filePath) || !fs.readFileSync(filePath, "utf8").trim()) {
    return;
  }
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  const headers = rows[0] || [];
  const hasAllFields = CSV_FIELDS.every((field) => headers.includes(field));
  if (hasAllFields) {
    return;
  }
  writeCsvRows(filePath, readCsvRowObjects(filePath));
}

function writeCsvRows(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const lines = [
    CSV_FIELDS.join(","),
    ...rows.map((row) => CSV_FIELDS.map((field) => csvEscape(row[field])).join(",")),
  ];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.trim())) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }
    value += char;
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) {
    rows.push(row);
  }
  return rows;
}

function readCsvEntries(filePath, sourceFile) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  if (rows.length <= 1) {
    return [];
  }
  const headers = rows[0];
  return rows.slice(1).map((row, index) => {
    const entry = { id: `${sourceFile}-${index}`, sourceFile };
    headers.forEach((header, columnIndex) => {
      entry[header] = row[columnIndex] || "";
    });
    return entry;
  });
}

function readCsvRowObjects(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const rows = parseCsv(fs.readFileSync(filePath, "utf8"));
  if (rows.length <= 1) {
    return [];
  }
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const entry = Object.fromEntries(CSV_FIELDS.map((field) => [field, ""]));
    headers.forEach((header, columnIndex) => {
      if (CSV_FIELDS.includes(header)) {
        entry[header] = row[columnIndex] || "";
      }
    });
    return entry;
  });
}

function manualEntryIndex(id) {
  const match = String(id || "").match(/^manual-(\d+)$/);
  if (!match) {
    throw new Error("직접 등록한 재료만 수정하거나 삭제할 수 있습니다.");
  }
  return Number(match[1]);
}

function isDateInRange(value, start, end) {
  if (!value) {
    return false;
  }
  const current = String(value).slice(0, 10);
  if (start && current < start) {
    return false;
  }
  if (end && current > end) {
    return false;
  }
  return true;
}

function projectIdFromPayload(payload = {}) {
  return String(payload.projectId || payload.project_id || "default").trim() || "default";
}

function entryProjectId(entry) {
  return String(entry.project_id || "default").trim() || "default";
}

function entryMatchesProject(entry, projectId) {
  const currentProjectId = projectIdFromPayload({ projectId });
  return entryProjectId(entry) === currentProjectId;
}

function projectObsidianCsvPath(projectId) {
  const normalizedProjectId = projectIdFromPayload({ projectId });
  if (normalizedProjectId === "default") {
    return OBSIDIAN_CSV;
  }
  return path.join(ROOT, "data", `weekly_terms.from_obsidian.${safeFileName(normalizedProjectId)}.csv`);
}

function entriesForRange(start, end, projectId = "default") {
  const obsidianCsv = projectObsidianCsvPath(projectId);
  const entries = [
    ...readCsvEntries(DEFAULT_CSV, "manual"),
    ...readCsvEntries(obsidianCsv, "obsidian"),
  ];
  return entries
    .filter((entry) => isDateInRange(entry.registered_at, start, end))
    .filter((entry) => entryMatchesProject(entry, projectId))
    .sort((a, b) => {
      const dateOrder = String(a.registered_at).localeCompare(String(b.registered_at));
      if (dateOrder !== 0) {
        return dateOrder;
      }
      return String(a.term || "").localeCompare(String(b.term || ""));
    });
}

function safeFileName(value) {
  return String(value || "book-draft")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

function projectFolderName(payload = {}) {
  const fallback = projectIdFromPayload(payload);
  const rawName = String(payload.projectName || payload.bookTitle || fallback).trim();
  const folderName = safeFileName(rawName);
  return folderName || safeFileName(fallback);
}

function projectOutputDir(vault, folder, payload = {}) {
  const baseDir = folder ? path.join(vault, folder) : vault;
  return path.join(baseDir, projectFolderName(payload));
}

function localTimestampForFile(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const validDate = Number.isNaN(date.valueOf()) ? new Date() : date;
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0");
  const day = String(validDate.getDate()).padStart(2, "0");
  const hour = String(validDate.getHours()).padStart(2, "0");
  const minute = String(validDate.getMinutes()).padStart(2, "0");
  const second = String(validDate.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}_${hour}${minute}${second}`;
}

function yamlString(value) {
  return JSON.stringify(String(value || ""));
}

function parseFrontmatterData(markdown) {
  const text = String(markdown || "");
  if (!text.startsWith("---\n")) {
    return {};
  }

  const end = text.indexOf("\n---", 4);
  if (end === -1) {
    return {};
  }

  const data = {};
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const [, key, rawValue] = match;
    const value = rawValue.trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value.slice(1, -1);
      }
      continue;
    }
    if (/^\d+$/.test(value)) {
      data[key] = Number(value);
      continue;
    }
    data[key] = value;
  }
  return data;
}

function markdownLine(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

function entryTypeLabel(type) {
  const labels = {
    case: "사례",
    experience: "경험",
    example: "예시",
    technical_term: "개념",
    word: "단어",
    description: "설명",
    memo: "메모",
    idea: "아이디어",
  };
  return labels[type] || type || "항목";
}

function draftTypeInfo(type) {
  const infos = {
    case: {
      label: "사례형",
      focus: "하나의 구체적인 장면과 문제 해결 흐름을 중심으로 쓴다.",
      sections: ["도입 장면", "문제의 이름 붙이기", "전환점", "원고 본문 초안", "독자에게 남길 해석", "마무리"],
    },
    essay: {
      label: "에세이형",
      focus: "개인적 관찰과 사유가 자연스럽게 이어지는 문장 중심의 글로 쓴다.",
      sections: ["도입 문장", "관찰", "생각의 전환", "원고 본문 초안", "독자에게 남길 여운", "마무리"],
    },
    guide: {
      label: "실무 가이드형",
      focus: "독자가 따라 할 수 있는 판단 기준과 실행 단계 중심으로 쓴다.",
      sections: ["문제 상황", "판단 기준", "실행 절차", "원고 본문 초안", "실무 적용 포인트", "마무리"],
    },
    concept: {
      label: "개념 설명형",
      focus: "개념을 정의하고 오해를 풀며 사례로 이해를 돕는 구조로 쓴다.",
      sections: ["개념 정의", "흔한 오해", "설명 사례", "원고 본문 초안", "적용 관점", "마무리"],
    },
  };
  return infos[type] || infos.case;
}

function chapterTemplateInfo(template) {
  const templates = {
    scene: {
      label: "장면에서 시작",
      direction: "첫 문단은 사용자가 겪은 장면, 대화, 상황 묘사에서 시작한다.",
    },
    problem: {
      label: "문제-해결",
      direction: "문제 정의, 원인, 전환점, 적용 가능한 해결 기준 순서로 전개한다.",
    },
    lesson: {
      label: "교훈/통찰",
      direction: "경험에서 얻은 판단 기준과 독자가 가져갈 질문을 중심으로 전개한다.",
    },
    howto: {
      label: "실행 가이드",
      direction: "독자가 따라 할 수 있는 단계, 체크포인트, 적용 예시 중심으로 전개한다.",
    },
  };
  return templates[String(template || "").trim()] || templates.scene;
}

function styleGuideInfo(payload) {
  const guide = payload?.styleGuide || {};
  return {
    principles: markdownLine(guide.principles),
    preferredExpressions: markdownLine(guide.preferredExpressions),
    bannedExpressions: markdownLine(guide.bannedExpressions),
    referenceStyle: markdownLine(guide.referenceStyle),
  };
}

function styleGuidePromptLines(payload) {
  const guide = styleGuideInfo(payload);
  const lines = [];
  if (guide.principles) {
    lines.push(`- 문체 원칙: ${guide.principles}`);
  }
  if (guide.preferredExpressions) {
    lines.push(`- 선호 표현: ${guide.preferredExpressions}`);
  }
  if (guide.bannedExpressions) {
    lines.push(`- 피할 표현: ${guide.bannedExpressions}`);
  }
  if (guide.referenceStyle) {
    lines.push(`- 참고 문장: ${guide.referenceStyle}`);
  }
  return lines;
}

function entriesForPayload(payload = {}) {
  const entries = entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId);
  const included = Array.isArray(payload.includedEntryIds)
    ? new Set(payload.includedEntryIds.map((id) => String(id)))
    : null;
  if (!included || included.size === 0) {
    return entries;
  }
  return entries.filter((entry) => included.has(entry.id));
}

function buildChapterMarkdown(entries, payload) {
  const weekStart = payload.weekStart || "시작일";
  const weekEnd = payload.weekEnd || "종료일";
  const title = markdownLine(payload.chapterTitle) || `${weekStart} - ${weekEnd} 원고 초안`;
  const draftType = draftTypeInfo(payload.draftType);
  const chapterTemplate = chapterTemplateInfo(payload.chapterTemplate);
  const bookContext = markdownLine(payload.bookContext);
  const targetReader = markdownLine(payload.targetReader);
  const chapterGoal = markdownLine(payload.chapterGoal);
  const tone = markdownLine(payload.tone);
  const styleLines = styleGuidePromptLines(payload);

  const lines = [
    "---",
    "book_draft: true",
    `project_id: ${yamlString(projectIdFromPayload(payload))}`,
    `project_name: ${yamlString(payload.projectName || "")}`,
    `book_title: ${yamlString(payload.bookTitle || "")}`,
    `draft_type: ${payload.draftType || "case"}`,
    `chapter_template: ${yamlString(chapterTemplate.label)}`,
    `week_start: ${weekStart}`,
    `week_end: ${weekEnd}`,
    "status: draft",
    "tags:",
    "  - book-draft",
    "---",
    "",
    `# ${title}`,
    "",
    "## 원고 기획 메모",
    "",
    `- 기간: ${weekStart}부터 ${weekEnd}까지`,
    `- 책의 맥락: ${bookContext || "미정"}`,
    `- 원고 유형: ${draftType.label}`,
    `- 유형 방향: ${draftType.focus}`,
    `- 챕터 템플릿: ${chapterTemplate.label}`,
    `- 템플릿 방향: ${chapterTemplate.direction}`,
    `- 예상 독자: ${targetReader || "미정"}`,
    `- 이번 원고의 목표: ${chapterGoal || "미정"}`,
    `- 원하는 톤: ${tone || "미정"}`,
    ...(styleLines.length ? ["- 작가 스타일 가이드:", ...styleLines.map((line) => `  ${line}`)] : []),
    "- 중심 장면 또는 사례:",
    "- 반드시 살릴 재료:",
    "- 보류할 재료:",
    "- 핵심 메시지:",
    "",
    `## ${draftType.sections[0]}`,
    "",
    "입력된 재료 중 하나를 골라 이 원고 유형에 맞는 시작점으로 엽니다.",
    "",
    `## ${draftType.sections[1]}`,
    "",
    "아래 날짜순 재료들이 공통으로 가리키는 문제나 관점을 한 문장으로 정리합니다.",
    "",
    "## 날짜순 원고 재료",
    "",
  ];

  if (!entries.length) {
    lines.push("원고 재료가 없습니다.", "");
  } else {
    for (const entry of entries) {
      lines.push(
        `### ${entry.registered_at || "-"} · ${entry.term || "제목 없음"}`,
        "",
        `- 종류: ${entryTypeLabel(entry.type)}`,
        `- 설명: ${markdownLine(entry.description) || "없음"}`,
        `- 맥락: ${markdownLine(entry.context) || "없음"}`,
        `- 출처: ${markdownLine(entry.source) || (entry.sourceFile === "obsidian" ? "Obsidian" : "직접 등록")}`,
        `- 태그: ${markdownLine(entry.tags) || "없음"}`,
        `- 중요도: ${markdownLine(entry.importance) || "없음"}`,
        "",
      );
    }
  }

  lines.push(
    `## ${draftType.sections[2]}`,
    "",
    "원고의 방향이 달라지는 판단, 기준, 관찰을 정리합니다.",
    "",
    `## ${draftType.sections[3]}`,
    "",
    "날짜순 재료를 그대로 나열하지 말고, 하나의 챕터 또는 사례 원고로 자연스럽게 엮습니다.",
    `템플릿 방향: ${chapterTemplate.direction}`,
    "",
    `## ${draftType.sections[4]}`,
    "",
    "독자가 이 사례나 챕터를 읽고 어떤 관점, 판단, 질문을 가져갈 수 있는지 적습니다.",
    "",
    `## ${draftType.sections[5]}`,
    "",
    "이번 원고의 메시지와 다음 원고로 이어질 질문을 남깁니다.",
    "",
    "## 원고에 반영한 핵심 개념",
    "",
    entries
      .filter((entry) => ["technical_term", "word", "description"].includes(entry.type))
      .map((entry) => `- ${entry.term}: ${markdownLine(entry.description) || "설명 필요"}`)
      .join("\n") || "- 별도 개념 정리가 필요하면 추가하세요.",
    "",
  );

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }
  return chunks.join("\n").trim();
}

function stripMarkdownFence(text) {
  return String(text || "")
    .trim()
    .replace(/^```(?:markdown|md)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function frontmatterBlock(markdown) {
  const text = String(markdown || "");
  if (!text.startsWith("---\n")) {
    return "";
  }
  const end = text.indexOf("\n---", 4);
  if (end === -1) {
    return "";
  }
  return text.slice(0, end + 4).trim();
}

function draftFrontmatter(payload) {
  const weekStart = String(payload.weekStart || "").slice(0, 10) || "시작일";
  const weekEnd = String(payload.weekEnd || "").slice(0, 10) || "종료일";
  const chapterTemplate = chapterTemplateInfo(payload.chapterTemplate);
  return [
    "---",
    "book_draft: true",
    `project_id: ${yamlString(projectIdFromPayload(payload))}`,
    `project_name: ${yamlString(payload.projectName || "")}`,
    `book_title: ${yamlString(payload.bookTitle || "")}`,
    `draft_type: ${payload.draftType || "case"}`,
    `chapter_template: ${yamlString(chapterTemplate.label)}`,
    `week_start: ${weekStart}`,
    `week_end: ${weekEnd}`,
    "status: edited",
    "tags:",
    "  - book-draft",
    "---",
  ].join("\n");
}

function ensureDraftFrontmatter(markdown, payload) {
  const text = String(markdown || "").trim();
  if (!text) {
    return "";
  }
  if (text.startsWith("---\n")) {
    return `${text}\n`;
  }
  return `${draftFrontmatter(payload)}\n\n${text}\n`;
}

function titleFromMarkdown(markdown) {
  const match = String(markdown || "").match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function markdownBodyText(markdown) {
  return String(markdown || "")
    .replace(/^---[\s\S]*?\n---\s*/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[-*_>`#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withPublicationReadyStatus(markdown) {
  const text = String(markdown || "").trim();
  if (!text.startsWith("---\n")) {
    return text;
  }
  if (/^status:\s*.+$/m.test(text)) {
    return text.replace(/^status:\s*.+$/m, "status: publication-ready");
  }
  return text.replace(/\n---/, "\nstatus: publication-ready\n---");
}

function markdownWithoutFrontmatter(markdown) {
  return String(markdown || "").replace(/^---[\s\S]*?\n---\s*/m, "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listOpen = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      html.push(`<h${heading[1].length}>${escapeHtml(heading[2])}</h${heading[1].length}>`);
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(bullet[1])}</li>`);
      continue;
    }

    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  if (listOpen) {
    html.push("</ul>");
  }
  return html.join("\n");
}

function exportOptions(payload = {}) {
  const options = payload.exportOptions && typeof payload.exportOptions === "object" ? payload.exportOptions : {};
  return {
    chapterNumber: markdownLine(options.chapterNumber || payload.chapterNumber),
    includeCover: options.includeCover !== false,
    includeToc: options.includeToc !== false,
  };
}

function chapterDisplayTitle(title, options) {
  const trimmed = String(title || "원고").trim();
  if (!options.chapterNumber || /^제\s*\S+\s*장/.test(trimmed)) {
    return trimmed;
  }
  return `제 ${options.chapterNumber}장. ${trimmed}`;
}

function tableOfContentsFromMarkdown(markdown) {
  return String(markdown || "")
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+)$/))
    .filter(Boolean)
    .map((match) => `- ${match[1].trim()}`);
}

function prepareManuscriptMarkdown(markdown, payload, title) {
  const options = exportOptions(payload);
  const body = String(markdown || "").trim();
  const displayTitle = chapterDisplayTitle(title, options);
  const normalizedBody = body.replace(/^#\s+(.+)$/m, `# ${displayTitle}`);
  const lines = [];

  if (options.includeCover) {
    lines.push(
      `# ${payload.bookTitle || payload.projectName || "책 원고"}`,
      "",
      `## ${displayTitle}`,
      "",
      `- 프로젝트: ${payload.projectName || "미정"}`,
      `- 원고 유형: ${draftTypeInfo(payload.draftType).label}`,
      `- 기간: ${payload.weekStart || "시작일"} - ${payload.weekEnd || "종료일"}`,
      "",
    );
  }

  const toc = tableOfContentsFromMarkdown(normalizedBody);
  if (options.includeToc && toc.length) {
    lines.push("## 목차", "", ...toc, "");
  }

  lines.push(normalizedBody);
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function outputFileReady(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
}

function ensureOutputFile(filePath, label) {
  if (!outputFileReady(filePath)) {
    throw new Error(`${label} 파일을 만들지 못했습니다: ${filePath}`);
  }
}

function exportTemplateInfo(template) {
  const templates = {
    manuscript: {
      id: "manuscript",
      label: "출판 원고형",
      css: [
        "body { font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; line-height: 1.72; color: #1f2a2d; max-width: 760px; margin: 42px auto; padding: 0 28px; }",
        "h1 { font-size: 28px; margin: 0 0 24px; }",
        "h2 { font-size: 20px; margin: 30px 0 12px; }",
        "h3 { font-size: 16px; margin: 24px 0 10px; }",
        "p, li { font-size: 13.5px; }",
        "ul { padding-left: 22px; }",
        "body > h1:first-child { break-after: avoid; border-bottom: 1px solid #d8dfda; padding-bottom: 18px; }",
      ],
    },
    essay: {
      id: "essay",
      label: "에세이형 여백",
      css: [
        "body { font-family: Georgia, 'Apple SD Gothic Neo', 'Noto Serif KR', serif; line-height: 1.86; color: #20282b; max-width: 690px; margin: 58px auto; padding: 0 36px; }",
        "h1 { font-size: 30px; margin: 0 0 30px; font-weight: 700; }",
        "h2 { font-size: 21px; margin: 36px 0 14px; }",
        "h3 { font-size: 17px; margin: 28px 0 12px; }",
        "p, li { font-size: 14.5px; }",
        "ul { padding-left: 24px; }",
        "body > h1:first-child { break-after: avoid; border-bottom: 1px solid #d6d0c4; padding-bottom: 20px; }",
      ],
    },
    compact: {
      id: "compact",
      label: "검토용 compact",
      css: [
        "body { font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; line-height: 1.55; color: #1f2a2d; max-width: 860px; margin: 30px auto; padding: 0 22px; }",
        "h1 { font-size: 24px; margin: 0 0 18px; }",
        "h2 { font-size: 18px; margin: 24px 0 10px; }",
        "h3 { font-size: 15px; margin: 18px 0 8px; }",
        "p, li { font-size: 12.5px; }",
        "ul { padding-left: 20px; }",
        "body > h1:first-child { border-bottom: 1px solid #d8dfda; padding-bottom: 12px; }",
      ],
    },
  };
  return templates[String(template || "").trim()] || templates.manuscript;
}

function manuscriptHtmlDocument(title, markdown, template) {
  const templateInfo = exportTemplateInfo(template);
  return [
    "<!doctype html>",
    '<html lang="ko">',
    "<head>",
    '<meta charset="utf-8" />',
    `<title>${escapeHtml(title)}</title>`,
    "<style>",
    ...templateInfo.css,
    "</style>",
    "</head>",
    "<body>",
    markdownToHtml(markdown),
    "</body>",
    "</html>",
  ].join("\n");
}

function draftVersionBodyFromNote(markdown) {
  const text = markdownWithoutFrontmatter(markdown).replace(/\r\n/g, "\n");
  const match = text.match(/(^|\n)## 원고 본문\s*\n/);
  if (!match || match.index === undefined) {
    return text.trim();
  }
  const start = match.index + match[0].length;
  return text.slice(start).trim();
}

function characterCount(value) {
  return String(value || "").replace(/\s/g, "").length;
}

function llmRequestUrl() {
  if (USE_AZURE_OPENAI) {
    return `${AZURE_OPENAI_ENDPOINT}/openai/v1/responses`;
  }
  return `${LLM_BASE_URL}/responses`;
}

function llmRequestHeaders() {
  const headers = {
    "Content-Type": "application/json",
  };

  if (USE_AZURE_OPENAI) {
    headers["api-key"] = LLM_API_KEY;
  } else {
    headers.Authorization = `Bearer ${LLM_API_KEY}`;
  }

  return headers;
}

function llmModel(payload) {
  const requestedModel = String(payload.llmModel || "").trim();
  if (requestedModel) {
    return requestedModel;
  }
  return LLM_MODEL;
}

function llmConnectionStatus() {
  return {
    provider: USE_AZURE_OPENAI ? "azure-openai" : "openai",
    configured: Boolean(LLM_API_KEY),
    endpoint: USE_AZURE_OPENAI ? AZURE_OPENAI_ENDPOINT : LLM_BASE_URL,
    model: LLM_MODEL,
  };
}

async function expandChapterWithLlm(markdown, entries, payload) {
  if (payload.expandWithLlm === false) {
    return {
      markdown,
      llmStatus: "disabled",
      llmMessage: "LLM 확장을 사용하지 않았습니다.",
    };
  }
  if (!LLM_API_KEY) {
    return {
      markdown,
      llmStatus: "skipped",
      llmMessage: "OPENAI_API_KEY, AZURE_OPENAI_API_KEY 또는 LLM_API_KEY가 없어 구조화 초안으로 저장했습니다.",
    };
  }

  const draftType = draftTypeInfo(payload.draftType);
  const chapterTemplate = chapterTemplateInfo(payload.chapterTemplate);
  const styleLines = styleGuidePromptLines(payload);
  const systemPrompt = [
    "당신은 사용자의 아이디어를 책 원고로 확장하는 한국어 작가 에이전트입니다.",
    "입력된 아이디어, 경험, 사례, 예시, 메모에 근거해 하나의 챕터 또는 사례 원고를 씁니다.",
    "없는 사실, 실제 인물, 회사명, 수치, 사건은 지어내지 않습니다.",
    "날짜순 원고 재료 섹션은 유지하되, 본문은 하나의 사례와 문제의식이 이어지도록 재구성합니다.",
    "출력은 Obsidian에서 바로 저장할 수 있는 Markdown 전체 문서만 반환합니다.",
  ].join("\n");

  const userPrompt = [
    "아래 Markdown 초안을 출판 가능한 책 원고 초안으로 확장/재정리하세요.",
    "",
    "요구사항:",
    "- YAML frontmatter를 유지하세요.",
    `- 원고 유형은 "${draftType.label}"입니다. ${draftType.focus}`,
    `- 챕터 템플릿은 "${chapterTemplate.label}"입니다. ${chapterTemplate.direction}`,
    "- 선택된 원고 유형에 맞게 제목, 도입부, 전개, 원고 본문, 독자에게 남길 해석, 마무리를 실제 문장으로 채우세요.",
    "- 날짜순 원고 재료는 오래된 날짜부터 최신 날짜까지 유지하세요.",
    "- 입력 재료가 적으면 억지로 사실을 만들지 말고, 사용자가 준 상황을 바탕으로 일반화된 설명을 쓰세요.",
    "- 문체는 책 원고처럼 자연스럽고 단정하게 쓰세요.",
    ...(styleLines.length ? ["- 아래 작가 스타일 가이드를 우선 적용하세요."] : []),
    "- '작성합니다', '추가하세요' 같은 지시문은 본문에 남기지 마세요.",
    "",
    `책의 맥락: ${payload.bookContext || "미정"}`,
    `예상 독자: ${payload.targetReader || "미정"}`,
    `이번 원고 목표: ${payload.chapterGoal || "미정"}`,
    `원고 유형: ${draftType.label}`,
    `유형 방향: ${draftType.focus}`,
    `챕터 템플릿: ${chapterTemplate.label}`,
    `템플릿 방향: ${chapterTemplate.direction}`,
    `톤: ${payload.tone || "미정"}`,
    ...(styleLines.length ? ["작가 스타일 가이드:", ...styleLines] : []),
    `원고 재료 수: ${entries.length}`,
    "",
    "초안:",
    markdown,
  ].join("\n");

  const response = await fetch(llmRequestUrl(), {
    method: "POST",
    headers: llmRequestHeaders(),
    body: JSON.stringify({
      model: llmModel(payload),
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_output_tokens: 10000,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || `LLM request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  let expanded = stripMarkdownFence(extractResponseText(data));
  if (!expanded) {
    throw new Error("LLM 응답에서 원고 내용을 찾지 못했습니다.");
  }
  if (!expanded.startsWith("---")) {
    const frontmatter = frontmatterBlock(markdown);
    if (frontmatter) {
      expanded = `${frontmatter}\n\n${expanded}`;
    }
  }

  return {
    markdown: `${expanded}\n`,
    llmStatus: "expanded",
    llmMessage: `LLM으로 원고를 확장했습니다. provider=${USE_AZURE_OPENAI ? "azure-openai" : "openai"}, model=${llmModel(payload)}`,
  };
}

async function exportChapterToObsidian(payload) {
  const rawVault = String(payload.vault || "").trim();
  const vault = resolveObsidianVault(rawVault);
  if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
    throw new Error(`Obsidian vault 경로를 찾을 수 없습니다: ${rawVault || vault}`);
  }

  const weekStart = String(payload.weekStart || "").slice(0, 10);
  const weekEnd = String(payload.weekEnd || "").slice(0, 10);
  const entries = entriesForPayload({ ...payload, weekStart, weekEnd });
  const folder = String(payload.chapterFolder || "Book Drafts").trim();
  const outputDir = projectOutputDir(vault, folder, payload);
  fs.mkdirSync(outputDir, { recursive: true });

  const editedMarkdown = ensureDraftFrontmatter(payload.markdown, payload);
  const defaultTitle = `${weekStart || "start"}_${weekEnd || "end"}_원고초안`;
  const title = String(payload.chapterTitle || titleFromMarkdown(editedMarkdown) || defaultTitle).trim();
  const filePath = path.join(outputDir, `${safeFileName(title)}.md`);
  let markdown = editedMarkdown;
  let llmStatus = "edited";
  let llmMessage = "화면에서 편집한 원고를 저장했습니다.";

  if (!markdown) {
    const draftMarkdown = buildChapterMarkdown(entries, payload);
    const expanded = await expandChapterWithLlm(draftMarkdown, entries, payload);
    markdown = expanded.markdown;
    llmStatus = expanded.llmStatus;
    llmMessage = expanded.llmMessage;
  }

  fs.writeFileSync(filePath, markdown, "utf8");

  const statusSuffix = llmMessage ? `\n${llmMessage}` : "";
  const lastRun = writeRunState({
    action: "export-chapter",
    status: "success",
    message: `Obsidian에 원고 노트를 저장했습니다: ${filePath}${statusSuffix}`,
  });

  return {
    entries,
    filePath,
    markdown,
    llmStatus,
    llmMessage,
    lastRun,
  };
}

function buildDraftVersionNote(payload, savedMarkdown, savedAt) {
  const draftType = draftTypeInfo(payload.draftType);
  const weekStart = String(payload.weekStart || "").slice(0, 10) || "시작일";
  const weekEnd = String(payload.weekEnd || "").slice(0, 10) || "종료일";
  const title = String(payload.chapterTitle || titleFromMarkdown(savedMarkdown) || `${weekStart}_${weekEnd}_원고초안`).trim();
  const source = String(payload.versionSource || "수동 저장").trim();
  const versionId = String(payload.versionId || "").trim();
  const body = markdownWithoutFrontmatter(savedMarkdown) || savedMarkdown.trim();
  const count = characterCount(body);

  return [
    "---",
    "book_draft_version: true",
    `project_id: ${yamlString(projectIdFromPayload(payload))}`,
    `project_name: ${yamlString(payload.projectName || "")}`,
    `book_title: ${yamlString(payload.bookTitle || "")}`,
    `draft_type: ${yamlString(payload.draftType || "case")}`,
    `week_start: ${yamlString(weekStart)}`,
    `week_end: ${yamlString(weekEnd)}`,
    `chapter_title: ${yamlString(title)}`,
    `version_source: ${yamlString(source)}`,
    `version_id: ${yamlString(versionId)}`,
    `version_saved_at: ${yamlString(savedAt.toISOString())}`,
    `character_count: ${count}`,
    "tags:",
    "  - book-draft-version",
    "---",
    "",
    `# ${title} - 원고 버전`,
    "",
    "## 버전 정보",
    "",
    `- 저장 시각: ${savedAt.toLocaleString()}`,
    `- 저장 이유: ${source}`,
    `- 원고 유형: ${draftType.label}`,
    `- 기간: ${weekStart}부터 ${weekEnd}까지`,
    `- 본문 글자 수: ${count}자`,
    "",
    "## 원고 본문",
    "",
    body,
    "",
  ].join("\n");
}

function exportDraftVersionToObsidian(payload) {
  const rawVault = String(payload.vault || "").trim();
  const vault = resolveObsidianVault(rawVault);
  if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
    throw new Error(`Obsidian vault 경로를 찾을 수 없습니다: ${rawVault || vault}`);
  }

  const savedMarkdown = ensureDraftFrontmatter(payload.markdown, payload);
  if (!savedMarkdown.trim()) {
    throw new Error("백업할 원고 버전 내용이 없습니다.");
  }

  const folder = String(payload.chapterFolder || "Book Drafts").trim();
  const outputDir = path.join(projectOutputDir(vault, folder, payload), "_versions");
  fs.mkdirSync(outputDir, { recursive: true });

  const savedAt = payload.versionCreatedAt ? new Date(payload.versionCreatedAt) : new Date();
  const validSavedAt = Number.isNaN(savedAt.valueOf()) ? new Date() : savedAt;
  const title = String(payload.chapterTitle || titleFromMarkdown(savedMarkdown) || "원고초안").trim();
  const source = String(payload.versionSource || "수동 저장").trim();
  const versionId = String(payload.versionId || "").trim();
  const idSuffix = versionId ? `_${versionId.slice(0, 8)}` : "";
  const fileName = `${localTimestampForFile(validSavedAt)}_${safeFileName(title)}_${safeFileName(source)}${idSuffix}.md`;
  const filePath = path.join(outputDir, fileName);
  const note = buildDraftVersionNote(payload, savedMarkdown, validSavedAt);

  fs.writeFileSync(filePath, note, "utf8");

  const lastRun = writeRunState({
    action: "export-draft-version",
    status: "success",
    message: `Obsidian에 원고 버전 백업을 저장했습니다: ${filePath}`,
  });

  return {
    filePath,
    markdown: savedMarkdown,
    versionArchiveMessage: `Obsidian 버전 백업 저장 완료: ${filePath}`,
    lastRun,
  };
}

function parseDraftVersionFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const meta = parseFrontmatterData(text);
  const stat = fs.statSync(filePath);
  const markdown = draftVersionBodyFromNote(text);
  const createdAt = meta.version_saved_at || stat.mtime.toISOString();
  const source = meta.version_source || "Obsidian 백업";
  const fileId = Buffer.from(filePath).toString("base64").replace(/[+/=]/g, "_");

  return {
    id: `obsidian-${fileId}`,
    source,
    createdAt,
    weekStart: meta.week_start || "",
    weekEnd: meta.week_end || "",
    projectId: meta.project_id || "default",
    projectName: meta.project_name || "",
    bookTitle: meta.book_title || "",
    chapterTitle: meta.chapter_title || titleFromMarkdown(markdown) || path.basename(filePath, ".md"),
    draftType: meta.draft_type || "case",
    markdown,
    characterCount: Number(meta.character_count) || characterCount(markdown),
    obsidianFilePath: filePath,
    obsidianArchivedAt: createdAt,
  };
}

function listDraftVersionsFromObsidian(payload) {
  const rawVault = String(payload.vault || "").trim();
  const vault = resolveObsidianVault(rawVault);
  if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
    throw new Error(`Obsidian vault 경로를 찾을 수 없습니다: ${rawVault || vault}`);
  }

  const folder = String(payload.chapterFolder || "Book Drafts").trim();
  const versionDir = path.join(projectOutputDir(vault, folder, payload), "_versions");
  const weekStart = String(payload.weekStart || "").slice(0, 10);
  const weekEnd = String(payload.weekEnd || "").slice(0, 10);
  const chapterTitle = String(payload.chapterTitle || "").trim();
  const projectId = projectIdFromPayload(payload);

  if (!fs.existsSync(versionDir) || !fs.statSync(versionDir).isDirectory()) {
    return {
      versionDir,
      versions: [],
      lastRun: writeRunState({
        action: "list-draft-versions",
        status: "success",
        message: `Obsidian 원고 버전 폴더가 아직 없습니다: ${versionDir}`,
      }),
    };
  }

  const versions = fs
    .readdirSync(versionDir)
    .filter((fileName) => fileName.toLowerCase().endsWith(".md"))
    .map((fileName) => parseDraftVersionFile(path.join(versionDir, fileName)))
    .filter((version) => {
      if (weekStart && version.weekStart !== weekStart) {
        return false;
      }
      if (weekEnd && version.weekEnd !== weekEnd) {
        return false;
      }
      if (chapterTitle && version.chapterTitle !== chapterTitle) {
        return false;
      }
      if (projectId && projectId !== "default" && version.projectId !== projectId) {
        return false;
      }
      return true;
    })
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  const lastRun = writeRunState({
    action: "list-draft-versions",
    status: "success",
    message: `Obsidian 원고 버전 ${versions.length}개를 불러왔습니다: ${versionDir}`,
  });

  return {
    versionDir,
    versions,
    lastRun,
  };
}

function listSavedDraftsFromObsidian(payload) {
  const rawVault = String(payload.vault || "").trim();
  const vault = resolveObsidianVault(rawVault);
  if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
    throw new Error(`Obsidian vault 경로를 찾을 수 없습니다: ${rawVault || vault}`);
  }

  const folder = String(payload.chapterFolder || "Book Drafts").trim();
  const outputDir = projectOutputDir(vault, folder, payload);
  const versionDir = path.join(outputDir, "_versions");
  if (!fs.existsSync(outputDir) || !fs.statSync(outputDir).isDirectory()) {
    return { savedDrafts: [], outputDir };
  }

  const versions = fs.existsSync(versionDir) && fs.statSync(versionDir).isDirectory()
    ? fs
        .readdirSync(versionDir)
        .filter((fileName) => fileName.toLowerCase().endsWith(".md"))
        .map((fileName) => parseDraftVersionFile(path.join(versionDir, fileName)))
    : [];

  const savedDrafts = fs
    .readdirSync(outputDir)
    .filter((fileName) => fileName.toLowerCase().endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(outputDir, fileName);
      const markdown = fs.readFileSync(filePath, "utf8");
      const meta = parseFrontmatterData(markdown);
      const stat = fs.statSync(filePath);
      const title = meta.chapter_title || titleFromMarkdown(markdown) || path.basename(fileName, ".md");
      const kind = meta.book_outline ? "outline" : "draft";
      return {
        id: Buffer.from(filePath).toString("base64").replace(/[+/=]/g, "_"),
        title,
        kind,
        draftType: meta.draft_type || "",
        weekStart: meta.week_start || "",
        weekEnd: meta.week_end || "",
        projectId: meta.project_id || projectIdFromPayload(payload),
        projectName: meta.project_name || payload.projectName || "",
        bookTitle: meta.book_title || payload.bookTitle || "",
        status: meta.status || "",
        updatedAt: stat.mtime.toISOString(),
        filePath,
        markdown,
        characterCount: characterCount(markdownWithoutFrontmatter(markdown)),
        versionCount: versions.filter((version) => version.chapterTitle === title).length,
      };
    })
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));

  const lastRun = writeRunState({
    action: "list-saved-drafts",
    status: "success",
    message: `Obsidian 저장본 ${savedDrafts.length}개를 불러왔습니다: ${outputDir}`,
  });

  return { savedDrafts, outputDir, lastRun };
}

function buildBookOutlineMarkdown(payload) {
  const outline = Array.isArray(payload.outline) ? payload.outline : [];
  const title = String(payload.bookTitle || "책 목차").trim() || "책 목차";
  const bookContext = markdownLine(payload.bookContext);

  const lines = [
    "---",
    "book_outline: true",
    `project_id: ${yamlString(projectIdFromPayload(payload))}`,
    `project_name: ${yamlString(payload.projectName || "")}`,
    `book_title: ${yamlString(payload.bookTitle || "")}`,
    "status: draft",
    "tags:",
    "  - book-outline",
    "---",
    "",
    `# ${title}`,
    "",
    "## 책의 방향",
    "",
    bookContext || "책의 전체 방향을 정리해 주세요.",
    "",
    "## 챕터 목록",
    "",
  ];

  if (!outline.length) {
    lines.push("아직 등록된 챕터가 없습니다.", "");
    return `${lines.join("\n")}\n`;
  }

  outline.forEach((item, index) => {
    const chapterTitle = String(item.title || `챕터 ${index + 1}`).trim();
    const draftType = draftTypeInfo(item.draftType);
    const period = [item.weekStart, item.weekEnd].filter(Boolean).join(" - ") || "기간 미정";
    const status = item.status === "draft" ? "초안 있음" : "브리프";
    lines.push(
      `### ${index + 1}. ${chapterTitle}`,
      "",
      `- 원고 링크: [[${chapterTitle}]]`,
      `- 기간: ${period}`,
      `- 원고 유형: ${draftType.label}`,
      `- 상태: ${status}`,
      `- 본문 글자 수: ${Number(item.characterCount) || 0}자`,
      `- 원고 목표: ${markdownLine(item.chapterGoal) || "미정"}`,
      `- 예상 독자: ${markdownLine(item.targetReader) || markdownLine(payload.targetReader) || "미정"}`,
      `- 톤: ${markdownLine(item.tone) || markdownLine(payload.tone) || "미정"}`,
      "",
    );
  });

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function exportBookOutlineToObsidian(payload) {
  const rawVault = String(payload.vault || "").trim();
  const vault = resolveObsidianVault(rawVault);
  if (!fs.existsSync(vault) || !fs.statSync(vault).isDirectory()) {
    throw new Error(`Obsidian vault 경로를 찾을 수 없습니다: ${rawVault || vault}`);
  }

  const folder = String(payload.chapterFolder || "Book Drafts").trim();
  const outputDir = projectOutputDir(vault, folder, payload);
  fs.mkdirSync(outputDir, { recursive: true });

  const markdown = buildBookOutlineMarkdown(payload);
  const filePath = path.join(outputDir, "00_책 목차.md");
  fs.writeFileSync(filePath, markdown, "utf8");

  const lastRun = writeRunState({
    action: "export-outline",
    status: "success",
    message: `Obsidian에 책 목차를 저장했습니다: ${filePath}`,
  });

  return {
    filePath,
    markdown,
    lastRun,
  };
}

async function exportManuscriptFile(payload) {
  const format = String(payload.format || "docx").toLowerCase();
  if (!["docx", "pdf"].includes(format)) {
    throw new Error("지원하지 않는 내보내기 형식입니다.");
  }

  const sourceMarkdown = markdownWithoutFrontmatter(payload.markdown) || String(payload.markdown || "").trim();
  if (!sourceMarkdown) {
    throw new Error("내보낼 원고 초안을 먼저 작성하거나 생성해 주세요.");
  }

  const title = String(payload.chapterTitle || titleFromMarkdown(sourceMarkdown) || "book-manuscript").trim();
  const template = exportTemplateInfo(payload.exportTemplate);
  const preparedMarkdown = String(payload.preparedMarkdown || "").trim();
  const markdown = preparedMarkdown ? `${preparedMarkdown}\n` : prepareManuscriptMarkdown(sourceMarkdown, payload, title);
  const exportDir = path.join(ROOT, "output", "exports");
  fs.mkdirSync(exportDir, { recursive: true });
  const baseName = `${localTimestampForFile()}_${safeFileName(title)}`;
  const mdPath = path.join(exportDir, `${baseName}.md`);
  const filePath = path.join(exportDir, `${baseName}.${format}`);
  fs.writeFileSync(mdPath, `${markdown.trim()}\n`, "utf8");

  if (format === "docx") {
    await runCommand(PANDOC, [mdPath, "-o", filePath, "--metadata", `title=${title}`]);
    ensureOutputFile(filePath, "DOCX");
  } else {
    let swiftReady = false;
    try {
      await runCommand(SWIFT, ["scripts/markdown_to_pdf.swift", mdPath, filePath, template.id]);
      swiftReady = outputFileReady(filePath);
    } catch (swiftError) {
      swiftReady = false;
    }
    if (!swiftReady) {
      const htmlPath = path.join(exportDir, `${baseName}.html`);
      fs.writeFileSync(htmlPath, manuscriptHtmlDocument(title, markdown, template.id), "utf8");
      await runCommandToFile(CUPSFILTER, ["-m", "application/pdf", htmlPath], filePath);
    }
    ensureOutputFile(filePath, "PDF");
  }

  const lastRun = writeRunState({
    action: "export-manuscript",
    status: "success",
    message: `${format.toUpperCase()} 원고 파일을 만들었습니다(${template.label}): ${filePath}`,
  });

  return {
    filePath,
    markdownPath: mdPath,
    downloadUrl: `/api/export-file?path=${encodeURIComponent(filePath)}`,
    format,
    exportTemplate: template.id,
    exportTemplateLabel: template.label,
    lastRun,
  };
}

async function generateChapterDraft(payload) {
  const weekStart = String(payload.weekStart || "").slice(0, 10);
  const weekEnd = String(payload.weekEnd || "").slice(0, 10);
  const entries = entriesForPayload({ ...payload, weekStart, weekEnd });
  const draftMarkdown = buildChapterMarkdown(entries, payload);
  const expanded = await expandChapterWithLlm(draftMarkdown, entries, payload);
  const lastRun = writeRunState({
    action: "generate-chapter",
    status: "success",
    message: expanded.llmMessage || "원고 초안을 생성했습니다.",
  });

  return {
    entries,
    markdown: expanded.markdown,
    llmStatus: expanded.llmStatus,
    llmMessage: expanded.llmMessage,
    lastRun,
  };
}

function fallbackDraftReview(markdown, entries, payload) {
  const draftType = draftTypeInfo(payload.draftType);
  const body = markdownBodyText(markdown);
  const length = characterCount(body);
  const hasQuestion = /[?？]|질문|왜|어떻게/.test(body);
  const hasScene = /때|순간|회의|프로젝트|사용자|현장|장면|경험|사례/.test(body);
  const hasReader = /독자|사용자|실무자|팀|담당자|작가/.test(body);
  const hasEnding = /마무리|결론|따라서|결국|남긴|질문/.test(body);
  const title = titleFromMarkdown(markdown) || payload.chapterTitle || "제목 없음";

  const messageState = hasQuestion || length >= 800 ? "읽을 중심축이 보입니다." : "핵심 질문이나 메시지를 한 문장 더 선명하게 잡아 주세요.";
  const sceneState = hasScene ? "사례 장면의 단서가 있습니다." : "독자가 떠올릴 수 있는 시간, 장소, 인물, 갈등을 더 넣어 주세요.";
  const readerState = hasReader ? "독자 관점의 단서가 있습니다." : "독자가 이 글을 읽고 무엇을 판단해야 하는지 직접 밝혀 주세요.";
  const endingState = hasEnding ? "마무리 방향이 보입니다." : "마지막에 독자에게 남길 해석이나 다음 질문을 추가해 주세요.";

  return [
    "# 원고 품질 점검",
    "",
    `- 대상 원고: ${title}`,
    "- 점검 방식: 기본 체크리스트",
    `- 원고 유형: ${draftType.label}`,
    `- 본문 분량: ${length}자`,
    `- 원고 재료: ${entries.length}개`,
    "",
    "## 핵심 메시지",
    "",
    `- 상태: ${messageState}`,
    "- 제안: 이 챕터가 답하려는 질문을 제목 아래나 도입부 끝에 한 문장으로 놓아 보세요.",
    "",
    "## 사례 구체성",
    "",
    `- 상태: ${sceneState}`,
    "- 제안: 회의, 대화, 실패, 판단 같은 장면을 하나 골라 독자가 볼 수 있게 써 주세요.",
    "",
    "## 독자 이해도",
    "",
    `- 상태: ${readerState}`,
    "- 제안: 독자가 이 사례를 자기 일에 어떻게 적용할 수 있는지 한 단락으로 연결해 주세요.",
    "",
    "## 마무리",
    "",
    `- 상태: ${endingState}`,
    "- 제안: 글의 끝에는 정답보다 다음 행동이나 다음 질문을 남기는 편이 좋습니다.",
    "",
    "## 보강 질문",
    "",
    "- 이 사례에서 가장 먼저 흔들린 판단은 무엇인가요?",
    "- 독자가 같은 상황을 만났을 때 바로 써볼 수 있는 기준은 무엇인가요?",
    "- 원고에 넣지 말아야 할 과장이나 추측은 무엇인가요?",
    "",
  ].join("\n");
}

async function reviewDraftQuality(payload) {
  const markdown = String(payload.markdown || "").trim();
  if (!markdown) {
    throw new Error("점검할 원고 초안을 먼저 작성하거나 생성해 주세요.");
  }

  const weekStart = String(payload.weekStart || "").slice(0, 10);
  const weekEnd = String(payload.weekEnd || "").slice(0, 10);
  const entries = entriesForPayload({ ...payload, weekStart, weekEnd });
  const draftType = draftTypeInfo(payload.draftType);
  const chapterTemplate = chapterTemplateInfo(payload.chapterTemplate);
  const styleLines = styleGuidePromptLines(payload);

  if (payload.reviewWithLlm === false || !LLM_API_KEY) {
    const review = fallbackDraftReview(markdown, entries, payload);
    const reviewMessage = payload.reviewWithLlm === false
      ? "기본 체크리스트로 원고를 점검했습니다."
      : "LLM 키가 없어 기본 체크리스트로 원고를 점검했습니다.";
    const lastRun = writeRunState({
      action: "review-draft",
      status: "success",
      message: reviewMessage,
    });
    return {
      entries,
      review,
      reviewStatus: "checklist",
      reviewMessage,
      lastRun,
    };
  }

  const systemPrompt = [
    "당신은 출판 원고를 검토하는 한국어 편집자입니다.",
    "원고를 새로 쓰지 말고, 품질 점검과 보강 질문만 제공합니다.",
    "입력에 없는 사실, 인물, 회사명, 수치, 사건은 지어내지 않습니다.",
    "결과는 Markdown으로만 작성합니다.",
  ].join("\n");

  const userPrompt = [
    "아래 원고 초안을 책에 실을 수 있는 챕터/사례 원고 관점에서 점검하세요.",
    "",
    "반드시 다음 섹션으로 답하세요.",
    "# 원고 품질 점검",
    "## 핵심 메시지",
    "## 사례 구체성",
    "## 독자 이해도",
    "## 구조와 흐름",
    "## 바로 고칠 문장 방향",
    "## 보강 질문",
    "",
    "각 섹션은 짧은 bullet 2-4개로 작성하세요.",
    "보강 질문은 사용자가 다음에 입력하면 좋은 질문 3-5개로 작성하세요.",
    "선택된 원고 유형에 맞는 구조와 문체인지 함께 점검하세요.",
    `챕터 템플릿 "${chapterTemplate.label}" 기준도 함께 점검하세요. ${chapterTemplate.direction}`,
    ...(styleLines.length ? ["작가 스타일 가이드를 잘 지키는지도 함께 점검하세요."] : []),
    "",
    `책의 맥락: ${payload.bookContext || "미정"}`,
    `예상 독자: ${payload.targetReader || "미정"}`,
    `이번 원고 목표: ${payload.chapterGoal || "미정"}`,
    `원고 유형: ${draftType.label}`,
    `유형 방향: ${draftType.focus}`,
    `챕터 템플릿: ${chapterTemplate.label}`,
    `템플릿 방향: ${chapterTemplate.direction}`,
    `톤: ${payload.tone || "미정"}`,
    ...(styleLines.length ? ["작가 스타일 가이드:", ...styleLines] : []),
    `원고 재료 수: ${entries.length}`,
    "",
    "원고 초안:",
    markdown,
  ].join("\n");

  const response = await fetch(llmRequestUrl(), {
    method: "POST",
    headers: llmRequestHeaders(),
    body: JSON.stringify({
      model: llmModel(payload),
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_output_tokens: 3500,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || `LLM request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  const review = stripMarkdownFence(extractResponseText(data));
  if (!review) {
    throw new Error("LLM 응답에서 점검 결과를 찾지 못했습니다.");
  }

  const reviewMessage = `AI 편집자로 원고를 점검했습니다. model=${llmModel(payload)}`;
  const lastRun = writeRunState({
    action: "review-draft",
    status: "success",
    message: reviewMessage,
  });

  return {
    entries,
    review: `${review}\n`,
    reviewStatus: "ai",
    reviewMessage,
    lastRun,
  };
}

function removeDraftOnlySections(markdown) {
  const sectionTitles = new Set(["원고 기획 메모", "날짜순 원고 재료", "원고에 반영한 핵심 개념"]);
  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  const kept = [];
  let skipping = false;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      skipping = sectionTitles.has(heading[1]);
      if (skipping) {
        continue;
      }
    }
    if (!skipping) {
      kept.push(line);
    }
  }
  return kept.join("\n");
}

function fallbackPolishDraft(markdown, payload) {
  const placeholderPatterns = [
    /입력된 재료 중 하나를 골라/,
    /아래 날짜순 재료들이 공통으로/,
    /원고의 방향이 달라지는 판단/,
    /날짜순 재료를 그대로 나열하지 말고/,
    /독자가 이 사례나 챕터를 읽고/,
    /이번 원고의 메시지와 다음 원고/,
    /별도 개념 정리가 필요하면/,
  ];

  const prepared = ensureDraftFrontmatter(markdown, payload);
  const cleaned = removeDraftOnlySections(prepared)
    .split(/\r?\n/)
    .filter((line) => !placeholderPatterns.some((pattern) => pattern.test(line)))
    .join("\n")
    .replace(/^## 원고 본문 초안$/gm, "## 본문")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return `${withPublicationReadyStatus(cleaned)}\n`;
}

async function polishDraftForPublication(payload) {
  const markdown = String(payload.markdown || "").trim();
  if (!markdown) {
    throw new Error("정리할 원고 초안을 먼저 작성하거나 생성해 주세요.");
  }

  if (payload.polishWithLlm === false || !LLM_API_KEY) {
    const polished = fallbackPolishDraft(markdown, payload);
    const polishMessage = payload.polishWithLlm === false
      ? "기본 정리 규칙으로 출판용 원고를 정리했습니다."
      : "LLM 키가 없어 기본 정리 규칙으로 출판용 원고를 정리했습니다.";
    const lastRun = writeRunState({
      action: "polish-draft",
      status: "success",
      message: polishMessage,
    });
    return {
      entries: entriesForPayload(payload),
      markdown: polished,
      llmStatus: "polished",
      polishStatus: "rules",
      polishMessage,
      lastRun,
    };
  }

  const draftType = draftTypeInfo(payload.draftType);
  const chapterTemplate = chapterTemplateInfo(payload.chapterTemplate);
  const styleLines = styleGuidePromptLines(payload);
  const systemPrompt = [
    "당신은 책 출판 전 원고를 정리하는 한국어 편집자입니다.",
    "초안의 기획 메모, 작성 지시문, 날짜순 재료 목록처럼 독자에게 보이면 안 되는 부분을 제거합니다.",
    "입력에 없는 사실, 인물, 회사명, 수치, 사건은 지어내지 않습니다.",
    "결과는 Markdown 전체 문서만 반환합니다.",
  ].join("\n");

  const userPrompt = [
    "아래 원고 초안을 출판용 원고 형태로 정리하세요.",
    "",
    "요구사항:",
    "- YAML frontmatter가 있으면 유지하되 status는 publication-ready로 바꾸세요.",
    "- 원고 기획 메모, 날짜순 원고 재료, 작성 지시문, 빈 안내 문장은 제거하세요.",
    "- 본문은 선택된 원고 유형과 문체 기준에 맞게 자연스럽게 이어지도록 정리하세요.",
    "- 초안의 사실 관계를 새로 만들지 말고, 이미 있는 내용만 정돈하세요.",
    `- 원고 유형: ${draftType.label}. ${draftType.focus}`,
    `- 챕터 템플릿: ${chapterTemplate.label}. ${chapterTemplate.direction}`,
    ...(styleLines.length ? ["- 작가 스타일 가이드:", ...styleLines] : []),
    "",
    "원고 초안:",
    markdown,
  ].join("\n");

  const response = await fetch(llmRequestUrl(), {
    method: "POST",
    headers: llmRequestHeaders(),
    body: JSON.stringify({
      model: llmModel(payload),
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_output_tokens: 9000,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error?.message || `LLM request failed with HTTP ${response.status}`;
    throw new Error(message);
  }

  let polished = stripMarkdownFence(extractResponseText(data));
  if (!polished) {
    throw new Error("LLM 응답에서 정리된 원고를 찾지 못했습니다.");
  }
  if (!polished.startsWith("---")) {
    const frontmatter = frontmatterBlock(markdown);
    if (frontmatter) {
      polished = `${frontmatter}\n\n${polished}`;
    }
  }
  polished = withPublicationReadyStatus(polished);

  const polishMessage = `AI 편집자로 출판용 원고를 정리했습니다. model=${llmModel(payload)}`;
  const lastRun = writeRunState({
    action: "polish-draft",
    status: "success",
    message: polishMessage,
  });

  return {
    entries: entriesForPayload(payload),
    markdown: `${polished.trim()}\n`,
    llmStatus: "polished",
    polishStatus: "ai",
    polishMessage,
    lastRun,
  };
}

function addIdea(payload) {
  const entry = ideaEntryFromPayload(payload);
  appendCsvRow(DEFAULT_CSV, entry);

  const lastRun = writeRunState({
    action: "add-idea",
    status: "success",
    message: `아이디어를 등록했습니다: ${entry.term}`,
  });

  return { entry, lastRun };
}

function ideaEntryFromPayload(payload, source = "UI 등록") {
  const registeredAt = String(payload.registeredAt || "").slice(0, 10);
  const title = String(payload.title || "").trim();
  const detail = String(payload.detail || "").trim();

  if (!registeredAt) {
    throw new Error("등록 날짜를 입력해 주세요.");
  }
  if (!title) {
    throw new Error("아이디어 제목을 입력해 주세요.");
  }
  if (!detail) {
    throw new Error("아이디어 내용을 입력해 주세요.");
  }

  return {
    registered_at: registeredAt,
    type: String(payload.type || "idea").trim(),
    term: title,
    description: detail,
    context: String(payload.context || "").trim(),
    source,
    tags: String(payload.tags || "").trim(),
    importance: String(payload.importance || "medium").trim(),
    project_id: projectIdFromPayload(payload),
    project_name: String(payload.projectName || "").trim(),
    book_title: String(payload.bookTitle || "").trim(),
  };
}

function updateIdea(payload) {
  const index = manualEntryIndex(payload.id);
  const rows = readCsvRowObjects(DEFAULT_CSV);
  if (!rows[index]) {
    throw new Error("수정할 재료를 찾지 못했습니다.");
  }

  const updated = ideaEntryFromPayload(payload, rows[index].source || "UI 등록");
  rows[index] = updated;
  writeCsvRows(DEFAULT_CSV, rows);
  const lastRun = writeRunState({
    action: "update-idea",
    status: "success",
    message: `원고 재료를 수정했습니다: ${updated.term}`,
  });

  return {
    entry: { id: `manual-${index}`, sourceFile: "manual", ...updated },
    lastRun,
  };
}

function deleteIdea(payload) {
  const index = manualEntryIndex(payload.id);
  const rows = readCsvRowObjects(DEFAULT_CSV);
  const deleted = rows[index];
  if (!deleted) {
    throw new Error("삭제할 재료를 찾지 못했습니다.");
  }

  rows.splice(index, 1);
  writeCsvRows(DEFAULT_CSV, rows);
  const lastRun = writeRunState({
    action: "delete-idea",
    status: "success",
    message: `원고 재료를 삭제했습니다: ${deleted.term || "제목 없음"}`,
  });

  return { deleted: { id: `manual-${index}`, sourceFile: "manual", ...deleted }, lastRun };
}

function appendPromptOptions(args, options = {}) {
  if (options.weekStart) {
    args.push("--week-start", options.weekStart);
  }
  if (options.weekEnd) {
    args.push("--week-end", options.weekEnd);
  }
  if (options.bookContext) {
    args.push("--book-context", options.bookContext);
  }
  if (options.targetReader) {
    args.push("--target-reader", options.targetReader);
  }
  if (options.chapterGoal) {
    args.push("--chapter-goal", options.chapterGoal);
  }
  if (options.tone) {
    args.push("--tone", options.tone);
  }
  if (options.projectId) {
    args.push("--project-id", projectIdFromPayload(options));
  }
  if (options.projectName) {
    args.push("--project-name", String(options.projectName).trim());
  }
  if (options.bookTitle) {
    args.push("--book-title", String(options.bookTitle).trim());
  }
}

async function buildPrompt(options = {}) {
  const args = ["scripts/build_prompt.py", "--input", relativePath(DEFAULT_CSV)];
  const obsidianCsv = projectObsidianCsvPath(options.projectId);

  if (fs.existsSync(obsidianCsv)) {
    args.push("--input", relativePath(obsidianCsv));
  }

  args.push("--out", relativePath(PROMPT_OUT));
  appendPromptOptions(args, options);

  const result = await runCommand(PYTHON, args);
  const readyMessage = `Ready: ${PROMPT_OUT}`;
  const lastRun = writeRunState({
    action: "build-prompt",
    status: "success",
    stdout: result.stdout,
    stderr: result.stderr,
    message: [result.stdout.trim(), readyMessage].filter(Boolean).join("\n"),
  });
  return {
    ...result,
    prompt: readTextIfExists(PROMPT_OUT),
    promptPath: PROMPT_OUT,
    lastRun,
  };
}

function splitTags(value) {
  if (!value) {
    return [];
  }
  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function importObsidian(payload) {
  const vault = resolveObsidianVault(payload.vault);
  const obsidianCsv = projectObsidianCsvPath(payload.projectId);

  const args = [
    "scripts/import_obsidian.py",
    "--vault",
    vault,
    "--out",
    relativePath(obsidianCsv),
    "--project-id",
    projectIdFromPayload(payload),
  ];

  if (payload.projectName) {
    args.push("--project-name", String(payload.projectName).trim());
  }
  if (payload.bookTitle) {
    args.push("--book-title", String(payload.bookTitle).trim());
  }

  if (payload.folder) {
    args.push("--folder", String(payload.folder).trim());
  }
  if (payload.includeAll) {
    args.push("--include-all");
  }
  for (const tag of splitTags(payload.tags)) {
    args.push("--tag", tag);
  }
  if (payload.weekStart) {
    args.push("--week-start", payload.weekStart);
  }
  if (payload.weekEnd) {
    args.push("--week-end", payload.weekEnd);
  }

  const importResult = await runCommand(PYTHON, args);
  const promptResult = await buildPrompt(payload);
  const lastRun = writeRunState({
    action: "import-obsidian",
    status: "success",
    stdout: [importResult.stdout.trim(), promptResult.stdout.trim()].filter(Boolean).join("\n"),
    stderr: [importResult.stderr.trim(), promptResult.stderr.trim()].filter(Boolean).join("\n"),
    message: [
      importResult.stdout.trim(),
      promptResult.stdout.trim(),
      `Ready: ${PROMPT_OUT}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  return {
    importStdout: importResult.stdout,
    importStderr: importResult.stderr,
    buildStdout: promptResult.stdout,
    buildStderr: promptResult.stderr,
    prompt: promptResult.prompt,
    obsidianCsvPath: obsidianCsv,
    promptPath: PROMPT_OUT,
    obsidianRows: csvRowCount(obsidianCsv),
    manualRows: csvRowCount(DEFAULT_CSV),
    lastRun,
    entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
  };
}

function getStatus(projectId = "default") {
  const obsidianCsv = projectObsidianCsvPath(projectId);
  return {
    root: ROOT,
    manualCsvPath: DEFAULT_CSV,
    obsidianCsvPath: obsidianCsv,
    promptPath: PROMPT_OUT,
    manualRows: csvRowCount(DEFAULT_CSV),
    obsidianRows: csvRowCount(obsidianCsv),
    entries: entriesForRange("", "", projectId).slice(0, 50),
    obsidianConnection: detectObsidianConnection(),
    llmConnection: llmConnectionStatus(),
    hasObsidianCsv: fs.existsSync(obsidianCsv),
    hasPrompt: fs.existsSync(PROMPT_OUT),
    prompt: readTextIfExists(PROMPT_OUT),
    lastRun: readJsonIfExists(RUN_STATE),
  };
}

function serveExportFile(request, requestUrl, response) {
  const requestedPath = requestUrl.searchParams.get("path") || "";
  const exportRoot = path.join(ROOT, "output", "exports");
  const filePath = path.resolve(requestedPath);
  const insideExportRoot = filePath === exportRoot || filePath.startsWith(`${exportRoot}${path.sep}`);
  if (!insideExportRoot || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendJson(response, 404, { ok: false, error: "내보내기 파일을 찾지 못했습니다." });
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = extension === ".pdf"
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  response.writeHead(200, {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(filePath))}`,
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(filePath).pipe(response);
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const rawPath = decodeURIComponent(requestUrl.pathname);
  const safePath = rawPath === "/" ? "/index.html" : rawPath;
  const filePath = path.resolve(PUBLIC_DIR, `.${safePath}`);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(response, 403, "Forbidden");
    return;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    sendText(response, 404, "Not found");
    return;
  }

  const extension = path.extname(filePath);
  response.writeHead(200, {
    "Content-Type": CONTENT_TYPES[extension] || "application/octet-stream",
  });
  fs.createReadStream(filePath).pipe(response);
}

async function handleApi(request, response) {
  try {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && requestUrl.pathname === "/api/status") {
      const weekStart = requestUrl.searchParams.get("weekStart") || "";
      const weekEnd = requestUrl.searchParams.get("weekEnd") || "";
      const projectId = requestUrl.searchParams.get("projectId") || "default";
      sendJson(response, 200, {
        ok: true,
        ...getStatus(projectId),
        entries: entriesForRange(weekStart, weekEnd, projectId),
      });
      return;
    }

    if ((request.method === "GET" || request.method === "HEAD") && requestUrl.pathname === "/api/export-file") {
      serveExportFile(request, requestUrl, response);
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/check-obsidian") {
      const payload = await readJson(request);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...checkObsidianSettings(payload),
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/add-idea") {
      const payload = await readJson(request);
      const result = addIdea(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/update-idea") {
      const payload = await readJson(request);
      const result = updateIdea(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/delete-idea") {
      const payload = await readJson(request);
      const result = deleteIdea(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/build-prompt") {
      const payload = await readJson(request);
      const result = await buildPrompt(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
        lastRun: result.lastRun,
        buildStdout: result.stdout,
        buildStderr: result.stderr,
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/generate-chapter") {
      const payload = await readJson(request);
      const result = await generateChapterDraft(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: result.entries,
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/review-draft") {
      const payload = await readJson(request);
      const result = await reviewDraftQuality(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: result.entries,
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/polish-draft") {
      const payload = await readJson(request);
      const result = await polishDraftForPublication(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: result.entries,
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/import-obsidian") {
      const payload = await readJson(request);
      const result = await importObsidian(payload);
      sendJson(response, 200, { ok: true, ...result });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/export-chapter") {
      const payload = await readJson(request);
      const result = await exportChapterToObsidian(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: result.entries,
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/export-draft-version") {
      const payload = await readJson(request);
      const result = exportDraftVersionToObsidian(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/list-draft-versions") {
      const payload = await readJson(request);
      const result = listDraftVersionsFromObsidian(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/list-saved-drafts") {
      const payload = await readJson(request);
      const result = listSavedDraftsFromObsidian(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/export-outline") {
      const payload = await readJson(request);
      const result = exportBookOutlineToObsidian(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/export-manuscript") {
      const payload = await readJson(request);
      const result = await exportManuscriptFile(payload);
      sendJson(response, 200, {
        ok: true,
        ...getStatus(payload.projectId),
        ...result,
        entries: entriesForRange(payload.weekStart || "", payload.weekEnd || "", payload.projectId),
      });
      return;
    }

    sendJson(response, 404, { ok: false, error: "Unknown API endpoint." });
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: error.message,
      stdout: error.stdout || "",
      stderr: error.stderr || "",
    });
  }
}

const server = http.createServer((request, response) => {
  if (request.url.startsWith("/api/")) {
    handleApi(request, response);
    return;
  }
  serveStatic(request, response);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Book Writing Agent UI: http://127.0.0.1:${PORT}`);
});
