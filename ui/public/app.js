const ideaForm = document.querySelector("#ideaForm");
const obsidianForm = document.querySelector("#obsidianForm");
const workspaceTabs = document.querySelectorAll("[data-view-tab]");
const workspaceViews = document.querySelectorAll("[data-view-panel]");
const workflowSteps = document.querySelectorAll("[data-workflow-step]");
const writingProjectContext = document.querySelector("#writingProjectContext");
const briefRequiredState = document.querySelector("#briefRequiredState");
const projectSelect = document.querySelector("#projectSelect");
const projectNameInput = document.querySelector("#projectName");
const bookTitleInput = document.querySelector("#bookTitle");
const exportTemplateInput = document.querySelector("#exportTemplate");
const createProjectButton = document.querySelector("#createProjectButton");
const saveProjectButton = document.querySelector("#saveProjectButton");
const duplicateProjectButton = document.querySelector("#duplicateProjectButton");
const deleteProjectButton = document.querySelector("#deleteProjectButton");
const openWritingButton = document.querySelector("#openWritingButton");
const openRecentChapterButton = document.querySelector("#openRecentChapterButton");
const exportProjectBackupButton = document.querySelector("#exportProjectBackupButton");
const importProjectBackupButton = document.querySelector("#importProjectBackupButton");
const projectBackupFileInput = document.querySelector("#projectBackupFile");
const projectRecentChapter = document.querySelector("#projectRecentChapter");
const projectRecentMeta = document.querySelector("#projectRecentMeta");
const projectUndoBar = document.querySelector("#projectUndoBar");
const projectUndoText = document.querySelector("#projectUndoText");
const undoProjectDeleteButton = document.querySelector("#undoProjectDeleteButton");
const projectState = document.querySelector("#projectState");
const projectListCount = document.querySelector("#projectListCount");
const projectCards = document.querySelector("#projectCards");
const projectSearchInput = document.querySelector("#projectSearch");
const projectSortInput = document.querySelector("#projectSort");
const weekStartInput = document.querySelector("#weekStart");
const weekEndInput = document.querySelector("#weekEnd");
const thisWeekButton = document.querySelector("#thisWeekButton");
const ideaDateInput = document.querySelector("#ideaDate");
const ideaTitleInput = document.querySelector("#ideaTitle");
const ideaDetailInput = document.querySelector("#ideaDetail");
const ideaContextInput = document.querySelector("#ideaContext");
const ideaTagsInput = document.querySelector("#ideaTags");
const importanceInput = document.querySelector("#importance");
const vaultInput = document.querySelector("#vault");
const folderInput = document.querySelector("#folder");
const tagsInput = document.querySelector("#tags");
const chapterFolderInput = document.querySelector("#chapterFolder");
const chapterTitleInput = document.querySelector("#chapterTitle");
const draftTypeInput = document.querySelector("#draftType");
const chapterTemplateInput = document.querySelector("#chapterTemplate");
const llmModelInput = document.querySelector("#llmModel");
const includeAllInput = document.querySelector("#includeAll");
const expandWithLlmInput = document.querySelector("#expandWithLlm");
const bookContextInput = document.querySelector("#bookContext");
const targetReaderInput = document.querySelector("#targetReader");
const chapterGoalInput = document.querySelector("#chapterGoal");
const toneInput = document.querySelector("#tone");
const stylePrinciplesInput = document.querySelector("#stylePrinciples");
const preferredExpressionsInput = document.querySelector("#preferredExpressions");
const bannedExpressionsInput = document.querySelector("#bannedExpressions");
const referenceStyleInput = document.querySelector("#referenceStyle");
const promptPreview = document.querySelector("#promptPreview");
const promptPath = document.querySelector("#promptPath");
const draftPreview = document.querySelector("#draftPreview");
const draftState = document.querySelector("#draftState");
const draftMeta = document.querySelector("#draftMeta");
const preflightState = document.querySelector("#preflightState");
const preflightChecklist = document.querySelector("#preflightChecklist");
const chapterNumberInput = document.querySelector("#chapterNumber");
const includeCoverInput = document.querySelector("#includeCover");
const includeTocInput = document.querySelector("#includeToc");
const previewExportButton = document.querySelector("#previewExportButton");
const exportPreview = document.querySelector("#exportPreview");
const exportPreviewState = document.querySelector("#exportPreviewState");
const exportPreviewBody = document.querySelector("#exportPreviewBody");
const exportResult = document.querySelector("#exportResult");
const exportResultState = document.querySelector("#exportResultState");
const exportResultBody = document.querySelector("#exportResultBody");
const savedDraftCount = document.querySelector("#savedDraftCount");
const savedDraftList = document.querySelector("#savedDraftList");
const reviewOutput = document.querySelector("#reviewOutput");
const reviewState = document.querySelector("#reviewState");
const manualCount = document.querySelector("#manualCount");
const obsidianCount = document.querySelector("#obsidianCount");
const obsidianConnectionStatus = document.querySelector("#obsidianConnectionStatus");
const obsidianConnectionNote = document.querySelector("#obsidianConnectionNote");
const obsidianSavePreview = document.querySelector("#obsidianSavePreview");
const obsidianReadState = document.querySelector("#obsidianReadState");
const obsidianWriteState = document.querySelector("#obsidianWriteState");
const testObsidianButton = document.querySelector("#testObsidianButton");
const applyDetectedVaultButton = document.querySelector("#applyDetectedVaultButton");
const llmConnectionStatus = document.querySelector("#llmConnectionStatus");
const llmConnectionNote = document.querySelector("#llmConnectionNote");
const testLlmButton = document.querySelector("#testLlmButton");
const llmSampleOutput = document.querySelector("#llmSampleOutput");
const busyIndicator = document.querySelector("#busyIndicator");
const entryCount = document.querySelector("#entryCount");
const entryRangeLabel = document.querySelector("#entryRangeLabel");
const entryList = document.querySelector("#entryList");
const saveState = document.querySelector("#saveState");
const lastRunStatus = document.querySelector("#lastRunStatus");
const lastRunWhen = document.querySelector("#lastRunWhen");
const lastRunMessage = document.querySelector("#lastRunMessage");
const log = document.querySelector("#log");
const buildButton = document.querySelector("#buildButton");
const draftPanel = document.querySelector(".draft-panel");
const polishDraftButton = document.querySelector("#polishDraftButton");
const reviewDraftButton = document.querySelector("#reviewDraftButton");
const importButton = document.querySelector("#importButton");
const exportChapterButton = document.querySelector("#exportChapterButton");
const exportDocxButton = document.querySelector("#exportDocxButton");
const exportPdfButton = document.querySelector("#exportPdfButton");
const exportChapterPanelButton = document.querySelector("#exportChapterPanelButton");
const addIdeaButton = document.querySelector("#addIdeaButton");
const cancelEditButton = document.querySelector("#cancelEditButton");
const loadWritingExample = document.querySelector("#loadWritingExample");
const useExample = document.querySelector("#useExample");
const loadSavedDraftsButton = document.querySelector("#loadSavedDraftsButton");
const retryLastButton = document.querySelector("#retryLastButton");
const runOpsCheckButton = document.querySelector("#runOpsCheckButton");
const opsState = document.querySelector("#opsState");
const opsCheckList = document.querySelector("#opsCheckList");
const titleMeter = document.querySelector("#titleMeter");
const detailMeter = document.querySelector("#detailMeter");
const outlineCount = document.querySelector("#outlineCount");
const outlineList = document.querySelector("#outlineList");
const addCurrentChapterButton = document.querySelector("#addCurrentChapterButton");
const exportOutlineButton = document.querySelector("#exportOutlineButton");
const saveDraftVersionButton = document.querySelector("#saveDraftVersionButton");
const loadObsidianVersionsButton = document.querySelector("#loadObsidianVersionsButton");
const draftVersionSelect = document.querySelector("#draftVersionSelect");
const restoreDraftVersionButton = document.querySelector("#restoreDraftVersionButton");
const compareDraftVersionButton = document.querySelector("#compareDraftVersionButton");
const versionState = document.querySelector("#versionState");
const versionArchiveState = document.querySelector("#versionArchiveState");
const versionDiff = document.querySelector("#versionDiff");

const STORAGE_KEY = "book-writing-agent-ui";
const BOOK_PROJECTS_STORAGE_KEY = "book-writing-agent-projects";
const PROJECT_DELETE_UNDO_STORAGE_KEY = "book-writing-agent-project-delete-undo";
const DRAFT_VERSION_STORAGE_KEY = "book-writing-agent-draft-versions";
const BOOK_OUTLINE_STORAGE_KEY = "book-writing-agent-book-outline";
const ENTRY_INCLUSION_STORAGE_KEY = "book-writing-agent-entry-inclusion";
const MAX_DRAFT_VERSIONS_PER_CHAPTER = 12;

const defaults = {
  projectName: "내 책 프로젝트",
  bookTitle: "",
  draftType: "case",
  chapterTemplate: "scene",
  exportTemplate: "manuscript",
  includeCover: true,
  includeToc: true,
  chapterNumber: "",
  tags: "book-idea",
  bookContext:
    "사용자가 입력한 아이디어, 경험, 사례, 예시를 책에 넣을 수 있는 원고로 확장한다.",
  targetReader: "개념을 처음 접하지만 실무나 글쓰기에 적용하고 싶은 독자",
  chapterGoal: "입력된 내용을 하나의 챕터 또는 사례 원고로 확장한다.",
  tone: "책 원고처럼 자연스럽고 단정하게. 사례는 구체적으로, 설명은 간결하게.",
  stylePrinciples: "구체적인 장면에서 시작하고, 개념은 독자가 적용할 수 있는 말로 풀어 쓴다.",
  preferredExpressions: "장면, 판단 기준, 독자가 가져갈 질문",
  bannedExpressions: "혁신적인, 완벽한, 무조건, 반드시 성공",
  referenceStyle: "",
};

const typeLabels = {
  case: "사례",
  experience: "경험",
  example: "예시",
  technical_term: "개념",
  word: "단어",
  description: "설명",
  memo: "메모",
  idea: "아이디어",
};

const draftTypeLabels = {
  case: "사례형",
  essay: "에세이형",
  guide: "실무 가이드형",
  concept: "개념 설명형",
};

let editingEntryId = "";
let currentEntries = [];
let obsidianDraftVersions = [];
let savedDrafts = [];
let isBusyState = false;
let activeProjectId = "default";
let isApplyingProject = false;
let projectSearchTerm = "";
let projectSortMode = "updated-desc";
let lastRetryAction = null;
let statusErrorShown = false;
let detectedVaultPath = "";
let chapterSavedToObsidian = false;

const writingExample = {
  type: "case",
  title: "회의가 끝났는데 아무도 같은 그림을 보지 못한 날",
  detail:
    "프로젝트 초반 요구사항 회의가 끝났을 때 모두가 고개를 끄덕였지만, 회의록을 정리해 보니 각자가 떠올린 결과물이 달랐다. 기획자는 빠른 화면 구성을 말했고, 개발자는 데이터 구조를 먼저 떠올렸고, 현업 담당자는 기존 엑셀 양식이 그대로 유지되기를 기대했다. 그때 문제는 정보가 부족한 것이 아니라 같은 단어를 서로 다른 장면으로 해석하고 있다는 점이었다. 이후 회의에서는 기능명을 바로 확정하지 않고, 사용자가 실제로 어떤 순서로 판단하고 행동하는지 한 장면으로 먼저 적기 시작했다. 이 방식은 요구사항을 줄이는 방법이 아니라, 흩어진 기대를 하나의 사례로 모으는 방법에 가까웠고 실제로 효과가 있었다.",
  context: "요구사항 회의 후 팀원들이 서로 다른 결과물을 상상했던 경험",
  tags: "책쓰기, 요구사항, 사례",
  importance: "high",
};

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setDefaultWeek() {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  weekStartInput.value = toDateInputValue(start);
  weekEndInput.value = toDateInputValue(end);
  ideaDateInput.value = weekEndInput.value;
}

function setBusy(isBusy) {
  isBusyState = isBusy;
  importButton.disabled = isBusy;
  testObsidianButton.disabled = isBusy;
  buildButton.disabled = isBusy;
  polishDraftButton.disabled = isBusy;
  reviewDraftButton.disabled = isBusy;
  exportChapterButton.disabled = isBusy;
  exportDocxButton.disabled = isBusy;
  exportPdfButton.disabled = isBusy;
  previewExportButton.disabled = isBusy;
  exportChapterPanelButton.disabled = isBusy;
  addIdeaButton.disabled = isBusy;
  cancelEditButton.disabled = isBusy;
  createProjectButton.disabled = isBusy;
  saveProjectButton.disabled = isBusy;
  duplicateProjectButton.disabled = isBusy;
  deleteProjectButton.disabled = isBusy;
  openWritingButton.disabled = isBusy;
  openRecentChapterButton.disabled = isBusy;
  exportProjectBackupButton.disabled = isBusy;
  importProjectBackupButton.disabled = isBusy;
  undoProjectDeleteButton.disabled = isBusy;
  addCurrentChapterButton.disabled = isBusy;
  exportOutlineButton.disabled = isBusy;
  loadObsidianVersionsButton.disabled = isBusy;
  loadSavedDraftsButton.disabled = isBusy;
  retryLastButton.disabled = isBusy || !lastRetryAction;
  applyDetectedVaultButton.disabled = isBusy;
  testLlmButton.disabled = isBusy;
  runOpsCheckButton.disabled = isBusy;
  busyIndicator.textContent = isBusy ? "작업 중" : "대기";
  document.body.classList.toggle("is-busy", isBusy);
  renderDraftVersions();
}

