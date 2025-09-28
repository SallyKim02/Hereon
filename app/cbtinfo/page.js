// app/cbtinfo/page.js
export default function CBTInfoPage() {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-center text-center">
          {/* Header */}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            CBT란 무엇인가요?
          </h1>

          {/* Body */}
          <div className="mt-8 w-full max-w-md text-left space-y-6">
            <section>
              <h2 className="text-lg font-semibold">CBT(인지행동치료)란?</h2>
              <p className="mt-2 text-gray-700">
                설명 넣기
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold">이 카드의 4단계</h2>
              <ol className="mt-2 list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">상황</span>- 지금 있었던 일/장소/문맥
                  <span className="text-gray-500">예) “지하철에서 심장 두근거림”</span>
                </li>
                <li>
                  <span className="font-medium">자동적 사고</span>— 그 순간 든 생각
                  <span className="text-gray-500">예) “나는 쓰러질 거야”</span>
                </li>
                <li>
                  <span className="font-medium">감정</span>— 느낀 감정 선택, 강도 인식
                  <span className="text-gray-500">예) 불안, 당황</span>
                </li>
                <li>
                  <span className="font-medium">대안적 사고</span>— 증거 살펴보고 새롭게 문장 작성
                  <span className="text-gray-500">예)
                  “괜찮아질 것이다”</span>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold">작성 팁</h2>
              <ul className="mt-2 list-disc list-inside space-y-2 text-gray-700">
                <li>“사실·증거”와 “생각·해석”을 구분해 보기</li>
                <li>흑백사고·재앙화·과잉일반화 등 인지왜곡 신호 찾기</li>
                <li>대안 문장은 짧고 구체적으로, 현재형으로 쓰기</li>
                <li>완벽보다 “충분히 괜찮음(80%)”을 목표로 하기</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold">안전 안내</h2>
              <p className="mt-2 text-gray-700">
                자·타해 위험, 의식 소실, 흉통·호흡곤란 등 응급 증상 시 즉시 112/119에
                연락하세요. 심각한 고통이 지속되면 정신건강의학과/상담센터로 연결하세요.
                한국 위기상담 1393.
              </p>
            </section>
          </div>

          {/* Footer Navigation: CBT 카드 → 메인 순서와 호환되도록 반대 링크 제공 */}
          <div className="mt-10 w-full flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/cbtcard"
              className="rounded-xl px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-center"
            >
              CBT 카드로 돌아가기
            </a>
            <a
              href="/"
              className="rounded-xl px-6 py-3 border border-gray-300 text-gray-600 hover:bg-gray-100 transition text-center"
            >
              메인으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
