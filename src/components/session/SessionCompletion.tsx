import React from 'react';
import type { Session, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { CheckCircle2, ArrowRight, Edit, Star, RotateCcw } from 'lucide-react';

interface SessionCompletionProps {
  session: Session;
  onReview: () => void;
  onContinueEditing: () => void;
  onStartAnother: () => void;
  lang?: Language;
}

export const SessionCompletion: React.FC<SessionCompletionProps> = ({
  session,
  onReview,
  onContinueEditing,
  onStartAnother,
  lang = 'en',
}) => {
  const t = getTranslation(lang);

  const totalIdeasWithContent = session.ideas.filter(
    (i) => i.strokes.length > 0 || i.description.trim().length > 0 || (i.bulletPoints && i.bulletPoints.length > 0)
  ).length;

  const totalWithDrawings = session.ideas.filter((i) => i.strokes.length > 0).length;
  const totalWithText = session.ideas.filter(
    (i) => i.description.trim().length > 0 || (i.bulletPoints && i.bulletPoints.length > 0)
  ).length;

  const durationMin = Math.round(session.durationSeconds / 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#171717] dark:border-[#EDECE6] p-8 sm:p-12 shadow-2xl text-[#171717] dark:text-[#F8F7F2] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Eyebrow & Headline */}
        <div className="text-center space-y-3 pb-8 border-b border-[#D8D6CE] dark:border-[#33322D]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-[11px] font-mono uppercase tracking-wider text-[#77756F] dark:text-[#88867F]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
            <span>{t.timeExpiredBadge}</span>
          </div>

          <h2 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717] dark:text-[#F8F7F2]">
            {t.completionHeadline}
          </h2>

          <p className="font-editorial-body text-base sm:text-lg text-[#77756F] dark:text-[#A09E94] font-light max-w-md mx-auto">
            {t.completionSub}
          </p>
        </div>

        {/* Challenge summary & statistics */}
        <div className="py-6 space-y-5">
          <div className="p-4 bg-[#F8F7F2] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F] dark:text-[#88867F] block mb-1">
              {t.challengeSolved}
            </span>
            <div className="font-editorial-body text-lg font-medium text-[#171717] dark:text-[#F8F7F2]">
              "{session.challenge}"
            </div>
            {session.context && (
              <p className="mt-1 text-xs text-[#77756F] dark:text-[#88867F] italic">
                {session.context}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                {totalIdeasWithContent} / 8
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F] dark:text-[#88867F]">
                {t.statPopulated}
              </span>
            </div>

            <div className="p-3 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                {totalWithDrawings}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F] dark:text-[#88867F]">
                {t.statSketches}
              </span>
            </div>

            <div className="p-3 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                {totalWithText}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F] dark:text-[#88867F]">
                {t.statWritten}
              </span>
            </div>

            <div className="p-3 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-center">
              <span className="font-editorial-heading text-3xl font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                {durationMin}m
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#77756F] dark:text-[#88867F]">
                {t.statDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-[#D8D6CE] dark:border-[#33322D] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onContinueEditing}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#D8D6CE] dark:border-[#33322D] bg-[#FAF9F5] dark:bg-[#252522] hover:bg-[#F0EFE9] dark:hover:bg-[#2e2e2a] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>{t.continueEditing}</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onStartAnother}
              className="flex-1 sm:flex-initial px-4 py-2.5 border border-[#D8D6CE] dark:border-[#33322D] text-xs font-mono uppercase tracking-wider text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2] transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.newSession}</span>
            </button>

            <button
              type="button"
              onClick={onReview}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{t.reviewMyIdeas}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
