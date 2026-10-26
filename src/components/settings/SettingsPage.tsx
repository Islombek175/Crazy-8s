import React, { useState, useRef } from 'react';
import type { UserSettings } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Type,
  Paintbrush,
  Download,
  Upload,
  Check,
} from 'lucide-react';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onExportAll: () => Promise<void>;
  onImportBackup: (jsonString: string) => Promise<{ success: boolean; count: number; error?: string }>;
  onClearAllData: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onExportAll,
  onImportBackup,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  const handleUpdate = (patch: Partial<UserSettings>) => {
    const updated = { ...settings, ...patch };
    onUpdateSettings(updated);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = await onImportBackup(text);
      if (res.success) {
        setImportStatus({
          message: `Successfully imported ${res.count} brainstorming session(s).`,
          isError: false,
        });
      } else {
        setImportStatus({
          message: res.error || 'Failed to import backup.',
          isError: true,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown read error';
      setImportStatus({
        message: `File read error: ${msg}`,
        isError: true,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="border-b border-[#D8D6CE] pb-6 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#77756F]">
              Preferences & Data
            </span>
            <h1 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717] mt-1">
              Settings
            </h1>
          </div>

          {saveBanner && (
            <span className="text-xs font-mono text-[#171717] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
        </div>

        {/* Section 1: Session & Workspace Defaults */}
        <section className="bg-[#FAF9F5] border border-[#D8D6CE] p-6 sm:p-8 space-y-6">
          <h2 className="font-editorial-heading text-2xl font-bold text-[#171717]">
            Session Defaults
          </h2>

          <div className="space-y-6">
            {/* Default Duration */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-2">
                Default Sprint Duration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: '4 Minutes', value: 240, desc: '30s per panel' },
                  { label: '8 Minutes', value: 480, desc: '60s per panel (Standard)' },
                  { label: '12 Minutes', value: 720, desc: '90s per panel' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleUpdate({ defaultDuration: item.value })}
                    className={`p-3.5 border text-left transition-colors ${
                      settings.defaultDuration === item.value
                        ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                        : 'bg-[#F8F7F2] text-[#171717] border-[#D8D6CE] hover:border-[#171717]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${settings.defaultDuration === item.value ? 'text-[#D8D6CE]' : 'text-[#77756F]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Default Mode */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] mb-2">
                Default Workspace Modality
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleUpdate({ defaultWorkspaceMode: 'draw' })}
                  className={`flex items-center justify-center gap-2 py-3 px-4 border text-xs font-mono uppercase tracking-wider transition-colors ${
                    settings.defaultWorkspaceMode === 'draw'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                      : 'bg-[#F8F7F2] text-[#171717] border-[#D8D6CE] hover:border-[#171717]'
                  }`}
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>Drawing First</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate({ defaultWorkspaceMode: 'write' })}
                  className={`flex items-center justify-center gap-2 py-3 px-4 border text-xs font-mono uppercase tracking-wider transition-colors ${
                    settings.defaultWorkspaceMode === 'write'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                      : 'bg-[#F8F7F2] text-[#171717] border-[#D8D6CE] hover:border-[#171717]'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>Writing First</span>
                </button>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="divide-y divide-[#D8D6CE] pt-2">
              {/* Auto progression */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] block">
                    Automatic panel progression
                  </span>
                  <span className="text-xs text-[#77756F]">
                    Advance active panel focus evenly (e.g. 1 min / idea) during sprints.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoProgression}
                  onChange={(e) => handleUpdate({ autoProgression: e.target.checked })}
                  className="w-4 h-4 accent-[#171717]"
                />
              </div>

              {/* Inspiration prompts */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] block">
                    Inspiration prompts banner
                  </span>
                  <span className="text-xs text-[#77756F]">
                    Show thoughtful creative prompts above the workspace.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inspirationPrompts}
                  onChange={(e) => handleUpdate({ inspirationPrompts: e.target.checked })}
                  className="w-4 h-4 accent-[#171717]"
                />
              </div>

              {/* Sound effects */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] block">
                    Tactile sound effects
                  </span>
                  <span className="text-xs text-[#77756F]">
                    Play synthesized gentle clicks and completion chimes via Web Audio.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => handleUpdate({ soundEffects: e.target.checked })}
                  className="w-4 h-4 accent-[#171717]"
                />
              </div>

              {/* Reduced motion */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] block">
                    Reduced motion
                  </span>
                  <span className="text-xs text-[#77756F]">
                    Minimize transitions and visual animations across all views.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => handleUpdate({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 accent-[#171717]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Keyboard Shortcuts Reference */}
        <section className="bg-[#FAF9F5] border border-[#D8D6CE] p-6 sm:p-8 space-y-4">
          <h2 className="font-editorial-heading text-2xl font-bold text-[#171717]">
            Keyboard Shortcuts
          </h2>
          <p className="text-xs text-[#77756F]">
            Quickly navigate and control your sessions with single keystrokes.
          </p>

          <div className="divide-y divide-[#D8D6CE] text-sm">
            {[
              { key: 'Space', action: 'Pause / Resume the active countdown timer' },
              { key: 'G', action: 'Toggle between 8-panel grid and focused single panel' },
              { key: '← / →', action: 'Navigate to previous / next idea panel' },
              { key: 'Z', action: 'Undo last drawing stroke on active canvas' },
              { key: 'Shift + Z', action: 'Redo previously undone drawing stroke' },
              { key: 'Esc', action: 'Exit focused mode or dismiss dialogs' },
            ].map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <span className="text-xs font-sans text-[#171717]">{s.action}</span>
                <kbd className="px-2.5 py-1 bg-[#F0EFE9] border border-[#D8D6CE] font-mono text-xs text-[#171717]">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Data Management & Backup */}
        <section className="bg-[#FAF9F5] border border-[#D8D6CE] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#D8D6CE] pb-3">
            <h2 className="font-editorial-heading text-2xl font-bold text-[#171717]">
              Local Data & Privacy
            </h2>
            <p className="text-xs text-[#77756F] mt-1">
              All sketches and sessions are stored locally in your browser's IndexedDB database. They never leave your device without your consent.
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-3 text-xs font-mono border ${
                importStatus.isError
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-green-600 bg-green-50 text-green-800'
              }`}
            >
              {importStatus.message}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            {/* Export all */}
            <button
              type="button"
              onClick={onExportAll}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F5] border border-[#171717] hover:bg-[#F0EFE9] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export All Sessions (JSON)</span>
            </button>

            {/* Import file */}
            <label className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Import JSON Backup</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Danger zone: Clear all data */}
          <div className="pt-6 border-t border-[#D8D6CE]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-300 bg-red-50/40">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-wider text-red-800 font-bold block">
                  Clear All Local Storage
                </span>
                <span className="text-xs text-red-700 block">
                  Permanently erase all saved brainstorming sessions, drawings, and preferences from this device.
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider shrink-0 transition-colors"
              >
                Clear all data
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <ConfirmationModal
          isOpen={true}
          title="Erase All Local Data?"
          message="This action will permanently delete all your saved sessions, sketches, and notes from your browser's IndexedDB storage. This cannot be undone."
          confirmLabel="Permanently Delete Everything"
          isDestructive={true}
          onConfirm={async () => {
            await onClearAllData();
            setShowClearConfirm(false);
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
};
