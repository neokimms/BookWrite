#!/usr/bin/env python3
"""Import marked Obsidian Markdown notes into the weekly term CSV format."""

from __future__ import annotations

import argparse
import csv
import re
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import Iterable, Optional


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

SKIP_DIRS = {".git", ".obsidian", ".trash", "node_modules"}

FIELD_ALIASES = {
    "registered_at": [
        "registered_at",
        "registered",
        "created",
        "date",
        "등록일",
        "날짜",
    ],
    "type": ["type", "kind", "category", "유형", "종류"],
    "term": ["term", "title", "name", "word", "용어", "단어", "제목"],
    "description": ["description", "desc", "definition", "summary", "설명", "정의", "요약"],
    "context": ["context", "use_case", "usage", "note", "맥락", "문맥", "활용", "메모"],
    "source": ["source", "reference", "url", "출처", "참고"],
    "tags": ["tags", "tag", "태그"],
    "importance": ["importance", "priority", "weight", "중요도", "우선순위"],
    "project_id": ["project_id", "project", "book_project_id", "프로젝트_id", "프로젝트"],
    "project_name": ["project_name", "book_project", "프로젝트명", "책프로젝트"],
    "book_title": ["book_title", "book", "책제목", "책_제목"],
    "include": [
        "book_idea",
        "book_draft",
        "writing_agent",
        "chapter_draft",
        "weekly_chapter",
        "weekly_term",
        "chapter_agent",
        "include_in_weekly_chapter",
        "등록항목",
        "주간챕터",
    ],
}

DESCRIPTION_HEADINGS = {"description", "definition", "summary", "설명", "정의", "요약"}
CONTEXT_HEADINGS = {"context", "usecase", "usage", "활용", "맥락", "문맥", "사용맥락"}
TRUE_VALUES = {"1", "true", "yes", "y", "on", "include", "included", "예", "네", "포함"}


@dataclass
class ObsidianEntry:
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


@dataclass
class ParsedNote:
    path: Path
    relative_path: str
    body: str
    pairs: list[tuple[str, object]]
    body_tags: list[str]


def normalize_key(value: str) -> str:
    return re.sub(r"[\s\-]+", "_", value.strip().lower())


def normalize_heading(value: str) -> str:
    return re.sub(r"[\s_\-]+", "", value.strip().lower())


def strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1].strip()
    return value


def parse_scalar(value: str) -> object:
    value = strip_quotes(value.strip())
    if value.startswith("[") and value.endswith("]"):
        inner = value[1:-1].strip()
        if not inner:
            return []
        return [strip_quotes(item) for item in next(csv.reader([inner], skipinitialspace=True))]
    return value


def parse_frontmatter_pairs(block: str) -> list[tuple[str, object]]:
    pairs: list[tuple[str, object]] = []
    lines = block.splitlines()
    index = 0

    while index < len(lines):
        line = lines[index]
        if not line.strip() or line.lstrip().startswith("#") or line[:1].isspace():
            index += 1
            continue
        if ":" not in line:
            index += 1
            continue

        key, raw_value = line.split(":", 1)
        key = key.strip()
        raw_value = raw_value.strip()

        if raw_value in {"|", ">"}:
            folded = raw_value == ">"
            block_lines: list[str] = []
            index += 1
            while index < len(lines) and (lines[index][:1].isspace() or not lines[index].strip()):
                block_lines.append(lines[index].strip())
                index += 1
            separator = " " if folded else "\n"
            pairs.append((key, separator.join(block_lines).strip()))
            continue

        if raw_value == "":
            items: list[str] = []
            next_index = index + 1
            while next_index < len(lines):
                next_line = lines[next_index]
                if not next_line.strip():
                    next_index += 1
                    continue
                if not next_line[:1].isspace() and ":" in next_line:
                    break
                match = re.match(r"^\s*-\s+(.*)$", next_line)
                if match:
                    items.append(str(parse_scalar(match.group(1))))
                next_index += 1
            if items:
                pairs.append((key, items))
                index = next_index
                continue

        pairs.append((key, parse_scalar(raw_value)))
        index += 1

    return pairs


