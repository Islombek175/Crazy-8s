import React, { useState } from 'react';
import type { ViewState, Language, ThemeMode } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { Menu, X, Check, Loader2, Sparkles, Keyboard, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onStartSession: () => void;
  isSaving?: boolean;
  onOpenShortcuts?: () => void;
  hasActiveSession?: boolean;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: (theme: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onStartSession,
  isSaving = false,
  onOpenShortcuts,
  hasActiveSession = false,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(language);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[#F8F7F2]/95 dark:bg-[#141412]/95 backdrop-blur-xs border-b border-[#D8D6CE] dark:border-[#33322D] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Wordmark & Subtitle */}
        <div className="flex items-baseline gap-3 cursor-pointer" onClick={() => handleNav('landing')}>
          <div className="flex items-center gap-2">
            <span className="font-editorial-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717] dark:text-[#F8F7F2]">
              {t.brandName}
            </span>
          </div>
          <span className="hidden md:inline text-xs font-mono tracking-wider uppercase text-[#77756F] dark:text-[#88867F]">
            {t.brandSubtitle}
          </span>
        </div>

        {/* Center: Save Status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-[#77756F] dark:text-[#88867F]">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-[#171717] dark:text-[#F8F7F2]" />
              <span>{t.savingChanges}</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-[#77756F] dark:text-[#88867F]" />
              <span>{t.allChangesSaved}</span>
            </>
          )}
        </div>

        {/* Right: Navigation items for Desktop */}
        <nav className="hidden md:flex items-center gap-5">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`text-xs font-mono uppercase tracking-wider transition-colors ${
              currentView === 'landing'
                ? 'text-[#171717] dark:text-[#F8F7F2] font-semibold underline underline-offset-4'
                : 'text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]'
            }`}
          >
            {t.navMethod}
          </button>

          <button
            type="button"
            onClick={() => handleNav('history')}
            className={`text-xs font-mono uppercase tracking-wider transition-colors ${
              currentView === 'history'
                ? 'text-[#171717] dark:text-[#F8F7F2] font-semibold underline underline-offset-4'
                : 'text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]'
            }`}
          >
            {t.navPastSessions}
          </button>

          <button
            type="button"
            onClick={() => handleNav('settings')}
            className={`text-xs font-mono uppercase tracking-wider transition-colors ${
              currentView === 'settings'
                ? 'text-[#171717] dark:text-[#F8F7F2] font-semibold underline underline-offset-4'
                : 'text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]'
            }`}
          >
            {t.navSettings}
          </button>

          {/* Language Toggle (EN / UZ) */}
          <div className="flex items-center border border-[#D8D6CE] dark:border-[#33322D] bg-[#F0EFE9] dark:bg-[#1E1E1C] p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`px-1.5 py-0.5 transition-colors ${
                language === 'en'
                  ? 'bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] font-bold'
                  : 'text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onToggleLanguage('uz')}
              className={`px-1.5 py-0.5 transition-colors ${
                language === 'uz'
                  ? 'bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] font-bold'
                  : 'text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]'
              }`}
            >
              UZ
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? t.themeLightLabel : t.themeDarkLabel}
            className="p-1.5 border border-[#D8D6CE] dark:border-[#33322D] bg-[#F0EFE9] dark:bg-[#1E1E1C] text-[#171717] dark:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              title={t.keyboardShortcuts}
              className="p-1.5 text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] transition-colors"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          {/* Primary CTA button */}
          <button
            type="button"
            onClick={onStartSession}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            {hasActiveSession && currentView !== 'workspace' ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.resumeSession}</span>
              </>
            ) : (
              <span>{t.startBrainstorming}</span>
            )}
          </button>
        </nav>

        {/* Mobile controls & menu button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile Language Toggle */}
          <button
            type="button"
            onClick={() => onToggleLanguage(language === 'en' ? 'uz' : 'en')}
            className="px-2 py-1 border border-[#D8D6CE] dark:border-[#33322D] text-xs font-mono font-bold text-[#171717] dark:text-[#F8F7F2]"
          >
            {language.toUpperCase()}
          </button>

          {/* Mobile Theme Toggle */}
          <button
            type="button"
            onClick={() => onToggleTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 border border-[#D8D6CE] dark:border-[#33322D] text-[#171717] dark:text-[#F8F7F2]"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="p-1.5 text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#171717] dark:text-[#F8F7F2] hover:bg-[#F0EFE9] dark:hover:bg-[#1E1E1C] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D8D6CE] dark:border-[#33322D] bg-[#F0EFE9] dark:bg-[#1E1E1C] px-4 py-4 space-y-3">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2]"
          >
            {t.navMethod}
          </button>
          <button
            type="button"
            onClick={() => handleNav('history')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2]"
          >
            {t.navPastSessions}
          </button>
          <button
            type="button"
            onClick={() => handleNav('settings')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2]"
          >
            {t.navSettings}
          </button>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartSession();
              }}
              className="w-full text-center py-2.5 bg-[#171717] dark:bg-[#F8F7F2] text-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-wider"
            >
              {hasActiveSession && currentView !== 'workspace' ? t.resumeSession : t.startBrainstorming}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
