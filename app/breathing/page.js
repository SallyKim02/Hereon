"use client";
import { useEffect, useMemo, useState } from "react";

export default function BreathingPage() {
  const [inhale, setInhale] = useState(4);
  const [hold, setHold] = useState(2);
  const [exhale, setExhale] = useState(4);

  const [phase, setPhase] = useState("원하는 시간을 선택해 주세요");
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [mode, setMode] = useState("circle"); // circle | bar
  const total = useMemo(() => inhale + hold + exhale, [inhale, hold, exhale]);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isRunning || total <= 0) return;
    let t = 0;

    setPhase("들이마시기");
    setCount(inhale);
    setProgress(0);

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

  const applyPreset = (type) => {
    if (type === "4-2-4") {
      setInhale(4); setHold(2); setExhale(4);
    } else if (type === "4-7-8") {
      setInhale(4); setHold(7); setExhale(8);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center text-center">
          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">호흡 훈련</h1>

          {/* 모드 토글 */}
          <div className="mt-4 inline-flex rounded-full border border-gray-300 overflow-hidden">
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

          {/* 시각화 */}
          <section className="mt-8 w-full flex flex-col items-center">
            {mode === "circle" ? (
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-56 h-56 md:w-64 md:h-64 rounded-full border-2 border-gray-300 flex items-center justify-center`}
                  style={{
                    animation:
                      phase === "들이마시기"
                        ? `inhaleAnim ${inhale}s linear infinite`
                        : phase === "내쉬기"
                        ? `exhaleAnim ${exhale}s linear infinite`
                        : "none",
                  }}
                >
                  <div className="text-3xl font-semibold">{isRunning ? count : "준비"}</div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="relative w-full h-5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gray-900 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 text-3xl font-semibold">{isRunning ? count : "준비"}</div>
              </div>
            )}
            <p className="mt-4 text-lg font-medium">{phase}</p>
          </section>

          {/* 입력/프리셋/시작정지 */}
          <section className="mt-8 w-full max-w-md text-left">
            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm">
                <span className="block">들이마시기</span>
                <input
                  type="number"
                  min={1}
                  value={inhale}
                  onChange={(e) => setInhale(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </label>
              <label className="text-sm">
                <span className="block">멈추기</span>
                <input
                  type="number"
                  min={0}
                  value={hold}
                  onChange={(e) => setHold(Math.max(0, Number(e.target.value)))}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </label>
              <label className="text-sm">
                <span className="block">내쉬기</span>
                <input
                  type="number"
                  min={1}
                  value={exhale}
                  onChange={(e) => setExhale(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => applyPreset("4-2-4")}
                className="rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                4-2-4
              </button>
              <button
                onClick={() => applyPreset("4-7-8")}
                className="rounded-xl px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                4-7-8
              </button>

              <button
                onClick={() => setIsRunning((v) => !v)}
                className="ml-auto rounded-xl px-5 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                {isRunning ? "정지" : "시작"}
              </button>
            </div>
          </section>

          {/* 하단 버튼 */}
          <div className="mt-10 w-full flex justify-center">
            <a
              href="/"
              className="rounded-xl px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-center"
            >
              메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes inhaleAnim {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
        @keyframes exhaleAnim {
          0% { transform: scale(1.2); }
          100% { transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
