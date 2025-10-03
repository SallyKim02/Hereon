"use client";

import { useRef, useState } from "react";
import { saveEntry } from "../../lib/cbt/storage";

/* ===== 옵션 ===== */
const CATEGORY_OPTIONS = [
  { key: "relationship", label: "대인관계" },
  { key: "study",        label: "학업/일" },
  { key: "health",       label: "건강" },
  { key: "anxiety",      label: "불안" },
  { key: "self",         label: "자존감" },
  { key: "etc",          label: "기타" },
];

const EMOTION_OPTIONS = [
  "불안","슬픔","분노","죄책감","수치심","좌절","무기력","놀람","기쁨(희미)"
];
const BODY_OPTIONS = [
  "심장 두근거림","가슴 답답","호흡 가빠짐","목 막힘","현기증","손발 저림/떨림",
  "어지러움","복부 불편","머리 멍함","땀 남",
];

/* ===== 유틸 ===== */
const pad = (n) => String(n).padStart(2, "0");
function toLocalDatetimeValue(date = new Date()) {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden="true">
      <path
        d="M5 12h12M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ===== 자동 늘어나는 텍스트에어리어 ===== */
function AutoTextarea({ value, onChange, placeholder, minH = 88 }) {
  const ref = useRef(null);
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 384) + "px"; // 최대 24rem
  };
  return (
    <textarea
      ref={(el) => {
        ref.current = el;
        if (el) autosize(el);
      }}
      value={value}
      onChange={(e) => {
        onChange(e);
        autosize(e.target);
      }}
      placeholder={placeholder}
      className="rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800 overflow-auto resize-none"
      style={{ minHeight: `${minH}px` }}
    />
  );
}

/* ===== 칩 드롭다운 (상단 소제목 + 하단 '선택 완료') ===== */
function ChipDropdown({ title, subtitle = "", options, values, setValues }) {
  const [open, setOpen] = useState(false);
  const toggle = (v) =>
    setValues((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const display = values.length ? values.join(", ") : "선택";

  return (
    <div className="relative">
      {/* 트리거 */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-left hover:border-neutral-500"
      >
        <span className="text-sm font-medium text-neutral-600">{title}:</span>{" "}
        <span className="text-sm text-neutral-900 truncate inline-block max-w-[80%] align-middle">
          {display}
        </span>
      </button>

      {open && (
        <div
          className="absolute z-20 mt-2 w-full rounded-xl border border-neutral-200 bg-white shadow-lg p-0 overflow-hidden"
          role="listbox"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-200">
            <div className="text-sm font-medium text-neutral-800">{title}</div>
            {subtitle ? (
              <div className="text-xs text-neutral-500">{subtitle}</div>
            ) : null}
          </div>

          {/* 칩 영역 */}
          <div className="max-h-64 overflow-auto p-3">
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const active = values.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggle(opt)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      active
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-white text-neutral-800 border-neutral-300 hover:border-neutral-500"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 하단 '선택 완료' */}
          <div className="border-t border-neutral-200 p-2">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white text-sm hover:opacity-90"
              >
                선택 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== 폼 ===== */
export default function EntryForm() {
  const [createdAt, setCreatedAt] = useState(toLocalDatetimeValue());
  const [category, setCategory] = useState("");
  const [situation, setSituation] = useState("");

  const [emotions, setEmotions] = useState([]);
  const [bodyReactions, setBodyReactions] = useState([]);

  const [automatic, setAutomatic] = useState("");
  const [alternative, setAlternative] = useState("");

  // 필수: 자동적 사고 + 대안적 사고
  const canSave = automatic.trim() && alternative.trim();

  const handleSave = () => {
    const payload = {
      createdAtISO: new Date(createdAt).toISOString(),
      category,       // key 저장됨 (e.g., "study")
      situation,
      emotions,
      bodyReactions,
      automatic,
      alternative,
    };
    saveEntry(payload);
    alert("저장했어요!");
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm p-5 md:p-6">
      {/* 1행: 작성일자 / 카테고리 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">작성일자</span>
          <input
            type="datetime-local"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-800"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-800"
          >
            <option value="">선택</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 2행: 상황 */}
      <div className="mt-6 flex flex-col gap-2">
        <span className="text-sm font-medium text-neutral-600">상황</span>
        <AutoTextarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="어디에서, 누구와, 어떤 상황이었는지 적어주세요"
          minH={72}
        />
      </div>

      {/* 3행: 감정 / 신체반응 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChipDropdown
          title="감정"
          subtitle="중복 선택 가능"
          options={EMOTION_OPTIONS}
          values={emotions}
          setValues={setEmotions}
        />
        <ChipDropdown
          title="신체반응"
          subtitle="중복 선택 가능"
          options={BODY_OPTIONS}
          values={bodyReactions}
          setValues={setBodyReactions}
        />
      </div>

      {/* 4행: 자동적 사고 & 대안적 사고 */}
      <div className="mt-6 relative">
        <div className="pointer-events-none hidden lg:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center text-neutral-400">
          <ArrowRight />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-600">자동적 사고</span>
            <AutoTextarea
              value={automatic}
              onChange={(e) => setAutomatic(e.target.value)}
              placeholder="떠오른 생각을 그대로 적어주세요"
              minH={180}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-600">대안적 사고</span>
            <AutoTextarea
              value={alternative}
              onChange={(e) => setAlternative(e.target.value)}
              placeholder="증거를 검토해 보다 균형 잡힌 생각을 적어주세요"
              minH={180}
            />
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="mt-6 flex justify-between">
        <a
          href="/cbt/history"
          className="px-4 py-2 rounded-lg border border-neutral-300 hover:border-neutral-500 bg-white"
        >
          기록보기
        </a>
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={`px-5 py-2 rounded-lg text-white ${
            canSave
              ? "bg-neutral-900 hover:opacity-90"
              : "bg-neutral-400 cursor-not-allowed"
          }`}
        >
          저장
        </button>
      </div>
    </div>
  );
}
