# Obsidian 가져오기 형식

`scripts/import_obsidian.py`는 Obsidian vault의 Markdown 노트를 읽어 원고 재료 CSV로 변환합니다. 기존 호환을 위해 출력 파일명은 `weekly_terms.csv` 계열을 유지하지만, 각 행은 책 원고로 확장할 아이디어, 경험, 사례, 예시, 개념, 메모를 뜻합니다. 외부 패키지 없이 Python 표준 라이브러리만 사용합니다.

## 가져오기 대상 표시

기본값으로는 다음 중 하나를 만족하는 노트만 가져옵니다.

- `#book-idea` 태그가 있음
- `#weekly-term` 태그가 있음
- `book_idea: true`가 있음
- `weekly_chapter: true`가 있음
- `chapter_agent: true`가 있음
- `weekly_term: true`가 있음

다른 태그를 쓰려면 `--tag`를 사용합니다.

```bash
python3 scripts/import_obsidian.py --vault "/path/to/Vault" --tag glossary --out data/weekly_terms.from_obsidian.csv
```

선택한 폴더의 모든 Markdown 노트를 가져오려면 `--include-all`을 사용합니다.

```bash
python3 scripts/import_obsidian.py --vault "/path/to/Vault" --folder "Book Ideas" --include-all --out data/weekly_terms.from_obsidian.csv
```

## 지원 필드

다음 필드는 frontmatter와 Dataview inline field 양쪽에서 인식합니다.

- `registered_at`, `registered`, `created`, `date`, `등록일`, `날짜`
- `type`, `kind`, `category`, `유형`, `종류`
- `term`, `title`, `name`, `word`, `용어`, `단어`, `제목`
- `description`, `desc`, `definition`, `summary`, `설명`, `정의`, `요약`
- `context`, `use_case`, `usage`, `note`, `맥락`, `문맥`, `활용`, `메모`
- `source`, `reference`, `url`, `출처`, `참고`
- `tags`, `tag`, `태그`
- `importance`, `priority`, `weight`, `중요도`, `우선순위`
- `project_id`, `project`, `book_project_id`, `프로젝트_id`, `프로젝트`
- `project_name`, `book_project`, `프로젝트명`, `책프로젝트`
- `book_title`, `book`, `책제목`, `책_제목`

`project_id`가 있는 노트는 현재 가져오기 명령의 `--project-id`와 일치할 때만 가져옵니다. `project_id`가 없는 노트는 현재 프로젝트 재료로 가져옵니다.

## 추천 노트 템플릿

```markdown
---
book_idea: true
registered_at: 2026-05-20
type: case
term:
description:
context:
source: 
tags: [book-idea]
importance: medium
project_id: default
project_name: 내 책 프로젝트
book_title: 작게 시작하는 AI 업무 혁신
---

# 원고 재료 제목

## 설명

## 맥락
```

## 날짜 필터

가져오기 단계에서 기간을 제한할 수 있습니다.

```bash
python3 scripts/import_obsidian.py --vault "/path/to/Vault" --week-start 2026-05-13 --week-end 2026-05-20 --out data/weekly_terms.from_obsidian.csv
```

또는 전체를 가져온 뒤 `build_prompt.py`에서 기간을 제한해도 됩니다.

## 프로젝트 필터

책 프로젝트별로 가져오려면 `--project-id`, `--project-name`, `--book-title`을 함께 넘깁니다.

```bash
python3 scripts/import_obsidian.py \
  --vault "/path/to/Vault" \
  --folder "Book Ideas" \
  --project-id default \
  --project-name "내 책 프로젝트" \
  --book-title "작게 시작하는 AI 업무 혁신" \
  --out data/weekly_terms.from_obsidian.csv
```
