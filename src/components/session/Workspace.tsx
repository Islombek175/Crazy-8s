import React, { useState, useEffect, useCallback } from 'react';
import type { Session, Idea, ToolType } from '../../types';
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
}

export const Workspace: React.FC<WorkspaceProps> = ({
  session,
  onUpdateSession,
  onExit,
  onCompleteSession,
}) => {
  // View mode: 'grid' or 'focused'
  const [workspaceView, setWorkspaceView] = useState<'grid' | 'focused'>('grid');
  const [activeIdeaIndex, setActiveIdeaIndex] = useState<number>(0);

  // Global active tool & brush settings for drawing
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [brushSize, setBrushSize] = useState<number>(3);

  // Inspiration prompt state
  const [showPromptBanner, setShowPromptBanner] = useState<boolean>(session.preferences.showPrompts);
  const [currentPrompt, setCurrentPrompt] = useState<string>(() => getRandomPrompt());

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
      // Ignore if focus is in an input or textarea
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
      title: 'Clear This Panel?',
      message: `Are you sure you want to clear Idea ${String(ideaId).padStart(2, '0')}? Existing strokes will be removed.`,
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
      title: 'Restart Session?',
      message: 'This will reset the countdown timer back to the beginning. Your existing ideas and sketches will be kept.',
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
      title: 'Exit Workspace?',
      message: 'All your work has been automatically saved in your browser. You can return and continue at any time.',
      action: () => {
        timer.pause();
        onExit();
        setPendingConfirm(null);
      },
    });
  };

  const nextPrompt = () => {
    setCurrentPrompt(getRandomPrompt(currentPrompt));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F7F2] select-none">
      {/* Top Main Workspace Toolbar */}
      <div className="no-print bg-[#F0EFE9] border-b border-[#D8D6CE] px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Left: Back button & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRequestExit}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            title="Exit session (changes are saved)"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <span className="font-editorial-heading text-xl font-bold tracking-tight text-[#171717]">
            EIGHT
          </span>

          <span className="hidden lg:inline text-xs font-mono text-[#77756F]">
            / CRAZY 8s WORKSPACE
          </span>
        </div>

        {/* Center: Current Challenge (compact) */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4 items-center justify-center">
          <div className="px-3 py-1 bg-[#FAF9F5] border border-[#D8D6CE] text-xs font-medium text-[#171717] truncate max-w-full text-center" title={session.challenge}>
            <span className="font-mono text-[#77756F] uppercase text-[10px] mr-1.5">Challenge:</span>
            <span>"{session.challenge}"</span>
          </div>
        </div>

        {/* Right: Timer & Session Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Large Countdown Monospace Timer */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#FAF9F5] border border-[#171717]">
            <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-[#171717]">
              {timer.formattedTime}
            </span>

            {/* Pause / Resume Button */}
            {timer.status === 'running' ? (
              <button
                type="button"
                onClick={timer.pause}
                title="Pause countdown (Space)"
                className="p-1 hover:bg-[#F0EFE9] text-[#171717] transition-colors"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={timer.resume}
                title="Resume countdown (Space)"
                className="p-1 hover:bg-[#F0EFE9] text-[#171717] transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}
          </div>

          {/* View Toggle (Grid / Focused) */}
          <button
            type="button"
            onClick={() => setWorkspaceView(workspaceView === 'grid' ? 'focused' : 'grid')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            title="Toggle between Grid and Focused mode (G)"
          >
            {workspaceView === 'grid' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Focused</span>
              </>
            ) : (
              <>
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">8-Grid</span>
              </>
            )}
          </button>

          {/* Prompt Toggle */}
          <button
            type="button"
            onClick={() => setShowPromptBanner(!showPromptBanner)}
            className={`p-1.5 border transition-colors ${
              showPromptBanner
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                : 'bg-[#FAF9F5] text-[#77756F] border-[#D8D6CE] hover:border-[#171717] hover:text-[#171717]'
            }`}
            title="Toggle inspiration prompts"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={handleRequestRestart}
            className="p-1.5 bg-[#FAF9F5] border border-[#D8D6CE] text-[#77756F] hover:text-[#171717] hover:border-[#171717] transition-colors"
            title="Restart session timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Finish & Review Button */}
          <button
            type="button"
            onClick={onCompleteSession}
            className="px-3 py-1.5 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors hidden sm:block"
          >
            Review ideas
          </button>
        </div>
      </div>

      {/* Thin Progress Line */}
      <div className="w-full h-1 bg-[#D8D6CE] relative overflow-hidden">
        <div
          className="h-full bg-[#171717] transition-all duration-300"
          style={{ width: `${timer.progressPercent}%` }}
        />
      </div>

      {/* Optional Inspiration Prompt Banner */}
      {showPromptBanner && (
        <div className="no-print bg-[#FAF9F5] border-b border-[#D8D6CE] px-4 py-2 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-mono uppercase text-[10px] tracking-wider text-[#77756F] shrink-0">
              Prompt for Idea {String(activeIdeaIndex + 1).padStart(2, '0')}:
            </span>
            <span className="font-editorial-heading text-sm font-semibold text-[#171717] italic truncate">
              "{currentPrompt}"
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={nextPrompt}
              className="text-[11px] font-mono uppercase tracking-wider text-[#171717] hover:underline"
            >
              Next prompt →
            </button>
            <button
              type="button"
              onClick={() => setShowPromptBanner(false)}
              className="text-[#77756F] hover:text-[#171717] ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      {workspaceView === 'grid' ? (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 bg-[#F8F7F2]">
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
        />
      )}

      {/* Confirmation Modal */}
      {pendingConfirm && (
        <ConfirmationModal
          isOpen={true}
          title={pendingConfirm.title}
          message={pendingConfirm.message}
          confirmLabel={pendingConfirm.type === 'clear' ? 'Clear' : pendingConfirm.type === 'restart' ? 'Restart' : 'Exit'}
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
        />
      )}
    </div>
  );
};
