// components/cbt/PracticeSummary.js
"use client";

export default function PracticeSummary({ deck, stats, onReplay }) {
  return (
    <div className="mt-4 rounded-2xl border p-4">
      <h2 className="text-lg font-semibold">라운드 완료! 🎉</h2>

      <div className="mt-2 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="덱" value={deck?.title ?? "—"} />
        <Stat label="걸린 시간" value={`${stats.time}s`} />
        <Stat label="이동" value={stats.moves} />
        <Stat label="정확도" value={`${stats.accuracy}%`} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onReplay}
          className="rounded-xl border px-3 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          다시 하기
        </button>
      </div>

      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        기록은 기기(LocalStorage)에 저장됩니다. 실전 기록지는 <span className="font-medium">CBT → 기록(Form)</span>에서 확인하세요.
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="mt-0.5 text-base font-medium">{String(value)}</div>
    </div>
  );
}
