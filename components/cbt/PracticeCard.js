// components/cbt/PracticeCard.js
"use client";

export default function PracticeCard({ text, isSelected, isMatched, onClick }) {
  const base = "w-full text-left rounded-lg border px-4 py-4 h-24 transition";

  // 매칭 상태: 초록 배경 + 흰 글씨 + 초록 보더
  const matchedClasses = isMatched ? "bg-green-700 text-stone-50 border-green-700" : "bg-white text-slate-900";

  // 선택/비선택에 따른 '마지막' 보더색 결정 (마지막에 둬야 우선 적용됨)
  const borderClasses =
    isSelected && !isMatched
      ? "border-2 border-green-700"   // 선택 시: 두꺼운 초록 보더
      : "border-slate-200";           // 평소: 얇은 회색 보더

  const hover = !isMatched ? "hover:border-slate-300" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isMatched}
      className={[base, matchedClasses, hover, borderClasses].join(" ")}
    >
      <span className="whitespace-pre-line leading-relaxed">{text}</span>
    </button>
  );
}
