import React, { useState } from 'react';
import type { Session, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Search,
  ArrowUpDown,
  Calendar,
  Clock,
  Star,
  Layers,
  ArrowRight,
  Copy,
  Trash2,
  Edit2,
  Check,
  Plus,
} from 'lucide-react';

interface SessionHistoryProps {
  sessions: Session[];
  onOpenSession: (sessionId: string) => void;
  onDuplicateSession: (session: Session) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onStartNew: () => void;
  lang?: Language;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onOpenSession,
  onDuplicateSession,
  onDeleteSession,
  onRenameSession,
  onStartNew,
  lang = 'en',
}) => {
  const t = getTranslation(lang);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const filtered = sessions
    .filter((s) => s.challenge.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return sortOrder === 'recent' ? timeB - timeA : timeA - timeB;
    });

  const startRenaming = (session: Session) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.challenge);
  };

  const saveRenaming = (sessionId: string) => {
    if (editingTitle.trim()) {
      onRenameSession(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F2] dark:bg-[#141412] text-[#171717] dark:text-[#F8F7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D8D6CE] dark:border-[#33322D] pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#77756F] dark:text-[#88867F]">
              {t.historyEyebrow}
            </span>
            <h1 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717] dark:text-[#F8F7F2] mt-1">
              {t.historyTitle}
            </h1>
          </div>

          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.newSession}</span>
          </button>
        </div>

        {/* Search and Sort Toolbar */}
        {sessions.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-[#77756F] dark:text-[#88867F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] focus:border-[#171717] dark:focus:border-[#F8F7F2] text-sm text-[#171717] dark:text-[#F8F7F2] placeholder-[#77756F] dark:placeholder-[#88867F] focus:outline-none"
              />
            </div>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2] transition-colors self-end sm:self-auto"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortOrder === 'recent' ? t.sortRecent : t.sortOldest}</span>
            </button>
          </div>
        )}

        {/* Sessions Grid / Empty State */}
        {filtered.length === 0 ? (
          <div className="border border-[#D8D6CE] dark:border-[#33322D] bg-[#FAF9F5] dark:bg-[#1C1C1A] p-12 sm:p-20 text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="font-editorial-heading text-4xl sm:text-5xl font-light text-[#171717] dark:text-[#F8F7F2]">
              {t.noIdeasYet}
            </div>
            <p className="font-editorial-body text-base text-[#77756F] dark:text-[#88867F] font-light max-w-md mx-auto">
              {t.noIdeasSub}
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onStartNew}
                className="px-6 py-3 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
              >
                <span>{t.startBrainstorming}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((s) => {
              const populatedCount = s.ideas.filter(
                (i) => i.strokes.length > 0 || i.description.trim().length > 0
              ).length;
              const favCount = s.ideas.filter((i) => i.isFavorite).length;
              const dateStr = new Date(s.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const durationMin = Math.round(s.durationSeconds / 60);

              const isRenaming = editingSessionId === s.id;

              return (
                <div
                  key={s.id}
                  className="group bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#D8D6CE] dark:border-[#33322D] hover:border-[#171717] dark:hover:border-[#EDECE6] p-6 flex flex-col justify-between transition-all duration-150 shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Top Date & Duration pill */}
                    <div className="flex items-center justify-between text-xs font-mono text-[#77756F] dark:text-[#88867F] pb-3 border-b border-[#D8D6CE] dark:border-[#33322D]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.sprintDurationMin.replace('{min}', String(durationMin))}</span>
                      </div>
                    </div>

                    {/* Challenge Title (Editable) */}
                    <div>
                      {isRenaming ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRenaming(s.id);
                              if (e.key === 'Escape') setEditingSessionId(null);
                            }}
                            autoFocus
                            className="w-full text-base font-editorial-heading font-semibold border-b border-[#171717] dark:border-[#F8F7F2] bg-white dark:bg-[#252522] text-[#171717] dark:text-[#F8F7F2] px-1.5 py-0.5 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => saveRenaming(s.id)}
                            className="p-1 text-[#171717] dark:text-[#F8F7F2]"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <h3
                          onClick={() => onOpenSession(s.id)}
                          className="font-editorial-heading text-2xl font-semibold text-[#171717] dark:text-[#F8F7F2] group-hover:text-black dark:group-hover:text-white cursor-pointer leading-snug line-clamp-2"
                        >
                          "{s.challenge}"
                        </h3>
                      )}

                      {s.context && (
                        <p className="mt-1 text-xs text-[#77756F] dark:text-[#88867F] line-clamp-1 italic font-light">
                          {s.context}
                        </p>
                      )}
                    </div>

                    {/* Miniature thumbnail preview of 8 ideas */}
                    <div className="grid grid-cols-4 gap-1.5 py-2">
                      {s.ideas.map((idea) => {
                        const hasContent = idea.strokes.length > 0 || idea.description.trim().length > 0;
                        return (
                          <div
                            key={idea.id}
                            className={`aspect-[4/3] border flex items-center justify-center text-[9px] font-mono relative overflow-hidden ${
                              idea.isFavorite
                                ? 'border-[#171717] dark:border-[#F8F7F2] bg-[#F0EFE9] dark:bg-[#252522]'
                                : hasContent
                                ? 'border-[#D8D6CE] dark:border-[#33322D] bg-[#FAF9F5] dark:bg-[#1E1E1C]'
                                : 'border-[#EAE8E0] dark:border-[#2A2A26] bg-[#F8F7F2] dark:bg-[#141412] opacity-40'
                            }`}
                          >
                            {idea.canvasData ? (
                              <img
                                src={idea.canvasData}
                                alt={`Idea ${idea.id}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className={hasContent ? 'text-[#171717] dark:text-[#F8F7F2]' : 'text-[#A09E96] dark:text-[#55544E]'}>
                                {String(idea.id).padStart(2, '0')}
                              </span>
                            )}
                            {idea.isFavorite && (
                              <span className="absolute top-0.5 right-0.5 text-[8px] text-[#171717] dark:text-[#F8F7F2] font-bold">
                                ★
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats pills */}
                    <div className="flex items-center gap-3 text-xs font-mono text-[#77756F] dark:text-[#88867F] pt-2">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
                        <span>{populatedCount}/8 {lang === 'uz' ? 'G\'oya' : 'Ideas'}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
                        <span>{favCount} {lang === 'uz' ? 'Sevimli' : 'Favorites'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-[#D8D6CE] dark:border-[#33322D] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3 text-[#77756F] dark:text-[#88867F]">
                      <button
                        type="button"
                        onClick={() => startRenaming(s)}
                        className="hover:text-[#171717] dark:hover:text-[#F8F7F2] transition-colors"
                        title="Rename challenge"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDuplicateSession(s)}
                        className="hover:text-[#171717] dark:hover:text-[#F8F7F2] transition-colors"
                        title={t.duplicate}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingDelete({ id: s.id, title: s.challenge })}
                        className="hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenSession(s.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors uppercase tracking-wider text-[11px]"
                    >
                      <span>{t.openSession}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <ConfirmationModal
          isOpen={true}
          title={t.deleteSessionTitle}
          message={t.deleteSessionMsg.replace('{title}', pendingDelete.title)}
          confirmLabel={t.deleteSessionConfirm}
          cancelLabel={t.cancelLabel}
          isDestructive={true}
          onConfirm={() => {
            onDeleteSession(pendingDelete.id);
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
};
