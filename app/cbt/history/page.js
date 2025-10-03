// app/cbt/history/page.js
"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadEntries, deleteEntry } from "../../../lib/cbt/storage";

/* 공통 카테고리 정의: 작성/히스토리 공유 */
const CATEGORIES = [
  { key: "all",          label: "전체" },
  { key: "relationship", label: "대인관계" },
  { key: "study",        label: "학업/일" },
  { key: "health",       label: "건강" },
  { key: "anxiety",      label: "불안" },
  { key: "self",         label: "자존감" },
  { key: "etc",          label: "기타" },
];

/* 레거시 문자열 → key 매핑 */
const LEGACY_TO_KEY = {
  "대인관계": "relationship",
  "학업/일": "study",
  "건강": "health",
  "불안": "anxiety",
  "자존감": "self",
  "기타": "etc",
  "학업": "study",
  "건강/신체": "health",
  "일상 스트레스": "etc",
  "대인 관계": "relationship",
};

/* key → label 조회 헬퍼 */
const labelOf = (key) => (CATEGORIES.find(c => c.key === key) || {}).label || "기타";

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    const raw = loadEntries();
    const normalized = raw.map((e) => {
      let key = e.category;
      if (!key) key = "etc";
      if (!CATEGORIES.some(c => c.key === key)) {
        key = LEGACY_TO_KEY[e.category] || "etc";
      }
      return { ...e, category: key };
    });
    setEntries(normalized);
  }, []);

  const handleDelete = (id) => {
    if (!confirm("이 기록을 삭제할까요? 되돌릴 수 없어요.")) return;
    deleteEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const catOk = cat === "all" ? true : e.category === cat;
      const text = [
        e.situation || "",
        (e.emotions || []).join(" "),
        (e.bodyReactions || []).join(" "),
        e.automatic || "",
        e.alternative || "",
      ].join(" ").toLowerCase();
      const qOk = q.trim() ? text.includes(q.trim().toLowerCase()) : true;
      return catOk && qOk;
    });
  }, [entries, cat, q]);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-8 md:py-12">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-semibold">나의 기록</h1>
          <div className="flex gap-2">
            <Link
              href="/cbt/form"
              className="rounded-lg bg-neutral-900 text-white px-3 py-2 text-sm"
            >
              새 기록 작성
            </Link>
          </div>
        </div>
        <p className="text-neutral-600 mb-4 text-sm">
          원하는 키워드로 지난 기록을 다시 꺼내볼 수 있어요.
        </p>

        {/* 필터: 카테고리 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCat(c.key)}
              className={`rounded-full border px-3 py-1 text-sm ${
                cat === c.key
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 필터: 검색 */}
        <div className="mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="상황, 감정, 자동적/대안적 사고, 날짜 검색..."
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>

        {/* 리스트 */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-600">
            조건에 맞는 기록이 없어요.
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((e) => {
              const created = e.createdAtISO ? new Date(e.createdAtISO) : null;
              const when =
                created && !isNaN(created) ? created.toLocaleString() : "날짜 없음";
              return (
                <li
                  key={e.id}
                  className="relative rounded-xl border border-neutral-200 bg-white p-4"
                >
                  {/* 삭제 X 아이콘 */}
                  <button
                    type="button"
                    aria-label="삭제"
                    onClick={() => handleDelete(e.id)}
                    className="absolute top-3 right-3 inline-flex items-center justify-center
                    w-9 h-9 rounded-full text-gray-600 hover:bg-red-50
                    text-2xl leading-none"
                  >
                    ×
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 pr-10">
                      <span>{when}</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-neutral-300" />
                      <span className="rounded-full border px-2 py-0.5 text-xs">
                        {labelOf(e.category)}
                      </span>
                    </div>

                    {/* 상황: 한 줄, 말줄임 */}
                    <div className="mt-2 text-sm text-neutral-700">
                      <div className="font-medium">상황</div>
                      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {e.situation || "-"}
                      </div>
                    </div>

                    {/* 자동적 사고 / 대안적 사고 2분할 */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">자동적 사고</div>
                        <div className="text-sm text-neutral-800 whitespace-pre-wrap">
                          {e.automatic || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">대안적 사고</div>
                        <div className="text-sm text-neutral-800 whitespace-pre-wrap">
                          {e.alternative || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 자세히 보기 → (오른쪽 하단) */}
                  <Link
                    href={`/cbt/history/${e.id}`}
                    className="absolute bottom-3 right-4 text-sm text-neutral-500 hover:text-neutral-700 underline-offset-4 hover:underline"
                  >
                    자세히 보기 →
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
