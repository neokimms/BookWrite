#!/usr/bin/env node
"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = 4185;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    let stderr = "";
    const timeout = setTimeout(() => reject(new Error(`Operational rehearsal server did not start.\n${stderr}`)), 12000);
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
        reject(new Error(`Operational rehearsal server exited with ${code}.\n${stderr}`));
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

function assertFile(filePath, label, contains = "") {
  assert(fs.existsSync(filePath), `${label} should exist: ${filePath}`);
  const text = fs.readFileSync(filePath, "utf8");
  assert(text.trim(), `${label} should not be empty`);
  if (contains) {
    assert(text.includes(contains), `${label} should include ${contains}`);
  }
  return text;
}

async function main() {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "bookwrite-ops-"));
  const dataDir = path.join(sandbox, "data");
  const outputDir = path.join(sandbox, "output");
  const vault = path.join(sandbox, "vault");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(vault, ".obsidian"), { recursive: true });
  fs.mkdirSync(path.join(vault, "Ideas"), { recursive: true });

  const child = spawn(process.execPath, ["ui/server.js"], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      BOOKWRITE_DATA_DIR: dataDir,
      BOOKWRITE_OUTPUT_DIR: outputDir,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const basePayload = {
    projectId: "ops-rehearsal",
    projectName: "운영 리허설",
    bookTitle: "운영 검증용 책",
    weekStart: "2026-06-01",
    weekEnd: "2026-06-07",
    chapterTitle: "회의가 남긴 서로 다른 그림",
    draftType: "case",
    chapterTemplate: "scene",
    exportTemplate: "manuscript",
    exportOptions: {
      chapterNumber: "2",
      includeCover: true,
      includeToc: true,
    },
    vault,
    folder: "Ideas",
    chapterFolder: "Book Drafts",
    tags: "book-idea",
    bookContext: "업무 경험을 책에 들어갈 수 있는 사례 원고로 확장한다.",
    targetReader: "프로젝트 경험을 글로 정리하려는 실무자",
    chapterGoal: "한 회의 장면을 통해 요구사항 합의의 기준을 설명한다.",
    tone: "단정하고 구체적인 책 원고",
    expandWithLlm: false,
  };

  try {
    await waitForServer(child);

    const idea = await postJson("/api/add-idea", {
      ...basePayload,
      registeredAt: "2026-06-02",
      type: "case",
      title: "회의가 끝났는데 서로 다른 결과물을 떠올린 날",
      detail:
        "요구사항 회의가 끝난 뒤 모두가 합의했다고 생각했지만, 회의록을 펼치자 기획자는 화면 흐름을, 개발자는 데이터 구조를, 현업 담당자는 기존 엑셀 양식을 떠올리고 있었다. 같은 단어를 썼지만 서로 다른 장면을 보고 있었고, 그 뒤부터 기능명을 정하기 전에 사용자가 실제로 판단하는 장면을 먼저 적기 시작했다.",
      context: "SI 프로젝트 요구사항 합의 경험",
      tags: "book-idea, 요구사항, 사례",
      importance: "high",
    });
    assert.strictEqual(idea.entries.length, 1, "one material should be registered");

    const includedEntryIds = [idea.entries[0].id];
    const draft = await postJson("/api/generate-chapter", {
      ...basePayload,
      includedEntryIds,
    });
    assert(draft.markdown.includes("날짜순 원고 재료"), "draft should include ordered source materials");

    const review = await postJson("/api/review-draft", {
      ...basePayload,
      includedEntryIds,
      markdown: draft.markdown,
      reviewWithLlm: false,
    });
    assert(review.review.includes("원고 품질 점검"), "review should be generated");

    const polished = await postJson("/api/polish-draft", {
      ...basePayload,
      includedEntryIds,
      markdown: draft.markdown,
      polishWithLlm: false,
    });
    assert(polished.markdown.includes("publication-ready"), "polished draft should be publication-ready");
    assert(!polished.markdown.includes("입력된 재료 중 하나를 골라"), "polished draft should remove writing instructions");
    const finalMarkdown = [
      polished.markdown.trim(),
      "",
      "## 운영 리허설 보강 문단",
      "",
      "이 장면에서 중요한 것은 합의라는 말이 실제로는 서로 다른 기대를 덮고 있을 수 있다는 점이다. 회의가 끝난 직후에는 모두 같은 결론에 도달한 것처럼 보였지만, 각자가 떠올린 결과물은 달랐다. 그래서 기능명이나 산출물 이름을 먼저 확정하기보다 사용자가 실제로 어떤 순서로 판단하고 행동하는지 한 장면으로 적어야 했다. 이 기준은 원고를 쓸 때도 유용하다. 추상적인 개념을 바로 설명하기보다 한 사람이 겪은 장면을 먼저 놓으면 독자는 문제를 더 선명하게 이해한다.",
      "",
      "운영 리허설에서는 이 원고가 저장, 버전 관리, 목차 연결, 파일 내보내기까지 이어질 만큼 충분한 본문을 갖추었는지도 함께 본다. 짧은 메모가 바로 출판 원고가 되는 것은 아니지만, 핵심 장면과 판단 기준이 남아 있으면 다음 편집 단계로 이동할 수 있다. 따라서 이 테스트는 단순히 버튼이 눌리는지를 확인하는 데서 끝나지 않고, 사용자가 실제로 책의 한 절에 넣을 수 있는 원고 조각을 확보했는지까지 확인한다.",
      "",
    ].join("\n");

    const saved = await postJson("/api/export-chapter", {
      ...basePayload,
      includedEntryIds,
      markdown: finalMarkdown,
    });
    assertFile(saved.filePath, "Obsidian chapter note", "회의가 남긴 서로 다른 그림");

    const outline = await postJson("/api/export-outline", {
      ...basePayload,
      outline: [
        {
          id: "ops-outline-1",
          title: basePayload.chapterTitle,
          weekStart: basePayload.weekStart,
          weekEnd: basePayload.weekEnd,
          draftType: basePayload.draftType,
          status: "draft",
          characterCount: finalMarkdown.length,
          chapterGoal: basePayload.chapterGoal,
          targetReader: basePayload.targetReader,
          tone: basePayload.tone,
        },
      ],
    });
    assertFile(outline.filePath, "Obsidian book outline", "[[회의가 남긴 서로 다른 그림]]");

    const ops = await postJson("/api/operational-check", {
      ...basePayload,
      includedEntryIds,
      markdown: finalMarkdown,
    });
    assert(ops.checks.some((check) => check.label === "Obsidian 연결" && check.status === "ok"), "ops check should confirm Obsidian");
    assert(ops.checks.some((check) => check.label === "원고 초안" && check.status === "ok"), "ops check should confirm draft readiness");

    const preparedMarkdown = [
      "# 운영 검증용 책",
      "",
      "## 제 2장. 회의가 남긴 서로 다른 그림",
      "",
      "## 목차",
      "",
      "- 도입 장면",
      "- 마무리",
      "",
      finalMarkdown,
    ].join("\n");

    const docx = await postJson("/api/export-manuscript", {
      ...basePayload,
      markdown: finalMarkdown,
      preparedMarkdown,
      format: "docx",
    });
    assert(fs.existsSync(docx.filePath), "DOCX should be generated");
    assert(fs.statSync(docx.filePath).size > 0, "DOCX should not be empty");

    const pdf = await postJson("/api/export-manuscript", {
      ...basePayload,
      markdown: finalMarkdown,
      preparedMarkdown,
      format: "pdf",
    });
    assert(fs.existsSync(pdf.filePath), "PDF should be generated");
    assert(fs.readFileSync(pdf.filePath).subarray(0, 4).toString("utf8") === "%PDF", "PDF should be a PDF file");
  } finally {
    child.kill("SIGTERM");
    fs.rmSync(sandbox, { recursive: true, force: true });
  }

  console.log("Operational rehearsal passed: material registration through Obsidian save and PDF/DOCX export works in an isolated sandbox.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
