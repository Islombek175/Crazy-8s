import React, { useState } from 'react';
import type { Idea, ToolType, Stroke, Language, ThemeMode } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingToolbar } from './DrawingToolbar';
import { ChevronLeft, ChevronRight, Grid, Star, Plus, X } from 'lucide-react';

interface FocusedWorkspaceProps {
  ideas: Idea[];
  activeIdeaIndex: number;
  onSelectIndex: (index: number) => void;
  onUpdateIdea: (idea: Idea) => void;
  onExitFocus: () => void;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onRequestClear: (ideaId: number) => void;
  readOnly?: boolean;
  lang?: Language;
  theme?: ThemeMode;
}

export const FocusedWorkspace: React.FC<FocusedWorkspaceProps> = ({
  ideas,
  activeIdeaIndex,
  onSelectIndex,
  onUpdateIdea,
  onExitFocus,
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  onRequestClear,
  readOnly = false,
  lang = 'en',
  theme = 'light',
}) => {
  const t = getTranslation(lang);
  const currentIdea = ideas[activeIdeaIndex] || ideas[0];
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [newBullet, setNewBullet] = useState('');

  const handlePrev = () => {
    if (activeIdeaIndex > 0) {
      onSelectIndex(activeIdeaIndex - 1);
      setRedoStack([]);
    }
  };

  const handleNext = () => {
    if (activeIdeaIndex < ideas.length - 1) {
      onSelectIndex(activeIdeaIndex + 1);
      setRedoStack([]);
    }
  };

  const handleStrokesChange = (newStrokes: Stroke[], dataUrl: string) => {
    setRedoStack([]);
    onUpdateIdea({
      ...currentIdea,
      strokes: newStrokes,
      canvasData: dataUrl,
    });
  };

  const handleUndo = () => {
    if (currentIdea.strokes.length === 0) return;
    const last = currentIdea.strokes[currentIdea.strokes.length - 1];
    const remaining = currentIdea.strokes.slice(0, currentIdea.strokes.length - 1);
    setRedoStack((prev) => [...prev, last]);
    onUpdateIdea({
      ...currentIdea,
      strokes: remaining,
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    onUpdateIdea({
      ...currentIdea,
      strokes: [...currentIdea.strokes, next],
    });
  };

  const toggleMode = () => {
    onUpdateIdea({
      ...currentIdea,
      mode: currentIdea.mode === 'draw' ? 'write' : 'draw',
    });
  };

  const toggleFavorite = () => {
    onUpdateIdea({
      ...currentIdea,
      isFavorite: !currentIdea.isFavorite,
    });
  };

  const handleAddBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBullet.trim()) return;
    onUpdateIdea({
      ...currentIdea,
      bulletPoints: [...(currentIdea.bulletPoints || []), newBullet.trim()],
    });
    setNewBullet('');
  };

  const handleRemoveBullet = (index: number) => {
    const updated = [...(currentIdea.bulletPoints || [])];
    updated.splice(index, 1);
    onUpdateIdea({
      ...currentIdea,
      bulletPoints: updated,
    });
  };

  const formattedNumber = String(currentIdea.id).padStart(2, '0');

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8F7F2] dark:bg-[#141412]">
      {/* Focused Navigation & Tool Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#F0EFE9] dark:bg-[#1E1E1C] border-b border-[#D8D6CE] dark:border-[#33322D]">
        {/* Left: Step counter & Switch to grid */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitFocus}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F5] dark:bg-[#252522] hover:bg-[#171717] hover:text-[#F8F7F2] dark:hover:bg-[#F8F7F2] dark:hover:text-[#171717] border border-[#D8D6CE] dark:border-[#33322D] text-xs font-mono uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] transition-colors"
            title={t.toggleGridFocused}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.showAll8}</span>
          </button>

          <div className="flex items-center gap-1 font-mono text-sm font-semibold text-[#171717] dark:text-[#F8F7F2]">
            <span>{formattedNumber}</span>
            <span className="text-[#77756F] dark:text-[#88867F]">/</span>
            <span className="text-[#77756F] dark:text-[#88867F]">08</span>
          </div>

          {/* Editable idea title */}
          <input
            type="text"
            value={currentIdea.title}
            onChange={(e) => onUpdateIdea({ ...currentIdea, title: e.target.value })}
            placeholder={t.ideaTitlePlaceholder.replace('{num}', formattedNumber)}
            readOnly={readOnly}
            className="bg-transparent border-b border-[#D8D6CE] dark:border-[#33322D] focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none text-sm font-medium text-[#171717] dark:text-[#F8F7F2] px-2 py-0.5 w-40 md:w-64"
          />

          <button
            type="button"
            onClick={toggleFavorite}
            className="p-1 text-[#171717] dark:text-[#F8F7F2] hover:opacity-75 transition-opacity"
            title={currentIdea.isFavorite ? t.starUnfavorite : t.starFavorite}
          >
            <Star
              className={`w-4 h-4 ${
                currentIdea.isFavorite
                  ? 'fill-[#171717] dark:fill-[#F8F7F2] text-[#171717] dark:text-[#F8F7F2]'
                  : 'text-[#77756F] dark:text-[#88867F]'
              }`}
            />
          </button>
        </div>

        {/* Center/Right: Drawing Toolbar */}
        {!readOnly && (
          <DrawingToolbar
            activeTool={activeTool}
            onToolChange={onToolChange}
            brushSize={brushSize}
            onBrushSizeChange={onBrushSizeChange}
            canUndo={currentIdea.strokes.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={() => onRequestClear(currentIdea.id)}
            panelMode={currentIdea.mode}
            onToggleMode={toggleMode}
            lang={lang}
          />
        )}

        {/* Right: Prev / Next Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeIdeaIndex === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono uppercase bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#171717] hover:text-[#F8F7F2] dark:hover:bg-[#F8F7F2] dark:hover:text-[#171717] text-[#171717] dark:text-[#F8F7F2] transition-colors"
            title={t.prev}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.prev}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={activeIdeaIndex === ideas.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono uppercase bg-[#FAF9F5] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#171717] hover:text-[#F8F7F2] dark:hover:bg-[#F8F7F2] dark:hover:text-[#171717] text-[#171717] dark:text-[#F8F7F2] transition-colors"
            title={t.next}
          >
            <span className="hidden md:inline">{t.next}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Large Surface */}
      <div className="flex-1 relative min-h-0 bg-[#FAF9F5] dark:bg-[#141412] p-3 md:p-6 flex flex-col justify-center items-center">
        <div className="w-full h-full max-w-5xl border border-[#D8D6CE] dark:border-[#33322D] shadow-sm flex flex-col bg-[#FAF9F5] dark:bg-[#1C1C1A] relative">
          {currentIdea.mode === 'draw' ? (
            <DrawingCanvas
              strokes={currentIdea.strokes}
              onStrokesChange={handleStrokesChange}
              activeTool={activeTool}
              brushSize={brushSize}
              readOnly={readOnly}
              theme={theme}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col p-6 space-y-4 overflow-y-auto text-[#171717] dark:text-[#F8F7F2]">
              <div className="flex-1 flex flex-col">
                <label className="text-xs uppercase font-mono tracking-wider text-[#77756F] dark:text-[#88867F] mb-2">
                  {t.descriptionConcept}
                </label>
                <textarea
                  value={currentIdea.description}
                  onChange={(e) => onUpdateIdea({ ...currentIdea, description: e.target.value })}
                  placeholder={t.descriptionPlaceholder}
                  readOnly={readOnly}
                  rows={8}
                  className="w-full flex-1 p-4 bg-[#F8F7F2] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none resize-none font-sans text-base text-[#171717] dark:text-[#F8F7F2] leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-mono tracking-wider text-[#77756F] dark:text-[#88867F]">
                  {t.keyElementsBullets}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(currentIdea.bulletPoints || []).map((bullet, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-sm text-[#171717] dark:text-[#F8F7F2]"
                    >
                      <span className="font-mono text-xs text-[#77756F] dark:text-[#88867F]">•</span>
                      <span className="flex-1">{bullet}</span>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx)}
                          className="text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!readOnly && (
                  <form onSubmit={handleAddBullet} className="flex gap-2 max-w-md pt-2">
                    <input
                      type="text"
                      value={newBullet}
                      onChange={(e) => setNewBullet(e.target.value)}
                      placeholder={t.addBulletPlaceholder}
                      className="flex-1 px-3 py-1.5 bg-[#F8F7F2] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-sm focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none text-[#171717] dark:text-[#F8F7F2]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#171717] dark:bg-[#F8F7F2] text-[#F8F7F2] dark:text-[#171717] hover:bg-[#333] dark:hover:bg-white transition-colors flex items-center gap-1 text-xs font-mono uppercase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.add}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Thumbnail Strip for all 8 ideas */}
      <div className="px-4 py-2.5 bg-[#F0EFE9] dark:bg-[#1E1E1C] border-t border-[#D8D6CE] dark:border-[#33322D] flex items-center justify-between gap-2 overflow-x-auto">
        <div className="text-[11px] font-mono text-[#77756F] dark:text-[#88867F] uppercase tracking-wider hidden sm:block whitespace-nowrap">
          {t.quickJump}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center">
          {ideas.map((item, idx) => {
            const isCur = idx === activeIdeaIndex;
            const hasContent = item.strokes.length > 0 || item.description.trim().length > 0;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectIndex(idx);
                  setRedoStack([]);
                }}
                className={`relative flex flex-col items-center justify-center w-10 sm:w-14 h-11 border transition-all ${
                  isCur
                    ? 'border-[#171717] bg-[#171717] text-[#F8F7F2] dark:border-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717]'
                    : hasContent
                    ? 'border-[#77756F] bg-[#FAF9F5] text-[#171717] hover:border-[#171717] dark:border-[#55544E] dark:bg-[#252522] dark:text-[#F8F7F2] dark:hover:border-[#F8F7F2]'
                    : 'border-[#D8D6CE] bg-[#F8F7F2] text-[#77756F] hover:border-[#171717] dark:border-[#33322D] dark:bg-[#1E1E1C] dark:text-[#88867F] dark:hover:border-[#F8F7F2]'
                }`}
                title={`Idea ${item.id}${item.title ? `: ${item.title}` : ''}`}
              >
                <span className="font-mono text-xs font-bold">
                  {String(item.id).padStart(2, '0')}
                </span>
                {item.isFavorite && (
                  <span className="text-[8px] absolute top-0.5 right-1">★</span>
                )}
                {hasContent && !isCur && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#171717] dark:bg-[#F8F7F2] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-[#77756F] dark:text-[#88867F] hidden md:block whitespace-nowrap">
          {t.navigateShortcutTip}
        </div>
      </div>
    </div>
  );
};
