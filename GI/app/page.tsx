'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

const PLAN_DETAILS: Record<string | number, { name: string; desc: string; isSelfPay?: boolean; isInsurance?: boolean }> = {
  1: { name: "① 通院一回（当日のみ）プラン", desc: "何度も通う手間は、私たちが引き受けます。あなたは当日、手術に来るだけでいい。それが今の時代の新しい治し方です。" },
  2: { name: "② 術後通院不要・遠隔サポートプラン", desc: "術後の移動は、お体に障ります。ご自宅でゆっくりお休みください。画面越しでも、私の目はあなたの経過を逃しません。" },
  3: { name: "③ 準備らくらく・術後しっかりプラン", desc: "準備の負担は最小限に、術後は手厚く。一番大事な時期に直接お会いして診る。安心と効率を両立した、最も『賢い』選択です。" },
  4: { name: "④ 休日特別枠・エグゼクティブプラン", desc: "失えない時間がある方のための、特別な一席です。月曜日、何事もなかったように最前線へ戻る。その対価としての価値をお約束します。", isSelfPay: true },
  5: { name: "⑤ 旅する手術プラン", desc: "手術を人生の嫌な思い出にしないでください。岡山・京都・阪神からお好きな街を選び、完治への道を特別な体験に変えましょう。", isInsurance: true },
  6: { name: "⑥ Gi 365 王道プラン", desc: "迷われるなら、これ。一年間、私があなたの伴走者になります。再発を許さない、Giが開院以来最も大切にしてきた究極のプランです。" },
  "standard": { name: "標準プラン（平日手術）", desc: "平日に手術を行い、保険診療の範囲で最も確実な治療を行います。", isInsurance: true }
}

const QUESTIONS = [
  {
    text: "あなたが治療において、最も「譲れないもの」は何ですか？",
    options: [
      { id: 'A', text: "1分1秒を惜しむ「時間」", sub: "仕事や日常を一瞬も止めたくない" },
      { id: 'B', text: "専門医に直接診てもらう「確信」", sub: "プロの目と手で確認してほしい" },
      { id: 'C', text: "手術を「ご褒美旅」と捉えたい", sub: "手術を嫌な思い出にしたくない" }
    ]
  },
  {
    text: "通院や移動について、正直な「お気持ち」は？",
    options: [
      { id: 'A', text: "「一回でも減らしたい」", sub: "遠い、忙しい、移動が負担" },
      { id: 'B', text: "「必要ならしっかり通いたい」", sub: "対面の診察が一番の安心" }
    ]
  },
  {
    text: "術後、どのような「日常」を迎えたいですか？",
    options: [
      { id: 'A', text: "「何事もなかったように最前線へ」", sub: "すぐに元の生活へ戻りたい" },
      { id: 'B', text: "「一年かけて、専門医と二人三脚で」", sub: "完璧に卒業したい" },
      { id: 'C', text: "「自宅でゆっくり、不安な時は相談」", sub: "無理せず、遠隔で見守ってほしい" }
    ]
  }
]

const LOGIC: Record<string, { surgery: (number | string)[]; care: number[] }> = {
  "AAA": { surgery: [4], care: [1] },
  "AAB": { surgery: ["standard"], care: [1] },
  "AAC": { surgery: ["standard"], care: [1] },
  "ABA": { surgery: [4], care: [2, 3, 6] },
  "ABB": { surgery: ["standard"], care: [3] },
  "ABC": { surgery: ["standard"], care: [3] },
  "BAA": { surgery: [4], care: [2, 3] },
  "BAB": { surgery: ["standard"], care: [3] },
  "BAC": { surgery: ["standard"], care: [3] },
  "BBA": { surgery: [4], care: [6] },
  "BBB": { surgery: ["standard"], care: [6] },
  "BBC": { surgery: ["standard"], care: [3] },
  "CAA": { surgery: [4, 5], care: [1] },
  "CAB": { surgery: [5], care: [1] },
  "CAC": { surgery: [5], care: [1] },
  "CBA": { surgery: [4, 5], care: [6] },
  "CBB": { surgery: [5], care: [6] },
  "CBC": { surgery: [5], care: [6] }
}

