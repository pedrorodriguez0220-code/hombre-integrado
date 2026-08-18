export default function MirrorFeedback({ feedback, onNext }) {
  return (
    <div className="space-y-8 border border-[#222] p-8 bg-[#0d0d0d]">
      <div className="space-y-3">
        <p className="text-xs tracking-[0.25em] uppercase text-[#666]">
          {feedback.type}
        </p>
        <p className="text-lg font-light leading-relaxed text-[#d4d4d4]">
          {feedback.response}
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full py-4 border border-[#333] text-xs tracking-[0.2em] uppercase hover:bg-[#111] transition-colors text-[#888] hover:text-[#e5e5e5]"
      >
        Continuar
      </button>
    </div>
  );
}
