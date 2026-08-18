"use client";

import { useState, useEffect } from "react";
import { getRandomQuestion } from "@/data/questions";
import { analyzeUserResponse } from "@/utils/egoAnalyzer";
import MirrorFeedback from "@/components/MirrorFeedback";
import SilenceTimer from "@/components/SilenceTimer";

export default function Home() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showSilence, setShowSilence] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setQuestion(getRandomQuestion());
    try {
      const saved = JSON.parse(localStorage.getItem("mirror_sessions") || "[]");
      setHistory(saved);
    } catch {
      // Fallo silencioso: el espejo no exige memoria.
    }
  }, []);

  const saveSession = (result) => {
    try {
      const session = {
        questionId: question.id,
        dimension: question.dimension,
        question: question.text,
        answer,
        type: result.type,
        response: result.response,
        timestamp: Date.now(),
      };
      const nextHistory = [session, ...history].slice(0, 100);
      localStorage.setItem("mirror_sessions", JSON.stringify(nextHistory));
      setHistory(nextHistory);
    } catch {
      // Santuario local: fallos de almacenamiento no interrumpen la experiencia.
    }
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;

    setAnalyzing(true);
    setFeedback(null);

    setTimeout(() => {
      const result = analyzeUserResponse(question.dimension, question.text, answer);
      setFeedback(result);
      setAnalyzing(false);
      saveSession(result);
    }, 2000);
  };

  const nextQuestion = () => {
    setQuestion(getRandomQuestion());
    setAnswer("");
    setFeedback(null);
  };

  if (showSilence) {
    return <SilenceTimer onClose={() => setShowSilence(false)} />;
  }

  if (!question) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16 bg-[#0a0a0a] text-[#e5e5e5]">
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <h1 className="text-xs tracking-[0.35em] uppercase text-[#666]">
          El Hombre Integrado
        </h1>
        <button
          onClick={() => setShowSilence(true)}
          className="text-xs tracking-[0.2em] uppercase text-[#555] hover:text-[#e5e5e5] transition-colors"
        >
          Silencio
        </button>
      </header>

      <section className="w-full max-w-2xl flex flex-col gap-10 mt-12">
        <div className="text-center space-y-5">
          <p className="text-xs tracking-[0.3em] uppercase text-[#666]">
            {question.dimension}
          </p>
          <h2 className="text-2xl md:text-3xl font-serif leading-relaxed text-[#e5e5e5]">
            {question.text}
          </h2>
        </div>

        {!feedback && !analyzing && (
          <div className="space-y-5">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Escribí sin censura..."
              className="w-full h-44 bg-transparent border border-[#333] p-5 text-base font-light text-[#e5e5e5] placeholder-[#555] focus:outline-none focus:border-[#777] resize-none"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-4 border border-[#444] text-xs tracking-[0.25em] uppercase hover:bg-[#111] transition-colors"
            >
              Entregar al Espejo
            </button>
          </div>
        )}

        {analyzing && (
          <div className="text-center py-12">
            <p className="text-sm tracking-[0.25em] uppercase text-[#888] animate-pulse">
              Observando la estructura...
            </p>
          </div>
        )}

        {feedback && <MirrorFeedback answer={answer} feedback={feedback} onNext={nextQuestion} />}
      </section>

      <section className="w-full max-w-2xl mt-20 border-t border-[#222] pt-6">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full text-left text-xs tracking-[0.25em] uppercase text-[#666] hover:text-[#e5e5e5] transition-colors flex justify-between items-center"
        >
          <span>Tus registros en este dispositivo</span>
          <span className="text-[#444]">{showHistory ? "−" : "+"}</span>
        </button>

        {showHistory && (
          <div className="mt-6 space-y-4">
            {history.length === 0 && (
              <p className="text-sm font-light text-[#555]">
                El espejo aún no guarda ningún reflejo en este dispositivo.
              </p>
            )}
            {history.map((entry, index) => (
              <details
                key={`${entry.timestamp}-${index}`}
                className="group border border-[#222] p-4 bg-[#0d0d0d] open:border-[#333]"
              >
                <summary className="cursor-pointer list-none flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-xs tracking-[0.2em] uppercase text-[#666]">
                      {entry.type}
                    </p>
                    <p className="text-sm font-light text-[#999] line-clamp-1">
                      {entry.question}
                    </p>
                  </div>
                  <span className="text-xs text-[#444] whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </summary>
                <div className="mt-4 space-y-4 border-t border-[#222] pt-4">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#666] mb-1">Tu reflejo entregado</p>
                    <p className="text-sm font-light text-[#aaa] leading-relaxed">{entry.answer}</p>
                  </div>
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#666] mb-1">Devolución del espejo</p>
                    <p className="text-sm font-light text-[#d4d4d4] leading-relaxed">{entry.response}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
