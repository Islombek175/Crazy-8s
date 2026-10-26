import React from 'react';
import type { Session } from '../../types';
import { CheckCircle2, ArrowRight, Edit, Star, RotateCcw } from 'lucide-react';

interface SessionCompletionProps {
  session: Session;
  onReview: () => void;
  onContinueEditing: () => void;
  onStartAnother: () => void;
}

export const SessionCompletion: React.FC<SessionCompletionProps> = ({
  session,
  onReview,
  onContinueEditing,
  onStartAnother,
}) => {
  // Compute summary stats
  const totalIdeasWithContent = session.ideas.filter(
    (i) => i.strokes.length > 0 || i.description.trim().length > 0 || (i.bulletPoints && i.bulletPoints.length > 0)
  ).length;

  const totalWithDrawings = session.ideas.filter((i) => i.strokes.length > 0).length;
  const totalWithText = session.ideas.filter(
    (i) => i.description.trim().length > 0 || (i.bulletPoints && i.bulletPoints.length > 0)
  ).length;

  const durationMin = Math.round(session.durationSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#FAF9F5] border border-[#171717] p-8 sm:p-12 shadow-2xl text-[#171717] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Eyebrow & Headline */}
        <div className="text-center space-y-3 pb-8 border-b border-[#D8D6CE]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F0EFE9] border border-[#D8D6CE] text-[11px] font-mono uppercase tracking-wider text-[#77756F]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />
            <span>Time Expired</span>
          </div>

          <h2 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717]">
            Eight minutes. Eight possibilities.
          </h2>

          <p className="font-editorial-body text-base sm:text-lg text-[#77756F] font-light max-w-md mx-auto">
            Take a moment to review what you created. Your raw thoughts are the raw material for design.
          </p>
        </div>

        {/* Challenge summary & statistics */}
        <div className="py-6 space-y-5">
          <div className="p-4 bg-[#F8F7F2] border border-[#D8D6CE]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F] block mb-1">
              Challenge Solved
            </span>
            <div className="font-editorial-body text-lg font-medium text-[#171717]">
              "{session.challenge}"
            </div>
            {session.context && (
              <p className="mt-1 text-xs text-[#77756F] italic">
                Context: {session.context}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F0EFE9] border border-[#D8D6CE] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] block">
                {totalIdeasWithContent} / 8
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F]">
                Populated
              </span>
            </div>

            <div className="p-3 bg-[#F0EFE9] border border-[#D8D6CE] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] block">
                {totalWithDrawings}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F]">
                Sketches
              </span>
            </div>

            <div className="p-3 bg-[#F0EFE9] border border-[#D8D6CE] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] block">
                {totalWithText}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F]">
                Written Concepts
              </span>
            </div>

            <div className="p-3 bg-[#F0EFE9] border border-[#D8D6CE] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] block">
                {durationMin}m
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F]">
                Sprint Duration
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#D8D6CE] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onContinueEditing}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#D8D6CE] bg-[#FAF9F5] hover:bg-[#F0EFE9] text-xs font-mono uppercase tracking-wider text-[#171717] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Continue editing</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onStartAnother}
              className="flex-1 sm:flex-initial px-4 py-2.5 border border-[#D8D6CE] text-xs font-mono uppercase tracking-wider text-[#77756F] hover:text-[#171717] hover:border-[#171717] transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New session</span>
            </button>

            <button
              type="button"
              onClick={onReview}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              <Star className="w-3.5 h-3.5 fill-[#F8F7F2]" />
              <span>Review my ideas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
