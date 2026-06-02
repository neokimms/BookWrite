#!/usr/bin/env node
"use strict";

const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 4183;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function assertIncludes(text, expected) {
  assert(text.includes(expected), `Expected UI to include: ${expected}`);
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("UI server did not start in time.")), 8000);
    child.stdout.on("data", (chunk) => {
      if (chunk.toString().includes(BASE_URL)) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`UI server exited with ${code}`));
      }
    });
  });
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  assert(response.ok && data.ok, data.error || `Request failed: ${url}`);
  return data;
}

async function main() {
  const html = fs.readFileSync(path.join(ROOT, "ui", "public", "index.html"), "utf8");
  for (const marker of [
    "data-view-tab=\"projects\"",
    "id=\"projectSearch\"",
    "id=\"duplicateProjectButton\"",
    "id=\"deleteProjectButton\"",
    "id=\"chapterTemplate\"",
    "id=\"preflightChecklist\"",
    "class=\"draft-workflow-actions\"",
    "id=\"previewExportButton\"",
    "id=\"exportResult\"",
    "id=\"testObsidianButton\"",
    "id=\"retryLastButton\"",
  ]) {
    assertIncludes(html, marker);
  }

  const child = spawn(process.execPath, ["ui/server.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  try {
    await waitForServer(child);
    const page = await fetch(BASE_URL).then((response) => response.text());
    assertIncludes(page, "책 프로젝트");
    assertIncludes(page, "원고 작성");

    const status = await jsonFetch(`${BASE_URL}/api/status?projectId=default`);
    assert(Array.isArray(status.entries), "status.entries should be an array");
    assert(status.llmConnection, "status should include llmConnection");
    assert(status.obsidianConnection, "status should include obsidianConnection");

    const obsidian = await jsonFetch(`${BASE_URL}/api/check-obsidian`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: "default",
        projectName: "UI Smoke",
        chapterTitle: "테스트 챕터",
        vault: "examples/obsidian-vault",
        folder: "Weekly Terms",
        chapterFolder: "Book Drafts",
      }),
    });
    assert(obsidian.vaultExists, "example vault path should exist");
    assert(obsidian.savePreview.includes("테스트 챕터.md"), "save preview should include chapter file name");
  } finally {
    child.kill("SIGTERM");
  }

  console.log("UI smoke test passed: workspace controls and local APIs are reachable.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
