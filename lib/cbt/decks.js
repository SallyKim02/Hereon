// lib/cbt/decks.js
export const DECKS = {
  panic: {
    key: "panic",
    label: "공황/신체감각",
    pairs: [
      { id: "p1", auto: "나는 겁쟁이야. 이런 나 자신이 싫어", alt: "불안은 인간의 기본 정서야. 올라오면 다루는 연습을 해 나가면 돼" },
      { id: "p2", auto: "나는 절대 불안하면 안 돼", alt: "감정 수용은 훈련일 뿐, 이번에는 다룰 수도 있어" },
      { id: "p3", auto: "또 분명 발작이 올 거야", alt: "나는 불안을 경험하는 사람이고, 지금은 안전해. 구체적 행동에 집중하자" },
      { id: "p4", auto: "심장이 빨리 뛰니 큰일이야", alt: "심박 상승은 생리적 반응일 뿐, 위험 신호는 아냐" },
      { id: "p5", auto: "숨이 막히는 것 같아 죽을지도 몰라", alt: "과호흡일 수 있어. 천천히 호흡을 조절하면 가라앉아" },
    ],
  },
  social: {
    key: "social",
    label: "대인/발표",
    pairs: [
      { id: "s1", auto: "사람들이 날 바보라고 생각할 거야", alt: "모두가 평가만 하진 않아. 메시지만 전달돼도 충분해" },
      { id: "s2", auto: "실수하면 끝장이야", alt: "작은 실수는 자연스러워. 회복이 더 좋은 인상을 줘" },
      { id: "s3", auto: "나는 말을 못해", alt: "준비한 포인트를 또박또박 말하면 돼" },
      { id: "s4", auto: "내 의견은 하찮아", alt: "나만 줄 수 있는 관점이 있어. 한 문장씩 꺼내보자" },
      { id: "s5", auto: "얼굴 빨개지면 망해", alt: "홍조는 흔한 반응이야. 내용에 주의를 돌리자" },
    ],
  },
  worry: {
    key: "worry",
    label: "범불안/걱정",
    pairs: [
      { id: "w1", auto: "안 좋은 일이 반드시 일어날 거야", alt: "가능성과 확률은 달라. 증거를 다시 보자" },
      { id: "w2", auto: "최악만 생각나", alt: "최악·최선·가장 현실적인 시나리오를 모두 보자" },
      { id: "w3", auto: "걱정을 멈출 수 없어", alt: "걱정은 기술로 관리 가능해. 걱정시간을 따로 잡자" },
      { id: "w4", auto: "준비가 완벽해야만 해", alt: "충분히 괜찮음이 목표. 80%면 출발하자" },
      { id: "w5", auto: "한 번 실패하면 계속 실패해", alt: "사건은 독립적이야. 이번엔 다를 근거가 있어" },
    ],
  },
};

export function getAllDecks() {
  return Object.values(DECKS);
}
export function getDeckByKey(key) {
  return DECKS[key] || DECKS.panic;
}
export function getRandomPairs(deckKey, count = 3) {
  const deck = getDeckByKey(deckKey).pairs.slice();
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, count);
}
