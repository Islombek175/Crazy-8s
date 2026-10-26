import React from 'react';
import type { ToolType } from '../../types';
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
}) => {
  const sizes = [
    { label: 'Fine', value: 1.5, dot: 'w-1.5 h-1.5' },
    { label: 'Medium', value: 3, dot: 'w-2.5 h-2.5' },
    { label: 'Bold', value: 6, dot: 'w-3.5 h-3.5' },
    { label: 'Thick', value: 12, dot: 'w-4.5 h-4.5' },
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F0EFE9] border border-[#D8D6CE] text-[#171717] ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      {/* Mode toggle (Draw vs Write) */}
      <button
        type="button"
        onClick={onToggleMode}
        title={panelMode === 'draw' ? 'Switch to writing mode' : 'Switch to drawing mode'}
        className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors ${
          panelMode === 'draw'
            ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
            : 'bg-[#F8F7F2] text-[#171717] border-[#D8D6CE] hover:border-[#171717]'
        }`}
      >
        {panelMode === 'draw' ? (
          <>
            <Paintbrush className="w-3.5 h-3.5" />
            <span className="font-mono text-xs uppercase tracking-wider">Draw</span>
          </>
        ) : (
          <>
            <Type className="w-3.5 h-3.5" />
            <span className="font-mono text-xs uppercase tracking-wider">Write</span>
          </>
        )}
      </button>

      {/* Tool items only active in draw mode */}
      {panelMode === 'draw' && (
        <>
          <div className="h-5 w-[1px] bg-[#D8D6CE] mx-0.5" />

          {/* Pen */}
          <button
            type="button"
            onClick={() => onToolChange('pen')}
            title="Black Pen (Solid ink)"
            className={`p-1.5 border transition-colors ${
              activeTool === 'pen'
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                : 'bg-transparent text-[#171717] border-transparent hover:border-[#D8D6CE]'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
          </button>

          {/* Pencil / Fine-line */}
          <button
            type="button"
            onClick={() => onToolChange('pencil')}
            title="Pencil / Fine-line"
            className={`p-1.5 border transition-colors ${
              activeTool === 'pencil'
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                : 'bg-transparent text-[#171717] border-transparent hover:border-[#D8D6CE]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => onToolChange('eraser')}
            title="Eraser"
            className={`p-1.5 border transition-colors ${
              activeTool === 'eraser'
                ? 'bg-[#171717] text-[#F8F7F2] border-[#171717]'
                : 'bg-transparent text-[#171717] border-transparent hover:border-[#D8D6CE]'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-[1px] bg-[#D8D6CE] mx-0.5" />

          {/* Brush sizes */}
          <div className="flex items-center gap-1 px-1">
            {sizes.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onBrushSizeChange(s.value)}
                title={`Brush size: ${s.label}`}
                className={`w-6 h-6 flex items-center justify-center border transition-colors ${
                  brushSize === s.value
                    ? 'border-[#171717] bg-[#FAF9F5]'
                    : 'border-transparent hover:border-[#D8D6CE]'
                }`}
              >
                <span className={`rounded-full bg-[#171717] ${s.dot}`} />
              </button>
            ))}
          </div>

          <div className="h-5 w-[1px] bg-[#D8D6CE] mx-0.5" />

          {/* Undo */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo stroke (Z)"
            className={`p-1.5 border transition-colors ${
              canUndo
                ? 'text-[#171717] hover:border-[#171717] cursor-pointer'
                : 'text-[#B0AEA6] border-transparent cursor-not-allowed opacity-40'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo stroke (Shift+Z)"
            className={`p-1.5 border transition-colors ${
              canRedo
                ? 'text-[#171717] hover:border-[#171717] cursor-pointer'
                : 'text-[#B0AEA6] border-transparent cursor-not-allowed opacity-40'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="h-5 w-[1px] bg-[#D8D6CE] mx-0.5" />

          {/* Clear */}
          <button
            type="button"
            onClick={onClear}
            title="Clear panel canvas"
            className="p-1.5 text-[#77756F] hover:text-[#171717] border border-transparent hover:border-[#D8D6CE] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
};
