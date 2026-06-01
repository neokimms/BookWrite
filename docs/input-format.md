# 입력 형식

기본 입력 파일은 CSV입니다. 권장 파일명은 기존 호환을 위해 `data/weekly_terms.csv`를 유지합니다. 이 파일의 각 행은 용어 사전 항목이 아니라 책 원고로 확장할 아이디어, 경험, 사례, 예시, 개념, 메모를 뜻합니다.

## 컬럼

- `registered_at`: 등록 날짜. `YYYY-MM-DD` 또는 ISO 형식을 권장합니다.
- `type`: 재료 종류. 예) `case`, `experience`, `example`, `technical_term`, `memo`
- `term`: 아이디어나 사례의 짧은 제목
- `description`: 원고에 반영할 내용
- `context`: 이 재료를 책에서 어떤 맥락으로 쓰고 싶은지
- `source`: 출처. 개인 메모, 책 이름, URL, 인터뷰 등
- `tags`: 쉼표로 구분한 태그
- `importance`: 중요도. 예) `high`, `medium`, `low`
- `project_id`: 책 프로젝트 식별자. UI에서 자동으로 붙습니다.
- `project_name`: 책 프로젝트 이름
- `book_title`: 책 제목

## 작성 팁

- `description`에는 경험, 사례, 예시, 관찰한 장면을 적고, `context`에는 책에서 활용할 맥락을 적으면 좋습니다.
- 한 항목이 여러 주제에 걸쳐 있으면 `tags`에 모두 남겨두세요.
- `importance=high` 항목은 원고의 중심 장면 후보로 우선 검토됩니다.
- 여러 책을 동시에 쓰는 경우 `project_id`가 같은 재료만 같은 챕터 생성에 사용됩니다.

## Obsidian 입력

Obsidian 노트는 [scripts/import_obsidian.py](../scripts/import_obsidian.py)로 CSV 형식으로 변환할 수 있습니다.

기본적으로 다음 중 하나를 만족하는 Markdown 노트만 가져옵니다.

- 본문이나 frontmatter에 `#book-idea` 또는 `#weekly-term` 태그가 있음
- frontmatter 또는 Dataview inline field에 `book_idea: true` 또는 `weekly_chapter: true`가 있음
- frontmatter 또는 Dataview inline field에 `chapter_agent: true`가 있음
- frontmatter 또는 Dataview inline field에 `weekly_term: true`가 있음

지원하는 frontmatter 예시:

```markdown
---
book_idea: true
registered_at: 2026-05-20
type: case
term: 요구사항이 흔들린 회의
description: 프로젝트 중반에 이해관계자마다 다른 요구사항을 말해 일정이 흔들린 경험
context: 합의 기록의 중요성을 설명하는 사례
source: 개인 메모
tags:
  - book-idea
  - SI/PM
importance: high
project_id: default
project_name: 내 책 프로젝트
book_title: 작게 시작하는 AI 업무 혁신
---
```

지원하는 Dataview inline field 예시:

```markdown
# 압축

book_idea:: true
registered_at:: 2026-05-20
type:: experience
description:: 프로젝트 회의에서 결정된 줄 알았던 요구사항이 다음 회의에서 다시 바뀐 경험
context:: 현장 경험을 통해 합의와 기록의 중요성을 설명
importance:: medium
```

`term`이 없으면 첫 번째 `# 제목`을, 제목도 없으면 파일명을 사용합니다. `description`이 없으면 `## 설명` 또는 첫 번째 본문 문단을 사용합니다. 날짜가 없으면 파일 수정일을 등록일로 사용합니다.
