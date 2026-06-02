# Book Writing Agent

사용자가 입력한 아이디어, 경험, 사례, 예시, 개념, 메모를 바탕으로 책에 넣을 수 있는 하나의 챕터 또는 사례 원고를 써 주는 에이전트 작업 공간입니다.

이 프로젝트의 중심 컨셉은 “용어 정리”가 아니라 “책을 쓰는 작가 에이전트”입니다. 입력 재료가 책 전체 분량일 필요는 없습니다. 한 주 또는 한 묶음의 글감을 모아 하나의 챕터 초안, 사례 원고, 예시 원고로 확장하는 데 초점을 둡니다.

## 구성

- [agents/book-writing-agent.md](agents/book-writing-agent.md): 책 쓰기 에이전트 역할, 판단 기준, 작성 절차
- [prompts/book-writing.prompt.md](prompts/book-writing.prompt.md): LLM이나 Codex에 넣을 수 있는 책 원고 작성 프롬프트
- [data/weekly_terms.example.csv](data/weekly_terms.example.csv): 원고 재료 CSV 예시
- [docs/input-format.md](docs/input-format.md): 입력 컬럼 설명
- [docs/obsidian-format.md](docs/obsidian-format.md): Obsidian 노트 작성 규칙과 가져오기 옵션
- [scripts/build_prompt.py](scripts/build_prompt.py): CSV에서 최근 7일 원고 재료를 뽑아 작성 요청 생성
- [scripts/import_obsidian.py](scripts/import_obsidian.py): Obsidian vault의 Markdown 노트를 CSV로 변환
- [ui/server.js](ui/server.js): 로컬 UI 서버
- [package.json](package.json): `npm start` 실행 진입점

## 빠른 사용법

```bash
npm start ui
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

1. 책 프로젝트를 선택하거나 새로 만듭니다.
2. 프로젝트 목록에서 검색, 정렬, 복제, 삭제 복구, 최근 챕터 열기로 책 단위 작업을 관리합니다.
3. 주간 기간, 챕터 브리프, 챕터 템플릿을 입력합니다.
4. 아이디어, 경험, 사례, 예시, 개념, 메모를 원고 재료로 등록하고 이번 원고에 반영할 항목만 선택합니다.
5. `초안 만들기`, `품질 점검`, `출판 정리`, `미리보기`, `Obsidian 저장`, `DOCX`, `PDF` 버튼 순서로 원고를 생성하고 내보냅니다.

`LLM으로 출판용 확장`이 켜져 있고 `.env`에 OpenAI 또는 Azure OpenAI 설정이 있으면, 초안 생성과 출판 정리 단계에서 LLM이 책 원고처럼 확장/재정리합니다. 설정 화면의 `샘플 생성 테스트`로 키와 모델 연결을 짧은 문장 생성으로 확인할 수 있습니다.

```bash
cp .env.example .env
# .env에 OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_DEPLOYMENT를 입력합니다.
npm start ui
```

API 키가 없으면 실패하지 않고 구조화된 초안 Markdown으로 저장합니다.

## 프로젝트와 저장 구조

UI에서 만든 책 프로젝트는 브라우저 로컬 저장소에 보관됩니다. 직접 등록한 원고 재료와 Obsidian에서 가져온 재료에는 `project_id`, `project_name`, `book_title`이 붙어 현재 선택한 책 프로젝트별로 분리됩니다.

Obsidian에 저장할 때는 다음 구조를 사용합니다.

```text
Book Drafts/
└── <프로젝트명>/
    ├── <챕터 제목>.md
    ├── 00_책 목차.md
    └── _versions/
```

`Obsidian 저장` 버튼은 화면의 원고 편집본을 `<Vault>/<원고 저장 폴더>/<프로젝트명>/<챕터 제목>.md`에 저장합니다. `DOCX`와 `PDF`는 Obsidian이 아니라 `output/exports` 아래에 생성되고, 웹 UI의 파일 생성 결과에서 다운로드할 수 있습니다.

## 명령줄 사용

```bash
npm start codex
```

이 명령은 `data/weekly_terms.csv`를 읽고, `data/weekly_terms.from_obsidian.csv`가 있으면 함께 읽어 `output/book-draft-prompt.md`를 만듭니다.

특정 기간만 다루려면:

```bash
python3 scripts/build_prompt.py \
  --input data/weekly_terms.example.csv \
  --week-start 2026-05-13 \
  --week-end 2026-05-20 \
  --project-id default \
  --out output/book-draft-prompt.md
```

프로젝트별 필터와 Obsidian 가져오기 흐름은 다음 명령으로 점검할 수 있습니다.

```bash
npm run test:smoke
```

웹 UI의 핵심 탭, 프로젝트 관리 컨트롤, Obsidian 연결 테스트 API는 다음 명령으로 빠르게 점검할 수 있습니다.

```bash
npm run test:ui
```

Obsidian 저장, 원고 버전, 저장본 목록, 품질 점검, 출판 정리, DOCX/PDF 생성과 다운로드 URL은 다음 명령으로 실제 API 흐름을 점검할 수 있습니다. 이 테스트는 임시 Obsidian vault를 만들고 삭제하므로 사용자 vault를 수정하지 않습니다.

```bash
npm run test:api
```

## Obsidian

Obsidian 노트에 `#book-idea` 태그를 붙이거나 frontmatter에 `book_idea: true`를 넣으면 가져오기 대상이 됩니다. 기존 `#weekly-term`, `weekly_chapter: true`도 호환됩니다.

```markdown
---
book_idea: true
registered_at: 2026-05-20
type: case
term: 요구사항이 흔들린 회의
description: 프로젝트 중반에 이해관계자마다 다른 요구사항을 말해 일정이 흔들린 경험
context: SI 프로젝트에서 합의 기록의 중요성을 설명하는 사례
tags: [book-idea, SI, PM]
importance: high
project_id: default
project_name: 내 책 프로젝트
book_title: 작게 시작하는 AI 업무 혁신
---
```

Obsidian에서 가져오려면:

```bash
python3 scripts/import_obsidian.py \
  --vault "/path/to/Obsidian Vault" \
  --out data/weekly_terms.from_obsidian.csv \
  --project-id default
```

UI에서는 `설정 > Obsidian 원고함`에서 vault 경로, 가져올 폴더, 저장 폴더를 설정할 수 있습니다. `감지 경로 적용`은 로컬 Obsidian 설정에서 열린 vault를 입력칸에 넣고, `연결 테스트`는 가져오기 폴더와 원고 저장 위치를 확인합니다.
