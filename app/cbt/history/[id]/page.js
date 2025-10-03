// app/cbt/history/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getEntryById, deleteEntry } from "../../../../lib/cbt/storage";

/* 작성 폼과 동일한 카테고리 key/label 매핑 */
const CATEGORY_LABELS = {
  relationship: "대인관계",
  study: "학업/일",
  health: "건강",
  anxiety: "불안",
  self: "자존감",
  etc: "기타",
};

/* 과거에 라벨 문자열로 저장된 데이터 대비용(레거시 → key) */
const LEGACY_TO_KEY = {
  "대인관계": "relationship",
  "학업/일": "study",
  "건강": "health",
  "불안": "anxiety",
  "자존감": "self",
  "기타": "etc",
  // 과거 변형들 대비
  "학업": "study",
  "건강/신체": "health",
  "대인 관계": "relationship",
  "일상 스트레스": "etc",
};

function labelOfCategory(cat) {
  if (!cat) return "기타";
  const key = CATEGORY_LABELS[cat] ? cat : (LEGACY_TO_KEY[cat] || "etc");
  return CATEGORY_LABELS[key] || "기타";
}

function formatWhen(isoOrStr) {
  if (!isoOrStr) return "날짜 없음";
  const d = new Date(isoOrStr);
  if (Number.isNaN(d.getTime())) return "날짜 없음";
  // 로컬 규칙으로 보기 좋게 포맷
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EntryDetailPage() {
  const params = useParams();
  const { id } = params || {};
  const [entry, setEntry] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    const found = getEntryById(id);
    if (!found) {
      setEntry(null);
      return;
    }
    // 레거시 카테고리 정규화
    const normalizedCat = CATEGORY_LABELS[found.category]
      ? found.category
      : (LEGACY_TO_KEY[found.category] || "etc");
    setEntry({ ...found, category: normalizedCat });
  }, [id]);

  const handleDelete = () => {
    if (!id) return;
    if (!confirm("이 기록을 삭제할까요? 되돌릴 수 없어요.")) return;
    deleteEntry(id);
    router.replace("/cbt/history");
  };

  if (!entry) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
          <h1 className="text-2xl md:text-3xl font-semibold mb-4">기록 상세보기</h1>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-neutral-700">
            해당 기록을 찾을 수 없어요. 목록에서 다시 선택해 주세요.
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/cbt/history" className="rounded-lg border px-4 py-2">목록으로</Link>
          </div>
        </div>
      </main>
    );
  }

  const when = formatWhen(entry.createdAtISO || entry.createdAt);
  const categoryLabel = labelOfCategory(entry.category);
  const emotions = Array.isArray(entry.emotions) ? entry.emotions.join(", ") : "-";
  const bodies = Array.isArray(entry.bodyReactions) ? entry.bodyReactions.join(", ") : "-";

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-3xl px-4 md:px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">기록 상세보기</h1>
        <div className="text-sm text-neutral-600 mb-6">작성일: {when}</div>

        <div className="space-y-5">
          {/* 카테고리 */}
          <div>
            <div className="text-sm font-medium text-neutral-600 mb-1">카테고리</div>
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-white">
              {categoryLabel}
            </div>
          </div>

          {/* 상황 */}
          <div>
            <div className="text-sm font-medium text-neutral-600 mb-1">상황</div>
            <div className="rounded-lg border bg-neutral-50 px-3 py-2 text-neutral-900 whitespace-pre-wrap">
              {entry.situation?.trim() ? entry.situation : "-"}
            </div>
          </div>

          {/* 감정 및 신체 반응 */}
          <div>
            <div className="text-sm font-medium text-neutral-600 mb-1">감정 및 신체 반응</div>
            <div className="rounded-lg border bg-neutral-50 px-3 py-2 text-neutral-900">
              <div className="text-sm"><span className="text-neutral-600">감정:</span> {emotions || "-"}</div>
              <div className="text-sm mt-1"><span className="text-neutral-600">신체반응:</span> {bodies || "-"}</div>
            </div>
          </div>

          {/* 자동적 사고 */}
          <div>
            <div className="text-sm font-medium text-neutral-600 mb-1">자동적 사고</div>
            <div className="rounded-lg border bg-white px-3 py-2 text-neutral-900 whitespace-pre-wrap">
              {entry.automatic?.trim() ? entry.automatic : "-"}
            </div>
          </div>

          {/* 대안적 사고 */}
          <div>
            <div className="text-sm font-medium text-neutral-600 mb-1">대안적 사고</div>
            <div className="rounded-lg border bg-white px-3 py-2 text-neutral-900 whitespace-pre-wrap">
              {entry.alternative?.trim() ? entry.alternative : "-"}
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/cbt/history" className="rounded-lg border px-4 py-2">목록으로</Link>
          <button
            type="button"
            onClick={handleDelete}
            className="ml-auto rounded-lg border border-red-300 text-red-600 px-4 py-2 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
    </main>
  );
}