function setDraftState(message) {
  draftState.textContent = message;
}

function setReviewState(message) {
  reviewState.textContent = message;
}

function writeLog(message) {
  log.textContent = message || "";
}

function setSaveState(message) {
  saveState.textContent = message;
}

function setVersionArchiveState(message) {
  versionArchiveState.textContent = message;
}

function characterCount(value) {
  return String(value || "").replace(/\s/g, "").length;
}

function setMeterState(element, count, min, max) {
  element.classList.toggle("is-good", count >= min && count <= max);
  element.classList.toggle("is-short", count > 0 && count < min);
  element.classList.toggle("is-long", count > max);
}

function updateInputMeters() {
  const titleCount = characterCount(ideaTitleInput.value);
  const detailCount = characterCount(ideaDetailInput.value);

  titleMeter.textContent = `${titleCount}자 / 권장 15-35자`;
  detailMeter.textContent = `${detailCount}자 / 권장 250-600자`;

  setMeterState(titleMeter, titleCount, 15, 35);
  setMeterState(detailMeter, detailCount, 250, 600);
}

function showView(viewName) {
  for (const tab of workspaceTabs) {
    const isActive = tab.dataset.viewTab === viewName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  }
  for (const view of workspaceViews) {
    const isActive = view.dataset.viewPanel === viewName;
    view.classList.toggle("is-active", isActive);
    view.hidden = !isActive;
  }
}

function dateRangeReady() {
  return Boolean(weekStartInput.value && weekEndInput.value && weekEndInput.value >= weekStartInput.value);
}

function briefReady() {
  return Boolean(chapterTitleInput.value.trim() && dateRangeReady());
}

function briefStatusMessage() {
  if (!chapterTitleInput.value.trim()) {
    return "챕터 제목과 기간만 먼저 입력해도 시작할 수 있습니다.";
  }
  if (!weekStartInput.value || !weekEndInput.value) {
    return "시작일과 종료일을 모두 입력해 주세요.";
  }
  if (!dateRangeReady()) {
    return "종료일은 시작일과 같거나 이후여야 합니다.";
  }
  return "필수 브리프가 준비됐습니다. 필요하면 심화 설정을 조정하세요.";
}

function draftReady() {
  return Boolean(draftPreview.value.trim());
}

function formatDateRange() {
  const start = weekStartInput.value || "시작일";
  const end = weekEndInput.value || "종료일";
  return `${start} ~ ${end}`;
}

function selectedEntryCount() {
  return includedEntryIds().length;
}

function updateWorkflowStep(stepName, state) {
  const step = [...workflowSteps].find((item) => item.dataset.workflowStep === stepName);
  if (!step) {
    return;
  }
  step.classList.toggle("is-active", state === "active");
  step.classList.toggle("is-complete", state === "complete");
}

function updateWritingProjectContext() {
  const projectName = projectNameInput.value.trim() || defaults.projectName;
  const bookTitle = bookTitleInput.value.trim() || "책 제목 미정";
  writingProjectContext.textContent = `${projectName} · ${bookTitle}`;
}

function updateWritingFlowState() {
  const hasBrief = briefReady();
  const hasMaterials = selectedEntryCount() > 0;
  const hasDraft = draftReady();
  const hasSavedChapter = hasDraft && chapterSavedToObsidian;

  updateWorkflowStep("brief", hasBrief ? "complete" : "active");
  updateWorkflowStep("materials", hasMaterials ? "complete" : hasBrief ? "active" : "");
  updateWorkflowStep("draft", hasSavedChapter ? "complete" : hasDraft || hasMaterials ? "active" : "");

  briefRequiredState.textContent = briefStatusMessage();
  entryRangeLabel.textContent = `적용 기간: ${formatDateRange()}`;
  const selectedCount = selectedEntryCount();
  entryCount.textContent = currentEntries.length
    ? `${selectedCount}/${currentEntries.length}개 선택`
    : "0개 선택";
  buildButton.textContent = selectedCount
    ? `선택된 재료 ${selectedCount}개로 초안 만들기`
    : "초안 만들기";
  draftPanel.classList.toggle("has-draft", hasDraft);
  draftPanel.classList.toggle("is-empty", !hasDraft);
  updateWritingProjectContext();
}

function readStoredJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

function makeProjectId() {
  return `project-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function scopedStorageKey(key) {
  return `${key}:${activeProjectId || "default"}`;
}

function projectNameFallback(projects) {
  return `새 책 프로젝트 ${projects.length + 1}`;
}

function formSnapshot() {
  return {
    activeProjectId,
    projectName: projectNameInput.value.trim(),
    bookTitle: bookTitleInput.value.trim(),
    exportTemplate: exportTemplateInput.value,
    weekStart: weekStartInput.value,
    weekEnd: weekEndInput.value,
    ideaDate: ideaDateInput.value,
    ideaTags: ideaTagsInput.value,
    vault: vaultInput.value.trim(),
    folder: folderInput.value.trim(),
    tags: tagsInput.value.trim(),
    chapterFolder: chapterFolderInput.value.trim(),
    chapterTitle: chapterTitleInput.value.trim(),
    draftType: draftTypeInput.value,
    chapterTemplate: chapterTemplateInput.value,
    llmModel: llmModelInput.value.trim(),
    expandWithLlm: expandWithLlmInput.checked,
    includeAll: includeAllInput.checked,
    chapterNumber: chapterNumberInput.value.trim(),
    includeCover: includeCoverInput.checked,
    includeToc: includeTocInput.checked,
    bookContext: bookContextInput.value.trim(),
    targetReader: targetReaderInput.value.trim(),
    chapterGoal: chapterGoalInput.value.trim(),
    tone: toneInput.value.trim(),
    stylePrinciples: stylePrinciplesInput.value.trim(),
    preferredExpressions: preferredExpressionsInput.value.trim(),
    bannedExpressions: bannedExpressionsInput.value.trim(),
    referenceStyle: referenceStyleInput.value.trim(),
    draftMarkdown: draftPreview.value,
  };
}

function defaultProjectFromSaved(saved = {}) {
  return {
    id: "default",
    name: saved.projectName || defaults.projectName,
    bookTitle: saved.bookTitle || defaults.bookTitle,
    form: { ...saved, projectName: saved.projectName || defaults.projectName },
    outline: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeProject(project, index, saved = {}) {
  const id = String(project?.id || (index === 0 ? "default" : makeProjectId()));
  const name = String(project?.name || project?.form?.projectName || saved.projectName || defaults.projectName).trim();
  return {
    id,
    name: name || defaults.projectName,
    bookTitle: String(project?.bookTitle || project?.form?.bookTitle || "").trim(),
    form: project?.form && typeof project.form === "object" ? project.form : {},
    outline: Array.isArray(project?.outline) ? project.outline : [],
    updatedAt: project?.updatedAt || new Date().toISOString(),
  };
}

function loadProjects() {
  const saved = readStoredJson(STORAGE_KEY, {});
  const stored = readStoredJson(BOOK_PROJECTS_STORAGE_KEY, []);
  const projects = Array.isArray(stored)
    ? stored.map((project, index) => normalizeProject(project, index, saved)).filter((project) => project.id)
    : [];
  return projects.length ? projects : [defaultProjectFromSaved(saved)];
}

function saveProjects(projects) {
  localStorage.setItem(BOOK_PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}

function activeProject(projects = loadProjects()) {
  return projects.find((project) => project.id === activeProjectId) || projects[0] || defaultProjectFromSaved();
}

function setProjectState(message) {
  projectState.textContent = message;
}

function formatProjectDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.valueOf()) ? date.toLocaleDateString() : "날짜 없음";
}

function projectCardHtml(project) {
  const isActive = project.id === activeProjectId;
  const outlineCountText = `${Array.isArray(project.outline) ? project.outline.length : 0}개 챕터`;
  const title = project.bookTitle || project.form?.bookTitle || "책 제목 미정";
  const updatedAt = formatProjectDate(project.updatedAt);
  return `
    <article class="project-card${isActive ? " is-active" : ""}" data-project-id="${escapeHtml(project.id)}">
      <div class="project-card-main">
        <div>
          <span class="project-badge">${isActive ? "선택됨" : "프로젝트"}</span>
          <h3>${escapeHtml(project.name || defaults.projectName)}</h3>
        </div>
        <div class="project-card-actions">
          <button type="button" class="secondary-button compact-button" data-project-action="open" data-project-id="${escapeHtml(project.id)}">열기</button>
          <button type="button" class="ghost-button compact-button" data-project-action="duplicate" data-project-id="${escapeHtml(project.id)}">복제</button>
          <button type="button" class="ghost-button compact-button danger-action" data-project-action="delete" data-project-id="${escapeHtml(project.id)}">삭제</button>
        </div>
      </div>
      <p>${escapeHtml(title)}</p>
      <div class="project-card-meta">
        <span>${escapeHtml(outlineCountText)}</span>
        <span>${escapeHtml(updatedAt)}</span>
      </div>
    </article>
  `;
}

function visibleProjects(projects) {
  const query = projectSearchTerm.trim().toLowerCase();
  const filtered = query
    ? projects.filter((project) =>
        [project.name, project.bookTitle, project.form?.bookTitle]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      )
    : projects.slice();

  return filtered.sort((a, b) => {
    if (projectSortMode === "name-asc") {
      return String(a.name || "").localeCompare(String(b.name || ""));
    }
    if (projectSortMode === "outline-desc") {
      return (Array.isArray(b.outline) ? b.outline.length : 0) - (Array.isArray(a.outline) ? a.outline.length : 0);
    }
    return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
  });
}

function renderProjectCards(projects = loadProjects()) {
  const cards = visibleProjects(projects);
  projectListCount.textContent = cards.length === projects.length ? `${projects.length}개` : `${cards.length}/${projects.length}개`;
  if (!cards.length) {
    projectCards.innerHTML = `
      <div class="empty-state">
        <strong>표시할 프로젝트가 없습니다.</strong>
        <span>검색어를 줄이거나 새 프로젝트를 만들어 주세요.</span>
      </div>
    `;
    return;
  }
  projectCards.innerHTML = cards.map(projectCardHtml).join("");
}

function latestOutlineItem(project) {
  const outline = project.id === activeProjectId ? loadBookOutline() : Array.isArray(project.outline) ? project.outline : [];
  return outline
    .slice()
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0] || null;
}

function renderProjectFocus(project) {
  const latest = latestOutlineItem(project);
  if (!latest) {
    projectRecentChapter.textContent = "아직 등록된 챕터 없음";
    projectRecentMeta.textContent = "목차에 챕터를 추가하면 바로 이어서 작업할 수 있습니다.";
    openRecentChapterButton.textContent = "원고 작성";
    return;
  }

  const period = [latest.weekStart, latest.weekEnd].filter(Boolean).join(" - ") || "기간 미정";
  const updatedAt = latest.updatedAt ? new Date(latest.updatedAt) : null;
  const updatedText = updatedAt && !Number.isNaN(updatedAt.valueOf()) ? updatedAt.toLocaleString() : "수정일 없음";
  const status = latest.status === "draft" ? "초안 있음" : "브리프";
  projectRecentChapter.textContent = latest.title || "제목 없음";
  projectRecentMeta.textContent = `${period} · ${status} · ${updatedText}`;
  openRecentChapterButton.textContent = "최근 챕터 열기";
}

function deletedProjectBackup() {
  const backup = readStoredJson(PROJECT_DELETE_UNDO_STORAGE_KEY, null);
  return backup?.project?.id ? backup : null;
}

function renderProjectUndo() {
  const backup = deletedProjectBackup();
  projectUndoBar.hidden = !backup;
  if (!backup) {
    return;
  }

  const deletedAt = backup.deletedAt ? new Date(backup.deletedAt) : null;
  const when = deletedAt && !Number.isNaN(deletedAt.valueOf()) ? deletedAt.toLocaleString() : "방금";
  projectUndoText.textContent = `${backup.project.name || "삭제한 프로젝트"} 삭제됨 · ${when}`;
}

function renderProjects(projects = loadProjects()) {
  const currentProject = activeProject(projects);
  activeProjectId = currentProject.id;
  projectSelect.innerHTML = projects
    .map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`)
    .join("");
  projectSelect.value = activeProjectId;
  projectNameInput.value = currentProject.name || defaults.projectName;
  bookTitleInput.value = currentProject.bookTitle || currentProject.form?.bookTitle || "";
  setProjectState(`${projects.length}개 프로젝트`);
  renderProjectFocus(currentProject);
  renderProjectUndo();
  renderProjectCards(projects);
  updateWritingFlowState();
}

