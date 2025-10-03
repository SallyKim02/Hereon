// components/cbt/PracticeBoard.js
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PracticeCard from "./PracticeCard";
import { getAllDecks, getRandomPairs } from "../../lib/cbt/decks";

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PracticeBoard() {
  const router = useRouter();

  const [category, setCategory] = useState("panic");
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedRightIds, setMatchedRightIds] = useState(new Set());
  const [pairsDone, setPairsDone] = useState([]);

  const decks = useMemo(() => getAllDecks(), []);

  const makeRound = (deckKey) => {
    const trio = getRandomPairs(deckKey, 3);
    const left = trio.map((p) => ({ id: p.id + "_L", base: p.id, text: p.auto }));
    const right = shuffle(trio.map((p) => ({ id: p.id + "_R", base: p.id, text: p.alt })));
    const answerMap = {};
    trio.forEach((p) => (answerMap[p.id + "_L"] = p.id + "_R"));
    return { left, right, answerMap };
  };

  useEffect(() => {
    const r0 = makeRound(category);
    setRounds([r0]);
    setRoundIndex(0);
    setSelectedLeft(null);
    setMatchedRightIds(new Set());
    setPairsDone([]);
  }, [category]);

  const current = rounds[roundIndex];
  const allMatched =
    current && current.left.every((l) => matchedRightIds.has(current.answerMap[l.id]));

  useEffect(() => {
    if (allMatched && roundIndex >= 2) {
      const t = setTimeout(() => router.push("/cbt"), 900);
      return () => clearTimeout(t);
    }
  }, [allMatched, roundIndex, router]);

  const onClickLeft = (lid) => {
    if (allMatched) return;
    setSelectedLeft(lid);
  };

  const onClickRight = (rid) => {
    if (!selectedLeft || allMatched) return;
    const correctRid = current.answerMap[selectedLeft];
    if (rid === correctRid) {
      const next = new Set(matchedRightIds);
      next.add(rid);
      setMatchedRightIds(next);
      setPairsDone([...pairsDone, { leftId: selectedLeft, rightId: rid }]);
      setSelectedLeft(null);
    } else {
      setSelectedLeft(null);
    }
  };

  const reshuffle = () => {
    const newRound = makeRound(category);
    const copied = rounds.slice();
    copied[roundIndex] = newRound; // 현재 라운드만 교체
    setRounds(copied);
    setSelectedLeft(null);
    setMatchedRightIds(new Set());
    setPairsDone([]);
  };

  const goPrev = () => {
    if (roundIndex > 0) {
      setRoundIndex(roundIndex - 1);
      setSelectedLeft(null);
      setMatchedRightIds(new Set());
      setPairsDone([]);
    }
  };

  const nextRound = () => {
    const newRound = makeRound(category);
    const copied = [...rounds, newRound];
    setRounds(copied);
    setRoundIndex(roundIndex + 1);
    setSelectedLeft(null);
    setMatchedRightIds(new Set());
    setPairsDone([]);
  };

  if (!current) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 bg-white text-slate-900">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">CBT 연습</h1>
          <p className="text-sm text-slate-600">자동적 사고 ↔ 대안적 사고 매칭</p>
        </div>
      </div>

      {/* 카테고리 탭 + 위쪽 다시섞기 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {decks.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setCategory(d.key)}
              className={[
                "px-3 py-1.5 rounded-full border text-sm",
                category === d.key
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-800 border-slate-300 hover:border-slate-400",
              ].join(" ")}
            >
              {d.label}
            </button>
          ))}
        </div>
        <button
          onClick={reshuffle}
          className="text-sm rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
        >
          다시섞기
        </button>
      </div>

      {/* 두 칼럼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 좌측 */}
        <div>
          <div className="mb-2 font-medium">자동적 사고</div>
          <div className="space-y-3">
            {current.left.map((l) => {
              const matched = pairsDone.some((p) => p.leftId === l.id);
              return (
                <PracticeCard
                  key={l.id}
                  text={l.text}
                  isSelected={selectedLeft === l.id}
                  isMatched={matched}
                  onClick={() => onClickLeft(l.id)}
                />
              );
            })}
          </div>
        </div>

        {/* 우측 */}
        <div>
          <div className="mb-2 font-medium">대안적 사고</div>
          <div className="space-y-3">
            {current.right.map((r) => {
              const matched = matchedRightIds.has(r.id);
              return (
                <PracticeCard
                  key={r.id}
                  text={r.text}
                  isSelected={false}
                  isMatched={matched}
                  onClick={() => onClickRight(r.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

        {/* 하단 컨트롤 */}
      <div className="mt-8">
        <div className="text-sm text-slate-700 mb-4">
          {pairsDone.length} / 3 매칭 완료
        </div>

        <div className="flex justify-center items-center gap-6">
          {/* 이전 라운드로 */}
          <button
            onClick={goPrev}
            disabled={roundIndex === 0 || !allMatched}
            className="rounded-md border border-slate-300 px-4 py-2 disabled:opacity-40 hover:bg-slate-50"
          >
            이전 라운드
          </button>

          {/* 라운드 진행 표시 */}
          <span className="text-base font-medium text-slate-700">
            {roundIndex + 1} / 3
          </span>

          {/* 다음 라운드 */}
          <button
            onClick={nextRound}
            disabled={!allMatched}
            className="rounded-md bg-slate-900 text-white px-4 py-2 disabled:opacity-40 hover:opacity-90"
          >
            다음 라운드
          </button>
        </div>
      </div>

    </div>
  );
}
