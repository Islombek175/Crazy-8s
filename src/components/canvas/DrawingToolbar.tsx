import React from 'react';
import type { ToolType, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { Pen, Edit3, Eraser, RotateCcw, RotateCw, Trash2, Type, Paintbrush } from 'lucide-react';

interface DrawingToolbarProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  panelMode: 'draw' | 'write';
  onToggleMode: () => void;
  compact?: boolean;
  lang?: Language;
}

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  panelMode,
  onToggleMode,
  compact = false,
  lang = 'en',
}) => {
  const t = getTranslation(lang);

  const sizes = [
    { label: t.sizeFine, value: 1.5, dot: 'w-1.5 h-1.5' },
    { label: t.sizeMedium, value: 3, dot: 'w-2.5 h-2.5' },
    { label: t.sizeBold, value: 6, dot: 'w-3.5 h-3.5' },
    { label: t.sizeThick, value: 12, dot: 'w-4.5 h-4.5' },
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F0EFE9] dark:bg-[#1E1E1C] border border-[#D8D6CE] dark:border-[#33322D] text-[#171717] dark:text-[#F8F7F2] ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      {/* Mode toggle (Draw vs Write) */}
      <button
        type="button"
        onClick={onToggleMode}
        title={panelMode === 'draw' ? t.writeTool : t.drawTool}
        className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors ${
          panelMode === 'draw'
            ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
            : 'bg-[#F8F7F2] text-[#171717] border-[#D8D6CE] dark:bg-[#252522] dark:text-[#F8F7F2] dark:border-[#33322D] hover:border-[#171717]'
        }`}
      >
        {panelMode === 'draw' ? (
          <>
            <Paintbrush className="w-3.5 h-3.5" />
            <span className="font-mono text-xs uppercase tracking-wider">{t.drawTool}</span>
          </>
        ) : (
          <>
            <Type className="w-3.5 h-3.5" />
            <span className="font-mono text-xs uppercase tracking-wider">{t.writeTool}</span>
          </>
        )}
      </button>

      {/* Tool items only active in draw mode */}
      {panelMode === 'draw' && (
        <>
          <div className="h-5 w-[1px] bg-[#D8D6CE] dark:bg-[#33322D] mx-0.5" />

          {/* Pen */}
          <button
            type="button"
            onClick={() => onToolChange('pen')}
            title={t.penTool}
            className={`p-1.5 border transition-colors ${
              activeTool === 'pen'
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                : 'bg-transparent text-[#171717] dark:text-[#F8F7F2] border-transparent hover:border-[#D8D6CE] dark:hover:border-[#44433E]'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
          </button>

          {/* Pencil / Fine-line */}
          <button
            type="button"
            onClick={() => onToolChange('pencil')}
            title={t.pencilTool}
            className={`p-1.5 border transition-colors ${
              activeTool === 'pencil'
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                : 'bg-transparent text-[#171717] dark:text-[#F8F7F2] border-transparent hover:border-[#D8D6CE] dark:hover:border-[#44433E]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => onToolChange('eraser')}
            title={t.eraserTool}
            className={`p-1.5 border transition-colors ${
              activeTool === 'eraser'
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717] dark:bg-[#F8F7F2] dark:text-[#171717] dark:border-[#F8F7F2]'
                : 'bg-transparent text-[#171717] dark:text-[#F8F7F2] border-transparent hover:border-[#D8D6CE] dark:hover:border-[#44433E]'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-[1px] bg-[#D8D6CE] dark:bg-[#33322D] mx-0.5" />

          {/* Brush sizes */}
          <div className="flex items-center gap-1 px-1">
            {sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onBrushSizeChange(s.value)}
                title={`${t.brushSizeLabel} ${s.label}`}
                className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                  brushSize === s.value
                    ? 'border-[#171717] bg-[#FAF9F5] dark:border-[#F8F7F2] dark:bg-[#2A2A26]'
                    : 'border-transparent hover:border-[#D8D6CE] dark:hover:border-[#44433E]'
                }`}
              >
                <span className={`rounded-full bg-[#171717] dark:bg-[#F8F7F2] ${s.dot}`} />
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-[#D8D6CE] dark:bg-[#33322D] mx-0.5" />

          {/* Undo */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title={t.undoAction}
            className={`p-1.5 border transition-colors ${
              canUndo
                ? 'text-[#171717] dark:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2] cursor-pointer'
                : 'text-[#B0AEA6] dark:text-[#55544E] border-transparent cursor-not-allowed opacity-40'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title={t.redoAction}
            className={`p-1.5 border transition-colors ${
              canRedo
                ? 'text-[#171717] dark:text-[#F8F7F2] hover:border-[#171717] dark:hover:border-[#F8F7F2] cursor-pointer'
                : 'text-[#B0AEA6] dark:text-[#55544E] border-transparent cursor-not-allowed opacity-40'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-[1px] bg-[#D8D6CE] dark:bg-[#33322D] mx-0.5" />

          {/* Clear */}
          <button
            type="button"
            onClick={onClear}
            title={t.clearCanvasAction}
            className="p-1.5 text-[#77756F] dark:text-[#9A9890] hover:text-[#171717] dark:hover:text-[#F8F7F2] border border-transparent hover:border-[#D8D6CE] dark:hover:border-[#33322D] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
};