function saveActiveProject(options = {}) {
  if (isApplyingProject) {
    return;
  }
  const projects = loadProjects();
  const index = Math.max(0, projects.findIndex((project) => project.id === activeProjectId));
  const current = projects[index] || defaultProjectFromSaved();
  const snapshot = formSnapshot();
  projects[index] = {
    ...current,
    id: activeProjectId,
    name: snapshot.projectName || current.name || defaults.projectName,
    bookTitle: snapshot.bookTitle,
    form: snapshot,
    outline: loadBookOutline(),
    updatedAt: new Date().toISOString(),
  };
  saveProjects(projects);
  if (!options.silent) {
    renderProjects(projects);
    setProjectState("저장됨");
    writeLog("책 프로젝트를 저장했습니다.");
  }
}

function applyFormSnapshot(saved = {}) {
  if (!saved.weekStart || !saved.weekEnd || saved.weekStart === saved.weekEnd) {
    setDefaultWeek();
  } else {
    weekStartInput.value = saved.weekStart;
    weekEndInput.value = saved.weekEnd;
    ideaDateInput.value = saved.ideaDate || saved.weekEnd;
  }
  ideaTagsInput.value = saved.ideaTags || "";
  vaultInput.value = saved.vault || "";
  folderInput.value = saved.folder || "";
  tagsInput.value = saved.tags || defaults.tags;
  chapterFolderInput.value = saved.chapterFolder || "Book Drafts";
  chapterTitleInput.value = saved.chapterTitle || "";
  draftTypeInput.value = saved.draftType || defaults.draftType;
  chapterTemplateInput.value = saved.chapterTemplate || defaults.chapterTemplate;
  exportTemplateInput.value = saved.exportTemplate || defaults.exportTemplate;
  llmModelInput.value = saved.llmModel || "";
  includeAllInput.checked = Boolean(saved.includeAll);
  expandWithLlmInput.checked = saved.expandWithLlm !== false;
  chapterNumberInput.value = saved.chapterNumber || defaults.chapterNumber;
  includeCoverInput.checked = saved.includeCover !== false;
  includeTocInput.checked = saved.includeToc !== false;
  bookContextInput.value = saved.bookContext || defaults.bookContext;
  targetReaderInput.value = saved.targetReader || defaults.targetReader;
  chapterGoalInput.value = saved.chapterGoal || defaults.chapterGoal;
  toneInput.value = saved.tone || defaults.tone;
  stylePrinciplesInput.value = saved.stylePrinciples || defaults.stylePrinciples;
  preferredExpressionsInput.value = saved.preferredExpressions || defaults.preferredExpressions;
  bannedExpressionsInput.value = saved.bannedExpressions || defaults.bannedExpressions;
  referenceStyleInput.value = saved.referenceStyle || defaults.referenceStyle;
  draftPreview.value = saved.draftMarkdown || "";

  if (draftPreview.value.trim()) {
    updateDraftEditState();
  } else {
    setDraftState("대기 중");
    draftMeta.textContent = "아직 생성된 원고가 없습니다.";
  }
}

function createProject() {
  saveActiveProject({ silent: true });
  const projects = loadProjects();
  const typedName = projectNameInput.value.trim();
  const hasSameName = projects.some((project) => project.name === typedName);
  const name = typedName && !hasSameName ? typedName : projectNameFallback(projects);
  const base = formSnapshot();
  const project = {
    id: makeProjectId(),
    name,
    bookTitle: typedName && !hasSameName ? bookTitleInput.value.trim() : "",
    form: {
      ...base,
      activeProjectId: "",
      projectName: name,
      bookTitle: typedName && !hasSameName ? bookTitleInput.value.trim() : "",
      chapterTitle: "",
      draftType: defaults.draftType,
      chapterTemplate: defaults.chapterTemplate,
      chapterNumber: "",
      includeCover: defaults.includeCover,
      includeToc: defaults.includeToc,
      bookContext: defaults.bookContext,
      targetReader: defaults.targetReader,
      chapterGoal: defaults.chapterGoal,
      tone: defaults.tone,
      draftMarkdown: "",
    },
    outline: [],
    updatedAt: new Date().toISOString(),
  };

  projects.push(project);
  activeProjectId = project.id;
  saveProjects(projects);
  localStorage.setItem(scopedStorageKey(BOOK_OUTLINE_STORAGE_KEY), "[]");
  isApplyingProject = true;
  renderProjects(projects);
  applyFormSnapshot(project.form);
  isApplyingProject = false;
  persistForm();
  obsidianDraftVersions = [];
  savedDrafts = [];
  renderBookOutline();
  renderSavedDrafts();
  renderDraftVersions();
  loadStatus();
  writeLog("새 책 프로젝트를 만들었습니다.");
}

function duplicateProject(projectId = activeProjectId) {
  saveActiveProject({ silent: true });
  const projects = loadProjects();
  const source = projects.find((project) => project.id === projectId);
  if (!source) {
    setProjectState("복제할 프로젝트 없음");
    return;
  }

  const newId = makeProjectId();
  const newName = `${source.name || defaults.projectName} 복사본`;
  const sourceOutline = Array.isArray(source.outline) ? source.outline : [];
  const duplicatedOutline = sourceOutline.map((item) => ({
    ...item,
    projectId: newId,
    projectName: newName,
    updatedAt: new Date().toISOString(),
  }));
  const duplicated = {
    ...source,
    id: newId,
    name: newName,
    form: {
      ...(source.form || {}),
      activeProjectId: newId,
      projectName: newName,
    },
    outline: duplicatedOutline,
    updatedAt: new Date().toISOString(),
  };

  projects.push(duplicated);
  activeProjectId = newId;
  saveProjects(projects);
  localStorage.setItem(scopedStorageKey(BOOK_OUTLINE_STORAGE_KEY), JSON.stringify(duplicatedOutline));
  isApplyingProject = true;
  renderProjects(projects);
  applyFormSnapshot({
    ...duplicated.form,
    projectName: duplicated.name,
    bookTitle: duplicated.bookTitle || duplicated.form?.bookTitle || "",
  });
  isApplyingProject = false;
  persistForm();
  renderBookOutline();
  loadStatus();
  writeLog(`책 프로젝트를 복제했습니다: ${newName}`);
}

function cacheDeletedProject(project) {
  localStorage.setItem(
    PROJECT_DELETE_UNDO_STORAGE_KEY,
    JSON.stringify({
      project,
      deletedAt: new Date().toISOString(),
    }),
  );
  renderProjectUndo();
}

function restoreDeletedProject() {
  const backup = deletedProjectBackup();
  if (!backup) {
    writeLog("복구할 삭제 프로젝트가 없습니다.");
    renderProjectUndo();
    return;
  }

  const projects = loadProjects();
  const restoredProject = {
    ...backup.project,
    updatedAt: new Date().toISOString(),
  };
  if (projects.some((project) => project.id === restoredProject.id)) {
    restoredProject.id = makeProjectId();
    restoredProject.name = `${restoredProject.name || defaults.projectName} 복구본`;
    restoredProject.form = {
      ...(restoredProject.form || {}),
      activeProjectId: restoredProject.id,
      projectName: restoredProject.name,
    };
    restoredProject.outline = Array.isArray(restoredProject.outline)
      ? restoredProject.outline.map((item) => ({ ...item, projectId: restoredProject.id, projectName: restoredProject.name }))
      : [];
  }

  projects.push(restoredProject);
  activeProjectId = restoredProject.id;
  saveProjects(projects);
  localStorage.setItem(scopedStorageKey(BOOK_OUTLINE_STORAGE_KEY), JSON.stringify(restoredProject.outline || []));
  localStorage.removeItem(PROJECT_DELETE_UNDO_STORAGE_KEY);
  isApplyingProject = true;
  renderProjects(projects);
  applyFormSnapshot({
    ...restoredProject.form,
    projectName: restoredProject.name,
    bookTitle: restoredProject.bookTitle || restoredProject.form?.bookTitle || "",
  });
  isApplyingProject = false;
  persistForm();
  renderBookOutline();
  loadStatus();
  setProjectState("복구됨");
  writeLog(`삭제한 책 프로젝트를 복구했습니다: ${restoredProject.name || "이름 없음"}`);
}

function collectLocalStorageByPrefix(prefix) {
  const values = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith(prefix)) {
      values[key] = localStorage.getItem(key);
    }
  }
  return values;
}

function projectBackupPayload() {
  saveActiveProject({ silent: true });
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    activeProjectId,
    form: formSnapshot(),
    projects: loadProjects(),
    draftVersions: loadDraftVersions(),
    outlines: collectLocalStorageByPrefix(BOOK_OUTLINE_STORAGE_KEY),
    entryInclusion: collectLocalStorageByPrefix(ENTRY_INCLUSION_STORAGE_KEY),
  };
}

function exportProjectBackup() {
  const payload = projectBackupPayload();
  const name = safePreviewName(projectNameInput.value || bookTitleInput.value || "book-projects");
  const date = toDateInputValue(new Date());
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${date}_${name}_backup.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setProjectState("백업 생성");
  writeLog(`프로젝트 백업 파일을 만들었습니다: ${link.download}`);
}

function validateProjectBackup(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("백업 파일 형식이 올바르지 않습니다.");
  }
  if (!Array.isArray(payload.projects) || !payload.projects.length) {
    throw new Error("백업 파일에 프로젝트 목록이 없습니다.");
  }
}

async function restoreProjectBackupFromFile(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) {
    return;
  }
  const text = await file.text();
  const payload = JSON.parse(text);
  validateProjectBackup(payload);
  if (!window.confirm("현재 브라우저의 프로젝트 목록을 선택한 백업으로 교체할까요?")) {
    return;
  }

  const normalizedProjects = payload.projects.map((project, index) => normalizeProject(project, index, payload.form || {}));
  const nextActiveProjectId = normalizedProjects.some((project) => project.id === payload.activeProjectId)
    ? payload.activeProjectId
    : normalizedProjects[0].id;

  localStorage.setItem(BOOK_PROJECTS_STORAGE_KEY, JSON.stringify(normalizedProjects));
  if (payload.form && typeof payload.form === "object") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...payload.form, activeProjectId: nextActiveProjectId }));
  }
  if (Array.isArray(payload.draftVersions)) {
    localStorage.setItem(DRAFT_VERSION_STORAGE_KEY, JSON.stringify(payload.draftVersions));
  }
  for (const [key, value] of Object.entries(payload.outlines || {})) {
    if (key.startsWith(BOOK_OUTLINE_STORAGE_KEY)) {
      localStorage.setItem(key, value);
    }
  }
  for (const [key, value] of Object.entries(payload.entryInclusion || {})) {
    if (key.startsWith(ENTRY_INCLUSION_STORAGE_KEY)) {
      localStorage.setItem(key, value);
    }
  }

  activeProjectId = nextActiveProjectId;
  const project = activeProject(normalizedProjects);
  isApplyingProject = true;
  renderProjects(normalizedProjects);
  applyFormSnapshot({
    ...(project.form || {}),
    projectName: project.name,
    bookTitle: project.bookTitle || project.form?.bookTitle || "",
  });
  isApplyingProject = false;
  persistForm();
  obsidianDraftVersions = [];
  savedDrafts = [];
  renderBookOutline();
  renderSavedDrafts();
  renderDraftVersions();
  loadStatus();
  setProjectState("백업 복원");
  writeLog(`프로젝트 백업을 복원했습니다: ${file.name}`);
}

function deleteProject(projectId = activeProjectId) {
  const projects = loadProjects();
  const target = projects.find((project) => project.id === projectId);
  if (!target) {
    setProjectState("삭제할 프로젝트 없음");
    return;
  }
  if (projects.length <= 1) {
    writeLog("프로젝트가 1개만 있을 때는 삭제할 수 없습니다. 새 프로젝트를 먼저 만들어 주세요.");
    setProjectState("삭제 불가");
    return;
  }
  if (!window.confirm(`책 프로젝트를 삭제할까요?\n${target.name || "이름 없음"}`)) {
    return;
  }

  cacheDeletedProject({
    ...target,
    outline: target.id === activeProjectId ? loadBookOutline() : target.outline || [],
  });
  const nextProjects = projects.filter((project) => project.id !== projectId);
  if (projectId === activeProjectId) {
    activeProjectId = nextProjects[0]?.id || "default";
  }
  saveProjects(nextProjects);
  localStorage.removeItem(`${BOOK_OUTLINE_STORAGE_KEY}:${projectId}`);
  const next = activeProject(nextProjects);
  isApplyingProject = true;
  renderProjects(nextProjects);
  applyFormSnapshot({
    ...next.form,
    projectName: next.name,
    bookTitle: next.bookTitle || next.form?.bookTitle || "",
  });
  isApplyingProject = false;
  persistForm();
  renderBookOutline();
  loadStatus();
  setProjectState("삭제됨");
  writeLog(`책 프로젝트를 삭제했습니다: ${target.name || "이름 없음"}`);
}

