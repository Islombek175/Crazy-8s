import React from 'react';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Pause or resume the countdown timer' },
    { key: 'G', desc: 'Toggle between 8-panel grid and focused mode' },
    { key: '← / →', desc: 'Navigate to previous or next idea' },
    { key: 'Z', desc: 'Undo stroke in the active drawing canvas' },
    { key: 'Shift + Z', desc: 'Redo previously undone stroke' },
    { key: 'Esc', desc: 'Close open dialogs or exit focused mode' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
      <div
        className="w-full max-w-lg bg-[#F8F7F2] border border-[#171717] p-6 shadow-md text-[#171717]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D6CE]">
          <h3 className="font-editorial-heading text-2xl font-bold">Keyboard Shortcuts</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#77756F] hover:text-[#171717] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-[#77756F] leading-relaxed">
          Shortcuts are active when focus is not inside a text input or textarea.
        </p>

        <div className="mt-4 divide-y divide-[#D8D6CE]">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5">
              <span className="text-sm font-sans text-[#171717]">{item.desc}</span>
              <kbd className="px-2.5 py-1 bg-[#F0EFE9] border border-[#D8D6CE] font-mono text-xs text-[#171717]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-[#D8D6CE] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
