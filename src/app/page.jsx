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

  useEffect(() => {
    setQuestion(getRandomQuestion());
  }, []);

  const handleSubmit = () => {
    if (!answer.trim()) return;

    setAnalyzing(true);
    setFeedback(null);

    setTimeout(() => {
      const result = analyzeUserResponse(answer);
      setFeedback(result);
      setAnalyzing(false);

      try {
        const history = JSON.parse(localStorage.getItem("mirror_sessions") || "[]");
        const session = {
          questionId: question.id,
          dimension: question.dimension,
          question: question.text,
          answer,
          type: result.type,
          response: result.response,
          timestamp: Date.now(),
        };
        history.unshift(session);
        localStorage.setItem("mirror_sessions", JSON.stringify(history.slice(0, 100)));
      } catch {
        // Santuario local: fallos de almacenamiento no interrumpen la experiencia.
      }
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
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#0a0a0a] text-[#e5e5e5]">
      <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10">
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
    </main>
  );
}