function switchProject(projectId) {
  if (!projectId || projectId === activeProjectId) {
    return;
  }
  saveActiveProject({ silent: true });
  const projects = loadProjects();
  const nextProject = projects.find((project) => project.id === projectId);
  if (!nextProject) {
    setProjectState("프로젝트 없음");
    return;
  }
  activeProjectId = nextProject.id;
  isApplyingProject = true;
  renderProjects(projects);
  applyFormSnapshot({
    ...nextProject.form,
    projectName: nextProject.name,
    bookTitle: nextProject.bookTitle || nextProject.form?.bookTitle || "",
  });
  isApplyingProject = false;
  persistForm();
  obsidianDraftVersions = [];
  savedDrafts = [];
  renderBookOutline();
  renderSavedDrafts();
  renderDraftVersions();
  loadStatus();
  writeLog(`책 프로젝트를 전환했습니다: ${nextProject.name}`);
}

function openWritingView() {
  persistForm();
  showView("writing");
}

function openRecentChapter() {
  const project = activeProject();
  const latest = latestOutlineItem(project);
  if (latest) {
    loadOutlineItem(latest);
  } else {
    writeLog("최근 챕터가 아직 없어 새 원고 작성 화면으로 이동합니다.");
  }
  showView("writing");
}

function handleProjectCardAction(event) {
  const button = event.target.closest("[data-project-action]");
  if (!button) {
    return;
  }
  const projectId = button.dataset.projectId || "";
  if (button.dataset.projectAction === "open") {
    if (projectId !== activeProjectId) {
      switchProject(projectId);
    }
    showView("writing");
    return;
  }
  if (button.dataset.projectAction === "duplicate") {
    duplicateProject(projectId);
    return;
  }
  if (button.dataset.projectAction === "delete") {
    deleteProject(projectId);
  }
}

function loadBookOutline() {
  try {
    const raw =
      localStorage.getItem(scopedStorageKey(BOOK_OUTLINE_STORAGE_KEY)) ||
      (activeProjectId === "default" ? localStorage.getItem(BOOK_OUTLINE_STORAGE_KEY) : "[]");
    const outline = JSON.parse(raw || "[]");
    return Array.isArray(outline) ? outline.filter((item) => item && item.id) : [];
  } catch {
    return [];
  }
}

function saveBookOutline(outline) {
  localStorage.setItem(scopedStorageKey(BOOK_OUTLINE_STORAGE_KEY), JSON.stringify(outline));
  saveActiveProject({ silent: true });
  renderProjectFocus(activeProject());
  renderProjectCards(loadProjects());
}

function currentChapterOutlineItem() {
  const title = chapterTitleInput.value.trim() || `${weekStartInput.value || "시작일"} - ${weekEndInput.value || "종료일"} 원고`;
  const markdown = draftPreview.value.trim();
  return {
    id: `${weekStartInput.value || "no-start"}|${weekEndInput.value || "no-end"}|${title}`,
    projectId: activeProjectId,
    projectName: projectNameInput.value.trim(),
    bookTitle: bookTitleInput.value.trim(),
    title,
    weekStart: weekStartInput.value,
    weekEnd: weekEndInput.value,
    draftType: draftTypeInput.value,
    bookContext: bookContextInput.value.trim(),
    targetReader: targetReaderInput.value.trim(),
    chapterGoal: chapterGoalInput.value.trim(),
    tone: toneInput.value.trim(),
    status: markdown ? "draft" : "brief",
    characterCount: characterCount(markdown),
    updatedAt: new Date().toISOString(),
  };
}

