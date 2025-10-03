"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ---------- Step specs ---------- */
const STEPS = [
  { key: "intro",  title: "그라운딩 (Grounding)",    subtitle: "!설명!", placeholder: "", targetCount: 0 },
  { key: "see5",   title: "무엇이 보이나요?",        subtitle: "아래의 사진에서 보이는 것 5가지를 골라주세요", placeholder: "예) 창문, 컵…", targetCount: 5 },
  { key: "touch4", title: "만져지는 것 4가지",        subtitle: "미션을 따라 실제로 만져보고 감각을 느껴보세요",   placeholder: "", targetCount: 4 },
  { key: "hear3",  title: "무엇으로 들리나요?",        subtitle: "세 가지 소리 중 어떤 소리가 들리나요?", targetCount: 3 },
  { key: "smell2", title: "맡을 수 있는 냄새 2가지",  subtitle: "후각",   placeholder: "예) 커피향, 비누향…", targetCount: 2 },
  { key: "taste1", title: "맛볼 수 있는 것 1가지",    subtitle: "미각",   placeholder: "예) 물, 껌…", targetCount: 1 },
  { key: "done",   title: "수고하셨습니다",            subtitle: "짧게 스스로 느낀 변화를 적어보세요."},
];

/* ---------- SEE5: 이미지/라벨 데이터 ---------- */
const SEE_IMAGES = [
  { src: "/images/grounding/desk.png",
    labels: ["책상","헤드셋","컵","인형","책","창문","조명","나무","포스트잇","마우스","노트북","연필","시계","화분","안경"] },
  { src: "/images/grounding/kinder.png",
    labels: ["곰인형","칠판","동화책","컵","의자","책상","알파벳","창문","나무","토끼인형","옷","장난감","상자","블록","공"] },
  { src: "/images/grounding/kitchen.png",
    labels: ["사과","창문","그릇","컵받침","선반","향신료","머그컵","무화과","포크","주전자","바나나","식탁","식탁보","싱크대"] },
  { src: "/images/grounding/living_room.png",
    labels: ["소파","쿠션","러그","테이블","책","머그컵","초","액자","화분","창문","스탠드","턴테이블","협탁","시계","잡지"] },
  { src: "/images/grounding/park.png",
    labels: ["나무","벤치","잔디","길","꽃","미끄럼틀","하늘","구름","타일","급수대","쓰레기통","조각상","그네","그늘","의자"] },
];

/* ---------- HEAR3: 오디오/선택지 데이터 ---------- */
const HEAR_SOUNDS = [
  { src: "/sounds/fryingfood.mp3", options: ["튀김", "빗방울", "삼겹살 굽기"]},
  { src: "/sounds/shower.mp3",     options: ["샤워", "설거지", "빗방울"]},
  { src: "/sounds/spray.mp3",      options: ["분무기", "머리 빗기", "먼지 제거"]},
  { src: "/sounds/street.mp3",     options: ["발걸음", "새", "교통음"]},
];

const LS_PREFIX = "grounding_541_";
const lsKey = (key) => `${LS_PREFIX}${key}`;

/* ---------- TOUCH4 미션 풀(컴포넌트 밖으로 이동해 stable) ---------- */
const OBJECT_MISSIONS = [
  { kind: "object", title: "딱딱한 것을 하나 찾아 만져보세요", hints: ["예) 어떤 재질인가요? 온도는 어떤가요?"] },
  { kind: "object", title: "차가운 것을 하나 찾아 만져보세요", hints: ["예) 얼마나 차갑나요? 물기/습기가 있나요?"] },
  { kind: "object", title: "부드러운 것을 하나 찾아 만져보세요", hints: ["예) 손가락 사이의 감각은 어떤가요?"] },
  { kind: "object", title: "거친 표면을 가진 것을 만져보세요", hints: ["예) 얼마나 까슬하나요? 가루나 먼지가 느껴지나요?"] },
  { kind: "object", title: "따뜻한 것을 하나 잡아보세요", hints: ["예) 얼마나 따뜻하나요?"] },
  { kind: "object", title: "말랑한 것을 눌러보세요", hints: ["예) 탄성이 얼마나 강한가요?"] },
  { kind: "object", title: "매끈한 것을 문질러보세요", hints: ["예) 표면의 온도는 어떤 가요?"] },
  { kind: "object", title: "나뭇결 있는 것을 만져보세요", hints: ["예) 얼마나 울퉁불퉁 한가요?"] },
];

