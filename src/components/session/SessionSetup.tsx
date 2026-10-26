import React, { useState } from 'react';
import type { UserSettings, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { ArrowRight, Volume2, Sparkles, FastForward } from 'lucide-react';

interface SessionSetupProps {
  initialSettings: UserSettings;
  onStart: (config: {
    challenge: string;
    context: string;
    durationSeconds: number;
    defaultMode: 'draw' | 'write';
    autoProgress: boolean;
    showPrompts: boolean;
    soundEnabled: boolean;
  }) => void;
  onCancel: () => void;
  lang?: Language;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({
  initialSettings,
  onStart,
  onCancel,
  lang = 'en',
}) => {
  const t = getTranslation(lang);
  const [challenge, setChallenge] = useState('');
  const [context, setContext] = useState('');
  const [durationSeconds, setDurationSeconds] = useState(initialSettings.defaultDuration || 480);
  const [defaultMode, setDefaultMode] = useState<'draw' | 'write'>(initialSettings.defaultWorkspaceMode || 'draw');
  const [autoProgress, setAutoProgress] = useState(initialSettings.autoProgression || false);
  const [showPrompts, setShowPrompts] = useState(initialSettings.inspirationPrompts || false);
  const [soundEnabled, setSoundEnabled] = useState(initialSettings.soundEffects || false);
  const [error, setError] = useState('');

  const durations = [
    { label: t.duration4Min, sub: t.duration4MinSub, value: 240 },
    { label: t.duration8Min, sub: t.duration8MinSub, value: 480, default: true },
    { label: t.duration12Min, sub: t.duration12MinSub, value: 720 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge.trim()) {
      setError(t.challengeError);
      return;
    }

    onStart({
      challenge: challenge.trim(),
      context: context.trim(),
      durationSeconds,
      defaultMode,
      autoProgress,
      showPrompts,
      soundEnabled,
    });
  };

  const sampleChallenges = lang === 'uz' ? [
    "Qanday qilib o'qishni yanada diqqatli va zavqli qilishimiz mumkin?",
    "Qanday qilib shaxsiy kundalikni qulay va jozibador qilish mumkin?",
    "Chalg'itmaydigan ertalabki odatlar qanday ko'rinishda bo'ladi?",
    "Kitob xatcho'plari va qaydlar tizimini qanday yangilash mumkin?",
  ] : [
    "How might we make studying more focused and enjoyable?",
    "How might we design a personal journaling tool that feels tactile?",
    "What could a distraction-free morning routine look like?",
    "How might we rethink how bookmarks and reading notes work?",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8F7F2] dark:bg-[#141412] text-[#171717] dark:text-[#F8F7F2]">
      <div className="w-full max-w-2xl bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#171717] dark:border-[#33322D] p-6 sm:p-10 shadow-sm">
        {/* Header */}
        <div className="border-b border-[#D8D6CE] dark:border-[#33322D] pb-5 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[#77756F] dark:text-[#88867F]">
              {t.setupEyebrow}
            </span>
            <span className="font-mono text-xs text-[#171717] dark:text-[#F8F7F2]">{t.setupPanelsBadge}</span>
          </div>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl font-normal text-[#171717] dark:text-[#F8F7F2] mt-2">
            {t.setupTitle}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Challenge Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2">
              {t.challengeLabel} <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={challenge}
              onChange={(e) => {
                setChallenge(e.target.value);
                if (error) setError('');
              }}
              placeholder={t.challengePlaceholder}
              className={`w-full px-4 py-3 bg-[#F8F7F2] dark:bg-[#252522] border text-base text-[#171717] dark:text-[#F8F7F2] font-sans placeholder-[#9A9890] dark:placeholder-[#77756F] focus:outline-none transition-colors ${
                error
                  ? 'border-red-600 focus:border-red-600'
                  : 'border-[#D8D6CE] dark:border-[#33322D] focus:border-[#171717] dark:focus:border-[#F8F7F2]'
              }`}
            />
            {error && <p className="mt-1.5 text-xs font-mono text-red-600">{error}</p>}

            {/* Quick Inspiration chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#77756F] dark:text-[#88867F] text-[11px] font-mono">{t.suggestionsLabel}</span>
              {sampleChallenges.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChallenge(sample);
                    if (error) setError('');
                  }}
                  className="text-[11px] font-sans text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] underline underline-offset-2 decoration-[#D8D6CE] dark:decoration-[#44433E] hover:decoration-[#171717] dark:hover:decoration-[#F8F7F2] transition-colors"
                >
                  "{sample.slice(0, 36)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Optional context */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2">
              {t.contextLabel}
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t.contextPlaceholder}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#F8F7F2] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-sm text-[#171717] dark:text-[#F8F7F2] placeholder-[#9A9890] dark:placeholder-[#77756F] focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Session Duration Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2">
              {t.durationLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {durations.map((d) => {
                const isSelected = durationSeconds === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDurationSeconds(d.value)}
                    className={`p-3.5 text-left border transition-all ${
                      isSelected
                        ? 'border-[#171717] bg-[#171717] text-[#F8F7F2] dark:border-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717]'
                        : 'border-[#D8D6CE] dark:border-[#33322D] bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] hover:border-[#77756F] dark:hover:border-[#55544E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs uppercase font-bold tracking-wider">
                        {d.label}
                      </span>
                      {d.default && (
                        <span className={`text-[9px] font-mono uppercase px-1 py-0.5 border ${
                          isSelected
                            ? 'border-[#F8F7F2] text-[#F8F7F2] dark:border-[#171717] dark:text-[#171717]'
                            : 'border-[#171717] text-[#171717] dark:border-[#F8F7F2] dark:text-[#F8F7F2]'
                        }`}>
                          {t.standardBadge}
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] ${isSelected ? 'text-[#D8D6CE] dark:text-[#44433E]' : 'text-[#77756F] dark:text-[#88867F]'}`}>
                      {d.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace Preferences Grid */}
          <div className="pt-2 border-t border-[#D8D6CE] dark:border-[#33322D] space-y-4">
            <span className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2]">
              {t.workspacePrefs}
            </span>

            {/* Mode selection: Draw vs Write */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDefaultMode('draw')}
                className={`py-2.5 px-3 border text-center transition-colors ${
                  defaultMode === 'draw'
                    ? 'border-[#171717] bg-[#171717] text-[#F8F7F2] dark:border-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717]'
                    : 'border-[#D8D6CE] dark:border-[#33322D] bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-wider">{t.drawingModeLabel}</span>
                <span className={`block text-[10px] mt-0.5 ${defaultMode === 'draw' ? 'text-[#D8D6CE] dark:text-[#44433E]' : 'text-[#77756F] dark:text-[#88867F]'}`}>
                  {t.drawingModeSub}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDefaultMode('write')}
                className={`py-2.5 px-3 border text-center transition-colors ${
                  defaultMode === 'write'
                    ? 'border-[#171717] bg-[#171717] text-[#F8F7F2] dark:border-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717]'
                    : 'border-[#D8D6CE] dark:border-[#33322D] bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-wider">{t.writingModeLabel}</span>
                <span className={`block text-[10px] mt-0.5 ${defaultMode === 'write' ? 'text-[#D8D6CE] dark:text-[#44433E]' : 'text-[#77756F] dark:text-[#88867F]'}`}>
                  {t.writingModeSub}
                </span>
              </button>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-3 pt-2">
              {/* Inspiration prompts toggle */}
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F0EFE9] dark:hover:bg-[#252522] transition-colors border border-transparent hover:border-[#D8D6CE] dark:hover:border-[#33322D]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#77756F] dark:text-[#88867F]" />
                  <div>
                    <span className="text-xs font-mono text-[#171717] dark:text-[#F8F7F2] uppercase tracking-wider block">
                      {t.promptsToggleTitle}
                    </span>
                    <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">
                      {t.promptsToggleSub}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showPrompts}
                  onChange={(e) => setShowPrompts(e.target.checked)}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </label>

              {/* Automatic Progression */}
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F0EFE9] dark:hover:bg-[#252522] transition-colors border border-transparent hover:border-[#D8D6CE] dark:hover:border-[#33322D]">
                <div className="flex items-center gap-2.5">
                  <FastForward className="w-4 h-4 text-[#77756F] dark:text-[#88867F]" />
                  <div>
                    <span className="text-xs font-mono text-[#171717] dark:text-[#F8F7F2] uppercase tracking-wider block">
                      {t.autoProgressionTitle}
                    </span>
                    <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">
                      {t.autoProgressionSub}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoProgress}
                  onChange={(e) => setAutoProgress(e.target.checked)}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </label>

              {/* Sound effects */}
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F0EFE9] dark:hover:bg-[#252522] transition-colors border border-transparent hover:border-[#D8D6CE] dark:hover:border-[#33322D]">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-[#77756F] dark:text-[#88867F]" />
                  <div>
                    <span className="text-xs font-mono text-[#171717] dark:text-[#F8F7F2] uppercase tracking-wider block">
                      {t.soundToggleTitle}
                    </span>
                    <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">
                      {t.soundToggleSub}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#D8D6CE] dark:border-[#33322D] flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] transition-colors"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              <span>{t.enterWorkspace}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
