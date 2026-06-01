#!/usr/bin/env python3
"""Run a small project-filter smoke test without touching user data."""

from __future__ import annotations

import csv
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable or "python3"
CSV_FIELDS = [
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
]


def run(args: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=ROOT, check=True, text=True, capture_output=True)


def write_fixture_csv(path: Path) -> None:
    rows = [
        {
            "registered_at": "2026-06-01",
            "type": "case",
            "term": "프로젝트 A 재료",
            "description": "현재 책 프로젝트에 들어가야 하는 재료",
            "context": "A 맥락",
            "source": "smoke",
            "tags": "book-idea",
            "importance": "high",
            "project_id": "project-a",
            "project_name": "프로젝트 A",
            "book_title": "책 A",
        },
        {
            "registered_at": "2026-06-01",
            "type": "case",
            "term": "프로젝트 B 재료",
            "description": "다른 책 프로젝트 재료",
            "context": "B 맥락",
            "source": "smoke",
            "tags": "book-idea",
            "importance": "medium",
            "project_id": "project-b",
            "project_name": "프로젝트 B",
            "book_title": "책 B",
        },
    ]
    with path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def write_obsidian_fixture(vault: Path) -> None:
    ideas = vault / "Ideas"
    ideas.mkdir(parents=True)
    (vault / ".obsidian").mkdir()
    (ideas / "a.md").write_text(
        "\n".join(
            [
                "---",
                "registered_at: 2026-06-02",
                "tags:",
                "  - book-idea",
                "project_id: project-a",
                "---",
                "# Obsidian A",
                "",
                "현재 프로젝트에 연결되는 Obsidian 재료입니다.",
            ]
        ),
        encoding="utf-8",
    )
    (ideas / "b.md").write_text(
        "\n".join(
            [
                "---",
                "registered_at: 2026-06-02",
                "tags:",
                "  - book-idea",
                "project_id: project-b",
                "---",
                "# Obsidian B",
                "",
                "다른 프로젝트 재료입니다.",
            ]
        ),
        encoding="utf-8",
    )
    (ideas / "unassigned.md").write_text(
        "\n".join(
            [
                "---",
                "registered_at: 2026-06-02",
                "tags:",
                "  - book-idea",
                "---",
                "# Obsidian 미지정",
                "",
                "명시 프로젝트가 없으면 현재 프로젝트로 가져옵니다.",
            ]
        ),
        encoding="utf-8",
    )


def assert_contains(text: str, expected: str) -> None:
    if expected not in text:
        raise AssertionError(f"Expected text not found: {expected}")


def assert_not_contains(text: str, unexpected: str) -> None:
    if unexpected in text:
        raise AssertionError(f"Unexpected text found: {unexpected}")


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="book-agent-smoke-") as tmp:
        tmp_dir = Path(tmp)
        fixture_csv = tmp_dir / "materials.csv"
        prompt_out = tmp_dir / "prompt.md"
        write_fixture_csv(fixture_csv)

        run(
            [
                PYTHON,
                "scripts/build_prompt.py",
                "--input",
                str(fixture_csv),
                "--out",
                str(prompt_out),
                "--week-start",
                "2026-06-01",
                "--week-end",
                "2026-06-07",
                "--project-id",
                "project-a",
                "--project-name",
                "프로젝트 A",
                "--book-title",
                "책 A",
            ]
        )
        prompt = prompt_out.read_text(encoding="utf-8")
        assert_contains(prompt, "프로젝트 A 재료")
        assert_not_contains(prompt, "프로젝트 B 재료")

        vault = tmp_dir / "vault"
        write_obsidian_fixture(vault)
        obsidian_out = tmp_dir / "obsidian.csv"
        run(
            [
                PYTHON,
                "scripts/import_obsidian.py",
                "--vault",
                str(vault),
                "--folder",
                "Ideas",
                "--out",
                str(obsidian_out),
                "--tag",
                "book-idea",
                "--project-id",
                "project-a",
                "--project-name",
                "프로젝트 A",
                "--book-title",
                "책 A",
            ]
        )
        imported = obsidian_out.read_text(encoding="utf-8")
        assert_contains(imported, "Obsidian A")
        assert_contains(imported, "Obsidian 미지정")
        assert_not_contains(imported, "Obsidian B")

    print("Smoke test passed: project filtering and Obsidian import are scoped.")


if __name__ == "__main__":
    main()
