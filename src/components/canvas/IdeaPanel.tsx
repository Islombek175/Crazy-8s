import React, { useState } from 'react';
import type { Idea, ToolType, Stroke, Language, ThemeMode } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { DrawingCanvas } from './DrawingCanvas';
import { DrawingToolbar } from './DrawingToolbar';
import { Star, Maximize2, Plus, X } from 'lucide-react';

interface IdeaPanelProps {
  idea: Idea;
  isActive: boolean;
  onSelect: () => void;
  onUpdate: (updatedIdea: Idea) => void;
  onExpand?: () => void;
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onRequestClear: (ideaId: number) => void;
  readOnly?: boolean;
  lang?: Language;
  theme?: ThemeMode;
}

export const IdeaPanel: React.FC<IdeaPanelProps> = ({
  idea,
  isActive,
  onSelect,
  onUpdate,
  onExpand,
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
  const [redoStack, setRedoStack] = useState<Stroke[]>([]);
  const [newBullet, setNewBullet] = useState('');

  const handleStrokesChange = (newStrokes: Stroke[], dataUrl: string) => {
    setRedoStack([]);
    onUpdate({
      ...idea,
      strokes: newStrokes,
      canvasData: dataUrl,
    });
  };

  const handleUndo = () => {
    if (idea.strokes.length === 0) return;
    const last = idea.strokes[idea.strokes.length - 1];
    const remaining = idea.strokes.slice(0, idea.strokes.length - 1);
    setRedoStack((prev) => [...prev, last]);
    onUpdate({
      ...idea,
      strokes: remaining,
    });
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    const nextStrokes = [...idea.strokes, next];
    onUpdate({
      ...idea,
      strokes: nextStrokes,
    });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      ...idea,
      isFavorite: !idea.isFavorite,
    });
  };

  const toggleMode = () => {
    onUpdate({
      ...idea,
      mode: idea.mode === 'draw' ? 'write' : 'draw',
    });
  };

  const handleAddBullet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBullet.trim()) return;
    onUpdate({
      ...idea,
      bulletPoints: [...(idea.bulletPoints || []), newBullet.trim()],
    });
    setNewBullet('');
  };

  const handleRemoveBullet = (index: number) => {
    const updated = [...(idea.bulletPoints || [])];
    updated.splice(index, 1);
    onUpdate({
      ...idea,
      bulletPoints: updated,
    });
  };

  const panelNumber = String(idea.id).padStart(2, '0');

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col transition-all duration-150 h-full min-h-[340px] md:min-h-[380px] ${
        theme === 'dark' ? 'bg-[#1C1C1A]' : 'bg-[#FAF9F5]'
      } ${
        isActive
          ? 'ring-2 ring-[#171717] dark:ring-[#F8F7F2] ring-offset-1 dark:ring-offset-[#141412] z-10'
          : 'border border-[#D8D6CE] dark:border-[#33322D] hover:border-[#77756F] dark:hover:border-[#5E5D57]'
      }`}
    >
      {/* Panel Top Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F0EFE9] dark:bg-[#252522] border-b border-[#D8D6CE] dark:border-[#33322D] select-none">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          {/* Panel Number */}
          <span className="font-mono text-xs font-semibold text-[#171717] dark:text-[#F8F7F2] tracking-wider">
            {panelNumber}
          </span>

          {/* Idea Title */}
          <input
            type="text"
            value={idea.title}
            onChange={(e) => onUpdate({ ...idea, title: e.target.value })}
            placeholder={t.ideaTitlePlaceholder.replace('{num}', panelNumber)}
            readOnly={readOnly}
            className="flex-1 bg-transparent text-xs font-medium text-[#171717] dark:text-[#F8F7F2] placeholder-[#77756F] dark:placeholder-[#88867F] border-b border-transparent focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none px-1 py-0.5 truncate"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Favorite toggle */}
          <button
            type="button"
            onClick={toggleFavorite}
            title={idea.isFavorite ? t.starUnfavorite : t.starFavorite}
            className="p-1 text-[#171717] dark:text-[#F8F7F2] hover:opacity-75 transition-opacity"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                idea.isFavorite
                  ? 'fill-[#171717] dark:fill-[#F8F7F2] text-[#171717] dark:text-[#F8F7F2]'
                  : 'text-[#77756F] dark:text-[#88867F]'
              }`}
            />
          </button>

          {/* Expand into focused mode */}
          {onExpand && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              title={t.focusedMode}
              className="p-1 text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Toolbar for active panel in Draw mode */}
      {isActive && !readOnly && (
        <div className="border-b border-[#D8D6CE] dark:border-[#33322D]">
          <DrawingToolbar
            activeTool={activeTool}
            onToolChange={onToolChange}
            brushSize={brushSize}
            onBrushSizeChange={onBrushSizeChange}
            canUndo={idea.strokes.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={() => onRequestClear(idea.id)}
            panelMode={idea.mode}
            onToggleMode={toggleMode}
            compact={true}
            lang={lang}
          />
        </div>
      )}

      {/* Main Content Area: Drawing or Writing */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-[#FAF9F5] dark:bg-[#1C1C1A]">
        {idea.mode === 'draw' ? (
          <DrawingCanvas
            strokes={idea.strokes}
            onStrokesChange={handleStrokesChange}
            activeTool={activeTool}
            brushSize={brushSize}
            readOnly={readOnly}
            theme={theme}
            className="w-full h-full"
          />
        ) : (
          <div className="flex-1 flex flex-col p-3 overflow-y-auto space-y-2.5 text-xs text-[#171717] dark:text-[#F8F7F2]">
            {/* Written description */}
            <div className="flex-1 flex flex-col">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#77756F] dark:text-[#88867F] mb-1">
                {t.descriptionConcept}
              </label>
              <textarea
                value={idea.description}
                onChange={(e) => onUpdate({ ...idea, description: e.target.value })}
                placeholder={t.descriptionPlaceholder}
                readOnly={readOnly}
                rows={4}
                className="w-full flex-1 p-2 bg-[#F8F7F2] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none resize-none font-sans text-xs text-[#171717] dark:text-[#F8F7F2] leading-relaxed"
              />
            </div>

            {/* Bullet points */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider text-[#77756F] dark:text-[#88867F]">
                {t.keyElementsBullets}
              </label>
              <ul className="space-y-1">
                {(idea.bulletPoints || []).map((bullet, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-1.5 py-0.5 px-2 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D]"
                  >
                    <span className="font-mono text-[10px] text-[#77756F] dark:text-[#88867F]">•</span>
                    <span className="flex-1 truncate">{bullet}</span>
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(idx)}
                        className="text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {!readOnly && (
                <form onSubmit={handleAddBullet} className="flex gap-1 pt-1">
                  <input
                    type="text"
                    value={newBullet}
                    onChange={(e) => setNewBullet(e.target.value)}
                    placeholder={t.addBulletPlaceholder}
                    className="flex-1 px-2 py-1 bg-[#F8F7F2] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] text-xs focus:border-[#171717] dark:focus:border-[#F8F7F2] focus:outline-none text-[#171717] dark:text-[#F8F7F2]"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-[#171717] dark:bg-[#F8F7F2] text-[#F8F7F2] dark:text-[#171717] hover:bg-[#333] dark:hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* If drawing exists, subtle indicator */}
            {idea.strokes.length > 0 && (
              <div className="pt-2 border-t border-[#D8D6CE] dark:border-[#33322D] flex items-center justify-between text-[11px] text-[#77756F] dark:text-[#88867F]">
                <span>{t.hasSketchNote.replace('{count}', String(idea.strokes.length))}</span>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="underline hover:text-[#171717] dark:hover:text-[#F8F7F2]"
                >
                  {t.viewDrawing}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer subtle mode / stroke count tag */}
      <div className="px-2.5 py-1 bg-[#F0EFE9] dark:bg-[#252522] border-t border-[#D8D6CE] dark:border-[#33322D] flex items-center justify-between text-[10px] font-mono text-[#77756F] dark:text-[#88867F] select-none">
        <span>
          {idea.mode === 'draw'
            ? idea.strokes.length > 0
              ? `${idea.strokes.length} ${lang === 'uz' ? 'chiziq' : `stroke${idea.strokes.length === 1 ? '' : 's'}`}`
              : t.blankCanvas
            : idea.description.trim()
            ? t.writtenIdea
            : t.blankDraft}
        </span>
        {idea.isFavorite && (
          <span className="font-semibold text-[#171717] dark:text-[#F8F7F2]">
            {t.favoriteTag}
          </span>
        )}
      </div>
    </div>
  );
};
