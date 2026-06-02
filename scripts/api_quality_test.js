#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = 4184;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timeout = setTimeout(() => reject(new Error(`API server did not start in time.\n${stderr}`)), 12000);
    child.stdout.on("data", (chunk) => {
      if (chunk.toString().includes(BASE_URL)) {
        clearTimeout(timeout);
        resolve();
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`API server exited with ${code}.\n${stderr}`));
      }
    });
  });
}

async function postJson(urlPath, payload) {
  const response = await fetch(`${BASE_URL}${urlPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  assert(response.ok && data.ok, data.error || `Request failed: ${urlPath}`);
  return data;
}

async function assertDownload(downloadUrl) {
  assert(downloadUrl, "export should return a download URL");
  const response = await fetch(`${BASE_URL}${downloadUrl}`, { method: "HEAD" });
  assert(response.ok, `download URL should be reachable: ${downloadUrl}`);
}

function assertFile(filePath, label, magic) {
  assert(fs.existsSync(filePath), `${label} file should exist: ${filePath}`);
  const stat = fs.statSync(filePath);
  assert(stat.size > 0, `${label} file should not be empty`);
  if (magic) {
    const head = fs.readFileSync(filePath).subarray(0, magic.length).toString("utf8");
    assert.strictEqual(head, magic, `${label} should start with ${magic}`);
  }
}

async function main() {
  const vault = fs.mkdtempSync(path.join(os.tmpdir(), "bookwrite-api-qa-vault-"));
  fs.mkdirSync(path.join(vault, ".obsidian"));
  fs.mkdirSync(path.join(vault, "Ideas"));

  const child = spawn(process.execPath, ["ui/server.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const payload = {
    projectId: "api-quality-project",
    projectName: "API 품질 검증",
    bookTitle: "검증용 책",
    weekStart: "2026-06-01",
    weekEnd: "2026-06-07",
    chapterTitle: "저장과 내보내기 검증",
    draftType: "case",
    chapterTemplate: "scene",
    exportTemplate: "compact",
    exportOptions: {
      chapterNumber: "1",
      includeCover: true,
      includeToc: true,
    },
    vault,
    folder: "Ideas",
    chapterFolder: "Book Drafts",
    bookContext: "사용자의 사례를 책에 들어갈 수 있는 원고로 정리한다.",
    targetReader: "업무 경험을 글로 확장하려는 작가",
    chapterGoal: "저장과 내보내기 흐름을 검증한다.",
    tone: "단정하고 구체적인 책 원고",
    expandWithLlm: false,
    markdown: [
      "# 저장과 내보내기 검증",
      "",
      "## 도입",
      "",
      "사용자가 짧은 원고 재료를 적은 뒤 초안을 만들고, 점검하고, 저장하고, 파일로 내보내는 흐름을 검증한다.",
      "",
      "## 본문",
      "",
      "중요한 기준은 사용자가 어느 버튼을 눌러야 하는지 바로 알 수 있고, 저장 위치와 결과 파일을 화면에서 확인할 수 있는지다.",
      "",
      "## 마무리",
      "",
      "검증은 실제 파일 생성까지 이어져야 한다.",
    ].join("\n"),
  };

  try {
    await waitForServer(child);

    const obsidian = await postJson("/api/check-obsidian", payload);
    assert(obsidian.connected, "temporary vault should be connected");
    assert(obsidian.savePreview.includes("저장과 내보내기 검증.md"), "save preview should include the chapter note");

    const saved = await postJson("/api/export-chapter", payload);
    assertFile(saved.filePath, "Obsidian chapter note");
    assert(saved.filePath.startsWith(vault), "chapter note should be written inside the temporary vault");

    const version = await postJson("/api/export-draft-version", {
      ...payload,
      versionId: "qa-version-1",
      versionSource: "API QA",
      versionCreatedAt: "2026-06-02T00:00:00.000Z",
    });
    assertFile(version.filePath, "Obsidian draft version");

    const versions = await postJson("/api/list-draft-versions", payload);
    assert(versions.versions.length >= 1, "draft version list should include the saved version");

    const savedDrafts = await postJson("/api/list-saved-drafts", payload);
    assert(savedDrafts.savedDrafts.length >= 1, "saved draft list should include the chapter note");

    const review = await postJson("/api/review-draft", { ...payload, reviewWithLlm: false });
    assert(review.review.includes("원고 품질 점검"), "fallback review should be returned");

    const polished = await postJson("/api/polish-draft", { ...payload, polishWithLlm: false });
    assert(polished.markdown.includes("publication-ready"), "polished draft should be marked publication-ready");

    const preparedMarkdown = [
      "# 검증용 책",
      "",
      "## 제 1장. 저장과 내보내기 검증",
      "",
      "## 목차",
      "",
      "- 도입",
      "- 본문",
      "- 마무리",
      "",
      payload.markdown,
    ].join("\n");

    const docx = await postJson("/api/export-manuscript", {
      ...payload,
      preparedMarkdown,
      format: "docx",
    });
    assertFile(docx.filePath, "DOCX", "PK");
    assertFile(docx.markdownPath, "DOCX source Markdown");
    await assertDownload(docx.downloadUrl);

    const pdf = await postJson("/api/export-manuscript", {
      ...payload,
      preparedMarkdown,
      format: "pdf",
    });
    assertFile(pdf.filePath, "PDF", "%PDF");
    assertFile(pdf.markdownPath, "PDF source Markdown");
    await assertDownload(pdf.downloadUrl);
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(vault, { recursive: true, force: true });
  }

  console.log("API quality test passed: Obsidian save, versions, review, polish, DOCX, and PDF flows work.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
