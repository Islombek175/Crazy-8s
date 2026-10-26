import React, { useState } from 'react';
import type { ViewState } from '../../types';
import { Menu, X, Check, Loader2, Sparkles, Keyboard } from 'lucide-react';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onStartSession: () => void;
  isSaving?: boolean;
  onOpenShortcuts?: () => void;
  hasActiveSession?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onStartSession,
  isSaving = false,
  onOpenShortcuts,
  hasActiveSession = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-[#F8F7F2]/95 backdrop-blur-xs border-b border-[#D8D6CE] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Wordmark & Subtitle */}
        <div className="flex items-baseline gap-3 cursor-pointer" onClick={() => handleNav('landing')}>
          <div className="flex items-center gap-2">
            <span className="font-editorial-heading text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
              EIGHT
            </span>
          </div>
          <span className="hidden md:inline text-xs font-mono tracking-wider uppercase text-[#77756F]">
            A space to think differently
          </span>
        </div>

        {/* Center: Save Status indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-[#77756F]">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-[#171717]" />
              <span>Saving…</span>
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-[#77756F]" />
              <span>All changes saved locally</span>
            </>
          )}
        </div>

        {/* Right: Navigation items for Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className={`text-xs font-mono uppercase tracking-wider transition-colors ${
              currentView === 'landing' ? 'text-[#171717] font-semibold underline underline-offset-4' : 'text-[#77756F] hover:text-[#171717]'
            }`}
          >
            The Method
          </button>

          <button
            type="button"
            onClick={() => handleNav('history')}
            className={`text-xs font-mono uppercase tracking-wider transition-colors ${
              currentView === 'history' ? 'text-[#171717] font-semibold underline underline-offset-4' : 'text-[#77756F] hover:text-[#171717]'
            }`}
          >
            Past Sessions
          </button>

          <button
            type="button"
            onClick={() => handleNav('settings')}
            className={`text-xs font-mono uppercase tracking-wider transition-colors ${
              currentView === 'settings' ? 'text-[#171717] font-semibold underline underline-offset-4' : 'text-[#77756F] hover:text-[#171717]'
            }`}
          >
            Settings
          </button>

          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts"
              className="p-1.5 text-[#77756F] hover:text-[#171717] transition-colors"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}

          {/* Primary CTA button */}
          <button
            type="button"
            onClick={onStartSession}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            {hasActiveSession && currentView !== 'workspace' ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resume session</span>
              </>
            ) : (
              <span>Start brainstorming</span>
            )}
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenShortcuts && (
            <button
              type="button"
              onClick={onOpenShortcuts}
              className="p-1.5 text-[#77756F] hover:text-[#171717]"
            >
              <Keyboard className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#171717] hover:bg-[#F0EFE9] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D8D6CE] bg-[#F0EFE9] px-4 py-4 space-y-3">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-wider text-[#171717]"
          >
            The Method
          </button>
          <button
            type="button"
            onClick={() => handleNav('history')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-wider text-[#171717]"
          >
            Past Sessions
          </button>
          <button
            type="button"
            onClick={() => handleNav('settings')}
            className="block w-full text-left py-2 text-xs font-mono uppercase tracking-wider text-[#171717]"
          >
            Settings
          </button>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartSession();
              }}
              className="w-full text-center py-2.5 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-wider"
            >
              {hasActiveSession && currentView !== 'workspace' ? 'Resume session' : 'Start brainstorming'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
