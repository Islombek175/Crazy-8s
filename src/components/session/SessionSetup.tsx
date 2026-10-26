import React, { useState } from 'react';
import type { UserSettings } from '../../types';
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
}

export const SessionSetup: React.FC<SessionSetupProps> = ({
  initialSettings,
  onStart,
  onCancel,
}) => {
  const [challenge, setChallenge] = useState('');
  const [context, setContext] = useState('');
  const [durationSeconds, setDurationSeconds] = useState(initialSettings.defaultDuration || 480);
  const [defaultMode, setDefaultMode] = useState<'draw' | 'write'>(initialSettings.defaultWorkspaceMode || 'draw');
  const [autoProgress, setAutoProgress] = useState(initialSettings.autoProgression || false);
  const [showPrompts, setShowPrompts] = useState(initialSettings.inspirationPrompts || false);
  const [soundEnabled, setSoundEnabled] = useState(initialSettings.soundEffects || false);
  const [error, setError] = useState('');

  const durations = [
    { label: '4 Minutes', sub: 'Quick sprint (30s / idea)', value: 240 },
    { label: '8 Minutes', sub: 'Standard Crazy 8s (60s / idea)', value: 480, default: true },
    { label: '12 Minutes', sub: 'Extended exploration (90s / idea)', value: 720 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge.trim()) {
      setError('Please provide a challenge statement to begin.');
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

  const sampleChallenges = [
    "How might we make studying more focused and enjoyable?",
    "How might we design a personal journaling tool that feels tactile?",
    "What could a distraction-free morning routine look like?",
    "How might we rethink how bookmarks and reading notes work?",
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8F7F2]">
      <div className="w-full max-w-2xl bg-[#FAF9F5] border border-[#171717] p-6 sm:p-10 shadow-sm text-[#171717]">
        {/* Header */}
        <div className="border-b border-[#D8D6CE] pb-5 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-[#77756F]">
              Session Configuration
            </span>
            <span className="font-mono text-xs text-[#171717]">8 PANELS</span>
          </div>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl font-normal text-[#171717] mt-2">
            Frame Your Brainstorming Sprint
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Challenge Field */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-2">
              What are you trying to solve? <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={challenge}
              onChange={(e) => {
                setChallenge(e.target.value);
                if (error) setError('');
              }}
              placeholder="How might we make studying more focused and enjoyable?"
              className={`w-full px-4 py-3 bg-[#F8F7F2] border text-base text-[#171717] font-sans placeholder-[#9A9890] focus:outline-none transition-colors ${
                error ? 'border-red-600 focus:border-red-600' : 'border-[#D8D6CE] focus:border-[#171717]'
              }`}
            />
            {error && <p className="mt-1.5 text-xs font-mono text-red-600">{error}</p>}

            {/* Quick Inspiration chips */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[#77756F] text-[11px] font-mono">Suggestions:</span>
              {sampleChallenges.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChallenge(sample);
                    if (error) setError('');
                  }}
                  className="text-[11px] font-sans text-[#77756F] hover:text-[#171717] underline underline-offset-2 decoration-[#D8D6CE] hover:decoration-[#171717] transition-colors"
                >
                  "{sample.slice(0, 36)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Optional context */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-2">
              Add context or constraints (optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Must work offline, target audience is college students, no complex hardware, paper-first approach..."
              rows={3}
              className="w-full px-4 py-2.5 bg-[#F8F7F2] border border-[#D8D6CE] text-sm text-[#171717] placeholder-[#9A9890] focus:border-[#171717] focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Session Duration Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-2">
              Session duration
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
                        ? 'border-[#171717] bg-[#171717] text-[#F8F7F2]'
                        : 'border-[#D8D6CE] bg-[#F8F7F2] text-[#171717] hover:border-[#77756F]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs uppercase font-bold tracking-wider">
                        {d.label}
                      </span>
                      {d.default && (
                        <span className={`text-[9px] font-mono uppercase px-1 py-0.5 border ${
                          isSelected ? 'border-[#F8F7F2] text-[#F8F7F2]' : 'border-[#171717] text-[#171717]'
                        }`}>
                          Standard
                        </span>
                      )}
                    </div>
                    <div className={`text-[11px] ${isSelected ? 'text-[#D8D6CE]' : 'text-[#77756F]'}`}>
                      {d.sub}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workspace Preferences Grid */}
          <div className="pt-2 border-t border-[#D8D6CE] space-y-4">
            <span className="block text-xs font-mono uppercase tracking-wider text-[#171717]">
              Workspace Preferences
            </span>

            {/* Mode selection: Draw vs Write */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDefaultMode('draw')}
                className={`py-2.5 px-3 border text-center transition-colors ${
                  defaultMode === 'draw'
                    ? 'border-[#171717] bg-[#171717] text-[#F8F7F2]'
                    : 'border-[#D8D6CE] bg-[#F8F7F2] text-[#171717] hover:border-[#171717]'
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-wider">Drawing Mode</span>
                <span className={`block text-[10px] mt-0.5 ${defaultMode === 'draw' ? 'text-[#D8D6CE]' : 'text-[#77756F]'}`}>
                  Freehand sketches & pen
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDefaultMode('write')}
                className={`py-2.5 px-3 border text-center transition-colors ${
                  defaultMode === 'write'
                    ? 'border-[#171717] bg-[#171717] text-[#F8F7F2]'
                    : 'border-[#D8D6CE] bg-[#F8F7F2] text-[#171717] hover:border-[#171717]'
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-wider">Writing Mode</span>
                <span className={`block text-[10px] mt-0.5 ${defaultMode === 'write' ? 'text-[#D8D6CE]' : 'text-[#77756F]'}`}>
                  Notes & bullet concepts
                </span>
              </button>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-3 pt-2">
              {/* Inspiration prompts toggle */}
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F0EFE9] transition-colors border border-transparent hover:border-[#D8D6CE]">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#77756F]" />
                  <div>
                    <span className="text-xs font-mono text-[#171717] uppercase tracking-wider block">
                      Inspiration prompts
                    </span>
                    <span className="text-[11px] text-[#77756F]">
                      Show lateral thinking prompts during brainstorming
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showPrompts}
                  onChange={(e) => setShowPrompts(e.target.checked)}
                  className="w-4 h-4 accent-[#171717]"
                />
              </label>

              {/* Automatic Progression */}
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F0EFE9] transition-colors border border-transparent hover:border-[#D8D6CE]">
                <div className="flex items-center gap-2.5">
                  <FastForward className="w-4 h-4 text-[#77756F]" />
                  <div>
                    <span className="text-xs font-mono text-[#171717] uppercase tracking-wider block">
                      Automatic panel progression
                    </span>
                    <span className="text-[11px] text-[#77756F]">
                      Advance active panel every minute automatically
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoProgress}
                  onChange={(e) => setAutoProgress(e.target.checked)}
                  className="w-4 h-4 accent-[#171717]"
                />
              </label>

              {/* Sound effects */}
              <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-[#F0EFE9] transition-colors border border-transparent hover:border-[#D8D6CE]">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-[#77756F]" />
                  <div>
                    <span className="text-xs font-mono text-[#171717] uppercase tracking-wider block">
                      Sound effects
                    </span>
                    <span className="text-[11px] text-[#77756F]">
                      Subtle tactile clicks and chime on timer completion
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-[#171717]"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-[#D8D6CE] flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#77756F] hover:text-[#171717] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-xs"
            >
              <span>Enter the workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
