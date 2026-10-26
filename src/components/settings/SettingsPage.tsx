import React, { useState, useRef } from 'react';
import type { UserSettings } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Type,
  Paintbrush,
  Download,
  Upload,
  Check,
  Moon,
  Sun,
  Globe,
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
  const t = getTranslation(settings.language || 'en');
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
          message: settings.language === 'uz'
            ? `${res.count} ta sessiya muvaffaqiyatli yuklandi.`
            : `Successfully imported ${res.count} brainstorming session(s).`,
          isError: false,
        });
      } else {
        setImportStatus({
          message: res.error || (settings.language === 'uz' ? 'Nusxani yuklashda xatolik yuz berdi.' : 'Failed to import backup.'),
          isError: true,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown read error';
      setImportStatus({
        message: `${settings.language === 'uz' ? 'Fayl xatosi' : 'File read error'}: ${msg}`,
        isError: true,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F2] dark:bg-[#141412] text-[#171717] dark:text-[#F8F7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Header */}
        <div className="border-b border-[#D8D6CE] dark:border-[#33322D] pb-6 flex items-baseline justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#77756F] dark:text-[#88867F]">
              {t.settingsEyebrow}
            </span>
            <h1 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717] dark:text-[#F8F7F2] mt-1">
              {t.settingsTitle}
            </h1>
          </div>

          {saveBanner && (
            <span className="text-xs font-mono text-[#171717] dark:text-[#F8F7F2] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{t.settingsSaved}</span>
            </span>
          )}
        </div>

        {/* Section 1: Appearance & Language Toggles */}
        <section className="bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] p-6 sm:p-8 space-y-6">
          <h2 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2]">
            {settings.language === 'uz' ? 'Ko\'rinish va Til' : 'Appearance & Language'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Language Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#77756F] dark:text-[#88867F]" />
                <span>{t.languagePreferenceTitle}</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate({ language: 'en' })}
                  className={`py-3 px-4 border text-left transition-colors ${
                    settings.language === 'en'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                      : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                  }`}
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider block">English</span>
                  <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">Default</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate({ language: 'uz' })}
                  className={`py-3 px-4 border text-left transition-colors ${
                    settings.language === 'uz'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                      : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                  }`}
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider block">O'zbek tili</span>
                  <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">Lotin yozuvida</span>
                </button>
              </div>
            </div>

            {/* Theme Mode Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2 flex items-center gap-1.5">
                {settings.theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-[#77756F] dark:text-[#88867F]" /> : <Sun className="w-3.5 h-3.5 text-[#77756F] dark:text-[#88867F]" />}
                <span>{t.themePreferenceTitle}</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleUpdate({ theme: 'light' })}
                  className={`py-3 px-4 border text-left transition-colors ${
                    settings.theme === 'light'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                      : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                  }`}
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider block flex items-center gap-1.5">
                    <Sun className="w-3 h-3" />
                    <span>Light</span>
                  </span>
                  <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">{t.themeLightLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate({ theme: 'dark' })}
                  className={`py-3 px-4 border text-left transition-colors ${
                    settings.theme === 'dark'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                      : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                  }`}
                >
                  <span className="font-mono text-xs font-bold uppercase tracking-wider block flex items-center gap-1.5">
                    <Moon className="w-3 h-3" />
                    <span>Dark</span>
                  </span>
                  <span className="text-[11px] text-[#77756F] dark:text-[#88867F]">{t.themeDarkLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Session & Workspace Defaults */}
        <section className="bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] p-6 sm:p-8 space-y-6">
          <h2 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2]">
            {t.sessionDefaults}
          </h2>

          <div className="space-y-6">
            {/* Default Duration */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2">
                {t.defaultSprintDuration}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: t.duration4Min, value: 240, desc: t.duration30sPerPanel },
                  { label: t.duration8Min, value: 480, desc: t.duration60sPerPanel },
                  { label: t.duration12Min, value: 720, desc: t.duration90sPerPanel },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => handleUpdate({ defaultDuration: item.value })}
                    className={`p-3.5 border text-left transition-colors ${
                      settings.defaultDuration === item.value
                        ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                        : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${settings.defaultDuration === item.value ? 'text-[#D8D6CE] dark:text-[#33322D]' : 'text-[#77756F] dark:text-[#88867F]'}`}>
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Default Mode */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] mb-2">
                {t.defaultWorkspaceModality}
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleUpdate({ defaultWorkspaceMode: 'draw' })}
                  className={`flex items-center justify-center gap-2 py-3 px-4 border text-xs font-mono uppercase tracking-wider transition-colors ${
                    settings.defaultWorkspaceMode === 'draw'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                      : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                  }`}
                >
                  <Paintbrush className="w-4 h-4" />
                  <span>{t.drawingFirst}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate({ defaultWorkspaceMode: 'write' })}
                  className={`flex items-center justify-center gap-2 py-3 px-4 border text-xs font-mono uppercase tracking-wider transition-colors ${
                    settings.defaultWorkspaceMode === 'write'
                      ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                      : 'bg-[#F8F7F2] dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2]'
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span>{t.writingFirst}</span>
                </button>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="divide-y divide-[#D8D6CE] dark:divide-[#33322D] pt-2">
              {/* Auto progression */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                    {t.autoProgressionTitle}
                  </span>
                  <span className="text-xs text-[#77756F] dark:text-[#88867F]">
                    {t.autoProgressionSettingDesc}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoProgression}
                  onChange={(e) => handleUpdate({ autoProgression: e.target.checked })}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </div>

              {/* Inspiration prompts */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                    {t.promptsToggleTitle}
                  </span>
                  <span className="text-xs text-[#77756F] dark:text-[#88867F]">
                    {t.inspirationSettingDesc}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.inspirationPrompts}
                  onChange={(e) => handleUpdate({ inspirationPrompts: e.target.checked })}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </div>

              {/* Sound effects */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                    {t.soundToggleTitle}
                  </span>
                  <span className="text-xs text-[#77756F] dark:text-[#88867F]">
                    {t.soundSettingDesc}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEffects}
                  onChange={(e) => handleUpdate({ soundEffects: e.target.checked })}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </div>

              {/* Reduced motion */}
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-[#171717] dark:text-[#F8F7F2] block">
                    {t.reducedMotionSetting}
                  </span>
                  <span className="text-xs text-[#77756F] dark:text-[#88867F]">
                    {t.reducedMotionSettingDesc}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => handleUpdate({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 accent-[#171717] dark:accent-[#F8F7F2]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Keyboard Shortcuts Reference */}
        <section className="bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] p-6 sm:p-8 space-y-4">
          <h2 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2]">
            {t.keyboardShortcutsSection}
          </h2>
          <p className="text-xs text-[#77756F] dark:text-[#88867F]">
            {t.keyboardShortcutsSectionDesc}
          </p>

          <div className="divide-y divide-[#D8D6CE] dark:divide-[#33322D] text-sm">
            {[
              { key: 'Space', action: t.shortcutSpace },
              { key: 'G', action: t.shortcutG },
              { key: '← / →', action: t.shortcutArrows },
              { key: 'Z', action: t.shortcutZ },
              { key: 'Shift + Z', action: t.shortcutShiftZ },
              { key: 'Esc', action: t.shortcutEsc },
            ].map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <span className="text-xs font-sans text-[#171717] dark:text-[#F8F7F2]">{s.action}</span>
                <kbd className="px-2.5 py-1 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] font-mono text-xs text-[#171717] dark:text-[#F8F7F2]">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Data Management & Backup */}
        <section className="bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#D8D6CE] dark:border-[#33322D] pb-3">
            <h2 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2]">
              {t.localDataPrivacy}
            </h2>
            <p className="text-xs text-[#77756F] dark:text-[#88867F] mt-1">
              {t.localDataDesc}
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-3 text-xs font-mono border ${
                importStatus.isError
                  ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-200'
                  : 'border-green-600 bg-green-50 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-200'
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
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F5] dark:bg-[#252522] border border-[#171717] dark:border-[#F8F7F2] hover:bg-[#F0EFE9] dark:hover:bg-[#2e2e2a] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t.exportAllBtn}</span>
            </button>

            {/* Import file */}
            <label className="flex items-center gap-2 px-4 py-2.5 bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#F8F7F2] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>{t.importBackupBtn}</span>
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
          <div className="pt-6 border-t border-[#D8D6CE] dark:border-[#33322D]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-300 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-wider text-red-800 dark:text-red-300 font-bold block">
                  {t.clearAllLocalStorage}
                </span>
                <span className="text-xs text-red-700 dark:text-red-400 block">
                  {t.clearAllLocalStorageDesc}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-mono uppercase tracking-wider shrink-0 transition-colors"
              >
                {t.clearAllDataBtn}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <ConfirmationModal
          isOpen={true}
          title={t.clearAllDataConfirmTitle}
          message={t.clearAllDataConfirmMsg}
          confirmLabel={t.clearAllDataConfirmBtn}
          cancelLabel={t.cancelLabel}
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
