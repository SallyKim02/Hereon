// app/cbt/history/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getEntries } from "../../../lib/cbt/storage";

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "panic", label: "공황/신체감각" },
  { key: "social", label: "대인/발표" },
  { key: "worry", label: "범불안/걱정" },
];

export default function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");

  // 초기 로드
  useEffect(() => {
    const list = getEntries();
    setEntries(Array.isArray(list) ? list : []);
  }, []);

  // 최신순 정렬 + 필터 + 검색
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();

    const byCategory = (e) => category === "all" || e.category === category;

    const byKeyword = (e) => {
      if (!kw) return true;
      const fields = [
        e.situation,
        e.automaticThought,
        e.emotionReaction,
        e.alternativeThought,
        e.category,
        e.date, // ISO 문자열에서도 검색
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return fields.includes(kw);
    };

    return [...entries]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(byCategory)
      .filter(byKeyword);
  }, [entries, category, keyword]);

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* 헤더 */}
        <header>
          <h1 className="text-3xl font-bold">실전 기록 히스토리</h1>
          <p className="text-sm text-slate-600 mt-1">
            카테고리/키워드로 필터링하고 과거 기록을 다시 볼 수 있어요.
          </p>
        </header>

        {/* 액션 버튼 */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/cbt/form"
            className="rounded-md bg-slate-900 text-white px-4 py-2 hover:opacity-90"
          >
            새 기록 작성
          </Link>
          <Link
            href="/cbt"
            className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
          >
            CBT 메인으로
          </Link>
        </div>

        {/* 필터 바 */}
        <section className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          {/* 카테고리 탭 */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={[
                  "px-3 py-1.5 rounded-full border text-sm",
                  category === c.key
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-800 border-slate-300 hover:border-slate-400",
                ].join(" ")}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* 키워드 검색 */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="상황, 감정, 자동적/대안적 사고, 날짜 검색"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </div>
        </section>

        {/* 리스트 */}
        <section className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-slate-200 p-6 text-slate-600">
              아직 저장된 기록이 없거나 조건에 맞는 항목이 없어요.
              <div className="mt-3">
                <Link
                  href="/cbt/form"
                  className="inline-block rounded-md bg-slate-900 text-white px-4 py-2 hover:opacity-90"
                >
                  첫 기록 남기기
                </Link>
              </div>
            </div>
          ) : (
            filtered.map((e) => (
              <Link
                key={e.id}
                href={`/cbt/history/${e.id}`}
                className="block rounded-lg border border-slate-200 p-4 hover:border-slate-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-600">
                    {new Date(e.date).toLocaleString()}
                  </div>
                  <span className="text-xs rounded-full border px-2 py-1 border-slate-300 text-slate-700">
                    {
                      {
                        panic: "공황/신체감각",
                        social: "대인/발표",
                        worry: "범불안/걱정",
                      }[e.category] || "기타"
                    }
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-sm text-slate-500">상황</div>
                  <div className="font-medium line-clamp-2">{e.situation || "-"}</div>
                </div>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">자동적 사고</div>
                    <div className="text-sm line-clamp-3">{e.automaticThought || "-"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">대안적 사고</div>
                    <div className="text-sm line-clamp-3">{e.alternativeThought || "-"}</div>
                  </div>
                </div>

                {e.emotionReaction ? (
                  <div className="mt-2">
                    <div className="text-xs text-slate-500 mb-1">감정 및 신체 반응</div>
                    <div className="text-sm line-clamp-3">{e.emotionReaction}</div>
                  </div>
                ) : null}
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
