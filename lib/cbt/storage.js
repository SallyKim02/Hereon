// lib/cbt/storage.js

const LS_KEY = "cbt_practice_history_v1";

// 연습 기록 불러오기
export function loadPracticeHistory() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
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
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn("Failed to save practice result", e);
  }
}
