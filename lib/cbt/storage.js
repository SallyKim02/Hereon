/* ---------- 연습 기록 ---------- */
const PRACTICE_KEY = "cbt_practice_history_v1";

// 연습 기록 불러오기
export function loadPracticeHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRACTICE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to load practice history", e);
    return [];
  }
}

// 연습 결과 저장하기
export function savePracticeResult(result) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadPracticeHistory();
    const next = [result, ...prev].slice(0, 100); // 최근 100개까지만 저장
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn("Failed to save practice result", e);
  }
}

/* ---------- 실전 기록 ---------- */
const ENTRY_KEY = "cbt_entries_v1";

function safeGet() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ENTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function safeSet(arr) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ENTRY_KEY, JSON.stringify(arr));
}

export function loadEntries() {
  return safeGet();
}

export function saveEntry(entry) {
  // entry: { id?, createdAtISO, category, situation, emotions[], bodyReactions[], automatic, alternative }
  const arr = safeGet();
  const id = entry.id ?? cryptoRandomId();
  const nowISO = new Date().toISOString();
  const idx = arr.findIndex((e) => e.id === id);
  const item = { ...entry, id, updatedAtISO: nowISO };
  if (idx >= 0) arr[idx] = item;
  else arr.unshift(item);
  safeSet(arr);
  return id;
}

export function deleteEntry(id) {
  const arr = safeGet().filter((e) => e.id !== id);
  safeSet(arr);
}

export function getEntryById(id) {
  return safeGet().find((e) => e.id === id);
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id_" + Math.random().toString(36).slice(2, 10);
}

export { loadEntries as getEntries };
