"use client";
import { useEffect, useMemo, useState } from "react";

export default function BreathingPage() {
  const [inhale, setInhale] = useState(4);
  const [hold, setHold] = useState(2);
  const [exhale, setExhale] = useState(4);

  const [inhaleStr, setInhaleStr] = useState(String(inhale));
  const [holdStr, setHoldStr] = useState(String(hold));
  const [exhaleStr, setExhaleStr] = useState(String(exhale));

  const [phase, setPhase] = useState("원하는 시간을 선택해 주세요");
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [mode, setMode] = useState("circle"); // "circle" | "bar"
  const total = useMemo(() => inhale + hold + exhale, [inhale, hold, exhale]);
  const [progress, setProgress] = useState(0);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 1.0;
  const [circleScale, setCircleScale] = useState(MIN_SCALE);
  const [circleTransitionSec, setCircleTransitionSec] = useState(0);

  const [elapsedSec, setElapsedSec] = useState(0);
  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(sec).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  useEffect(() => {
    if (!isRunning) return;
    const iv = setInterval(() => setElapsedSec((v) => v + 1), 1000);
    return () => clearInterval(iv);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || total <= 0) return;

    let t = 0;
    setPhase("들이마시기");
    setCount(inhale);
    setProgress(0);

    setCircleTransitionSec(0);
    setCircleScale(MIN_SCALE);

    const iv = setInterval(() => {
      t = (t + 1) % total;

      if (t < inhale) {
        setPhase("들이마시기");
        setCount(inhale - t);
        setProgress(((t + 1) / inhale) * 100);
      } else if (t < inhale + hold) {
        setPhase("멈추기");
        setCount(inhale + hold - t);
        setProgress(100);
      } else {
        setPhase("내쉬기");
        setCount(total - t);
        const e = t - (inhale + hold);
        setProgress(100 - ((e + 1) / exhale) * 100);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [isRunning, total, inhale, hold, exhale]);

  useEffect(() => {
    if (!isRunning || total <= 0) return;

    if (phase === "들이마시기") {
      setCircleTransitionSec(inhale);
      setCircleScale(MAX_SCALE);
    } else if (phase === "멈추기") {
      setCircleTransitionSec(0);
      setCircleScale(MAX_SCALE);
    } else if (phase === "내쉬기") {
      setCircleTransitionSec(exhale);
      setCircleScale(MIN_SCALE);
    }
  }, [phase, inhale, exhale, isRunning, total]);

  const applyPreset = (type) => {
    if (type === "4-2-4") {
      const ni = 4, nh = 2, ne = 5;
      setInhale(ni); setHold(nh); setExhale(ne);
      setInhaleStr(String(ni)); setHoldStr(String(nh)); setExhaleStr(String(ne));
    } else if (type === "4-7-8") {
      const ni = 4, nh = 7, ne = 8;
      setInhale(ni); setHold(nh); setExhale(ne);
      setInhaleStr(String(ni)); setHoldStr(String(nh)); setExhaleStr(String(ne));
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setPhase("원하는 시간을 선택해 주세요");
      setCount(0);
      setProgress(0);
      setCircleTransitionSec(0);
      setCircleScale(MIN_SCALE);
      setElapsedSec(0);
    } else {
      setIsRunning(true);
    }
  };

  const finalizeInhale = () => {
    let n = parseInt(inhaleStr, 10);
    if (isNaN(n) || n < 1) n = 1;
    setInhale(n);
    setInhaleStr(String(n));
    if (exhale < n + 1) {
      setExhale(n + 1);
      setExhaleStr(String(n + 1));
    }
  };
  const finalizeHold = () => {
    let n = parseInt(holdStr, 10);
    if (isNaN(n) || n < 0) n = 0;
    setHold(n);
    setHoldStr(String(n));
  };
  const finalizeExhale = () => {
    let n = parseInt(exhaleStr, 10);
    if (isNaN(n)) n = inhale + 1;
    if (n < inhale + 1) n = inhale + 1;
    setExhale(n);
    setExhaleStr(String(n));
  };

  useEffect(() => setInhaleStr(String(inhale)), [inhale]);
  useEffect(() => setHoldStr(String(hold)), [hold]);
  useEffect(() => setExhaleStr(String(exhale)), [exhale]);

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-left">호흡 훈련</h1>

            <div className="flex flex-col items-end gap-2">
              <div className="inline-flex rounded-full border border-gray-300 overflow-hidden">
                <button
                  className={`px-4 py-2 text-sm ${mode === "circle" ? "bg-gray-900 text-white" : "bg-white text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setMode("circle")}
                >
                  원
                </button>
                <button
                  className={`px-4 py-2 text-sm ${mode === "bar" ? "bg-gray-900 text-white" : "bg-white text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setMode("bar")}
                >
                  막대
                </button>
              </div>

              <span
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium text-gray-700"
                aria-live="polite"
                title="세션 경과 시간"
              >
                ⏱️ <span className="tabular-nums">{formatTime(elapsedSec)}</span>
              </span>
            </div>
          </div>

          {/* 시각화 */}
          <section className="mt-8 w-full flex flex-col items-center">
            {mode === "circle" ? (
              <div className="w-full flex flex-col items-center">
                <div className="relative mx-auto flex items-center justify-center" style={{ width: 288, height: 288 }}>
                  <div
                    className="absolute inset-0 rounded-full border-2 border-gray-300"
                    style={{
                      transform: `scale(${circleScale})`,
                      transition: `transform ${circleTransitionSec}s linear`,
                      transformOrigin: "center center",
                      willChange: "transform",
                    }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-semibold" aria-live="polite">
                      {isRunning ? count : "준비"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="relative w-full h-5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-gray-900 transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-4 text-3xl font-semibold">{isRunning ? count : "준비"}</div>
              </div>
            )}
            <p className="mt-2 text-lg font-medium">{phase}</p>
          </section>

          {/* 입력/프리셋 */}
          <section className="mt-6 w-full max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-4 justify-items-center items-start mx-auto">
              {/* 들이마시기 */}
              <label className="text-sm text-center">
                <span className="block mb-1 text-[11px] text-gray-700">들이마시기</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={inhaleStr}
                  onChange={(e) => setInhaleStr(e.target.value)}
                  onBlur={finalizeInhale}
                  className="w-20 h-11 rounded-xl border border-gray-300 px-3 text-center text-base leading-none focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </label>

              {/* 멈추기 */}
              <label className="text-sm text-center">
                <span className="block mb-1 text-[11px] text-gray-700">멈추기</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={holdStr}
                  onChange={(e) => setHoldStr(e.target.value)}
                  onBlur={finalizeHold}
                  className="w-20 h-11 rounded-xl border border-gray-300 px-3 text-center text-base leading-none focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </label>

              {/* 내쉬기 */}
              <label className="text-sm text-center">
                <span className="block mb-1 text-[11px] text-gray-700">내쉬기</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={inhale + 1}
                  value={exhaleStr}
                  onChange={(e) => setExhaleStr(e.target.value)}
                  onBlur={finalizeExhale}
                  className="w-20 h-11 rounded-xl border border-gray-300 px-3 text-center text-base leading-none focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
                <span className="mt-1 block text-[10px] text-gray-500 text-center">
                  들이마시기 보다 길게 내쉬기
                </span>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset("4-2-4")}
                className="rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                4-2-5
              </button>
              <button
                onClick={() => applyPreset("4-7-8")}
                className="rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                4-7-8
              </button>

              <button
                onClick={handleStartStop}
                className="ml-auto rounded-xl px-5 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                {isRunning ? "정지" : "시작"}
              </button>
            </div>
          </section>

          <div className="mt-8 w-full flex justify-center">
            <a
              href="/"
              className="rounded-xl px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-center"
            >
              메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