def split_frontmatter(text: str) -> tuple[list[tuple[str, object]], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return [], text

    for index in range(1, len(lines)):
        if lines[index].strip() in {"---", "..."}:
            block = "\n".join(lines[1:index])
            body = "\n".join(lines[index + 1 :])
            return parse_frontmatter_pairs(block), body

    return [], text


def parse_inline_pairs(body: str) -> list[tuple[str, object]]:
    pairs: list[tuple[str, object]] = []
    for line in body.splitlines():
        match = re.match(r"^\s*(?:[-*+]\s*)?([^:\n]{1,80})::\s*(.+?)\s*$", line)
        if match:
            pairs.append((match.group(1).strip(), parse_scalar(match.group(2))))
    return pairs


def extract_body_tags(body: str) -> list[str]:
    tags = re.findall(r"(?<![\w/])#([A-Za-z0-9_\-/가-힣]+)", body)
    return [tag.strip("/") for tag in tags if tag.strip("/")]


def stringify(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return ", ".join(str(item).strip() for item in value if str(item).strip())
    return str(value).strip()


def split_tags(value: object) -> list[str]:
    if value is None:
        return []
    if isinstance(value, list):
        raw_items = value
    else:
        raw_items = re.split(r"[,;\s]+", str(value))
    tags: list[str] = []
    for item in raw_items:
        tag = str(item).strip().lstrip("#").strip("/")
        if tag:
            tags.append(tag)
    return tags


def pick_field(pairs: list[tuple[str, object]], canonical: str) -> str:
    aliases = {normalize_key(alias) for alias in FIELD_ALIASES[canonical]}
    for alias in FIELD_ALIASES[canonical]:
        normalized_alias = normalize_key(alias)
        for key, value in reversed(pairs):
            if normalize_key(key) == normalized_alias:
                return stringify(value)
    for key, value in reversed(pairs):
        if normalize_key(key) in aliases:
            return stringify(value)
    return ""


def collect_tags(pairs: list[tuple[str, object]], body_tags: Iterable[str]) -> list[str]:
    tags: list[str] = []
    tag_aliases = {normalize_key(alias) for alias in FIELD_ALIASES["tags"]}
    for key, value in pairs:
        if normalize_key(key) in tag_aliases:
            tags.extend(split_tags(value))
    tags.extend(body_tags)

    deduped: list[str] = []
    seen: set[str] = set()
    for tag in tags:
        normalized = tag.strip().lstrip("#").strip("/")
        key = normalized.lower()
        if normalized and key not in seen:
            seen.add(key)
            deduped.append(normalized)
    return deduped


def parse_date_value(value: str, fallback: date) -> date:
    value = value.strip()
    if not value:
        return fallback

    normalized = value.replace("/", "-").replace(".", "-")
    korean_match = re.search(r"(\d{4})\s*년\s*(\d{1,2})\s*월\s*(\d{1,2})\s*일", value)
    if korean_match:
        year, month, day = (int(part) for part in korean_match.groups())
        return date(year, month, day)

    iso_match = re.search(r"\d{4}-\d{1,2}-\d{1,2}", normalized)
    if iso_match:
        year, month, day = (int(part) for part in iso_match.group(0).split("-"))
        return date(year, month, day)

    try:
        return datetime.fromisoformat(value).date()
    except ValueError as error:
        raise ValueError(f"Unsupported date value: {value}") from error


def clean_markdown(value: str) -> str:
    value = re.sub(r"`([^`]+)`", r"\1", value)
    value = re.sub(r"\[\[([^|\]]+)\|([^\]]+)\]\]", r"\2", value)
    value = re.sub(r"\[\[([^\]]+)\]\]", r"\1", value)
    value = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", value)
    value = re.sub(r"[*_~]", "", value)
    return re.sub(r"\s+", " ", value).strip()


def first_heading(body: str) -> str:
    for line in body.splitlines():
        match = re.match(r"^#\s+(.+)$", line.strip())
        if match:
            return clean_markdown(match.group(1))
    return ""


def extract_section(body: str, heading_names: set[str]) -> str:
    collecting = False
    collected: list[str] = []

    for line in body.splitlines():
        heading = re.match(r"^#{1,6}\s+(.+)$", line.strip())
        if heading:
            heading_text = normalize_heading(heading.group(1))
            if collecting:
                break
            collecting = heading_text in heading_names
            continue
        if collecting:
            collected.append(line)

    return clean_markdown("\n".join(collected).strip())


def first_paragraph(body: str) -> str:
    paragraphs: list[str] = []
    current: list[str] = []
    in_code = False

    for line in body.splitlines():
        stripped = line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if not stripped:
            if current:
                paragraphs.append(" ".join(current))
                current = []
            continue
        if stripped.startswith("#") or "::" in stripped:
            continue
        if re.fullmatch(r"(#[A-Za-z0-9_\-/가-힣]+\s*)+", stripped):
            continue
        current.append(stripped)

    if current:
        paragraphs.append(" ".join(current))

    return clean_markdown(paragraphs[0]) if paragraphs else ""


def infer_type(tags: list[str], term: str, description: str) -> str:
    normalized_tags = {tag.lower().replace("_", "-") for tag in tags}
    if {"technical-term", "tech-term", "기술용어"} & normalized_tags:
        return "technical_term"
    if {"word", "단어"} & normalized_tags:
        return "word"
    if {"description", "설명"} & normalized_tags:
        return "description"
    if term and description:
        return "technical_term"
    return "memo"


def truthy(value: str) -> bool:
    return value.strip().lower() in TRUE_VALUES


def tag_matches(tags: list[str], filters: list[str]) -> bool:
    normalized_tags = [tag.lower().lstrip("#").strip("/") for tag in tags]
    normalized_filters = [tag.lower().lstrip("#").strip("/") for tag in filters]
    for tag in normalized_tags:
        for tag_filter in normalized_filters:
            if tag == tag_filter or tag.startswith(f"{tag_filter}/"):
                return True
    return False


def should_import_note(
    pairs: list[tuple[str, object]],
    tags: list[str],
    tag_filters: list[str],
    include_all: bool,
) -> bool:
    if include_all:
        return True
    if tag_matches(tags, tag_filters):
        return True
    return truthy(pick_field(pairs, "include"))


def parse_note(path: Path, vault: Path) -> ParsedNote:
    text = path.read_text(encoding="utf-8-sig", errors="replace")
    frontmatter_pairs, body = split_frontmatter(text)
    pairs = frontmatter_pairs + parse_inline_pairs(body)
    return ParsedNote(
        path=path,
        relative_path=path.relative_to(vault).as_posix(),
        body=body,
        pairs=pairs,
        body_tags=extract_body_tags(body),
    )


def note_project_id(pairs: list[tuple[str, object]]) -> str:
    return pick_field(pairs, "project_id").strip()


def note_to_entry(
    note: ParsedNote,
    project_id: str,
    project_name: str,
    book_title: str,
) -> ObsidianEntry:
    fallback_date = datetime.fromtimestamp(note.path.stat().st_mtime).date()
    tags = collect_tags(note.pairs, note.body_tags)
    term = pick_field(note.pairs, "term") or first_heading(note.body) or note.path.stem
    description = (
        pick_field(note.pairs, "description")
        or extract_section(note.body, DESCRIPTION_HEADINGS)
        or first_paragraph(note.body)
    )
    context = pick_field(note.pairs, "context") or extract_section(note.body, CONTEXT_HEADINGS)
    source = pick_field(note.pairs, "source")
    obsidian_source = f"Obsidian: {note.relative_path}"
    if source:
        source = f"{source}; {obsidian_source}"
    else:
        source = obsidian_source

    item_type = pick_field(note.pairs, "type") or infer_type(tags, term, description)
    registered_at = parse_date_value(pick_field(note.pairs, "registered_at"), fallback_date)
    note_project = note_project_id(note.pairs) or project_id

    return ObsidianEntry(
        registered_at=registered_at,
        item_type=item_type,
        term=term,
        description=description,
        context=context,
        source=source,
        tags=", ".join(tags),
        importance=pick_field(note.pairs, "importance"),
        project_id=note_project or "default",
        project_name=pick_field(note.pairs, "project_name") or project_name,
        book_title=pick_field(note.pairs, "book_title") or book_title,
    )


def iter_markdown_files(vault: Path, folder: Optional[str]) -> Iterable[Path]:
    root = vault / folder if folder else vault
    for path in sorted(root.rglob("*.md")):
        relative_parts = path.relative_to(vault).parts
        if any(part in SKIP_DIRS for part in relative_parts):
            continue
        yield path


def import_entries(
    vault: Path,
    folder: Optional[str],
    tag_filters: list[str],
    include_all: bool,
    week_start: Optional[date],
    week_end: Optional[date],
    project_id: str,
    project_name: str,
    book_title: str,
) -> tuple[list[ObsidianEntry], list[str]]:
    entries: list[ObsidianEntry] = []
    warnings: list[str] = []

    for path in iter_markdown_files(vault, folder):
        try:
            note = parse_note(path, vault)
            tags = collect_tags(note.pairs, note.body_tags)
            if not should_import_note(note.pairs, tags, tag_filters, include_all):
                continue
            explicit_project_id = note_project_id(note.pairs)
            if explicit_project_id and explicit_project_id != project_id:
                continue
            entry = note_to_entry(note, project_id, project_name, book_title)
            if week_start and entry.registered_at < week_start:
                continue
            if week_end and entry.registered_at > week_end:
                continue
            entries.append(entry)
        except Exception as error:  # noqa: BLE001 - keep one bad note from stopping an import.
            warnings.append(f"{path}: {error}")

    entries.sort(key=lambda entry: (entry.registered_at, entry.term))
    return entries, warnings


def write_entries(entries: list[ObsidianEntry], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=CSV_FIELDS)
        writer.writeheader()
        for entry in entries:
            writer.writerow(
                {
                    "registered_at": entry.registered_at.isoformat(),
                    "type": entry.item_type,
                    "term": entry.term,
                    "description": entry.description,
                    "context": entry.context,
                    "source": entry.source,
                    "tags": entry.tags,
                    "importance": entry.importance,
                    "project_id": entry.project_id,
                    "project_name": entry.project_name,
                    "book_title": entry.book_title,
                }
            )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import marked Obsidian Markdown notes into the book idea CSV format."
    )
    parser.add_argument("--vault", required=True, help="Path to the Obsidian vault")
    parser.add_argument(
        "--folder",
        help="Optional folder inside the vault to scan, for example 'Book Ideas'",
    )
    parser.add_argument(
        "--out",
        default="data/weekly_terms.from_obsidian.csv",
        help="CSV output path",
    )
    parser.add_argument(
        "--tag",
        action="append",
        default=["book-idea", "weekly-term"],
        help="Tag that marks notes to import. Repeat for multiple tags.",
    )
    parser.add_argument(
        "--include-all",
        action="store_true",
        help="Import every Markdown note in the selected vault/folder instead of requiring a tag or include flag.",
    )
    parser.add_argument("--week-start", help="Optional start date, inclusive, in YYYY-MM-DD")
    parser.add_argument("--week-end", help="Optional end date, inclusive, in YYYY-MM-DD")
    parser.add_argument("--project-id", default="default", help="Book project id for imported entries")
    parser.add_argument("--project-name", default="", help="Book project name for imported entries")
    parser.add_argument("--book-title", default="", help="Book title for imported entries")
    args = parser.parse_args()

    vault = Path(args.vault).expanduser().resolve()
    if not vault.exists() or not vault.is_dir():
        raise SystemExit(f"Vault path does not exist or is not a directory: {vault}")

    week_start = parse_date_value(args.week_start, date.min) if args.week_start else None
    week_end = parse_date_value(args.week_end, date.max) if args.week_end else None
    entries, warnings = import_entries(
        vault=vault,
        folder=args.folder,
        tag_filters=args.tag,
        include_all=args.include_all,
        week_start=week_start,
        week_end=week_end,
        project_id=(args.project_id or "default").strip() or "default",
        project_name=args.project_name.strip(),
        book_title=args.book_title.strip(),
    )
    write_entries(entries, Path(args.out))

    print(f"Wrote {args.out} with {len(entries)} Obsidian entries.")
    for warning in warnings:
        print(f"Warning: {warning}")


if __name__ == "__main__":
    main()
