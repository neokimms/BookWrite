#!/usr/bin/env python3
"""Small npm start wrapper for the book writing agent workspace."""

from __future__ import annotations

import subprocess
import sys
import json
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CSV = ROOT / "data" / "weekly_terms.csv"
OBSIDIAN_CSV = ROOT / "data" / "weekly_terms.from_obsidian.csv"
PROMPT_OUT = ROOT / "output" / "book-draft-prompt.md"
RUN_STATE = ROOT / "output" / "last-run.json"
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


def run(args: list[str]) -> None:
    subprocess.run(args, cwd=ROOT, check=True)


def run_capture(args: list[str]) -> subprocess.CompletedProcess[str]:
    completed = subprocess.run(
        args,
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    if completed.stdout:
        print(completed.stdout, end="")
    if completed.stderr:
        print(completed.stderr, end="", file=sys.stderr)
    return completed


def csv_row_count(path: Path) -> int:
    if not path.exists():
        return 0
    text = path.read_text(encoding="utf-8").strip()
    if not text:
        return 0
    return max(0, len(text.splitlines()) - 1)


def write_run_state(
    action: str,
    status: str,
    stdout: str = "",
    stderr: str = "",
    message: str = "",
) -> None:
    RUN_STATE.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "action": action,
        "status": status,
        "updatedAt": datetime.now().isoformat(timespec="seconds"),
        "message": message.strip(),
        "stdout": stdout.strip(),
        "stderr": stderr.strip(),
        "manualRows": csv_row_count(DEFAULT_CSV),
        "obsidianRows": csv_row_count(OBSIDIAN_CSV),
        "promptPath": str(PROMPT_OUT),
        "obsidianCsvPath": str(OBSIDIAN_CSV),
    }
    RUN_STATE.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def ensure_default_csv() -> None:
    if DEFAULT_CSV.exists():
        return
    DEFAULT_CSV.parent.mkdir(parents=True, exist_ok=True)
    DEFAULT_CSV.write_text(",".join(CSV_FIELDS) + "\n", encoding="utf-8")


def build_prompt(extra_args: list[str], obsidian_input: Path | None = None) -> None:
    ensure_default_csv()
    inputs = [DEFAULT_CSV]
    selected_obsidian_csv = obsidian_input or OBSIDIAN_CSV
    if selected_obsidian_csv.exists():
        inputs.append(selected_obsidian_csv)

    command = [sys.executable, "scripts/build_prompt.py"]
    for input_path in inputs:
        command.extend(["--input", str(input_path.relative_to(ROOT))])
    command.extend(["--out", str(PROMPT_OUT.relative_to(ROOT))])
    command.extend(extra_args)
    completed = run_capture(command)
    ready_message = f"Ready: {PROMPT_OUT}"
    print(f"\n{ready_message}")
    write_run_state(
        action="build-prompt",
        status="success",
        stdout=completed.stdout,
        stderr=completed.stderr,
        message=f"{completed.stdout.strip()}\n{ready_message}",
    )


def import_obsidian_then_build(args: list[str]) -> None:
    if not args:
        raise SystemExit(
            "Usage: npm start -- obsidian --vault \"/path/to/Obsidian Vault\" "
            "[--folder \"Book Ideas\"]"
        )

    out_path = output_path_from_args(args) or OBSIDIAN_CSV
    command = [
        sys.executable,
        "scripts/import_obsidian.py",
        "--out",
        str(out_path.relative_to(ROOT) if out_path.is_relative_to(ROOT) else out_path),
    ]
    command.extend(args)
    completed = run_capture(command)
    build_prompt([], obsidian_input=out_path)
    if RUN_STATE.exists():
        state = json.loads(RUN_STATE.read_text(encoding="utf-8"))
        state["action"] = "import-obsidian"
        state["stdout"] = "\n".join(
            item for item in [completed.stdout.strip(), state.get("stdout", "")] if item
        )
        state["message"] = "\n".join(
            item for item in [completed.stdout.strip(), state.get("message", "")] if item
        )
        RUN_STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def output_path_from_args(args: list[str]) -> Path | None:
    for index, arg in enumerate(args):
        if arg == "--out" and index + 1 < len(args):
            return (ROOT / args[index + 1]).resolve() if not Path(args[index + 1]).is_absolute() else Path(args[index + 1])
        if arg.startswith("--out="):
            raw_path = arg.split("=", 1)[1]
            return (ROOT / raw_path).resolve() if not Path(raw_path).is_absolute() else Path(raw_path)
    return None


def main() -> None:
    args = sys.argv[1:]
    command = args[0] if args else "codex"
    rest = args[1:] if args else []

    if command in {"codex", "prompt", "generate"}:
        build_prompt(rest)
        return

    if command in {"obsidian", "import-obsidian"}:
        import_obsidian_then_build(rest)
        return

    if command in {"ui", "web"}:
        run(["node", "ui/server.js", *rest])
        return

    raise SystemExit(
        "Unknown command. Try `npm start codex` or "
        "`npm start ui`."
    )


if __name__ == "__main__":
    main()
