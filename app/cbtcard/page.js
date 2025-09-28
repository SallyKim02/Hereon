"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

// ---- Symptom Quick Pick Data ----
export const SYMPTOM_PRESETS = {
  "심장 두근거림": "심박이 빨라지는 건 각성/불안의 정상 반응일 수 있어요. 곧 가라앉습니다. ",
  "숨 가쁨": "과호흡이면 더 숨이 가쁘게 느껴질 수 있어요. 4초 들숨, 6초 날숨을 천천히요.",
  "가슴 답답함": "근육 긴장/호흡 패턴 때문에 답답할 수 있어요. 길게 내쉬는 호흡이 도움 돼요.",
  "어지러움": "빠른 호흡/긴장으로 머리가 멍할 수 있어요. 시선을 한 점에 두고 천천히 호흡해요.",
  "떨림": "아드레날린 반응으로 해롭지 않아요. 시간이 지나면 자연스레 가라앉아요.",
  "메스꺼움": "위장도 스트레스에 민감해요. 작은 물 한 모금과 느린 호흡이 도움이 돼요.",
  "열감/냉감": "자율신경 반응으로 체온 감각이 달라질 수 있어요. 해롭지 않아요.",
  "비현실감": "과각성의 부산물이에요. 주변 사물 3가지를 만지고 이름 붙여보세요.",
  "손발 저림": "과호흡 시 말초 감각이 달라질 수 있어요. 코로 들이마시고 길게 내쉬어요.",
  "식은땀": "몸이 경보모드로 잠깐 반응 중이에요. 안전한 자세로 호흡을 정돈해요.",
  "질식감": "목이 막히는 느낌은 감각 오류일 수 있어요. 실제 산소는 충분해요.",
};

export const SYMPTOM_CORE = [
  { key: "심장 두근거림", emoji: "❤️", label: "두근거림" },
  { key: "숨 가쁨", emoji: "🌬️", label: "숨 가쁨" },
  { key: "가슴 답답함", emoji: "🫁", label: "답답함" },
  { key: "어지러움", emoji: "🌀", label: "어지러움" },
  { key: "떨림", emoji: "🤲", label: "떨림" },
  { key: "메스꺼움", emoji: "🤢", label: "메스꺼움" },
  { key: "열감/냉감", emoji: "🌡️", label: "열/한기" },
  { key: "비현실감", emoji: "🧠", label: "비현실감" },
];

export const SYMPTOM_EXTRA = ["손발 저림", "식은땀", "질식감"];

