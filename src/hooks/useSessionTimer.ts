import { useState, useEffect, useRef, useCallback } from 'react';
import type { SessionStatus } from '../types';
import { sound } from '../services/audio';

interface UseSessionTimerProps {
  initialDuration: number;
  initialRemaining: number;
  initialStatus: SessionStatus;
  autoProgress: boolean;
  soundEnabled: boolean;
  onTick?: (remaining: number, elapsed: number) => void;
  onComplete?: () => void;
  onAdvancePanel?: () => void;
}

export function useSessionTimer({
  initialDuration,
  initialRemaining,
  initialStatus,
  autoProgress,
  soundEnabled,
  onTick,
  onComplete,
  onAdvancePanel,
}: UseSessionTimerProps) {
  const [remaining, setRemaining] = useState<number>(initialRemaining);
  const [status, setStatus] = useState<SessionStatus>(initialStatus);
  const [elapsed, setElapsed] = useState<number>(initialDuration - initialRemaining);

  const lastTimestampRef = useRef<number | null>(null);
  const intervalSecondsPerIdea = Math.floor(initialDuration / 8);
  const lastIdeaIntervalRef = useRef<number>(Math.floor((initialDuration - initialRemaining) / intervalSecondsPerIdea));

  // Sync sound service preference
  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Tick function using real timestamps to eliminate drift
  const handleTick = useCallback(() => {
    if (status !== 'running') return;

    const now = Date.now();
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = now;
      return;
    }

    const deltaMs = now - lastTimestampRef.current;
    if (deltaMs >= 1000) {
      const deltaSec = Math.floor(deltaMs / 1000);
      lastTimestampRef.current = now - (deltaMs % 1000);

      setRemaining((prevRemaining) => {
        const nextRemaining = Math.max(0, prevRemaining - deltaSec);
        const currentElapsed = initialDuration - nextRemaining;
        setElapsed(currentElapsed);

        if (onTick) {
          onTick(nextRemaining, currentElapsed);
        }

        // Check auto-progression interval
        if (autoProgress && nextRemaining > 0 && intervalSecondsPerIdea > 0) {
          const currentIntervalIndex = Math.floor(currentElapsed / intervalSecondsPerIdea);
          if (currentIntervalIndex > lastIdeaIntervalRef.current && currentIntervalIndex < 8) {
            lastIdeaIntervalRef.current = currentIntervalIndex;
            sound.playIntervalChime();
            if (onAdvancePanel) {
              onAdvancePanel();
            }
          }
        }

        // Check completion
        if (nextRemaining === 0) {
          setStatus('completed');
          sound.playCompletionChime();
          if (onComplete) {
            onComplete();
          }
        }

        return nextRemaining;
      });
    }
  }, [status, initialDuration, autoProgress, intervalSecondsPerIdea, onTick, onAdvancePanel, onComplete]);

  // RequestAnimationFrame or setInterval loop
  useEffect(() => {
    if (status !== 'running') {
      lastTimestampRef.current = null;
      return;
    }

    lastTimestampRef.current = Date.now();
    const timerId = setInterval(handleTick, 250);

    // Also handle tab visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'running') {
        handleTick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, handleTick]);

  const start = () => {
    if (remaining > 0) {
      lastTimestampRef.current = Date.now();
      setStatus('running');
    }
  };

  const pause = () => {
    setStatus('paused');
    lastTimestampRef.current = null;
  };

  const resume = () => {
    if (remaining > 0) {
      lastTimestampRef.current = Date.now();
      setStatus('running');
    }
  };

  const restart = () => {
    setRemaining(initialDuration);
    setElapsed(0);
    setStatus('draft');
    lastTimestampRef.current = null;
    lastIdeaIntervalRef.current = 0;
    if (onTick) {
      onTick(initialDuration, 0);
    }
  };

  const formattedTime = () => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const progressPercent = initialDuration > 0
    ? Math.min(100, Math.max(0, ((initialDuration - remaining) / initialDuration) * 100))
    : 0;

  return {
    remaining,
    elapsed,
    status,
    formattedTime: formattedTime(),
    progressPercent,
    start,
    pause,
    resume,
    restart,
    setStatus,
  };
}