function renderBookOutline() {
  const outline = loadBookOutline();
  outlineCount.textContent = `${outline.length}개`;

  if (!outline.length) {
    outlineList.innerHTML = `
      <div class="empty-state">
        <strong>아직 목차에 등록된 챕터가 없습니다.</strong>
        <span>이번 챕터 브리프를 작성한 뒤 현재 챕터를 추가해 보세요.</span>
      </div>
    `;
    return;
  }

  outlineList.innerHTML = outline
    .map((item, index) => {
      const status = item.status === "draft" ? "초안 있음" : "브리프";
      const period = [item.weekStart, item.weekEnd].filter(Boolean).join(" - ") || "기간 미정";
      return `
        <article class="outline-item" data-outline-id="${escapeHtml(item.id)}">
          <div class="outline-index">${index + 1}</div>
          <div class="outline-body">
            <div class="outline-meta">
              <span>${escapeHtml(period)}</span>
              <span>${escapeHtml(draftTypeLabels[item.draftType] || "유형 미정")}</span>
              <span>${status}</span>
              <span>${item.characterCount || 0}자</span>
            </div>
            <h3>${escapeHtml(item.title || "제목 없음")}</h3>
            ${item.chapterGoal ? `<p>${escapeHtml(item.chapterGoal)}</p>` : ""}
          </div>
          <div class="outline-item-actions">
            <button type="button" class="ghost-button compact-button" data-outline-action="load" data-outline-id="${escapeHtml(item.id)}">열기</button>
            <button type="button" class="ghost-button compact-button" data-outline-action="up" data-outline-id="${escapeHtml(item.id)}">위</button>
            <button type="button" class="ghost-button compact-button" data-outline-action="down" data-outline-id="${escapeHtml(item.id)}">아래</button>
            <button type="button" class="ghost-button compact-button danger-action" data-outline-action="delete" data-outline-id="${escapeHtml(item.id)}">삭제</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function addCurrentChapterToOutline() {
  const item = currentChapterOutlineItem();
  const outline = loadBookOutline();
  const index = outline.findIndex((chapter) => chapter.id === item.id);
  if (index >= 0) {
    outline[index] = { ...outline[index], ...item };
  } else {
    outline.push(item);
  }
  saveBookOutline(outline);
  renderBookOutline();
  writeLog(index >= 0 ? "책 목차의 현재 챕터 정보를 업데이트했습니다." : "현재 챕터를 책 목차에 추가했습니다.");
}

function loadOutlineItem(item) {
  weekStartInput.value = item.weekStart || weekStartInput.value;
  weekEndInput.value = item.weekEnd || weekEndInput.value;
  chapterTitleInput.value = item.title || "";
  if (item.bookTitle) {
    bookTitleInput.value = item.bookTitle;
  }
  draftTypeInput.value = item.draftType || defaults.draftType;
  bookContextInput.value = item.bookContext || defaults.bookContext;
  targetReaderInput.value = item.targetReader || defaults.targetReader;
  chapterGoalInput.value = item.chapterGoal || defaults.chapterGoal;
  toneInput.value = item.tone || defaults.tone;
  persistForm();
  obsidianDraftVersions = [];
  renderDraftVersions();
  loadStatus();
  writeLog("목차에서 선택한 챕터 브리프를 불러왔습니다.");
}

function moveOutlineItem(outline, index, direction) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= outline.length) {
    return outline;
  }
  const copy = outline.slice();
  [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
  return copy;
}

function handleOutlineAction(event) {
  const button = event.target.closest("[data-outline-action]");
  if (!button) {
    return;
  }

  const outline = loadBookOutline();
  const id = button.dataset.outlineId || "";
  const index = outline.findIndex((item) => item.id === id);
  if (index === -1) {
    writeLog("선택한 목차 항목을 찾지 못했습니다.");
    return;
  }

  const action = button.dataset.outlineAction;
  if (action === "load") {
    loadOutlineItem(outline[index]);
    return;
  }
  if (action === "delete") {
    saveBookOutline(outline.filter((item) => item.id !== id));
    renderBookOutline();
    writeLog("목차 항목을 삭제했습니다.");
    return;
  }
  if (action === "up" || action === "down") {
    saveBookOutline(moveOutlineItem(outline, index, action === "up" ? -1 : 1));
    renderBookOutline();
  }
}

async function exportBookOutline() {
  const outline = loadBookOutline();
  if (!outline.length) {
    writeLog("저장할 책 목차가 없습니다.");
    return;
  }

  persistForm();
  setBusy(true);
  writeLog("책 목차를 Obsidian에 저장 중...");
  try {
    const data = await requestJson("/api/export-outline", {
      ...obsidianPayload(),
      outline,
    });
    renderStatus(data);
    writeLog(data.lastRun?.message || `책 목차를 저장했습니다: ${data.filePath}`);
  } catch (error) {
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

function currentChapterKey() {
  return [
    activeProjectId || "default",
    weekStartInput.value || "no-start",
    weekEndInput.value || "no-end",
    chapterTitleInput.value.trim() || "untitled",
  ].join("|");
}

function loadDraftVersions() {
  try {
    const versions = JSON.parse(localStorage.getItem(DRAFT_VERSION_STORAGE_KEY) || "[]");
    return Array.isArray(versions)
      ? versions.filter((version) => version && typeof version.markdown === "string")
      : [];
  } catch {
    return [];
  }
}

function saveDraftVersions(versions) {
  localStorage.setItem(DRAFT_VERSION_STORAGE_KEY, JSON.stringify(versions));
}

function updateDraftVersionRecord(versionId, patch) {
  const versions = loadDraftVersions();
  const index = versions.findIndex((version) => version.id === versionId);
  if (index === -1) {
    return null;
  }
  versions[index] = { ...versions[index], ...patch };
  saveDraftVersions(versions);
  renderDraftVersions();
  return versions[index];
}

function pruneDraftVersions(versions) {
  const counts = new Map();
  return versions
    .slice()
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .filter((version) => {
      const key = version.chapterKey || "";
      const count = counts.get(key) || 0;
      if (count >= MAX_DRAFT_VERSIONS_PER_CHAPTER) {
        return false;
      }
      counts.set(key, count + 1);
      return true;
    });
}

function currentDraftVersions() {
  const key = currentChapterKey();
  return loadDraftVersions()
    .filter((version) => version.chapterKey === key)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function allDraftVersions() {
  const key = currentChapterKey();
  const localVersions = currentDraftVersions();
  const localObsidianPaths = new Set(
    localVersions.map((version) => version.obsidianFilePath).filter(Boolean),
  );
  const remoteVersions = obsidianDraftVersions
    .filter((version) => version.chapterKey === key)
    .filter((version) => !localObsidianPaths.has(version.obsidianFilePath));

  return [...localVersions, ...remoteVersions].sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
  );
}

function formatVersionLabel(version) {
  const createdAt = version.createdAt ? new Date(version.createdAt) : null;
  const when = createdAt && !Number.isNaN(createdAt.valueOf()) ? createdAt.toLocaleString() : "날짜 없음";
  const source = version.source || "저장";
  const count = version.characterCount || characterCount(version.markdown);
  const archive = version.obsidianFilePath ? " · Obsidian 백업" : "";
  return `${when} · ${source} · ${count}자${archive}`;
}

function renderDraftVersions() {
  const versions = allDraftVersions();
  const archivedCount = versions.filter((version) => version.obsidianFilePath).length;
  versionState.textContent = `${versions.length}개`;
  saveDraftVersionButton.disabled = isBusyState || !draftPreview.value.trim();
  draftVersionSelect.disabled = isBusyState || versions.length === 0;
  restoreDraftVersionButton.disabled = isBusyState || versions.length === 0;
  compareDraftVersionButton.disabled = isBusyState || versions.length === 0 || !draftPreview.value.trim();

  if (!versions.length) {
    draftVersionSelect.innerHTML = '<option value="">저장된 버전 없음</option>';
    versionDiff.hidden = true;
    versionDiff.innerHTML = "";
    setVersionArchiveState("Obsidian 대기");
    return;
  }

  setVersionArchiveState(archivedCount === versions.length ? "Obsidian 백업됨" : `Obsidian ${archivedCount}/${versions.length}`);

  const selectedId = draftVersionSelect.value;
  draftVersionSelect.innerHTML = versions
    .map((version) => `<option value="${escapeHtml(version.id)}">${escapeHtml(formatVersionLabel(version))}</option>`)
    .join("");
  if (selectedId && versions.some((version) => version.id === selectedId)) {
    draftVersionSelect.value = selectedId;
  }
}

function draftVersionArchivePayload(version) {
  return {
    ...obsidianPayload(),
    markdown: version.markdown,
    versionId: version.id,
    versionSource: version.source,
    versionCreatedAt: version.createdAt,
    versionCharacterCount: version.characterCount,
  };
}

async function archiveDraftVersionToObsidian(version, options = {}) {
  if (!version || !version.markdown) {
    return null;
  }
  if (version.obsidianFilePath && !options.force) {
    setVersionArchiveState("Obsidian 백업됨");
    return version;
  }

  setVersionArchiveState("Obsidian 저장 중");
  try {
    const data = await requestJson("/api/export-draft-version", draftVersionArchivePayload(version));
    const updated = updateDraftVersionRecord(version.id, {
      obsidianFilePath: data.filePath,
      obsidianArchivedAt: new Date().toISOString(),
    });
    setVersionArchiveState("Obsidian 백업됨");
    if (!options.silent) {
      writeLog(data.versionArchiveMessage || "Obsidian에 원고 버전을 백업했습니다.");
    }
    return updated || version;
  } catch (error) {
    setVersionArchiveState("Obsidian 확인 필요");
    if (!options.silent) {
      writeLog(`브라우저에는 저장됐지만 Obsidian 백업은 실패했습니다.\n${error.message}`);
    }
    return version;
  }
}

function normalizeObsidianVersion(version) {
  return {
    ...version,
    id: version.id || `obsidian-${version.obsidianFilePath || Math.random().toString(36).slice(2)}`,
    chapterKey: currentChapterKey(),
    source: version.source || "Obsidian 백업",
    createdAt: version.createdAt || version.obsidianArchivedAt || new Date().toISOString(),
    markdown: version.markdown || "",
    characterCount: version.characterCount || characterCount(version.markdown),
    obsidianFilePath: version.obsidianFilePath || version.filePath || "",
  };
}

async function loadObsidianDraftVersions(options = {}) {
  persistForm();
  setVersionArchiveState("Obsidian 불러오는 중");
  if (!options.silent) {
    writeLog("Obsidian 원고 버전 목록을 불러오는 중...");
  }

  try {
    const data = await requestJson("/api/list-draft-versions", obsidianPayload());
    const currentKey = currentChapterKey();
    obsidianDraftVersions = [
      ...obsidianDraftVersions.filter((version) => version.chapterKey !== currentKey),
      ...(data.versions || []).map(normalizeObsidianVersion),
    ];
    renderDraftVersions();
    setVersionArchiveState(`Obsidian ${data.versions?.length || 0}개 불러옴`);
    if (!options.silent) {
      writeLog(data.lastRun?.message || "Obsidian 원고 버전을 불러왔습니다.");
    }
    return data.versions || [];
  } catch (error) {
    setVersionArchiveState("Obsidian 확인 필요");
    if (!options.silent) {
      writeLog(error.message);
    }
    return [];
  }
}

async function saveDraftVersion(source = "수동 저장", options = {}) {
  const markdown = draftPreview.value.trim();
  if (!markdown) {
    if (!options.silent) {
      setDraftState("저장할 원고 없음");
    }
    renderDraftVersions();
    return null;
  }

  const chapterKey = currentChapterKey();
  const versions = loadDraftVersions();
  const latest = versions
    .filter((version) => version.chapterKey === chapterKey)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];

  if (latest?.markdown === markdown && !options.force) {
    if (!options.silent) {
      setDraftState("이미 저장됨");
      writeLog("현재 원고는 최신 저장 버전과 같습니다.");
    }
    renderDraftVersions();
    await archiveDraftVersionToObsidian(latest, { silent: options.silent });
    return latest;
  }

  const version = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    chapterKey,
    createdAt: new Date().toISOString(),
    source,
    weekStart: weekStartInput.value,
    weekEnd: weekEndInput.value,
    chapterTitle: chapterTitleInput.value.trim(),
    draftType: draftTypeInput.value,
    markdown,
    characterCount: characterCount(markdown),
  };

  saveDraftVersions(pruneDraftVersions([version, ...versions]));
  renderDraftVersions();

  if (!options.silent) {
    setDraftState("버전 저장됨");
    draftMeta.textContent = `${version.characterCount}자 · ${source}`;
    writeLog("현재 원고 버전을 브라우저에 저장했습니다. Obsidian 백업을 이어서 진행합니다.");
  }
  return archiveDraftVersionToObsidian(version, { silent: options.silent });
}

function selectedDraftVersion() {
  const selectedId = draftVersionSelect.value;
  return allDraftVersions().find((version) => version.id === selectedId) || null;
}

async function restoreDraftVersion() {
  const version = selectedDraftVersion();
  if (!version) {
    writeLog("복원할 원고 버전을 선택해 주세요.");
    return;
  }

  const currentMarkdown = draftPreview.value.trim();
  if (currentMarkdown && currentMarkdown !== version.markdown) {
    await saveDraftVersion("복원 전 백업", { silent: true });
  }

  draftPreview.value = version.markdown;
  chapterSavedToObsidian = false;
  setDraftState("버전 복원됨");
  draftMeta.textContent = `${characterCount(version.markdown)}자 · ${formatVersionLabel(version)}에서 복원`;
  setReviewState("다시 점검 필요");
  versionDiff.hidden = true;
  versionDiff.innerHTML = "";
  renderDraftVersions();
  updateWritingFlowState();
  writeLog("선택한 원고 버전을 편집창으로 복원했습니다.");
}

function comparableBlocks(markdown) {
  return String(markdown || "")
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim().replace(/\n+/g, "\n"))
    .filter(Boolean);
}

function truncateDiffBlock(value) {
  const text = String(value || "").trim();
  if (text.length <= 420) {
    return text;
  }
  return `${text.slice(0, 420)}...`;
}

function diffOperations(baseBlocks, currentBlocks) {
  const rowCount = baseBlocks.length + 1;
  const columnCount = currentBlocks.length + 1;
  const table = Array.from({ length: rowCount }, () => Array(columnCount).fill(0));

  for (let row = baseBlocks.length - 1; row >= 0; row -= 1) {
    for (let column = currentBlocks.length - 1; column >= 0; column -= 1) {
      if (baseBlocks[row] === currentBlocks[column]) {
        table[row][column] = table[row + 1][column + 1] + 1;
      } else {
        table[row][column] = Math.max(table[row + 1][column], table[row][column + 1]);
      }
    }
  }

  const operations = [];
  let row = 0;
  let column = 0;
  while (row < baseBlocks.length && column < currentBlocks.length) {
    if (baseBlocks[row] === currentBlocks[column]) {
      operations.push({ type: "same", base: baseBlocks[row], current: currentBlocks[column] });
      row += 1;
      column += 1;
    } else if (table[row + 1][column] >= table[row][column + 1]) {
      operations.push({ type: "removed", base: baseBlocks[row], current: "" });
      row += 1;
    } else {
      operations.push({ type: "added", base: "", current: currentBlocks[column] });
      column += 1;
    }
  }

  while (row < baseBlocks.length) {
    operations.push({ type: "removed", base: baseBlocks[row], current: "" });
    row += 1;
  }
  while (column < currentBlocks.length) {
    operations.push({ type: "added", base: "", current: currentBlocks[column] });
    column += 1;
  }

  return operations;
}

function compactDiffOperations(operations) {
  const rows = [];
  let index = 0;

  while (index < operations.length) {
    const operation = operations[index];
    if (operation.type === "same") {
      rows.push(operation);
      index += 1;
      continue;
    }

    const removed = [];
    const added = [];
    while (index < operations.length && operations[index].type !== "same") {
      if (operations[index].type === "removed") {
        removed.push(operations[index].base);
      } else {
        added.push(operations[index].current);
      }
      index += 1;
    }

    const pairCount = Math.min(removed.length, added.length);
    for (let pairIndex = 0; pairIndex < pairCount; pairIndex += 1) {
      rows.push({
        type: "changed",
        base: removed[pairIndex],
        current: added[pairIndex],
      });
    }
    for (const block of removed.slice(pairCount)) {
      rows.push({ type: "removed", base: block, current: "" });
    }
    for (const block of added.slice(pairCount)) {
      rows.push({ type: "added", base: "", current: block });
    }
  }

  return rows;
}

function versionDiffSummary(baseMarkdown, currentMarkdown) {
  const baseBlocks = comparableBlocks(baseMarkdown);
  const currentBlocks = comparableBlocks(currentMarkdown);
  const rows = compactDiffOperations(diffOperations(baseBlocks, currentBlocks));
  const changedRows = rows.filter((row) => row.type !== "same");

  return {
    rows,
    changedRows,
    counts: {
      same: rows.filter((row) => row.type === "same").length,
      changed: rows.filter((row) => row.type === "changed").length,
      added: rows.filter((row) => row.type === "added").length,
      removed: rows.filter((row) => row.type === "removed").length,
    },
    baseCount: characterCount(baseMarkdown),
    currentCount: characterCount(currentMarkdown),
  };
}

function renderVersionComparison() {
  const version = selectedDraftVersion();
  const currentMarkdown = draftPreview.value.trim();
  if (!version || !currentMarkdown) {
    writeLog("비교할 원고와 저장된 버전이 필요합니다.");
    return;
  }

  const summary = versionDiffSummary(version.markdown, currentMarkdown);
  const delta = summary.currentCount - summary.baseCount;
  const visibleRows = summary.changedRows.slice(0, 30);
  const omittedCount = Math.max(0, summary.changedRows.length - visibleRows.length);
  const labels = {
    added: "추가",
    changed: "변경",
    removed: "삭제",
  };
  const rowHtml = visibleRows
    .map((row) => {
      const base = truncateDiffBlock(row.base);
      const current = truncateDiffBlock(row.current);
      return `
        <article class="version-diff-row is-${row.type}">
          <div class="version-diff-badge">${labels[row.type] || "차이"}</div>
          <div class="version-diff-cell">
            <span>선택 버전</span>
            ${base ? `<p>${escapeHtml(base)}</p>` : '<p class="empty-diff-cell">없음</p>'}
          </div>
          <div class="version-diff-cell">
            <span>현재 원고</span>
            ${current ? `<p>${escapeHtml(current)}</p>` : '<p class="empty-diff-cell">없음</p>'}
          </div>
        </article>
      `;
    })
    .join("");

  versionDiff.hidden = false;
  versionDiff.innerHTML = `
    <div class="version-diff-summary">
      <strong>${escapeHtml(formatVersionLabel(version))}</strong>
      <span>현재 원고 ${summary.currentCount}자 · 선택 버전 ${summary.baseCount}자 · 차이 ${delta >= 0 ? "+" : ""}${delta}자</span>
    </div>
    <div class="version-diff-stats" aria-label="원고 차이 요약">
      <span>변경 ${summary.counts.changed}</span>
      <span>추가 ${summary.counts.added}</span>
      <span>삭제 ${summary.counts.removed}</span>
      <span>동일 ${summary.counts.same}</span>
    </div>
    ${
      visibleRows.length
        ? `<div class="version-diff-list">${rowHtml}</div>`
        : '<p class="version-diff-empty">선택한 버전과 현재 원고가 같습니다.</p>'
    }
    ${omittedCount ? `<p class="version-diff-more">차이 ${omittedCount}개는 목록에서 줄였습니다.</p>` : ""}
  `;
}

async function requestJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data.ok) {
    const detail = [data.error, data.stderr, data.stdout].filter(Boolean).join("\n\n");
    throw new Error(detail || "Request failed.");
  }
  return data;
}

function selectedIdeaType() {
  return document.querySelector("input[name='ideaType']:checked")?.value || "case";
}

function entryInclusionKey() {
  return scopedStorageKey(ENTRY_INCLUSION_STORAGE_KEY);
}

function loadEntryInclusion() {
  return readStoredJson(entryInclusionKey(), {});
}

function saveEntryInclusion(map) {
  localStorage.setItem(entryInclusionKey(), JSON.stringify(map));
}

function isEntryIncluded(entryId) {
  const inclusion = loadEntryInclusion();
  return inclusion[entryId] !== false;
}

function includedEntryIds() {
  return currentEntries.filter((entry) => isEntryIncluded(entry.id)).map((entry) => entry.id);
}

function setEntryIncluded(entryId, included) {
  const inclusion = loadEntryInclusion();
  inclusion[entryId] = included;
  saveEntryInclusion(inclusion);
  renderEntries(currentEntries);
  renderPreflightChecklist();
  persistForm();
}

function exportOptionsPayload() {
  return {
    chapterNumber: chapterNumberInput.value.trim(),
    includeCover: includeCoverInput.checked,
    includeToc: includeTocInput.checked,
  };
}

function commonPayload() {
  return {
    projectId: activeProjectId,
    projectName: projectNameInput.value.trim(),
    bookTitle: bookTitleInput.value.trim(),
    exportTemplate: exportTemplateInput.value,
    weekStart: weekStartInput.value,
    weekEnd: weekEndInput.value,
    chapterTitle: chapterTitleInput.value.trim(),
    draftType: draftTypeInput.value,
    chapterTemplate: chapterTemplateInput.value,
    includedEntryIds: includedEntryIds(),
    exportOptions: exportOptionsPayload(),
    bookContext: bookContextInput.value.trim(),
    targetReader: targetReaderInput.value.trim(),
    chapterGoal: chapterGoalInput.value.trim(),
    tone: toneInput.value.trim(),
    styleGuide: {
      principles: stylePrinciplesInput.value.trim(),
      preferredExpressions: preferredExpressionsInput.value.trim(),
      bannedExpressions: bannedExpressionsInput.value.trim(),
      referenceStyle: referenceStyleInput.value.trim(),
    },
  };
}

function obsidianPayload() {
  return {
    ...commonPayload(),
    vault: vaultInput.value.trim(),
    folder: folderInput.value.trim(),
    tags: tagsInput.value.trim(),
    chapterFolder: chapterFolderInput.value.trim(),
    chapterTitle: chapterTitleInput.value.trim(),
    llmModel: llmModelInput.value.trim(),
    expandWithLlm: expandWithLlmInput.checked,
    includeAll: includeAllInput.checked,
  };
}

function editedDraftPayload() {
  return {
    ...obsidianPayload(),
    markdown: draftPreview.value.trim(),
  };
}

function draftReviewPayload(options = {}) {
  return {
    ...obsidianPayload(),
    markdown: draftPreview.value.trim(),
    reviewWithLlm: options.reviewWithLlm !== false,
  };
}

function polishDraftPayload() {
  return {
    ...editedDraftPayload(),
    polishWithLlm: expandWithLlmInput.checked,
  };
}

function manuscriptExportPayload(format) {
  return {
    ...editedDraftPayload(),
    format,
    preparedMarkdown: exportPreviewMarkdown(),
  };
}

function ideaPayload() {
  return {
    ...commonPayload(),
    id: editingEntryId,
    registeredAt: ideaDateInput.value,
    type: selectedIdeaType(),
    title: ideaTitleInput.value.trim(),
    detail: ideaDetailInput.value.trim(),
    context: ideaContextInput.value.trim(),
    tags: ideaTagsInput.value.trim(),
    importance: importanceInput.value,
  };
}

function persistForm() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(formSnapshot()),
  );
  saveActiveProject({ silent: true });
}

function restoreForm() {
  const saved = readStoredJson(STORAGE_KEY, {});
  const projects = loadProjects();
  activeProjectId = saved.activeProjectId || activeProjectId;
  if (!projects.some((project) => project.id === activeProjectId)) {
    activeProjectId = projects[0]?.id || "default";
  }
  const project = activeProject(projects);
  isApplyingProject = true;
  renderProjects(projects);
  applyFormSnapshot({
    ...saved,
    ...project.form,
    projectName: project.name || saved.projectName || defaults.projectName,
    bookTitle: project.bookTitle || project.form?.bookTitle || saved.bookTitle || "",
  });
  isApplyingProject = false;
  renderProjects(projects);
}

function renderStatus(data) {
  const entries = data.entries || [];
  manualCount.textContent = `이번 주 재료 ${entries.length}개`;
  obsidianCount.textContent = `Obsidian ${data.obsidianRows || 0}개`;
  promptPath.textContent = data.promptPath || "";
  promptPreview.value = data.prompt || "";
  renderObsidianConnection(data.obsidianConnection);
  renderLlmConnection(data.llmConnection);
  renderEntries(entries);
  renderPreflightChecklist();
  updateObsidianPreview();
  if (Object.prototype.hasOwnProperty.call(data, "markdown")) {
    renderDraft(data);
  }
  if (Object.prototype.hasOwnProperty.call(data, "review")) {
    renderReview(data);
  }
  renderLastRun(data.lastRun);
}

function renderLlmConnection(connection) {
  if (!connection) {
    llmConnectionStatus.textContent = "LLM 미확인";
    llmConnectionNote.textContent = "LLM 연결 상태를 아직 확인하지 못했습니다.";
    return;
  }

  if (connection.configured) {
    const provider = connection.provider === "azure-openai" ? "Azure OpenAI" : "OpenAI";
    const model = llmModelInput.value.trim() || connection.model || "기본 모델";
    llmConnectionStatus.textContent = `${provider} 연결됨`;
    llmConnectionNote.textContent = `${provider} · model=${model} · endpoint=${connection.endpoint || "기본값"}`;
    return;
  }

  llmConnectionStatus.textContent = "LLM 키 필요";
  llmConnectionNote.textContent = "API 키가 없으면 구조화 초안과 기본 점검 규칙으로 동작합니다. .env에 키를 넣으면 AI 확장이 활성화됩니다.";
}

function renderObsidianConnection(connection) {
  if (!connection) {
    obsidianConnectionStatus.textContent = "Obsidian 미확인";
    obsidianConnectionNote.textContent = "Obsidian 연결 상태를 아직 확인하지 못했습니다.";
    obsidianReadState.textContent = "확인 대기";
    obsidianWriteState.textContent = "확인 대기";
    return;
  }

  if (connection.connected && connection.defaultVaultPath) {
    detectedVaultPath = connection.defaultVaultPath;
    obsidianConnectionStatus.textContent = "Obsidian 연결됨";
    obsidianConnectionNote.textContent = `연결된 vault: ${connection.defaultVaultPath}`;
    obsidianReadState.textContent = "Vault 자동 감지됨";
    obsidianWriteState.textContent = "저장 경로 미리보기 가능";
    if (!vaultInput.value.trim()) {
      vaultInput.value = connection.defaultVaultPath;
      persistForm();
    }
    return;
  }

  if (connection.installed) {
    obsidianConnectionStatus.textContent = "Obsidian 경로 필요";
    obsidianConnectionNote.textContent = "Obsidian은 설치되어 있지만 연결된 vault를 찾지 못했습니다.";
    obsidianReadState.textContent = "Vault 경로 필요";
    obsidianWriteState.textContent = "Vault 확인 후 저장 가능";
    return;
  }

  obsidianConnectionStatus.textContent = "Obsidian 미설치";
  obsidianConnectionNote.textContent = "이 PC에서 Obsidian 앱을 찾지 못했습니다.";
  obsidianReadState.textContent = "앱 확인 필요";
  obsidianWriteState.textContent = "앱 확인 필요";
}

function safePreviewName(value) {
  return String(value || "book-draft")
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120) || "book-draft";
}

function updateObsidianPreview(check = null) {
  if (check?.savePreview) {
    obsidianSavePreview.textContent = `저장 위치: ${check.savePreview}`;
    obsidianWriteState.textContent = check.vaultExists ? "저장 위치 확인됨" : "Vault 확인 필요";
    return;
  }
  const vault = vaultInput.value.trim() || "(자동 감지 vault)";
  const folder = chapterFolderInput.value.trim() || "Book Drafts";
  const project = safePreviewName(projectNameInput.value || bookTitleInput.value || activeProjectId);
  const title = safePreviewName(chapterTitleInput.value || "챕터 제목");
  obsidianSavePreview.textContent = `저장 위치 미리보기: ${vault}/${folder}/${project}/${title}.md`;
  obsidianWriteState.textContent = vaultInput.value.trim() ? "저장 위치 미리보기" : "자동 감지 대기";
}

function renderObsidianCheck(data) {
  detectedVaultPath = data.obsidianConnection?.defaultVaultPath || detectedVaultPath;
  const parts = [];
  if (data.vaultPath) {
    parts.push(data.vaultExists ? `Vault 확인: ${data.vaultPath}` : `Vault 없음: ${data.vaultPath}`);
  } else {
    parts.push("Vault 경로를 입력하거나 Obsidian에서 vault를 열어 주세요.");
  }
  if (data.importFolder) {
    parts.push(data.importFolderExists ? `가져올 폴더 확인: ${data.importFolder}` : `가져올 폴더 없음: ${data.importFolder}`);
  }
  if (data.savePreview) {
    parts.push(`저장 예정 위치: ${data.savePreview}`);
  }
  obsidianConnectionNote.textContent = parts.join(" · ");
  obsidianConnectionStatus.textContent = data.connected ? "Obsidian 연결됨" : "Obsidian 확인 필요";
  obsidianReadState.textContent = data.importFolder
    ? data.importFolderExists ? "가져오기 폴더 확인됨" : "가져오기 폴더 확인 필요"
    : data.vaultExists ? "Vault 확인됨" : "Vault 확인 필요";
  obsidianWriteState.textContent = data.savePreview
    ? data.vaultExists ? "원고 저장 가능" : "Vault 확인 필요"
    : "저장 경로 확인 필요";
  updateObsidianPreview(data);
}

function applyDetectedVault() {
  const vaultPath = detectedVaultPath || vaultInput.value.trim();
  if (!vaultPath) {
    writeLog("자동 감지된 Obsidian vault가 없습니다. Vault 경로를 직접 입력해 주세요.");
    obsidianReadState.textContent = "Vault 경로 필요";
    return;
  }

  vaultInput.value = vaultPath;
  persistForm();
  updateObsidianPreview();
  writeLog(`감지된 Obsidian vault 경로를 적용했습니다: ${vaultPath}`);
}

async function testObsidianConnection() {
  persistForm();
  setBusy(true);
  writeLog("Obsidian 연결을 테스트하는 중...");
  try {
    const data = await requestJson("/api/check-obsidian", obsidianPayload());
    renderObsidianConnection(data.obsidianConnection);
    renderObsidianCheck(data);
    writeLog(data.message || "Obsidian 연결 테스트를 완료했습니다.");
  } catch (error) {
    obsidianConnectionStatus.textContent = "Obsidian 확인 필요";
    obsidianConnectionNote.textContent = error.message;
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

async function testLlmSample() {
  persistForm();
  setBusy(true);
  llmSampleOutput.textContent = "샘플 원고 문장을 생성하는 중...";
  writeLog("LLM 샘플 생성을 테스트하는 중...");
  try {
    const data = await requestJson("/api/test-llm", {
      ...commonPayload(),
      llmModel: llmModelInput.value.trim(),
    });
    renderLlmConnection(data.llmConnection);
    renderLastRun(data.lastRun);
    llmSampleOutput.textContent = data.sample || "샘플 응답이 비어 있습니다.";
    writeLog(data.lastRun?.message || "LLM 샘플 생성을 완료했습니다.");
  } catch (error) {
    llmConnectionStatus.textContent = "LLM 확인 필요";
    llmSampleOutput.textContent = error.message;
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

function renderOpsCheck(data) {
  const checks = data.checks || [];
  const okCount = checks.filter((item) => item.status === "ok").length;
  const warnCount = checks.filter((item) => item.status === "warn").length;
  const errorCount = checks.filter((item) => item.status === "error").length;
  opsState.textContent = errorCount
    ? `확인 필요 ${errorCount}`
    : warnCount
      ? `주의 ${warnCount}`
      : `정상 ${okCount}`;
  if (!checks.length) {
    opsCheckList.innerHTML = `
      <div class="empty-state">
        <strong>운영 점검 결과가 없습니다.</strong>
      </div>
    `;
    return;
  }
  opsCheckList.innerHTML = checks
    .map((item) => `
      <article class="ops-check-item is-${escapeHtml(item.status || "warn")}">
        <strong>${escapeHtml(item.label || "점검 항목")}</strong>
        <span>${escapeHtml(item.message || "")}</span>
        ${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ""}
      </article>
    `)
    .join("");
}

async function runOperationalCheck() {
  persistForm();
  setBusy(true);
  opsState.textContent = "점검 중";
  writeLog("운영 점검을 실행하는 중...");
  try {
    const data = await requestJson("/api/operational-check", {
      ...obsidianPayload(),
      markdown: draftPreview.value.trim(),
    });
    renderOpsCheck(data);
    renderLastRun(data.lastRun);
    writeLog(data.lastRun?.message || "운영 점검을 완료했습니다.");
  } catch (error) {
    opsState.textContent = "확인 필요";
    opsCheckList.innerHTML = `
      <article class="ops-check-item is-error">
        <strong>운영 점검 실패</strong>
        <span>${escapeHtml(error.message)}</span>
      </article>
    `;
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

function preflightItems() {
  const selectedCount = includedEntryIds().length;
  return [
    {
      label: "챕터 브리프",
      ok: briefReady(),
      detail: briefReady() ? "제목과 기간이 준비됐습니다." : "챕터 제목과 기간을 먼저 적어 주세요.",
    },
    {
      label: "원고 재료",
      ok: selectedCount > 0,
      detail: selectedCount > 0 ? `${selectedCount}개 재료를 반영합니다.` : "반영할 재료를 1개 이상 선택해 주세요.",
    },
    {
      label: "심화 설정",
      ok: Boolean(targetReaderInput.value.trim() && chapterGoalInput.value.trim()),
      detail: targetReaderInput.value.trim() && chapterGoalInput.value.trim() ? "독자와 목표가 잡혔습니다." : "독자와 목표를 입력하면 원고 방향이 더 선명해집니다.",
    },
    {
      label: "분량 단서",
      ok: currentEntries.some((entry) => isEntryIncluded(entry.id) && characterCount(entry.description) >= 80),
      detail: "구체적인 장면이나 설명이 긴 재료가 있으면 초안 품질이 좋아집니다.",
    },
  ];
}

function renderPreflightChecklist() {
  const items = preflightItems();
  const okCount = items.filter((item) => item.ok).length;
  preflightState.textContent = `${okCount}/${items.length} 준비`;
  preflightChecklist.innerHTML = items
    .map((item) => `
      <div class="preflight-item ${item.ok ? "is-ok" : "is-warn"}">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.detail)}</span>
      </div>
    `)
    .join("");
  updateWritingFlowState();
}

function generationReady() {
  const requiredLabels = new Set(["챕터 브리프", "원고 재료"]);
  const blockers = preflightItems()
    .filter((item) => !item.ok && requiredLabels.has(item.label))
    .map((item) => item.detail);
  if (!blockers.length) {
    return true;
  }
  writeLog(`초안 생성 전 확인이 필요합니다.\n- ${blockers.join("\n- ")}`);
  setDraftState("확인 필요");
  return false;
}

function renderEntries(entries) {
  currentEntries = entries;
  updateWritingFlowState();

  if (!entries.length) {
    entryList.innerHTML = `
      <div class="empty-state">
        <strong>아직 원고 재료가 없습니다.</strong>
        <span>${escapeHtml(formatDateRange())} 기간에 등록된 재료만 표시됩니다.</span>
      </div>
    `;
    return;
  }

  entryList.innerHTML = entries
    .map((entry) => {
      const type = typeLabels[entry.type] || entry.type || "항목";
      const source = entry.sourceFile === "obsidian" ? "Obsidian" : "직접 등록";
      const canEdit = entry.sourceFile === "manual";
      const included = isEntryIncluded(entry.id);
      return `
        <article class="entry-item" data-entry-id="${escapeHtml(entry.id || "")}">
          <div class="entry-meta">
            <span>${entry.registered_at || "-"}</span>
            <span>${type}</span>
            <span>${source}</span>
            <span>${included ? "원고 반영" : "보류"}</span>
          </div>
          <h3>${escapeHtml(entry.term || "제목 없음")}</h3>
          <p>${escapeHtml(entry.description || "")}</p>
          ${entry.context ? `<small>${escapeHtml(entry.context)}</small>` : ""}
          <label class="check-row entry-include">
            <input type="checkbox" data-entry-action="include" data-entry-id="${escapeHtml(entry.id)}" ${included ? "checked" : ""} />
            <span>이번 원고에 반영</span>
          </label>
          ${
            canEdit
              ? `<div class="entry-actions">
                  <button type="button" class="ghost-button compact-button" data-entry-action="edit" data-entry-id="${escapeHtml(entry.id)}">수정</button>
                  <button type="button" class="ghost-button compact-button danger-action" data-entry-action="delete" data-entry-id="${escapeHtml(entry.id)}">삭제</button>
                </div>`
              : `<div class="entry-actions muted-action">Obsidian 원본에서 수정</div>`
          }
        </article>
      `;
    })
    .join("");
}

function renderDraft(data) {
  const markdown = data.markdown || "";
  draftPreview.value = markdown;
  chapterSavedToObsidian = false;
  if (!markdown.trim()) {
    setDraftState("대기 중");
    draftMeta.textContent = "아직 생성된 원고가 없습니다.";
    renderDraftVersions();
    updateWritingFlowState();
    return;
  }

  const entryCountText = `${(data.entries || []).length}개 재료`;
  const statusLabels = {
    disabled: "구조 초안",
    edited: "Obsidian 저장됨",
    expanded: "AI 확장 완료",
    polished: "출판 정리 완료",
    skipped: "구조 초안",
  };
  const llmText = statusLabels[data.llmStatus] || "초안 준비됨";
  setDraftState(llmText);
  draftMeta.textContent = [entryCountText, data.llmMessage || llmText].filter(Boolean).join(" · ");
  renderDraftVersions();
  updateWritingFlowState();
}

function renderMarkdown(value) {
  const lines = String(value || "").split(/\r?\n/);
  const html = [];
  let listOpen = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      const level = Math.min(heading[1].length + 2, 4);
      html.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(bullet[1])}</li>`);
      continue;
    }

    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  if (listOpen) {
    html.push("</ul>");
  }
  return html.join("");
}

