"use client";

import { useState, useEffect } from "react";

export default function SilenceTimer({ onClose }) {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const format = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-[#333] animate-pulse mb-12" />
      <div className="text-5xl md:text-7xl font-extralight tracking-widest text-[#222]">
        {format(seconds)}
      </div>
      <p className="mt-8 text-xs tracking-[0.3em] uppercase text-[#1a1a1a]">
        Las grandes estructuras fracasan por buscar acelerar al ser.
      </p>
      <button
        onClick={onClose}
        className="fixed bottom-8 right-8 text-xs text-[#333] hover:text-[#666] uppercase tracking-widest transition-colors"
      >
        Salir
      </button>
    </div>
  );
}
