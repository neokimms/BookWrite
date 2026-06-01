#!/usr/bin/env python3
"""Build a book-draft writing prompt from a CSV idea log."""

from __future__ import annotations

import argparse
import csv
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path


@dataclass
class Entry:
    registered_at: date
    item_type: str
    term: str
    description: str
    context: str
    source: str
    tags: str
    importance: str
    project_id: str
    project_name: str
    book_title: str


def parse_date(value: str) -> date:
    value = value.strip()
    if not value:
        raise ValueError("registered_at is empty")
    if "T" in value:
        return datetime.fromisoformat(value).date()
    return date.fromisoformat(value)


def read_entries(path: Path) -> list[Entry]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)
        required = {"registered_at", "type", "term", "description"}
        missing = required - set(reader.fieldnames or [])
        if missing:
            raise ValueError(f"Missing required columns: {', '.join(sorted(missing))}")

        entries: list[Entry] = []
        for row_number, row in enumerate(reader, start=2):
            try:
                entries.append(
                    Entry(
                        registered_at=parse_date(row.get("registered_at", "")),
                        item_type=(row.get("type") or "").strip(),
                        term=(row.get("term") or "").strip(),
                        description=(row.get("description") or "").strip(),
                        context=(row.get("context") or "").strip(),
                        source=(row.get("source") or "").strip(),
                        tags=(row.get("tags") or "").strip(),
                        importance=(row.get("importance") or "").strip(),
                        project_id=(row.get("project_id") or "default").strip() or "default",
                        project_name=(row.get("project_name") or "").strip(),
                        book_title=(row.get("book_title") or "").strip(),
                    )
                )
            except ValueError as error:
                raise ValueError(f"Row {row_number}: {error}") from error
    return entries


def read_entry_files(paths: list[Path]) -> list[Entry]:
    entries: list[Entry] = []
    for path in paths:
        entries.extend(read_entries(path))
    return entries


def dedupe_entries(entries: list[Entry]) -> list[Entry]:
    seen: set[tuple[str, str, str, str]] = set()
    deduped: list[Entry] = []
    for entry in entries:
        key = (
            entry.registered_at.isoformat(),
            entry.item_type,
            entry.term,
            entry.description,
        )
        if key in seen:
            continue
        seen.add(key)
        deduped.append(entry)
    return deduped


def filter_entries(
    entries: list[Entry],
    week_start: date,
    week_end: date,
    project_id: str,
) -> list[Entry]:
    current_project_id = (project_id or "default").strip() or "default"
    return [
        entry
        for entry in entries
        if week_start <= entry.registered_at <= week_end
        and (entry.project_id or "default") == current_project_id
    ]


def format_entries(entries: list[Entry]) -> str:
    if not entries:
        return "원고 재료가 없습니다."

    lines: list[str] = []
    for index, entry in enumerate(entries, start=1):
        lines.append(
            "\n".join(
                [
                    f"{index}. [{entry.item_type}] {entry.term}",
                    f"   - 등록일: {entry.registered_at.isoformat()}",
                    f"   - 설명: {entry.description or '없음'}",
                    f"   - 맥락: {entry.context or '없음'}",
                    f"   - 출처: {entry.source or '없음'}",
                    f"   - 태그: {entry.tags or '없음'}",
                    f"   - 중요도: {entry.importance or '없음'}",
                ]
            )
        )
    return "\n\n".join(lines)


def build_prompt(
    entries: list[Entry],
    week_start: date,
    week_end: date,
    book_context: str,
    target_reader: str,
    chapter_goal: str,
    tone: str,
    project_name: str,
    book_title: str,
) -> str:
    return f"""# 책 원고 작성 요청

당신은 사용자의 아이디어를 책 원고로 확장하는 작가 에이전트입니다. 아래 기간 동안 등록된 아이디어, 경험, 사례, 예시, 개념, 메모를 바탕으로 하나의 챕터 또는 사례 원고를 작성하세요.

## 기간

{week_start.isoformat()}부터 {week_end.isoformat()}까지

## 책의 맥락

{book_context}

## 책 프로젝트

- 프로젝트: {project_name or '미정'}
- 책 제목: {book_title or '미정'}

## 예상 독자

{target_reader}

## 이번 원고의 목표

{chapter_goal}

## 원하는 톤

{tone}

## 원고 재료

{format_entries(entries)}

## 작성 지시

1. 입력 재료를 날짜순으로 검토하고 중심 장면 또는 중심 질문을 하나 선택하세요.
2. 전체 책 한 권을 쓰려 하지 말고, 하나의 챕터 또는 하나의 사례/예시 원고로 완성하세요.
3. 입력 재료는 목록처럼 나열하지 말고, 도입 장면과 본문 흐름 안에서 자연스럽게 사용하세요.
4. 입력에 없는 실제 회사명, 인물, 수치, 사건을 지어내지 마세요.
5. 보강이 필요한 내용은 `보강 후보`로 남기세요.
6. 한국어로 작성하세요.

## 출력 형식

```text
원고 기획 메모
- 중심 장면:
- 핵심 메시지:
- 반드시 살릴 재료:
- 보류할 재료:

# 원고 제목

본문

## 날짜순 원고 재료
- 날짜: 재료 요약

## 보강 후보
- 더 있으면 좋은 자료나 질문
```
"""


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build a book-draft writing prompt from a CSV idea log."
    )
    parser.add_argument(
        "--input",
        action="append",
        default=None,
        help="CSV input path. Repeat this option to combine multiple files.",
    )
    parser.add_argument("--out", default="output/book-draft-prompt.md", help="Prompt output path")
    parser.add_argument("--week-start", help="Start date, inclusive, in YYYY-MM-DD")
    parser.add_argument("--week-end", help="End date, inclusive, in YYYY-MM-DD")
    parser.add_argument(
        "--book-context",
        default="사용자가 입력한 아이디어, 경험, 사례, 예시를 책에 넣을 수 있는 원고로 확장한다.",
    )
    parser.add_argument(
        "--target-reader",
        default="개념을 처음 접하지만 실무나 글쓰기에 적용하고 싶은 독자",
    )
    parser.add_argument(
        "--chapter-goal",
        default="입력된 내용을 하나의 챕터 또는 사례 원고로 확장한다.",
    )
    parser.add_argument(
        "--tone",
        default="책 원고처럼 자연스럽고 단정하게. 사례는 구체적으로, 설명은 간결하게.",
    )
    parser.add_argument("--project-id", default="default", help="Book project id to filter entries")
    parser.add_argument("--project-name", default="", help="Book project name")
    parser.add_argument("--book-title", default="", help="Book title")
    args = parser.parse_args()

    today = date.today()
    week_end = parse_date(args.week_end) if args.week_end else today
    week_start = parse_date(args.week_start) if args.week_start else week_end - timedelta(days=6)

    input_paths = [Path(path) for path in (args.input or ["data/weekly_terms.csv"])]
    entries = filter_entries(
        dedupe_entries(read_entry_files(input_paths)),
        week_start,
        week_end,
        args.project_id,
    )
    prompt = build_prompt(
        entries=entries,
        week_start=week_start,
        week_end=week_end,
        book_context=args.book_context,
        target_reader=args.target_reader,
        chapter_goal=args.chapter_goal,
        tone=args.tone,
        project_name=args.project_name,
        book_title=args.book_title,
    )

    output_path = Path(args.out)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(prompt, encoding="utf-8")
    print(f"Wrote {output_path} with {len(entries)} entries.")


if __name__ == "__main__":
    main()
