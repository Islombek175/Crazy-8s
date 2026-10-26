import React, { useState, useEffect, useCallback } from 'react';
import type { Session, Idea, ToolType, Language, ThemeMode } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { useSessionTimer } from '../../hooks/useSessionTimer';
import { IdeaPanel } from '../canvas/IdeaPanel';
import { FocusedWorkspace } from '../canvas/FocusedWorkspace';
import { SessionCompletion } from './SessionCompletion';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { getRandomPrompt } from '../../data/prompts';
import {
  Play,
  Pause,
  RotateCcw,
  Grid,
  Maximize2,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

interface WorkspaceProps {
  session: Session;
  onUpdateSession: (updated: Session) => void;
  onExit: () => void;
  onCompleteSession: () => void;
  lang?: Language;
  theme?: ThemeMode;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  session,
  onUpdateSession,
  onExit,
  onCompleteSession,
  lang = 'en',
  theme = 'light',
}) => {
  const t = getTranslation(lang);
  // View mode: 'grid' or 'focused'
  const [workspaceView, setWorkspaceView] = useState<'grid' | 'focused'>('grid');
  const [activeIdeaIndex, setActiveIdeaIndex] = useState<number>(0);

  // Global active tool & brush settings for drawing
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [brushSize, setBrushSize] = useState<number>(3);

  // Inspiration prompt state
  const [showPromptBanner, setShowPromptBanner] = useState<boolean>(session.preferences.showPrompts);
  const [currentPrompt, setCurrentPrompt] = useState<string>(() => getRandomPrompt(undefined, lang));

  // Completion modal state
  const [showCompletionOverlay, setShowCompletionOverlay] = useState<boolean>(false);

  // Confirmation dialogs
  const [pendingConfirm, setPendingConfirm] = useState<{
    type: 'restart' | 'exit' | 'clear';
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  // Timer integration
  const timer = useSessionTimer({
    initialDuration: session.durationSeconds,
    initialRemaining: session.remainingSeconds,
    initialStatus: session.status === 'draft' ? 'running' : session.status,
    autoProgress: session.preferences.autoProgress,
    soundEnabled: session.preferences.soundEnabled,
    onTick: (remaining, elapsed) => {
      onUpdateSession({
        ...session,
        remainingSeconds: remaining,
        elapsedSeconds: elapsed,
        lastActiveTimestamp: Date.now(),
      });
    },
    onComplete: () => {
      setShowCompletionOverlay(true);
      onUpdateSession({
        ...session,
        status: 'completed',
        remainingSeconds: 0,
      });
    },
    onAdvancePanel: () => {
      setActiveIdeaIndex((prev) => (prev < 7 ? prev + 1 : prev));
    },
  });

  // Handle idea updates
  const handleUpdateIdea = useCallback(
    (updatedIdea: Idea) => {
      const updatedIdeas = session.ideas.map((item) =>
        item.id === updatedIdea.id ? updatedIdea : item
      );
      onUpdateSession({
        ...session,
        ideas: updatedIdeas,
      });
    },
    [session, onUpdateSession]
  );

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Space: pause/resume
      if (e.code === 'Space') {
        e.preventDefault();
        if (timer.status === 'running') {
          timer.pause();
        } else if (timer.status === 'paused' || timer.status === 'draft') {
          timer.resume();
        }
      }

      // G: toggle grid/focused
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setWorkspaceView((prev) => (prev === 'grid' ? 'focused' : 'grid'));
      }

      // Arrow Left: prev idea
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveIdeaIndex((prev) => Math.max(0, prev - 1));
      }

      // Arrow Right: next idea
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveIdeaIndex((prev) => Math.min(7, prev + 1));
      }

      // Escape: return to grid if focused or close prompt
      if (e.key === 'Escape') {
        if (workspaceView === 'focused') {
          setWorkspaceView('grid');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timer, workspaceView]);

  // Request clear individual panel
  const handleRequestClearPanel = (ideaId: number) => {
    setPendingConfirm({
      type: 'clear',
      title: t.confirmClearPanelTitle,
      message: t.confirmClearPanelMsg.replace('{num}', String(ideaId).padStart(2, '0')),
      action: () => {
        const target = session.ideas.find((i) => i.id === ideaId);
        if (target) {
          handleUpdateIdea({
            ...target,
            strokes: [],
            canvasData: null,
            description: '',
            bulletPoints: [],
          });
        }
        setPendingConfirm(null);
      },
    });
  };

  // Request restart session
  const handleRequestRestart = () => {
    setPendingConfirm({
      type: 'restart',
      title: t.confirmRestartTitle,
      message: t.confirmRestartMsg,
      action: () => {
        timer.restart();
        onUpdateSession({
          ...session,
          status: 'running',
          remainingSeconds: session.durationSeconds,
          elapsedSeconds: 0,
        });
        timer.start();
        setPendingConfirm(null);
      },
    });
  };

  // Request exit session
  const handleRequestExit = () => {
    setPendingConfirm({
      type: 'exit',
      title: t.confirmExitTitle,
      message: t.confirmExitMsg,
      action: () => {
        timer.pause();
        onExit();
        setPendingConfirm(null);
      },
    });
  };

  const nextPrompt = () => {
    setCurrentPrompt(getRandomPrompt(currentPrompt, lang));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F7F2] dark:bg-[#141412] text-[#171717] dark:text-[#F8F7F2] select-none transition-colors">
      {/* Top Main Workspace Toolbar */}
      <div className="no-print bg-[#F0EFE9] dark:bg-[#1E1E1C] border-b border-[#D8D6CE] dark:border-[#33322D] px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Back button & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRequestExit}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] transition-colors"
            title={t.exit}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exit}</span>
          </button>

          <span className="font-editorial-heading text-xl font-bold tracking-tight text-[#171717] dark:text-[#F8F7F2]">
            {t.brandName}
          </span>

          <span className="hidden lg:inline text-xs font-mono text-[#77756F] dark:text-[#88867F]">
            {t.workspaceTitle}
          </span>
        </div>

        {/* Center: Current Challenge (compact) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4 items-center justify-center">
          <div className="px-3 py-1 bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-xs font-medium text-[#171717] dark:text-[#F8F7F2] truncate max-w-full text-center" title={session.challenge}>
            <span className="font-mono text-[#77756F] dark:text-[#88867F] uppercase text-[10px] mr-1.5">{t.challengeCompact}</span>
            <span>"{session.challenge}"</span>
          </div>
        </div>

        {/* Right: Timer & Session Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Large Countdown Monospace Timer */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#FAF9F5] dark:bg-[#252522] border border-[#171717] dark:border-[#F8F7F2]">
            <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-[#171717] dark:text-[#F8F7F2]">
              {timer.formattedTime}
            </span>

            {/* Pause / Resume Button */}
            {timer.status === 'running' ? (
              <button
                type="button"
                onClick={timer.pause}
                title={t.pauseTimer}
                className="p-1 hover:bg-[#F0EFE9] dark:hover:bg-[#33322D] text-[#171717] dark:text-[#F8F7F2] transition-colors"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.resume}
                title={t.resumeTimer}
                className="p-1 hover:bg-[#F0EFE9] dark:hover:bg-[#33322D] text-[#171717] dark:text-[#F8F7F2] transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>

          {/* View Toggle (Grid / Focused) */}
          <button
            type="button"
            onClick={() => setWorkspaceView(workspaceView === 'grid' ? 'focused' : 'grid')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] transition-colors"
            title={t.toggleGridFocused}
          >
            {workspaceView === 'grid' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.focusedMode}</span>
              </>
            ) : (
              <>
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.gridMode}</span>
              </>
            )}
          </button>

          {/* Prompt Toggle */}
          <button
            type="button"
            onClick={() => setShowPromptBanner(!showPromptBanner)}
            className={`p-1.5 border transition-colors ${
              showPromptBanner
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                : 'bg-[#FAF9F5] dark:bg-[#252522] text-[#77756F] dark:text-[#88867F] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
            }`}
            title={t.togglePrompts}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={handleRequestRestart}
            className="p-1.5 bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2] transition-colors"
            title={t.restartTimer}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Finish & Review Button */}
          <button
            type="button"
            onClick={onCompleteSession}
            className="px-3 py-1.5 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors hidden sm:block"
          >
            {t.reviewIdeas}
          </button>
        </div>
      </div>

      {/* Thin Progress Line */}
      <div className="w-full h-1 bg-[#D8D6CE] dark:bg-[#33322D] relative overflow-hidden">
        <div
          className="h-full bg-[#171717] dark:bg-[#F8F7F2] transition-all duration-300"
          style={{ width: `${timer.progressPercent}%` }}
        />
      </div>

      {/* Optional Inspiration Prompt Banner */}
      {showPromptBanner && (
        <div className="no-print bg-[#FAF9F5] dark:bg-[#1C1C1A] border-b border-[#D8D6CE] dark:border-[#33322D] px-4 py-2 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-mono uppercase text-[10px] tracking-wider text-[#77756F] dark:text-[#88867F] shrink-0">
              {t.promptForIdea} {String(activeIdeaIndex + 1).padStart(2, '0')}:
            </span>
            <span className="font-editorial-heading text-sm font-semibold text-[#171717] dark:text-[#F8F7F2] italic truncate">
              "{currentPrompt}"
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={nextPrompt}
              className="text-[11px] font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] hover:underline"
            >
              {t.nextPrompt}
            </button>
            <button
              type="button"
              onClick={() => setShowPromptBanner(false)}
              className="text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      {workspaceView === 'grid' ? (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-[#F8F7F2] dark:bg-[#141412]">
          {/* Responsive 8-Panel Grid: Desktop 4x2, Tablet 2x4, Mobile 1-2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto h-full min-h-[700px]">
            {session.ideas.map((idea, index) => (
              <IdeaPanel
                key={idea.id}
                idea={idea}
                isActive={index === activeIdeaIndex}
                onSelect={() => setActiveIdeaIndex(index)}
                onUpdate={handleUpdateIdea}
                onExpand={() => {
                  setActiveIdeaIndex(index);
                  setWorkspaceView('focused');
                }}
                activeTool={activeTool}
                onToolChange={setActiveTool}
                brushSize={brushSize}
                onBrushSizeChange={setBrushSize}
                onRequestClear={handleRequestClearPanel}
                lang={lang}
                theme={theme}
              />
            ))}
          </div>
        </div>
      ) : (
        <FocusedWorkspace
          ideas={session.ideas}
          activeIdeaIndex={activeIdeaIndex}
          onSelectIndex={setActiveIdeaIndex}
          onUpdateIdea={handleUpdateIdea}
          onExitFocus={() => setWorkspaceView('grid')}
          activeTool={activeTool}
          onToolChange={setActiveTool}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          onRequestClear={handleRequestClearPanel}
          lang={lang}
          theme={theme}
        />
      )}

      {/* Confirmation Modal */}
      {pendingConfirm && (
        <ConfirmationModal
          isOpen={true}
          title={pendingConfirm.title}
          message={pendingConfirm.message}
          confirmLabel={pendingConfirm.type === 'clear' ? t.clearLabel : pendingConfirm.type === 'restart' ? t.restartLabel : t.confirmLabel}
          cancelLabel={t.cancelLabel}
          isDestructive={pendingConfirm.type === 'clear'}
          onConfirm={pendingConfirm.action}
          onCancel={() => setPendingConfirm(null)}
        />
      )}

      {/* Session Completion Overlay */}
      {showCompletionOverlay && (
        <SessionCompletion
          session={session}
          onReview={() => {
            setShowCompletionOverlay(false);
            onCompleteSession();
          }}
          onContinueEditing={() => setShowCompletionOverlay(false)}
          onStartAnother={onExit}
          lang={lang}
        />
      )}
    </div>
  );
};