const BODY_MISSIONS = [
  { kind: "body", title: "손바닥을 맞잡아 압력을 천천히 느껴보세요", hints: ["예) 압력이 얼마나 강한가요? "] },
  { kind: "body", title: "손등을 반대 손가락으로 톡톡 두드려보세요", hints: ["예) 얼마나 탄력이 있나요?"] },
  { kind: "body", title: "팔을 어깨에서 손목까지 천천히 쓸어내려보세요", hints: ["예) 간지럽게 느껴지나요?"] },
  { kind: "body", title: "엄지와 검지로 귓볼을 살짝 비벼보세요", hints: ["예) 촉감이나 온도는 어떤가요?"] },
  { kind: "body", title: "양손으로 머리카락을 부드럽게 쓸어보세요", hints: ["예) 머리카락의 촉감은 어떤가요?"] },
  { kind: "body", title: "가슴 위에 손을 얹고 3회 호흡해 보세요", hints: ["예) 손의 높낮이가 얼마나 달라지나요?"] },
];

/* ---------- TOUCH4: 미션 컴포넌트 ---------- */
function TouchGroundingStep({ targetCount = 4, onAdd, onDone }) {
  const [ready, setReady] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [current, setCurrent] = useState(null); // { kind, title, hint }
  const [notes, setNotes] = useState("");
  const recentKeyRef = useRef(null); // 직전 미션 key 저장(연속 중복 방지)

  useEffect(() => { setReady(true); }, []);

  const vibrate = (ms) => {
    if (typeof window !== "undefined" && navigator && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const missionKey = (m) => `${m.kind}:${m.title}`;

  // 미션 및 힌트 1개 선택 (직전 미션과 title 연속 중복 방지)
  const drawMission = useCallback(() => {
    if (!ready) return;
    const useBody = Math.random() < 0.5;
    const pool = useBody ? BODY_MISSIONS : OBJECT_MISSIONS;

    let pick = null;
    for (let i = 0; i < 10; i++) {
      const cand = pool[Math.floor(Math.random() * pool.length)];
      if (missionKey(cand) !== recentKeyRef.current) {
        pick = cand;
        break;
      }
    }
    if (!pick) pick = pool[Math.floor(Math.random() * pool.length)]; // 안전장치

    const randHint = pick.hints[Math.floor(Math.random() * pick.hints.length)];
    setCurrent({ kind: pick.kind, title: pick.title, hint: randHint });
    recentKeyRef.current = missionKey(pick); // 직전 키 기록
    setNotes("");
  }, [ready]);

  useEffect(() => {
    if (ready && !current) drawMission();
  }, [ready, current, drawMission]);

  const progress = useMemo(
    () => Math.min(100, Math.round((doneCount / targetCount) * 100)),
    [doneCount, targetCount]
  );

  const onSkip = () => { vibrate(10); drawMission(); };

  const onCompleteOne = () => {
    if (!current) return;
    vibrate(30);
    const tag = current.kind === "object" ? "사물" : "손동작";
    const rec = `${tag}: ${current.title}${notes.trim() ? ` — ${notes.trim()}` : ""}`;
    onAdd(rec);

    const next = doneCount + 1;
    setDoneCount(next);
    setNotes("");
    if (next >= targetCount) {
      vibrate(60);
      onDone && onDone();
    } else {
      drawMission();
    }
  };

  if (!ready || !current) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
        <span className="text-gray-600">촉각 미션 불러오는 중…</span>
      </div>
    );
  }

  return (
    <section
      aria-label="촉각 그라운딩"
      className="w-full max-w-md mx-auto mt-8 p-4 sm:p-6 rounded-2xl border border-gray-200 bg-white"
    >
      {/* 진행도 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>진행도</span>
          <span>{doneCount} / {targetCount}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-gray-900 transition-all"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </div>

      {/* 미션 카드 */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
        <p className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-500">
          <span className="h-2 w-2 rounded-full bg-gray-900" />
          {current.kind === "object" ? "주변 사물 찾기" : "손동작 미션"}
        </p>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          {current.title}
        </h3>

        {/* 힌트 리스트 제거 → placeholder로만 제공 */}
        <label className="mt-4 block text-sm text-gray-500">느껴지는 것을 짧게 적어보세요<br />아래의 질문을 참고해도 좋습니다</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={current.hint || "예)"}
          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-gray-900"
          aria-label="느낀 촉감 입력"
        />

        {/* 액션 버튼 */}
        <div className="mt-4 grid grid-cols-3 items-center w-full">
          {/* 왼쪽 */}
          <div className="justify-self-start">
            <button
              onClick={onSkip}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              다시 뽑기
            </button>
          </div>

          {/* 중앙 */}
          <div className="justify-self-center">
            <button
              onClick={onCompleteOne}
              className="align-middle rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              미션 완료
            </button>
          </div>
        </div>
      </div>

      {/* 보조 가이드 */}
      <p className="mt-4 text-xs leading-relaxed text-gray-500">
        ※ 주변에 적절한 물건이 없을 땐, <br /> <span className="text-gray-800">손바닥 맞잡기, 손등 톡톡, 팔 쓸어내리기, 귓불 비비기</span> 등 <span className="text-gray-800"> <br />손동작 미션</span>을 수행하세요. <br />안전하고 통증 없는 범위에서 천천히 진행합니다.
      </p>
    </section>
  );
}

/* ---------- PAGE ---------- */
export default function GroundingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const current = STEPS[stepIndex];

  const [entries, setEntries] = useState({
    intro: [],
    see5_labels: [],
    see5_text: [],
    touch4: [],
    hear3: [],
    smell2: [],
    taste1: [],
    done: [],
  });

  /* 초기 로드: localStorage 복원 (eslint-disable 제거) */
  useEffect(() => {
    const base = {
      intro: [],
      see5_labels: [],
      see5_text: [],
      touch4: [],
      hear3: [],
      smell2: [],
      taste1: [],
      done: [],
    };
    const loaded = { ...base };
    Object.keys(base).forEach((k) => {
      try {
        const raw = localStorage.getItem(lsKey(k));
        if (raw) loaded[k] = JSON.parse(raw);
      } catch {}
    });
    setEntries(loaded);
  }, []);

  const saveStep = (k, arr) => {
    try { localStorage.setItem(lsKey(k), JSON.stringify(arr)); } catch {}
  };

  const [text, setText] = useState("");
  const inputRef = useRef(null);

  /* done 페이지 프리필 (정상 deps) */
  useEffect(() => {
    if (current.key === "done") setText(entries.done?.[0] || "");
    else setText("");
  }, [current.key, entries.done]);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0));

  /* ---------- see5 전용 ---------- */
  const [seeMode, setSeeMode] = useState("text"); // 'image' | 'text'
  const [seeImgIdx, setSeeImgIdx] = useState(0);
  const seeImage = SEE_IMAGES[seeImgIdx];

  const pickRandomIdx = (excludeIdx) => {
    if (SEE_IMAGES.length <= 1) return 0;
    let idx = excludeIdx;
    while (idx === excludeIdx) idx = Math.floor(Math.random() * SEE_IMAGES.length);
    return idx;
  };

  const switchSeeMode = (mode) => {
    if (mode === seeMode) return;
    const cleared = { see5_labels: [], see5_text: [] };
    setEntries((prev) => ({ ...prev, ...cleared }));
    saveStep("see5_labels", []); saveStep("see5_text", []);
    setSeeMode(mode);
    setSeeImgIdx((prev) => pickRandomIdx(prev));
    setText("");
  };

  const shuffleSee = () => {
    setSeeImgIdx((prev) => pickRandomIdx(prev));
    if (seeMode === "image") {
      setEntries((prev) => ({ ...prev, see5_labels: [] }));
      saveStep("see5_labels", []);
    }
  };

  useEffect(() => {
    if (current.key === "see5") setSeeImgIdx((prev) => pickRandomIdx(prev));
  }, [stepIndex, seeMode, current.key]);

  const toggleLabel = (label) => {
    if (current.key !== "see5" || seeMode !== "image") return;
    const list = entries.see5_labels || [];
    const exists = list.includes(label);
    if (!exists && list.length >= 5) return;
    const next = exists ? list.filter((x) => x !== label) : [...list, label];
    setEntries((prev) => ({ ...prev, see5_labels: next }));
    saveStep("see5_labels", next);
  };

  const addSeeText = () => {
    if (seeMode !== "text") return;
    const v = text.trim(); if (!v) return;
    if ((entries.see5_text?.length || 0) >= 5) return;
    const next = [...(entries.see5_text || []), v];
    setEntries((prev) => ({ ...prev, see5_text: next }));
    saveStep("see5_text", next);
    setText(""); inputRef.current?.focus();
  };

  const removeSeeTextAt = (i) => {
    const next = (entries.see5_text || []).filter((_, idx) => idx !== i);
    setEntries((prev) => ({ ...prev, see5_text: next }));
    saveStep("see5_text", next);
  };

  const see5Placeholder = (STEPS.find((s) => s.key === "see5")?.placeholder) || "예) 창문, 컵…";
  const see5Len = seeMode === "image" ? (entries.see5_labels?.length || 0) : (entries.see5_text?.length || 0);
  const see5Remaining = Math.max(0, 5 - see5Len);

  /* ---------- hear3 전용 ---------- */
  const audioRef = useRef(null);
  const [hearSet, setHearSet] = useState([]);
  const [hearRound, setHearRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const pickThreeHear = () => {
    const idxs = new Set();
    while (idxs.size < 3 && idxs.size < HEAR_SOUNDS.length) {
      idxs.add(Math.floor(Math.random() * HEAR_SOUNDS.length));
    }
    return [...idxs];
  };

  useEffect(() => {
    if (current.key !== "hear3") {
      const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0; }
      setIsPlaying(false);
      return;
    }
    setIsPlaying(false);
    const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0; }

    setHearSet((prev) => (prev.length === 3 ? prev : pickThreeHear()));

    setEntries((prev) => {
      const base = prev.hear3 || [];
      const padded = [base[0] ?? "", base[1] ?? "", base[2] ?? ""];
      if (JSON.stringify(base) !== JSON.stringify(padded)) {
        saveStep("hear3", padded);
        return { ...prev, hear3: padded };
      }
      return prev;
    });
    setHearRound(0);
  }, [current.key]);

  const currentHearIdx = hearSet[hearRound];
  const currentHear = currentHearIdx !== undefined ? HEAR_SOUNDS[currentHearIdx] : null;

  const playAudio = async () => {
    if (!currentHear || !audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      // autoplay 차단 등
    }
  };
  const pauseAudio = () => { if (!audioRef.current) return; audioRef.current.pause(); setIsPlaying(false); };
  const replayAudio = () => {
    if (!audioRef.current) return;
    const a = audioRef.current;
    a.pause(); a.currentTime = 0; a.play();
    setIsPlaying(true);
  };
  const onEnded = () => setIsPlaying(false);

  const chooseHearOption = (label) => {
    const next = [...(entries.hear3 || ["", "", ""])];
    next[hearRound] = label;
    setEntries((prev) => ({ ...prev, hear3: next }));
    saveStep("hear3", next);
  };

  const goPrevRound = () => {
    const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0; }
    setIsPlaying(false);
    setHearRound((r) => Math.max(0, r - 1));
  };
  const goNextRound = () => {
    const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0; }
    setIsPlaying(false);
    setHearRound((r) => Math.min(2, r + 1));
  };

  const pickedLabel = (entries.hear3 || ["", "", ""])[hearRound] || "";

  /* ---------- 일반 단계 리스트 (see5/hear3/touch4 제외) ---------- */
  const currentList = (() => {
    if (current.key === "see5" || current.key === "hear3" || current.key === "touch4") return [];
    return entries[current.key] || [];
  })();
  const remainingGeneric = Math.max(0, (current.targetCount || 0) - currentList.length);

  const canAdd =
    current.key !== "intro" &&
    current.key !== "done" &&
    current.key !== "see5" &&
    current.key !== "hear3" &&
    current.key !== "touch4" &&
    text.trim().length > 0 &&
    ((current.targetCount || 0) === 0 || currentList.length < (current.targetCount || 0));

  const addItem = () => {
    if (!canAdd) return;
    const nextList = [...currentList, text.trim()];
    const nextEntries = { ...entries, [current.key]: nextList };
    setEntries(nextEntries); saveStep(current.key, nextList);
    setText(""); inputRef.current?.focus();
  };

  const removeItem = (idx) => {
    const nextList = currentList.filter((_, i) => i !== idx);
    const nextEntries = { ...entries, [current.key]: nextList };
    setEntries(nextEntries); saveStep(current.key, nextList);
  };

  /* ---------- 완료 카운트 ---------- */
  const completedCount = useMemo(() => {
    return (
      STEPS.filter((s) => {
        if (s.key === "intro") return true;
        if (s.key === "see5") {
          const maxLen = Math.max(entries.see5_labels?.length || 0, entries.see5_text?.length || 0);
          return maxLen >= (s.targetCount || 0);
        }
        if (s.key === "hear3") {
          const n = (entries.hear3 || []).filter(Boolean).length;
          return n >= (s.targetCount || 0);
        }
        if (s.key === "touch4") {
          return (entries.touch4?.length || 0) >= (s.targetCount || 0);
        }
        return (entries[s.key]?.length || 0) >= (s.targetCount || 0);
      }).length - 1
    );
  }, [entries]);

  /* ---------- touch4 저장 콜백 ---------- */
  const addTouchRecord = (rec) => {
    const next = [...(entries.touch4 || []), rec];
    setEntries((prev) => ({ ...prev, touch4: next }));
    saveStep("touch4", next);
  };

  /* ---------- 렌더 ---------- */
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{current.title}</h1>
          {current.subtitle && (
            <p className="mt-3 text-base md:text-lg text_GRAY-600 whitespace-pre-wrap">{current.subtitle}</p>
          )}

          {/* ---------- SEE5 ---------- */}
          {current.key === "see5" && (
            <div className="mt-8 w-full max-w-md">
              <div
                className="w-full rounded-2xl overflow-hidden border border-gray-200 bg-white relative group cursor-pointer"
                onClick={shuffleSee}
                title="클릭하면 다른 이미지가 랜덤으로 나타납니다"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={seeImage.src}
                    alt="안전한 시각 자극"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover transition group-active:opacity-90"
                    priority
                  />
                </div>
              </div>

              <div className="mt-2 w-full flex justify-end">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchSeeMode("image")}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      (seeMode === "image")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    라벨 버튼
                  </button>
                  <button
                    onClick={() => switchSeeMode("text")}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      (seeMode === "text")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    직접 입력
                  </button>
                </div>
              </div>

              {seeMode === "image" && (
                <>
                  <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2 w-full">
                    {seeImage.labels.map((lab, idx) => {
                      const picked = (entries.see5_labels || []).includes(lab);
                      const disabled = !picked && (entries.see5_labels?.length || 0) >= 5;
                      return (
                        <button
                          key={`${seeImage.src}-${lab}-${idx}`}
                          onClick={() => toggleLabel(lab)}
                          disabled={disabled}
                          className={`truncate rounded-full px-3 py-2 text-sm border transition ${
                            picked
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                          title={lab}
                          aria-pressed={picked}
                        >
                          {lab}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between w-full text-sm text-gray-600">
                    <button
                      onClick={shuffleSee}
                      className="rounded-lg px-3 py-1 border border-gray-300 hover:bg-gray-100"
                    >
                      다른 이미지 보여줘 🔀
                    </button>
                    <div>남은 항목: <strong>{see5Remaining}</strong> / 5</div>
                  </div>
                </>
              )}

              {seeMode === "text" && (
                <div className="mt-4">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                      placeholder={see5Placeholder}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSeeText(); } }}
                      disabled={(entries.see5_text?.length || 0) >= 5}
                    />
                    <button
                      onClick={addSeeText}
                      className="rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition disabled:opacity-40"
                      disabled={!text.trim() || (entries.see5_text?.length || 0) >= 5}
                    >
                      추가
                    </button>
                  </div>

                  {(entries.see5_text?.length || 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(entries.see5_text || []).map((chip, i) => (
                        <span
                          key={`see5-chip-${i}`}
                          className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-800"
                        >
                          {chip}
                          <button
                            onClick={() => removeSeeTextAt(i)}
                            aria-label="삭제"
                            className="rounded-md border border-gray-300 px-1 leading-none text-gray-600 hover:bg-gray-200"
                            title="삭제"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between w-full text-sm text-gray-600">
                    <button
                      onClick={shuffleSee}
                      className="rounded-lg px-3 py-1 border border-gray-300 hover:bg-gray-100"
                    >
                      다른 이미지 보여줘 🔀
                    </button>
                    <div>남은 항목: <strong>{see5Remaining}</strong> / 5</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------- TOUCH4 ---------- */}
          {current.key === "touch4" && (
            <TouchGroundingStep
              targetCount={4}
              onAdd={addTouchRecord}
              onDone={goNext}
            />
          )}

          {/* ---------- HEAR3 ---------- */}
          {current.key === "hear3" && (
            <div className="mt-8 w-full max-w-md">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">라운드 {hearRound + 1} / 3</div>
                <div className="flex gap-1" aria-label="라운드 점프">
                  {[0,1,2].map((r) => {
                    const filled = (entries.hear3?.[r] || "") !== "";
                    return (
                      <button
                        key={`dot-${r}`}
                        onClick={() => {
                          const a = audioRef.current;
                          if (a) { a.pause(); a.currentTime = 0; }
                          setIsPlaying(false);
                          setHearRound(r);
                        }}
                        className={`w-3 h-3 rounded-full border ${
                          hearRound === r
                            ? "border-gray-900 bg-gray-900"
                            : filled
                              ? "border-gray-600 bg-gray-600"
                              : "border-gray-300 bg-white"
                        }`}
                        aria-label={`${r+1}라운드로 이동`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center">
                <button
                  onClick={isPlaying ? pauseAudio : playAudio}
                  className="w-28 h-28 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-lg"
                  aria-label={isPlaying ? "멈춤" : "재생"}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>

                <div className="mt-3">
                  <button
                    onClick={replayAudio}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    aria-label="다시 듣기"
                  >
                    ↺ 다시 듣기
                  </button>
                </div>

                <audio
                  ref={audioRef}
                  src={currentHear?.src}
                  onEnded={onEnded}
                  preload="auto"
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {(currentHear?.options || []).map((opt, i) => {
                  const picked = pickedLabel === opt;
                  return (
                    <button
                      key={`${currentHear?.src}-${opt}-${i}`}
                      onClick={() => chooseHearOption(opt)}
                      className={`truncate rounded-xl px-3 py-3 text-sm border transition ${
                        picked
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={goPrevRound}
                  className="rounded-lg px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                  disabled={hearRound === 0}
                >
                  ← 이전 라운드
                </button>
                <button
                  onClick={goNextRound}
                  className="rounded-lg px-3 py-1.5 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white disabled:opacity-40"
                  disabled={hearRound === 2}
                >
                  다음 라운드 →
                </button>
              </div>
            </div>
          )}

          {/* ---------- 다른 단계(일반 입력) ---------- */}
          {current.key !== "intro" &&
            current.key !== "done" &&
            current.key !== "see5" &&
            current.key !== "hear3" &&
            current.key !== "touch4" && (
              <div className="mt-8 w-full max-w-md flex flex-col items-center">
                <input
                  ref={inputRef}
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                  placeholder={current.placeholder}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                  disabled={(current.targetCount || 0) > 0 && currentList.length >= (current.targetCount || 0)}
                />
                <div className="mt-2 text-sm text-gray-500">
                  {(current.targetCount || 0) > 0 ? (
                    <>남은 항목: <strong>{remainingGeneric}</strong> / {current.targetCount}</>
                  ) : (
                    <>하나씩 입력하고 Enter를 누르세요</>
                  )}
                </div>
                <button
                  onClick={addItem}
                  className="mt-4 rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition disabled:opacity-40"
                  disabled={!canAdd}
                >
                  추가
                </button>
                <ol className="mt-8 w-full max-w-md space-y-2 list-decimal list-inside text-left mx-auto" aria-live="polite">
                  {currentList.map((item, idx) => (
                    <li key={`${current.key}-${idx}`} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 text-gray-800 bg-gray-50">
                      <span className="truncate">{item}</span>
                      <button
                        onClick={() => removeItem(idx)}
                        aria-label="삭제"
                        className="shrink-0 rounded-md px-2 py-1 border border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                        title="삭제"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}

          {/* ---------- Done ---------- */}
          {current.key === "done" && (
            <div className="mt-8 w-full max-w-md flex flex-col items-center">
              <textarea
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                rows={3}
                placeholder={current.placeholder}
                value={text}
                onChange={(e) => {
                  const val = e.target.value;
                  setText(val);
                  const arr = val ? [val] : [];
                  const nextEntries = { ...entries, done: arr };
                  setEntries(nextEntries); saveStep("done", arr);
                }}
              />
              <Link href="/" className="mt-6 rounded-xl px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition">
                메인으로 돌아가기
              </Link>
            </div>
          )}

          {/* ---------- Navigation ---------- */}
          <div className="mt-10 w-full flex items-center justify-between">
            <button
              onClick={goPrev}
              className="rounded-xl px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-40"
              disabled={stepIndex === 0}
            >
              이전
            </button>
            <div className="text-sm text-gray-500">
              단계 {stepIndex + 1} / {STEPS.length}
              {stepIndex > 0 && <span className="ml-2">완료 {completedCount} / 6</span>}
            </div>
            {current.key !== "done" && (
              <button
                onClick={goNext}
                className="rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                다음으로 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