const QUOTES: Record<number, string> = {
  1: "お忙しいあなたには、準備を最小限に抑えたこのプランが最適です。当日だけお任せください。",
  2: "遠方にお住まいで通院が負担なら、この遠隔サポートが一番です。離れていても私がしっかり見守ります。",
  3: "準備の負担は最小限に、術後は手厚く。一番大事な時期に直接お会いして診る。安心と効率を両立した、最も『賢い』選択です。",
  6: "迷われるなら、これ。一年間、私があなたの伴走者になります。再発を許さない、Giが開院以来最も大切にしてきた究極のプランです。"
}

type Screen = 'start' | 'question' | 'result'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start')
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selectedCare, setSelectedCare] = useState<number | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => console.log('SW registered:', registration.scope))
        .catch((error) => console.log('SW registration failed:', error))
    }
  }, [])

  const startDiagnosis = () => {
    setScreen('question')
    setCurrentStep(0)
    setAnswers([])
  }

  const nextStep = (answerId: string) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = answerId
    setAnswers(newAnswers)

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      setScreen('result')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const restart = () => {
    setScreen('start')
    setCurrentStep(0)
    setAnswers([])
    setSelectedCare(null)
  }

  const getResult = () => {
    const pattern = answers.join('')
    return LOGIC[pattern]
  }

  const getQuote = (planId: number) => {
    return QUOTES[planId] || "あなたの価値観に寄り添った、最適な治療を約束します。"
  }

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <style jsx global>{`
        body { font-family: 'Noto Sans JP', sans-serif; background-color: #f8fafc; }
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .bg-gi-blue { background-color: #00429d; }
        .text-gi-blue { color: #00429d; }
        .border-gi-blue { border-color: #00429d; }
      `}</style>

      <div className="max-w-xl mx-auto min-h-screen flex flex-col p-4 text-slate-800 antialiased leading-relaxed">
        {/* Header */}
        <header className="py-6 text-center">
          <h1 className="text-gi-blue text-2xl font-bold tracking-wider">医療法人Gi</h1>
          <p className="text-sm text-slate-500 font-bold mt-1">人生の完治コンパス</p>
        </header>

        <main className="flex-grow flex flex-col justify-center">
          {/* Start Screen */}
          {screen === 'start' && (
            <div className="fade-in text-center space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-gi-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-4">あなたに最適な「完治のカタチ」を提案します</h2>
                <p className="text-slate-600 mb-6 text-sm">3つの質問に答えるだけで、池田理事長が推奨する治療プランを自動診断します。（所要時間：約30秒）</p>
                <button onClick={startDiagnosis} className="w-full bg-gi-blue text-white py-4 rounded-full text-lg font-bold shadow-lg hover:opacity-90 transition transform active:scale-95">診断を始める</button>
              </div>
            </div>
          )}

          {/* Question Screen */}
          {screen === 'question' && (
            <div className="fade-in space-y-6">
              <div className="mb-4 px-2">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gi-blue transition-all duration-500" style={{ width: `${((currentStep + 1) / 3) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Question</span>
                  <p className="text-right text-xs text-slate-400 font-bold">{currentStep + 1} / 3</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[400px] flex flex-col">
                <h3 className="text-lg font-bold mb-8 text-gi-blue leading-tight">{QUESTIONS[currentStep].text}</h3>
                <div className="space-y-4 flex-grow">
                  {QUESTIONS[currentStep].options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => nextStep(opt.id)}
                      className="w-full text-left p-5 border-2 border-slate-100 rounded-2xl transition group flex flex-col transform active:scale-[0.98] hover:border-gi-blue hover:bg-blue-50"
                    >
                      <span className="font-bold text-lg group-hover:text-gi-blue transition-colors">{opt.text}</span>
                      <span className="text-xs text-slate-400 mt-1 group-hover:text-slate-500 transition-colors">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={prevStep}
                className={`text-slate-400 text-sm font-bold underline w-full py-2 hover:text-slate-600 transition ${currentStep === 0 ? 'invisible' : ''}`}
              >
                一つ前の質問に戻る
              </button>
            </div>
          )}

          {/* Result Screen */}
          {screen === 'result' && (() => {
            const res = getResult()
            const has4 = res.surgery.includes(4)
            const isCombined = res.surgery.length === 2 && res.surgery.includes(4) && res.surgery.includes(5)

            let surgeryName = ""
            let surgeryDesc = ""

            if (isCombined) {
              surgeryName = "④休日 ＋ ⑤旅（3院選択）プラン"
              surgeryDesc = "休日に3院どこでも選べる特別な体験です。岡山・京都・阪神からお好きな街を選び、完治への道を特別な思い出に変えましょう。"
            } else {
              const sId = res.surgery[0]
              const sData = PLAN_DETAILS[sId]
              surgeryName = sData.name
              surgeryDesc = sData.desc
            }

            const currentQuote = selectedCare
              ? getQuote(selectedCare)
              : res.care.length === 1
                ? getQuote(res.care[0])
                : "プランを選択すると、私からの推奨理由が表示されます。"

            return (
              <div className="fade-in space-y-6 pb-12">
                <div className="bg-gi-blue text-white p-8 rounded-t-3xl text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-xs opacity-80 mb-2 font-bold tracking-widest">DIAGNOSIS RESULT</p>
                  <h2 className="text-2xl font-bold">あなたに最適な完治プラン</h2>
                </div>

                <div className="bg-white p-6 rounded-b-3xl shadow-xl space-y-8 -mt-2 relative z-10">
                  {/* Surgery Plan */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold">1</span>
                      <div className="text-orange-700 text-xs font-bold tracking-wider">手術日・体験の選択</div>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-lg text-gi-blue mb-2">{surgeryName}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{surgeryDesc}</p>

                      {has4 && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 text-[11px] rounded-xl border border-red-100">
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                            <span className="font-bold">費用に関するご案内</span>
                          </div>
                          <p>本プランは休日特別執刀が含まれるため、手術費用は<span className="font-bold underline">自費診療</span>となります。限られた方への特別なご案内です。</p>
                        </div>
                      )}

                      {!has4 && (
                        <div className="mt-4 flex items-center gap-1.5 text-green-700 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100 w-fit">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          保険診療対象
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Care Plan */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold">2</span>
                      <div className="text-blue-700 text-xs font-bold tracking-wider">通院・並走プランの選択</div>
                    </div>
                    <div className="space-y-3">
                      {res.care.length === 1 ? (
                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 shadow-inner">
                          <h4 className="font-bold text-gi-blue mb-1">{PLAN_DETAILS[res.care[0]].name}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{PLAN_DETAILS[res.care[0]].desc}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-[11px] text-slate-400 mb-3 font-bold px-1">※以下の3つから、あなたのご希望に合わせて選べます</p>
                          {res.care.map((cId) => (
                            <button
                              key={cId}
                              onClick={() => setSelectedCare(cId)}
                              className={`w-full text-left p-4 border rounded-2xl transition transform active:scale-[0.97] ${selectedCare === cId ? 'border-gi-blue bg-blue-50' : 'border-slate-200 hover:border-gi-blue hover:bg-blue-50'}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-sm">{PLAN_DETAILS[cId].name}</h4>
                                <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                                  <div className={`w-2 h-2 rounded-full bg-gi-blue transition-opacity ${selectedCare === cId ? 'opacity-100' : 'opacity-0'}`}></div>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 leading-normal">{PLAN_DETAILS[cId].desc}</p>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Doctor Message */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                    <div className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-bold text-gi-blue tracking-tighter border border-slate-100 rounded">DIRECTOR&apos;S MESSAGE</div>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-white p-1 rounded-full shadow-sm flex-shrink-0 overflow-hidden border border-slate-100">
                        <img
                          src="https://gi-clinic.net/wp-content/themes/gi-clinic/assets/img/common/doctor_ikeda.png"
                          alt="池田理事長"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23ccc'/%3E%3Cpath d='M24 24c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8zm0 4c-5.3 0-16 2.7-16 8v4h32v-4c0-5.3-10.7-8-16-8z' fill='%23fff'/%3E%3C/svg%3E"
                          }}
                        />
                      </div>
                      <div className="flex-grow pt-1">
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">{currentQuote}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-2">
                    <a href="https://gi-clinic.net/" className="block w-full bg-gi-blue text-white py-4 rounded-full text-center font-bold shadow-lg transition transform hover:-translate-y-1 active:scale-95">このプランで予約相談する</a>
                    <button onClick={restart} className="block w-full text-slate-400 text-xs font-bold py-2 hover:text-slate-600">もう一度診断する</button>
                  </div>
                </div>
              </div>
            )
          })()}
        </main>

        <footer className="py-8 text-center text-[10px] text-slate-400 font-bold tracking-widest uppercase">
          &copy; 2026 Medical Corporation Gi Project.
        </footer>
      </div>
    </>
  )
}
