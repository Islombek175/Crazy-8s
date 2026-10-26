import { useState, useEffect, useRef, useCallback } from 'react';
import type { Session, UserSettings, ViewState, Idea } from './types';
import {
  getAllSessions,
  saveSession,
  deleteSession,
  getSettings,
  saveSettings,
  exportAllData,
  importAllData,
  clearAllData,
  DEFAULT_SETTINGS,
} from './services/storage';
import { generateSampleSession } from './data/sampleSession';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { SessionSetup } from './components/session/SessionSetup';
import { Workspace } from './components/session/Workspace';
import { IdeaReview } from './components/session/IdeaReview';
import { SessionHistory } from './components/history/SessionHistory';
import { SettingsPage } from './components/settings/SettingsPage';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

function createNewIdeas(mode: 'draw' | 'write'): Idea[] {
  return Array.from({ length: 8 }, (_, idx) => ({
    id: idx + 1,
    title: '',
    description: '',
    bulletPoints: [],
    canvasData: null,
    strokes: [],
    isFavorite: false,
    notes: '',
    mode,
  }));
}

export function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedSessions] = await Promise.all([
          getSettings(),
          getAllSessions(),
        ]);
        setSettings(loadedSettings);

        if (loadedSessions.length === 0) {
          // Seed initial inspirational sample session
          const sample = generateSampleSession();
          await saveSession(sample);
          setSessions([sample]);
        } else {
          setSessions(loadedSessions);

          // If there's an in-progress session, restore it
          const inProgress = loadedSessions.find((s) => s.status === 'running' || s.status === 'paused');
          if (inProgress) {
            setActiveSession(inProgress);
          }
        }
      } catch (err) {
        console.error('Initialization error', err);
      }
    }
    loadData();
  }, []);

  // Sync reduced motion preference to html root
  useEffect(() => {
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [settings.reducedMotion]);

  // Debounced auto-save for active session
  const persistActiveSession = useCallback(
    (session: Session) => {
      setActiveSession(session);
      setIsSaving(true);

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(async () => {
        try {
          await saveSession(session);
          setSessions((prev) => {
            const index = prev.findIndex((s) => s.id === session.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = session;
              return updated;
            } else {
              return [session, ...prev];
            }
          });
        } catch (err) {
          console.error('Error saving active session', err);
        } finally {
          setIsSaving(false);
        }
      }, 400);
    },
    []
  );

  // Start new session
  const handleStartNewSession = (config: {
    challenge: string;
    context: string;
    durationSeconds: number;
    defaultMode: 'draw' | 'write';
    autoProgress: boolean;
    showPrompts: boolean;
    soundEnabled: boolean;
  }) => {
    const newSession: Session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      challenge: config.challenge,
      context: config.context,
      durationSeconds: config.durationSeconds,
      remainingSeconds: config.durationSeconds,
      elapsedSeconds: 0,
      status: 'draft',
      startTime: Date.now(),
      lastActiveTimestamp: Date.now(),
      ideas: createNewIdeas(config.defaultMode),
      reflections: {
        surprise: '',
        potential: '',
        nextStep: '',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        defaultMode: config.defaultMode,
        autoProgress: config.autoProgress,
        showPrompts: config.showPrompts,
        soundEnabled: config.soundEnabled,
      },
    };

    setActiveSession(newSession);
    persistActiveSession(newSession);
    setCurrentView('workspace');
  };

  // Open existing session
  const handleOpenSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setActiveSession(target);
      setCurrentView('review');
    }
  };

  // Duplicate session
  const handleDuplicateSession = async (session: Session) => {
    const duplicated: Session = {
      ...session,
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      challenge: `${session.challenge} (Copy)`,
      status: 'draft',
      remainingSeconds: session.durationSeconds,
      elapsedSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveSession(duplicated);
    setSessions((prev) => [duplicated, ...prev]);
  };

  // Delete session
  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSession?.id === sessionId) {
      setActiveSession(null);
    }
  };

  // Rename session
  const handleRenameSession = async (sessionId: string, newTitle: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      const updated = { ...target, challenge: newTitle };
      await saveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
      if (activeSession?.id === sessionId) {
        setActiveSession(updated);
      }
    }
  };

  // Update user settings
  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  // Export full JSON backup
  const handleExportAll = async () => {
    const json = await exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eight-brainstorming-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = async (jsonString: string) => {
    const res = await importAllData(jsonString);
    if (res.success) {
      const reloaded = await getAllSessions();
      setSessions(reloaded);
      const reloadedSettings = await getSettings();
      setSettings(reloadedSettings);
    }
    return res;
  };

  // Clear all data
  const handleClearAllData = async () => {
    await clearAllData();
    setSessions([]);
    setActiveSession(null);
    setSettings(DEFAULT_SETTINGS);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F2] text-[#171717] font-editorial-body selection:bg-[#171717] selection:text-[#F8F7F2]">
      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onStartSession={() => {
          if (activeSession && currentView !== 'workspace') {
            setCurrentView('workspace');
          } else {
            setCurrentView('setup');
          }
        }}
        isSaving={isSaving}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        hasActiveSession={!!activeSession}
      />

      {/* Main Routed Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {currentView === 'landing' && (
          <LandingPage onBeginSession={() => setCurrentView('setup')} />
        )}

        {currentView === 'setup' && (
          <SessionSetup
            initialSettings={settings}
            onStart={handleStartNewSession}
            onCancel={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'workspace' && activeSession && (
          <Workspace
            session={activeSession}
            onUpdateSession={persistActiveSession}
            onExit={() => setCurrentView('history')}
            onCompleteSession={() => setCurrentView('review')}
          />
        )}

        {currentView === 'review' && activeSession && (
          <IdeaReview
            session={activeSession}
            onUpdateSession={persistActiveSession}
            onReturnToWorkspace={() => setCurrentView('workspace')}
            onNewSession={() => setCurrentView('setup')}
          />
        )}

        {currentView === 'history' && (
          <SessionHistory
            sessions={sessions}
            onOpenSession={handleOpenSession}
            onDuplicateSession={handleDuplicateSession}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onStartNew={() => setCurrentView('setup')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onExportAll={handleExportAll}
            onImportBackup={handleImportBackup}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

export default App;
