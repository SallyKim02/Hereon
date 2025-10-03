// components/cbt/EntryForm.js
"use client";

import { useState } from "react";

const categories = [
  { key: "panic", label: "공황/신체감각" },
  { key: "social", label: "대인/발표" },
  { key: "worry", label: "범불안/걱정" },
];

export default function EntryForm({ onSubmit }) {
  const [category, setCategory] = useState("panic");
  const [situation, setSituation] = useState("");
  const [automaticThought, setAutomaticThought] = useState("");
  const [emotionReaction, setEmotionReaction] = useState("");
  const [alternativeThought, setAlternativeThought] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      category,
      situation,
      automaticThought,
      emotionReaction,
      alternativeThought,
    };
    if (onSubmit) onSubmit(entry);
    // 폼 초기화
    setSituation("");
    setAutomaticThought("");
    setEmotionReaction("");
    setAlternativeThought("");
    setCategory("panic");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 날짜 표시 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          작성 날짜
        </label>
        <input
          type="text"
          value={new Date().toLocaleString()}
          disabled
          className="w-full rounded-md border border-slate-300 px-3 py-2 bg-slate-100 text-slate-600"
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          카테고리
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* 상황 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          상황
        </label>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          rows={2}
          placeholder="예: 발표 시작 직전"
        />
      </div>

      {/* 자동적 사고 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          자동적 사고
        </label>
        <textarea
          value={automaticThought}
          onChange={(e) => setAutomaticThought(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          rows={2}
          placeholder="예: 사람들이 날 바보라고 생각할 거야"
        />
      </div>

      {/* 감정 및 신체 반응 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          감정 및 신체 반응
        </label>
        <textarea
          value={emotionReaction}
          onChange={(e) => setEmotionReaction(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          rows={2}
          placeholder="예: 심장이 빨리 뛰고 손에 땀이 남"
        />
      </div>

      {/* 대안적 사고 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          대안적 사고
        </label>
        <textarea
          value={alternativeThought}
          onChange={(e) => setAlternativeThought(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          rows={2}
          placeholder="예: 작은 실수는 자연스러워, 내용 전달이 중요해"
        />
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-slate-900 text-white px-5 py-2 hover:opacity-90"
        >
          저장
        </button>
      </div>
    </form>
  );
}