function draftWithoutFrontmatter(markdown) {
  return String(markdown || "").replace(/^---[\s\S]*?\n---\s*/m, "").trim();
}

function exportPreviewMarkdown() {
  const body = draftWithoutFrontmatter(draftPreview.value);
  if (!body) {
    return "";
  }
  const title = chapterTitleInput.value.trim() || body.match(/^#\s+(.+)$/m)?.[1]?.trim() || "원고";
  const chapterNumber = chapterNumberInput.value.trim();
  const displayTitle = chapterNumber && !/^제\s*\S+\s*장/.test(title) ? `제 ${chapterNumber}장. ${title}` : title;
  const headings = body
    .split(/\r?\n/)
    .map((line) => line.match(/^##\s+(.+)$/))
    .filter(Boolean)
    .map((match) => `- ${match[1].trim()}`);
  const lines = [];
  if (includeCoverInput.checked) {
    lines.push(`# ${bookTitleInput.value.trim() || projectNameInput.value.trim() || "책 원고"}`, "", `## ${displayTitle}`, "", `- 프로젝트: ${projectNameInput.value.trim() || "미정"}`, `- 기간: ${weekStartInput.value || "시작일"} - ${weekEndInput.value || "종료일"}`, "");
  }
  if (includeTocInput.checked && headings.length) {
    lines.push("## 목차", "", ...headings, "");
  }
  lines.push(body.replace(/^#\s+(.+)$/m, `# ${displayTitle}`));
  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function renderExportPreview() {
  const markdown = exportPreviewMarkdown();
  if (!markdown) {
    exportPreview.hidden = false;
    exportPreviewState.textContent = "확인 필요";
    exportPreviewBody.textContent = "미리볼 원고 초안을 먼저 만들거나 직접 입력해 주세요.";
    return;
  }
  exportPreview.hidden = false;
  exportPreviewState.textContent = `${characterCount(markdown)}자`;
  exportPreviewBody.innerHTML = renderMarkdown(markdown);
}

function renderExportResult(data, format) {
  exportResult.hidden = false;
  exportResultState.textContent = `${format.toUpperCase()} 완료`;
  const filePath = data.filePath || "";
  const markdownPath = data.markdownPath || "";
  const downloadUrl = data.downloadUrl || "";
  exportResultBody.innerHTML = `
    <p>${escapeHtml(data.lastRun?.message || `${format.toUpperCase()} 파일을 만들었습니다.`)}</p>
    ${filePath ? `<p><strong>파일</strong><br>${escapeHtml(filePath)}</p>` : ""}
    ${markdownPath ? `<p><strong>Markdown</strong><br>${escapeHtml(markdownPath)}</p>` : ""}
    ${downloadUrl ? `<p><a class="download-link" href="${escapeHtml(downloadUrl)}">다운로드</a></p>` : ""}
  `;
}

function renderReview(data) {
  const review = data.review || "";
  if (!review.trim()) {
    setReviewState("대기 중");
    reviewOutput.textContent = "초안을 만든 뒤 품질 점검을 실행해 주세요.";
    return;
  }

  setReviewState(data.reviewStatus === "ai" ? "AI 점검 완료" : "체크리스트 완료");
  reviewOutput.innerHTML = renderMarkdown(review);
}

function renderSavedDrafts() {
  savedDraftCount.textContent = `${savedDrafts.length}개`;
  if (!savedDrafts.length) {
    savedDraftList.innerHTML = `
      <div class="empty-state">
        <strong>아직 불러온 저장본이 없습니다.</strong>
        <span>Obsidian 원고함을 연결한 뒤 저장본 새로고침을 눌러 주세요.</span>
      </div>
    `;
    return;
  }

  savedDraftList.innerHTML = savedDrafts
    .map((draft) => {
      const type = draft.kind === "outline" ? "목차" : draftTypeLabels[draft.draftType] || "원고";
      const updatedAt = draft.updatedAt ? new Date(draft.updatedAt) : null;
      const updatedText = updatedAt && !Number.isNaN(updatedAt.valueOf()) ? updatedAt.toLocaleString() : "날짜 없음";
      return `
        <article class="saved-draft-item" data-saved-draft-id="${escapeHtml(draft.id)}">
          <div class="outline-meta">
            <span>${escapeHtml(type)}</span>
            <span>${escapeHtml(updatedText)}</span>
            <span>버전 ${draft.versionCount || 0}개</span>
            <span>${draft.characterCount || 0}자</span>
          </div>
          <h3>${escapeHtml(draft.title || "제목 없음")}</h3>
          <p>${escapeHtml(draft.filePath || "")}</p>
          <div class="entry-actions">
            <button type="button" class="ghost-button compact-button" data-saved-draft-action="load" data-saved-draft-id="${escapeHtml(draft.id)}">불러오기</button>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadSavedDrafts() {
  persistForm();
  setBusy(true);
  writeLog("Obsidian 저장본 목록을 불러오는 중...");
  try {
    const data = await requestJson("/api/list-saved-drafts", obsidianPayload());
    savedDrafts = data.savedDrafts || [];
    renderSavedDrafts();
    renderLastRun(data.lastRun);
    writeLog(data.lastRun?.message || "Obsidian 저장본 목록을 불러왔습니다.");
  } catch (error) {
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

function loadSavedDraft(draftId) {
  const draft = savedDrafts.find((item) => item.id === draftId);
  if (!draft) {
    writeLog("선택한 저장본을 찾지 못했습니다.");
    return;
  }

  chapterTitleInput.value = draft.title || chapterTitleInput.value;
  draftTypeInput.value = draft.draftType || draftTypeInput.value;
  weekStartInput.value = draft.weekStart || weekStartInput.value;
  weekEndInput.value = draft.weekEnd || weekEndInput.value;
  draftPreview.value = draft.markdown || "";
  persistForm();
  renderDraft({ markdown: draft.markdown || "", entries: currentEntries, llmStatus: "edited", llmMessage: "Obsidian 저장본을 불러왔습니다." });
  writeLog("Obsidian 저장본을 편집창으로 불러왔습니다.");
}

function handleSavedDraftAction(event) {
  const button = event.target.closest("[data-saved-draft-action]");
  if (!button) {
    return;
  }
  if (button.dataset.savedDraftAction === "load") {
    loadSavedDraft(button.dataset.savedDraftId || "");
  }
}

function updateDraftEditState() {
  const text = draftPreview.value.trim();
  chapterSavedToObsidian = false;
  if (!text) {
    setDraftState("대기 중");
    draftMeta.textContent = "아직 생성된 원고가 없습니다.";
    updateWritingFlowState();
    return;
  }

  setDraftState("편집 중");
  draftMeta.textContent = `${characterCount(text)}자 편집본`;
  setReviewState("다시 점검 필요");
  renderDraftVersions();
  updateWritingFlowState();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderLastRun(lastRun) {
  if (!lastRun) {
    lastRunStatus.textContent = "기록 없음";
    lastRunWhen.textContent = "-";
    lastRunMessage.textContent = "아직 실행 기록이 없습니다.";
    return;
  }

  const actionLabels = {
    "add-idea": "아이디어 등록",
    "check-obsidian": "Obsidian 연결 테스트",
    "delete-idea": "재료 삭제",
    "build-prompt": "원고 초안 생성",
    "generate-chapter": "AI 초안 생성",
    "export-chapter": "Obsidian 원고 저장",
    "export-draft-version": "원고 버전 백업",
    "export-manuscript": "원고 파일 내보내기",
    "export-outline": "책 목차 저장",
    "import-obsidian": "Obsidian 가져오기",
    "list-saved-drafts": "Obsidian 저장본 목록",
    "operational-check": "운영 점검",
    "polish-draft": "출판 원고 정리",
    "review-draft": "원고 품질 점검",
    "test-llm": "LLM 샘플 테스트",
    "update-idea": "재료 수정",
  };
  const statusLabel = lastRun.status === "success" ? "완료" : "확인 필요";
  const actionLabel = actionLabels[lastRun.action] || lastRun.action || "실행";
  const updatedAt = lastRun.updatedAt ? new Date(lastRun.updatedAt) : null;

  lastRunStatus.textContent = `${actionLabel} ${statusLabel}`;
  lastRunWhen.textContent =
    updatedAt && !Number.isNaN(updatedAt.valueOf()) ? updatedAt.toLocaleString() : "-";
  lastRunMessage.textContent = lastRun.message || lastRun.stdout || "메시지가 없습니다.";

  if (!log.textContent.trim()) {
    writeLog(lastRun.message || lastRun.stdout || "");
  }
}

async function loadStatus() {
  const params = new URLSearchParams({
    projectId: activeProjectId,
    weekStart: weekStartInput.value,
    weekEnd: weekEndInput.value,
  });
  try {
    const response = await fetch(`/api/status?${params.toString()}`);
    const data = await response.json();
    if (data.ok) {
      statusErrorShown = false;
      renderStatus(data);
    }
  } catch (error) {
    if (!statusErrorShown) {
      statusErrorShown = true;
      writeLog(`상태 조회를 잠시 가져오지 못했습니다. UI 서버가 실행 중인지 확인해 주세요.\n${error.message}`);
    }
  }
}

function clearIdeaForm() {
  ideaTitleInput.value = "";
  ideaDetailInput.value = "";
  ideaContextInput.value = "";
  ideaDateInput.value = weekEndInput.value || toDateInputValue(new Date());
  exitEditMode();
  updateInputMeters();
  ideaTitleInput.focus();
}

function selectIdeaType(type) {
  const option = document.querySelector(`input[name='ideaType'][value='${type}']`);
  if (option) {
    option.checked = true;
  }
}

function exitEditMode() {
  editingEntryId = "";
  addIdeaButton.textContent = "재료 추가";
  cancelEditButton.hidden = true;
}

function startEditEntry(entry) {
  editingEntryId = entry.id;
  ideaDateInput.value = entry.registered_at || weekEndInput.value || toDateInputValue(new Date());
  selectIdeaType(entry.type || "case");
  ideaTitleInput.value = entry.term || "";
  ideaDetailInput.value = entry.description || "";
  ideaContextInput.value = entry.context || "";
  ideaTagsInput.value = entry.tags || "";
  importanceInput.value = entry.importance || "medium";
  addIdeaButton.textContent = "수정 저장";
  cancelEditButton.hidden = false;
  updateInputMeters();
  persistForm();
  setSaveState("수정 중");
  ideaTitleInput.focus();
}

function fillWritingExample() {
  exitEditMode();
  ideaDateInput.value = weekEndInput.value || toDateInputValue(new Date());
  selectIdeaType(writingExample.type);
  ideaTitleInput.value = writingExample.title;
  ideaDetailInput.value = writingExample.detail;
  ideaContextInput.value = writingExample.context;
  ideaTagsInput.value = writingExample.tags;
  importanceInput.value = writingExample.importance;
  updateInputMeters();
  persistForm();
  setSaveState("예시 입력됨");
  writeLog("작성 예시를 입력칸에 채웠습니다. 저장하려면 등록을 누르세요.");
  ideaDetailInput.focus();
}

async function addIdea(event) {
  event.preventDefault();
  persistForm();
  setBusy(true);
  const isEditing = Boolean(editingEntryId);
  setSaveState(isEditing ? "수정 중" : "저장 중");
  try {
    const data = await requestJson(isEditing ? "/api/update-idea" : "/api/add-idea", ideaPayload());
    renderStatus(data);
    writeLog(data.lastRun?.message || (isEditing ? "원고 재료를 수정했습니다." : "아이디어를 등록했습니다."));
    setSaveState(isEditing ? "수정됨" : "저장됨");
    setDraftState("재료 준비됨");
    clearIdeaForm();
  } catch (error) {
    setSaveState("확인 필요");
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

async function deleteEntry(entryId) {
  const entry = currentEntries.find((item) => item.id === entryId);
  if (!entry || entry.sourceFile !== "manual") {
    writeLog("직접 등록한 재료만 삭제할 수 있습니다.");
    return;
  }
  if (!window.confirm(`이 재료를 삭제할까요?\n${entry.term || "제목 없음"}`)) {
    return;
  }

  setBusy(true);
  setSaveState("삭제 중");
  try {
    const data = await requestJson("/api/delete-idea", {
      ...commonPayload(),
      id: entryId,
    });
    renderStatus(data);
    if (editingEntryId === entryId) {
      clearIdeaForm();
    }
    writeLog(data.lastRun?.message || "원고 재료를 삭제했습니다.");
    setSaveState("삭제됨");
    setDraftState("재료 변경됨");
  } catch (error) {
    setSaveState("확인 필요");
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

function handleEntryAction(event) {
  const button = event.target.closest("[data-entry-action]");
  if (!button) {
    return;
  }

  const entryId = button.dataset.entryId || "";
  const entry = currentEntries.find((item) => item.id === entryId);
  if (!entry) {
    writeLog("선택한 재료를 찾지 못했습니다.");
    return;
  }

  if (button.dataset.entryAction === "include") {
    setEntryIncluded(entryId, button.checked);
    return;
  }

  if (button.dataset.entryAction === "edit") {
    startEditEntry(entry);
    return;
  }

  if (button.dataset.entryAction === "delete") {
    deleteEntry(entryId);
  }
}

async function importObsidian(event) {
  event?.preventDefault();
  setRetryAction("Obsidian 가져오기", importObsidian);
  persistForm();
  setBusy(true);
  writeLog("Obsidian 가져오는 중...");
  try {
    const data = await requestJson("/api/import-obsidian", obsidianPayload());
    renderStatus(data);
    writeLog(data.lastRun?.message || [data.importStdout, data.buildStdout].filter(Boolean).join("\n"));
    clearRetryAction();
  } catch (error) {
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

function setRetryAction(label, handler) {
  lastRetryAction = { label, handler };
  retryLastButton.textContent = `${label} 재시도`;
  retryLastButton.disabled = isBusyState;
}

function clearRetryAction() {
  lastRetryAction = null;
  retryLastButton.textContent = "재시도";
  retryLastButton.disabled = true;
}

async function retryLastAction() {
  if (!lastRetryAction || isBusyState) {
    return;
  }
  const action = lastRetryAction;
  writeLog(`${action.label} 작업을 다시 시도합니다.`);
  await action.handler();
}

async function generateDraft() {
  if (!generationReady()) {
    return;
  }
  setRetryAction("초안 만들기", generateDraft);
  persistForm();
  setBusy(true);
  setDraftState("생성 중");
  writeLog("원고 초안을 만드는 중...");
  try {
    await saveDraftVersion("생성 전 백업", { silent: true });
    const data = await requestJson("/api/generate-chapter", obsidianPayload());
    renderStatus(data);
    await saveDraftVersion(data.llmStatus === "expanded" ? "AI 초안 생성" : "구조 초안 생성", { silent: true });
    writeLog(data.lastRun?.message || data.llmMessage || "원고 초안을 생성했습니다.");
    clearRetryAction();
  } catch (error) {
    setDraftState("확인 필요");
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

async function reviewDraft(options = {}) {
  const markdown = draftPreview.value.trim();
  if (!markdown) {
    setReviewState("확인 필요");
    reviewOutput.textContent = "품질을 점검할 원고 초안을 먼저 만들거나 직접 입력해 주세요.";
    return;
  }

  setRetryAction("품질 점검", () => reviewDraft(options));
  persistForm();
  setBusy(true);
  setReviewState("점검 중");
  writeLog("원고 품질을 점검 중...");
  try {
    const data = await requestJson("/api/review-draft", draftReviewPayload(options));
    renderStatus(data);
    writeLog(data.lastRun?.message || data.reviewMessage || "원고 품질을 점검했습니다.");
    clearRetryAction();
  } catch (error) {
    setReviewState("확인 필요");
    reviewOutput.textContent = error.message;
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

async function polishDraft() {
  const markdown = draftPreview.value.trim();
  if (!markdown) {
    setDraftState("확인 필요");
    writeLog("정리할 원고 초안을 먼저 만들거나 직접 입력해 주세요.");
    return;
  }

  setRetryAction("출판 정리", polishDraft);
  persistForm();
  setBusy(true);
  setDraftState("정리 중");
  writeLog("출판용 원고로 정리 중...");
  try {
    await saveDraftVersion("출판 정리 전 백업", { silent: true });
    const data = await requestJson("/api/polish-draft", polishDraftPayload());
    renderStatus(data);
    await saveDraftVersion("출판 정리본", { silent: true });
    writeLog(data.lastRun?.message || data.polishMessage || "출판용 원고로 정리했습니다.");
    clearRetryAction();
  } catch (error) {
    setDraftState("확인 필요");
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

async function exportChapter() {
  setRetryAction("Obsidian 저장", exportChapter);
  persistForm();
  setBusy(true);
  setDraftState("저장 중");
  writeLog("편집한 원고를 Obsidian에 저장 중...");
  try {
    const data = await requestJson("/api/export-chapter", editedDraftPayload());
    renderStatus(data);
    await saveDraftVersion("Obsidian 저장", { silent: true });
    chapterSavedToObsidian = true;
    setDraftState("Obsidian 저장됨");
    updateWritingFlowState();
    writeLog(data.lastRun?.message || `저장했습니다: ${data.filePath}`);
    clearRetryAction();
  } catch (error) {
    setDraftState("확인 필요");
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

async function exportManuscript(format) {
  const markdown = draftPreview.value.trim();
  if (!markdown) {
    setDraftState("확인 필요");
    writeLog("내보낼 원고 초안을 먼저 만들거나 직접 입력해 주세요.");
    return;
  }

  renderExportPreview();
  exportResult.hidden = true;
  exportResultState.textContent = "생성 중";
  setRetryAction(`${format.toUpperCase()} 내보내기`, () => exportManuscript(format));
  persistForm();
  setBusy(true);
  writeLog(`${format.toUpperCase()} 원고 파일을 만드는 중...`);
  try {
    const data = await requestJson("/api/export-manuscript", manuscriptExportPayload(format));
    renderStatus(data);
    renderExportResult(data, format);
    writeLog(data.lastRun?.message || `${format.toUpperCase()} 파일을 만들었습니다: ${data.filePath}`);
    clearRetryAction();
  } catch (error) {
    writeLog(error.message);
  } finally {
    setBusy(false);
  }
}

ideaForm.addEventListener("submit", addIdea);
obsidianForm.addEventListener("submit", importObsidian);
buildButton.addEventListener("click", generateDraft);
polishDraftButton.addEventListener("click", polishDraft);
reviewDraftButton.addEventListener("click", () => reviewDraft());
exportChapterButton.addEventListener("click", exportChapter);
exportChapterPanelButton.addEventListener("click", testObsidianConnection);
exportDocxButton.addEventListener("click", () => exportManuscript("docx"));
exportPdfButton.addEventListener("click", () => exportManuscript("pdf"));
projectSelect.addEventListener("change", () => switchProject(projectSelect.value));
createProjectButton.addEventListener("click", createProject);
saveProjectButton.addEventListener("click", () => saveActiveProject());
duplicateProjectButton.addEventListener("click", () => duplicateProject());
deleteProjectButton.addEventListener("click", () => deleteProject());
openWritingButton.addEventListener("click", openWritingView);
openRecentChapterButton.addEventListener("click", openRecentChapter);
exportProjectBackupButton.addEventListener("click", exportProjectBackup);
importProjectBackupButton.addEventListener("click", () => projectBackupFileInput.click());
projectBackupFileInput.addEventListener("change", restoreProjectBackupFromFile);
undoProjectDeleteButton.addEventListener("click", restoreDeletedProject);
projectCards.addEventListener("click", handleProjectCardAction);
projectSearchInput.addEventListener("input", () => {
  projectSearchTerm = projectSearchInput.value;
  renderProjectCards(loadProjects());
});
projectSortInput.addEventListener("change", () => {
  projectSortMode = projectSortInput.value;
  renderProjectCards(loadProjects());
});
for (const tab of workspaceTabs) {
  tab.addEventListener("click", () => showView(tab.dataset.viewTab || "projects"));
}
addCurrentChapterButton.addEventListener("click", addCurrentChapterToOutline);
exportOutlineButton.addEventListener("click", exportBookOutline);
outlineList.addEventListener("click", handleOutlineAction);
saveDraftVersionButton.addEventListener("click", () => saveDraftVersion("수동 저장"));
loadObsidianVersionsButton.addEventListener("click", () => loadObsidianDraftVersions());
restoreDraftVersionButton.addEventListener("click", restoreDraftVersion);
compareDraftVersionButton.addEventListener("click", renderVersionComparison);
draftVersionSelect.addEventListener("change", () => {
  versionDiff.hidden = true;
  versionDiff.innerHTML = "";
});
entryList.addEventListener("click", handleEntryAction);
cancelEditButton.addEventListener("click", () => {
  clearIdeaForm();
  setSaveState("준비됨");
});
loadWritingExample.addEventListener("click", fillWritingExample);
previewExportButton.addEventListener("click", renderExportPreview);
testObsidianButton.addEventListener("click", testObsidianConnection);
applyDetectedVaultButton.addEventListener("click", applyDetectedVault);
testLlmButton.addEventListener("click", testLlmSample);
runOpsCheckButton.addEventListener("click", runOperationalCheck);
retryLastButton.addEventListener("click", retryLastAction);
thisWeekButton.addEventListener("click", () => {
  setDefaultWeek();
  persistForm();
  updateInputMeters();
  renderPreflightChecklist();
  updateObsidianPreview();
  loadStatus();
});
useExample.addEventListener("click", () => {
  vaultInput.value = "examples/obsidian-vault";
  folderInput.value = "Book Ideas";
  tagsInput.value = "book-idea";
  chapterFolderInput.value = "Book Drafts";
  persistForm();
  updateObsidianPreview();
});
loadSavedDraftsButton.addEventListener("click", loadSavedDrafts);
savedDraftList.addEventListener("click", handleSavedDraftAction);

for (const input of document.querySelectorAll("input, textarea, select")) {
  if (input === projectSelect || input === projectSearchInput || input === projectSortInput) {
    continue;
  }
  input.addEventListener("input", () => {
    persistForm();
    if (input === ideaTitleInput || input === ideaDetailInput) {
      updateInputMeters();
    }
    if (
      [
        chapterTitleInput,
        targetReaderInput,
        chapterGoalInput,
        projectNameInput,
        bookTitleInput,
        chapterNumberInput,
        vaultInput,
        folderInput,
        chapterFolderInput,
      ].includes(input)
    ) {
      renderPreflightChecklist();
      updateObsidianPreview();
      renderProjectCards(loadProjects());
    }
    if (input === chapterTitleInput) {
      obsidianDraftVersions = [];
      renderDraftVersions();
    }
  });
  input.addEventListener("change", () => {
    persistForm();
    if ([draftTypeInput, chapterTemplateInput, includeCoverInput, includeTocInput, expandWithLlmInput].includes(input)) {
      renderPreflightChecklist();
      updateObsidianPreview();
    }
    if (input === weekStartInput || input === weekEndInput) {
      obsidianDraftVersions = [];
      renderPreflightChecklist();
      updateObsidianPreview();
      loadStatus();
      renderDraftVersions();
    }
  });
}

draftPreview.addEventListener("input", updateDraftEditState);

restoreForm();
updateInputMeters();
renderBookOutline();
renderSavedDrafts();
renderDraftVersions();
renderPreflightChecklist();
updateObsidianPreview();
loadStatus();
setInterval(loadStatus, 5000);