// (기존 SymptomQuickPick은 남겨둠 — 사용하진 않지만 필요 시 재활용 가능)
function SymptomQuickPick({ onPick }) {
  const [showAll, setShowAll] = useState(false);
  const handlePick = (key) => {
    const msg = SYMPTOM_PRESETS[key];
    if (onPick) onPick(key, msg);
  };

  const HoverCard = ({ k, children }) => (
    <div className="relative group">
      {children}
      <div className="pointer-events-none absolute left-full top-0 z-20 ml-2 hidden w-64 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 lg:block">
        <div className="rounded-2xl border border-white/40 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-md shadow-xl p-3">
          <div className="mb-1 text-xs text-gray-500">{k}</div>
          <div className="text-sm leading-5">{SYMPTOM_PRESETS[k]}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-2 overflow-visible">
      <div className="grid grid-cols-4 gap-2 overflow-visible">
        {SYMPTOM_CORE.map((item) => (
          <HoverCard key={item.key} k={item.key}>
            <button
              type="button"
              onClick={() => handlePick(item.key)}
              className="flex flex-col items-center justify-center rounded-2xl border px-2 py-3 hover:bg-gray-50 active:scale-[0.98] transition"
              aria-label={item.key + " 선택"}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="mt-1 text-xs">{item.label}</span>
            </button>
          </HoverCard>
        ))}
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="rounded-2xl border px-2 py-3 text-xs hover:bg-gray-50"
          aria-expanded={showAll}
        >
          {showAll ? "간단히" : "+ 더 보기"}
        </button>
      </div>

      {showAll ? (
        <div className="flex flex-wrap gap-2 overflow-visible">
          {SYMPTOM_EXTRA.map((k) => (
            <HoverCard key={k} k={k}>
              <button
                type="button"
                onClick={() => handlePick(k)}
                className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
              >
                {k}
              </button>
            </HoverCard>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// --- 새 섹션: 왼쪽 카테고리(검정) + 오른쪽 증상 칩 ---
function SymptomInlineByCategory({ onPick }) {
  const data = {
    "심장/순환": ["심장 두근거림","심박 증가/불규칙","가슴 답답함","흉통/찌름","얼굴 화끈/창백"],
    "호흡": ["숨 가쁨","과호흡","질식감(목 막힘)","깊은 한숨/하품 반복","흉곽 조임"],
    "신경/감각": ["어지러움","머리 멍함","손발 저림/따가움","귀먹먹/이명","시야 협소/흐림"],
    "근육/운동": ["떨림","근육 경직/쥐남","턱/어깨/등 결림","다리 힘 풀림","안절부절"],
    "위장관": ["메스꺼움","속 울렁거림","복부 통증/쥐어짜는 느낌","설사/변의 급함","헛배부름/트림","입 마름"],
    "체온/자율신경": ["식은땀/발한","한기/오한","열감/홍조","소름","손발 차가움/뜨거움"],
    "피부/기타": ["가려움/따가움","얼굴 화끈","잦은 소변"],
    "지각/해리감": ["비현실감","이인감","시간 왜곡"],
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-[110px_1fr] gap-y-3 items-start">
        {Object.entries(data).map(([cat, symptoms]) => (
          <React.Fragment key={cat}>
            {/* 왼쪽: 카테고리 (검정) */}
            <div className="pt-1 text-sm font-semibold text-black">{cat}</div>

            {/* 오른쪽: 해당 증상 칩 */}
            <div className="flex flex-wrap gap-2">
              {symptoms.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => onPick(sym)}
                  className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50 active:scale-[0.98]"
                  title={`${cat} · ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ---- Main Component ----
export default function DangerSoothingMode({ onNext, enableSave = true }) {
  // Short Affirmations
  const affirmations = useMemo(
    () => [
      "이 감각은 곧 사라집니다.",
      "지금 이 순간, 나는 안전합니다.",
      "몸의 경보가 울린 거지, 실제 위험은 아닙니다.",
      "나는 이미 많은 순간을 지나왔고, 이번에도 지나갑니다.",
      "한 번에 한 호흡, 충분합니다.",
      "두근거림은 불안의 신호일 뿐, 해가 되지 않습니다.",
      "어지러움은 일시적 감각 변화입니다.",
      "내가 느끼는 감정은 파도처럼 왔다가 갑니다.",
      "지금 내가 할 수 있는 일에만 집중합니다.",
      "완벽할 필요 없습니다. 충분히 잘하고 있어요.",
      "불편하지만 안전합니다.",
      "내 몸은 스스로 균형을 되찾고 있습니다.",
    ],
    []
  );
  const [idx, setIdx] = useState(0);
  const rotateRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    rotateRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % affirmations.length);
    }, 6000);
    return () => {
      if (rotateRef.current) clearInterval(rotateRef.current);
    };
  }, [affirmations.length]);

  // Micro CBT Card state
  const [situation, setSituation] = useState("");
  const [autoThought, setAutoThought] = useState("");
  const [emotion, setEmotion] = useState("");
  const [altThought, setAltThought] = useState("");

  const emotionOptions = [
    "불안", "두려움", "당황", "답답함", "분노", "슬픔", "수치심", "괜찮음",
  ];

  function applyPreset(key) {
    setAltThought(SYMPTOM_PRESETS[key] || "");
    if (!autoThought) setAutoThought("큰일 났어, 위험해!");
  }

  // Save to localStorage
  function saveCard() {
    const payload = {
      ts: new Date().toISOString(),
      situation,
      autoThought,
      emotion,
      altThought,
    };
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("cbtnow_cards");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(payload);
      localStorage.setItem("cbtnow_cards", JSON.stringify(arr.slice(0, 50)));
      alert("카드를 저장했어요.");
    } catch (e) {
      console.error(e);
      alert("저장 중 문제가 발생했어요.");
    }
  }

  // Accessible Breathing Helper
  const [breathPhase, setBreathPhase] = useState("inhale");
  useEffect(() => {
    const id = setInterval(() => {
      setBreathPhase((p) => (p === "inhale" ? "exhale" : "inhale"));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">위험 신호 완화 모드</h1>
        <div className="flex items-center gap-2">
          {onNext ? (
            <button
              onClick={onNext}
              className="rounded-2xl border px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring"
              aria-label="다음으로"
            >
              다음으로
            </button>
          ) : null}
        </div>
      </div>

      {/* Short Affirmation */}
      <section aria-label="짧은 안심 메시지" className="mb-6">
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm text-gray-500">짧은 자기암시</div>
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-lg"
            >
              {affirmations[idx]}
            </motion.p>
          </AnimatePresence>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => setIdx((i) => (i - 1 + affirmations.length) % affirmations.length)}
              className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50"
              aria-label="이전 메시지"
            >이전</button>
            <button
              onClick={() => setIdx((i) => (i + 1) % affirmations.length)}
              className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50"
              aria-label="다음 메시지"
            >다음</button>
          </div>
        </div>
      </section>

      {/* Visual Breathing Aid */}
      <section aria-label="호흡 보조" className="mb-6">
        <div className="rounded-2xl border p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">호흡 보조 (무음)</span>
            <span className="text-xs text-gray-400" aria-live="polite">
              {breathPhase === "inhale" ? "들이마시기 4초" : "내쉬기 4초"}
            </span>
          </div>
          <div className="flex items-center justify-center p-4">
            <motion.div
              aria-hidden={true}
              className="h-24 w-24 rounded-full border"
              animate={{ scale: breathPhase === "inhale" ? 1.12 : 0.88 }}
              transition={{ duration: 3.6, ease: "easeInOut" }}
            />
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">코로 4초 들이마시고, 4~6초 길게 내쉬세요.</p>
        </div>
      </section>

      {/* 신체 증상: 왼쪽 카테고리(검정) + 오른쪽 증상 칩 */}
      <section aria-label="신체 증상 선택" className="mb-6">
        <div className="rounded-2xl border p-4">
          <div className="mb-2 text-sm text-gray-500">
            신체 증상: 왼쪽 카테고리(검정)를 보고 오른쪽에서 바로 선택하세요
          </div>
          <SymptomInlineByCategory onPick={(key) => applyPreset(key)} />
        </div>
      </section>

      {/* Micro CBT Card */}
      <section aria-label="간단한 CBT 카드" className="mb-6">
        <div className="rounded-2xl border p-4">
          <div className="mb-3 text-sm text-gray-500">간단한 CBT 카드</div>
          <div className="grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm">상황</span>
              <input
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="지하철에서 갑자기 심장이 뛰었음"
                className="rounded-xl border px-3 py-2 focus:outline-none focus:ring"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">자동적 사고</span>
              <input
                value={autoThought}
                onChange={(e) => setAutoThought(e.target.value)}
                placeholder="혹시 쓰러지면 어떡하지? 큰일 났어"
                className="rounded-xl border px-3 py-2 focus:outline-none focus:ring"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">감정</span>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((emo) => (
                  <button
                    key={emo}
                    type="button"
                    onClick={() => setEmotion(emo)}
                    className={`rounded-full border px-3 py-1 text-sm ${emotion === emo ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
                    aria-pressed={emotion === emo}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </label>
            <label className="grid gap-1">
              <span className="text-sm">대안적 사고</span>
              <textarea
                value={altThought}
                onChange={(e) => setAltThought(e.target.value)}
                placeholder="내 심장이 빨리 뛰는 건 위험 신호가 아니라 불안 반응일 뿐이에요."
                rows={3}
                className="rounded-xl border px-3 py-2 focus:outline-none focus:ring"
              />
            </label>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span role="img" aria-label="no-sound">🔇</span> 소리 없이 사용 가능
              </div>
              <div className="flex items-center gap-2">
                {enableSave ? (
                  <button onClick={saveCard} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
                    저장
                  </button>
                ) : null}
                {onNext ? (
                  <button
                    onClick={onNext}
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    다음으로
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Footer */}
      <footer className="mt-6 text-xs text-gray-500 text-center space-y-1">
        <p>위급 상황(자/타해 위험, 의식 소실 등)에서는 즉시 112/119로 연락하세요.</p>
        <p>심각한 고통이 지속되면 전문 도움(정신건강의학과/상담센터)에 연결하세요. 한국 위기상담 1393.</p>
      </footer>
    </div>
  );
}

DangerSoothingMode.propTypes = {
  onNext: PropTypes.func,
  enableSave: PropTypes.bool,
};
