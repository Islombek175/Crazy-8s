import React, { useState } from 'react';
import type { Session, Idea } from '../../types';
import {
  exportSessionAsPDF,
  exportSessionAsPNG,
  exportSessionAsJSON,
} from '../../services/export';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
  Star,
  Download,
  Printer,
  Copy,
  Trash2,
  FileText,
  Image as ImageIcon,
  Columns,
  ArrowLeft,
} from 'lucide-react';

interface IdeaReviewProps {
  session: Session;
  onUpdateSession: (updated: Session) => void;
  onReturnToWorkspace: () => void;
  onNewSession: () => void;
}

export const IdeaReview: React.FC<IdeaReviewProps> = ({
  session,
  onUpdateSession,
  onReturnToWorkspace,
  onNewSession,
}) => {
  const [comparing, setComparing] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    message: string;
    action: () => void;
  } | null>(null);

  const favoriteCount = session.ideas.filter((i) => i.isFavorite).length;

  const handleToggleFavorite = (ideaId: number) => {
    const target = session.ideas.find((i) => i.id === ideaId);
    if (!target) return;

    if (!target.isFavorite && favoriteCount >= 3) {
      alert('You have reached the maximum of 3 favorite ideas. Deselect one first to add another.');
      return;
    }

    const updated = session.ideas.map((i) =>
      i.id === ideaId ? { ...i, isFavorite: !i.isFavorite } : i
    );
    onUpdateSession({ ...session, ideas: updated });
  };

  const handleUpdateIdeaText = (ideaId: number, field: 'title' | 'description' | 'notes', val: string) => {
    const updated = session.ideas.map((i) =>
      i.id === ideaId ? { ...i, [field]: val } : i
    );
    onUpdateSession({ ...session, ideas: updated });
  };

  const handleDuplicateIdea = (sourceIdea: Idea) => {
    // Find first blank panel or prompt for target
    const target = session.ideas.find(
      (i) => i.id !== sourceIdea.id && i.strokes.length === 0 && !i.description.trim()
    );

    if (!target) {
      alert('All 8 panels currently have content. Clear a panel first to duplicate.');
      return;
    }

    const updated = session.ideas.map((i) => {
      if (i.id === target.id) {
        return {
          ...i,
          title: sourceIdea.title ? `${sourceIdea.title} (Copy)` : `Idea ${i.id}`,
          description: sourceIdea.description,
          bulletPoints: [...(sourceIdea.bulletPoints || [])],
          strokes: [...sourceIdea.strokes],
          canvasData: sourceIdea.canvasData,
          mode: sourceIdea.mode,
        };
      }
      return i;
    });

    onUpdateSession({ ...session, ideas: updated });
  };

  const handleClearIdea = (ideaId: number) => {
    setPendingConfirm({
      title: `Clear Idea ${String(ideaId).padStart(2, '0')}?`,
      message: 'This will reset this panel and remove its drawing, title, and notes.',
      action: () => {
        const updated = session.ideas.map((i) =>
          i.id === ideaId
            ? {
                ...i,
                title: '',
                description: '',
                bulletPoints: [],
                strokes: [],
                canvasData: null,
                notes: '',
                isFavorite: false,
              }
            : i
        );
        onUpdateSession({ ...session, ideas: updated });
        setPendingConfirm(null);
      },
    });
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting('pdf');
      await exportSessionAsPDF(session);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportPNG = async () => {
    try {
      setIsExporting('png');
      await exportSessionAsPNG(session);
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportJSON = () => {
    exportSessionAsJSON(session);
  };

  const handlePrint = () => {
    window.print();
  };

  const favoriteIdeas = session.ideas.filter((i) => i.isFavorite);

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F2]">
      {/* Top Review Header Toolbar */}
      <div className="no-print bg-[#F0EFE9] border-b border-[#D8D6CE] px-4 sm:px-8 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReturnToWorkspace}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>

            <div>
              <h2 className="font-editorial-heading text-2xl font-bold text-[#171717]">
                Session Results & Selection
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-[#77756F]">
                <span>Challenge: "{session.challenge}"</span>
                <span>•</span>
                <span className="font-semibold text-[#171717]">
                  {favoriteCount}/3 Favorites Selected
                </span>
              </div>
            </div>
          </div>

          {/* Export & Comparison buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {favoriteIdeas.length >= 2 && (
              <button
                type="button"
                onClick={() => setComparing(!comparing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono uppercase tracking-wider transition-colors ${
                  comparing
                    ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                    : 'bg-[#FAF9F5] text-[#171717] border-[#D8D6CE] hover:border-[#171717]'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Compare Favorites ({favoriteIdeas.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isExporting === 'pdf' ? 'Generating...' : 'PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportPNG}
              disabled={isExporting !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isExporting === 'png' ? 'Rendering...' : 'PNG'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] border border-[#D8D6CE] hover:border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Backup</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-12">
        {/* Printable Worksheet Header (Only visible when printing) */}
        <div className="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div className="flex justify-between items-baseline">
            <h1 className="text-3xl font-bold font-editorial-heading">EIGHT — CRAZY 8s WORKSHEET</h1>
            <span className="font-mono text-sm">
              {new Date(session.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-base font-bold">Challenge: "{session.challenge}"</p>
          {session.context && <p className="text-sm italic">Context: {session.context}</p>}
        </div>

        {/* Side-by-side Favorite Comparison Modal/Section */}
        {comparing && favoriteIdeas.length > 0 && (
          <div className="p-6 bg-[#FAF9F5] border-2 border-[#171717] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D6CE]">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4 text-[#171717]" />
                <h3 className="font-editorial-heading text-xl font-bold text-[#171717]">
                  Side-by-Side Comparison of Favorites
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setComparing(false)}
                className="text-xs font-mono uppercase text-[#77756F] hover:text-[#171717]"
              >
                Close comparison ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favoriteIdeas.map((fav) => (
                <div key={fav.id} className="border border-[#171717] bg-[#F8F7F2] p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs font-bold pb-2 border-b border-[#D8D6CE]">
                      <span>IDEA {String(fav.id).padStart(2, '0')}</span>
                      <span className="text-[#171717]">★ FAVORITE</span>
                    </div>

                    <h4 className="font-editorial-heading text-xl font-semibold mt-2 mb-2 text-[#171717]">
                      {fav.title || `Idea ${fav.id}`}
                    </h4>

                    {fav.canvasData && (
                      <div className="aspect-[4/3] w-full border border-[#D8D6CE] bg-[#FAF9F5] my-2 overflow-hidden flex items-center justify-center">
                        <img
                          src={fav.canvasData}
                          alt={`Sketch for idea ${fav.id}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}

                    {fav.description && (
                      <p className="text-xs text-[#171717] leading-relaxed mt-2 font-sans">
                        {fav.description}
                      </p>
                    )}

                    {fav.notes && (
                      <div className="mt-3 p-2 bg-[#F0EFE9] border border-[#D8D6CE] text-xs text-[#77756F]">
                        <span className="font-mono text-[10px] uppercase block font-semibold text-[#171717]">
                          Note:
                        </span>
                        {fav.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8-Panel Review Grid */}
        <section>
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#D8D6CE]">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#77756F]">
                All Generated Concepts
              </span>
              <h3 className="font-editorial-heading text-3xl font-normal text-[#171717]">
                The Eight Panels
              </h3>
            </div>
            <span className="font-mono text-xs text-[#77756F]">
              Click star to select up to 3 favorites
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {session.ideas.map((idea) => {
              const panelNumber = String(idea.id).padStart(2, '0');
              const hasDrawing = idea.canvasData || idea.strokes.length > 0;

              return (
                <div
                  key={idea.id}
                  className={`flex flex-col justify-between bg-[#FAF9F5] transition-all border ${
                    idea.isFavorite
                      ? 'border-2 border-[#171717] shadow-sm'
                      : 'border-[#D8D6CE] hover:border-[#77756F]'
                  }`}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-center justify-between px-3 py-2 bg-[#F0EFE9] border-b border-[#D8D6CE]">
                      <span className="font-mono text-xs font-semibold text-[#171717]">
                        {panelNumber}
                      </span>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(idea.id)}
                        className="flex items-center gap-1 text-xs font-mono uppercase text-[#171717] hover:opacity-75 transition-opacity"
                        title={idea.isFavorite ? 'Remove favorite' : 'Select favorite (max 3)'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            idea.isFavorite ? 'fill-[#171717] text-[#171717]' : 'text-[#77756F]'
                          }`}
                        />
                        <span className="text-[10px] hidden sm:inline">
                          {idea.isFavorite ? 'Favorite' : 'Star'}
                        </span>
                      </button>
                    </div>

                    {/* Idea Title */}
                    <div className="p-3 border-b border-[#D8D6CE]">
                      <input
                        type="text"
                        value={idea.title}
                        onChange={(e) => handleUpdateIdeaText(idea.id, 'title', e.target.value)}
                        placeholder={`Idea ${panelNumber} title`}
                        className="w-full font-editorial-heading text-lg font-semibold bg-transparent border-b border-transparent hover:border-[#D8D6CE] focus:border-[#171717] focus:outline-none text-[#171717]"
                      />
                    </div>

                    {/* Canvas Drawing Preview */}
                    {hasDrawing && idea.canvasData ? (
                      <div className="aspect-[4/3] bg-white border-b border-[#D8D6CE] flex items-center justify-center p-2 overflow-hidden">
                        <img
                          src={idea.canvasData}
                          alt={`Idea ${panelNumber} drawing`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/2.5] bg-[#F8F7F2] border-b border-[#D8D6CE] flex items-center justify-center text-xs font-mono text-[#77756F] italic">
                        (No sketch recorded)
                      </div>
                    )}

                    {/* Description & Bullets */}
                    <div className="p-3 space-y-2">
                      <textarea
                        value={idea.description}
                        onChange={(e) => handleUpdateIdeaText(idea.id, 'description', e.target.value)}
                        placeholder="Add notes or description for this idea..."
                        rows={3}
                        className="w-full text-xs text-[#171717] font-sans bg-transparent border border-transparent hover:border-[#D8D6CE] focus:border-[#171717] focus:bg-white focus:outline-none p-1.5 resize-none leading-relaxed"
                      />

                      {idea.bulletPoints && idea.bulletPoints.length > 0 && (
                        <ul className="text-xs text-[#77756F] space-y-1 pl-1">
                          {idea.bulletPoints.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5">
                              <span className="font-mono text-[10px] text-[#171717]">•</span>
                              <span className="truncate">{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Idea Specific Notes */}
                      <div className="pt-2 border-t border-[#D8D6CE]">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#77756F] block mb-1">
                          Refinement Note
                        </label>
                        <input
                          type="text"
                          value={idea.notes || ''}
                          onChange={(e) => handleUpdateIdeaText(idea.id, 'notes', e.target.value)}
                          placeholder="e.g. Combine with #04, test prototype"
                          className="w-full text-xs font-sans px-2 py-1 bg-[#F8F7F2] border border-[#D8D6CE] focus:border-[#171717] focus:outline-none text-[#171717]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Panel Footer Actions: Duplicate / Clear */}
                  <div className="no-print p-2 bg-[#F0EFE9] border-t border-[#D8D6CE] flex items-center justify-between text-xs font-mono text-[#77756F]">
                    <button
                      type="button"
                      onClick={() => handleDuplicateIdea(idea)}
                      className="hover:text-[#171717] flex items-center gap-1 transition-colors"
                      title="Duplicate this idea to an empty panel"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleClearIdea(idea.id)}
                      className="hover:text-red-700 flex items-center gap-1 transition-colors"
                      title="Clear this panel"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final Reflection Questionnaire (Section 8) */}
        <section className="p-8 bg-[#FAF9F5] border border-[#171717] shadow-sm space-y-6">
          <div className="border-b border-[#D8D6CE] pb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#77756F]">
              Synthesis & Next Steps
            </span>
            <h3 className="font-editorial-heading text-3xl font-normal text-[#171717] mt-1">
              Final Session Reflections
            </h3>
            <p className="text-sm text-[#77756F] font-light mt-1">
              Answer these three standard sprint questions to anchor what you've learned.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#171717] mb-1.5">
                1. Which idea surprised you the most?
              </label>
              <textarea
                value={session.reflections.surprise}
                onChange={(e) =>
                  onUpdateSession({
                    ...session,
                    reflections: { ...session.reflections, surprise: e.target.value },
                  })
                }
                placeholder="Idea #07 surprised me because it solved the problem without any digital screen..."
                rows={2}
                className="w-full p-3 bg-[#F8F7F2] border border-[#D8D6CE] text-sm text-[#171717] focus:border-[#171717] focus:outline-none resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#171717] mb-1.5">
                2. Which idea has the greatest potential?
              </label>
              <textarea
                value={session.reflections.potential}
                onChange={(e) =>
                  onUpdateSession({
                    ...session,
                    reflections: { ...session.reflections, potential: e.target.value },
                  })
                }
                placeholder="Idea #03 has the highest commercial potential because it's immediately feasible with low cost..."
                rows={2}
                className="w-full p-3 bg-[#F8F7F2] border border-[#D8D6CE] text-sm text-[#171717] focus:border-[#171717] focus:outline-none resize-none font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#171717] mb-1.5">
                3. What would you like to explore next?
              </label>
              <textarea
                value={session.reflections.nextStep}
                onChange={(e) =>
                  onUpdateSession({
                    ...session,
                    reflections: { ...session.reflections, nextStep: e.target.value },
                  })
                }
                placeholder="Build a rough paper mockup of Idea #03 and interview two users tomorrow..."
                rows={2}
                className="w-full p-3 bg-[#F8F7F2] border border-[#D8D6CE] text-sm text-[#171717] focus:border-[#171717] focus:outline-none resize-none font-sans"
              />
            </div>
          </div>
        </section>

        {/* Footer actions */}
        <div className="no-print pt-6 border-t border-[#D8D6CE] flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReturnToWorkspace}
            className="px-6 py-3 border border-[#D8D6CE] text-xs font-mono uppercase tracking-wider text-[#171717] hover:bg-[#F0EFE9] transition-colors"
          >
            ← Back to workspace
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-6 py-3 border border-[#171717] text-xs font-mono uppercase tracking-wider text-[#171717] hover:bg-[#F0EFE9] transition-colors"
            >
              Export PDF
            </button>

            <button
              type="button"
              onClick={onNewSession}
              className="px-6 py-3 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Begin new sprint
            </button>
          </div>
        </div>
      </div>

      {pendingConfirm && (
        <ConfirmationModal
          isOpen={true}
          title={pendingConfirm.title}
          message={pendingConfirm.message}
          confirmLabel="Clear"
          isDestructive={true}
          onConfirm={pendingConfirm.action}
          onCancel={() => setPendingConfirm(null)}
        />
      )}
    </div>
  );
};
