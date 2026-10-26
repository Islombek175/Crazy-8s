import React from 'react';
import type { Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { X } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
}) => {
  if (!isOpen) return null;
  const t = getTranslation(lang);

  const shortcuts = [
    { key: 'Space', desc: t.shortcutSpace },
    { key: 'G', desc: t.shortcutG },
    { key: '← / →', desc: t.shortcutArrows },
    { key: 'Z', desc: t.shortcutZ },
    { key: 'Shift + Z', desc: t.shortcutShiftZ },
    { key: 'Esc', desc: t.shortcutEsc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-[1px]">
      <div
        className="w-full max-w-lg bg-[#F8F7F2] dark:bg-[#1E1E1C] border border-[#171717] dark:border-[#EDECE6] p-6 shadow-md text-[#171717] dark:text-[#F8F7F2]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D6CE] dark:border-[#33322D]">
          <h3 className="font-editorial-heading text-2xl font-bold">{t.keyboardShortcuts}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#77756F] dark:text-[#88867F] hover:text-[#171717] dark:hover:text-[#F8F7F2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-[#77756F] dark:text-[#88867F] leading-relaxed">
          {t.shortcutsModalDesc}
        </p>

        <div className="mt-4 divide-y divide-[#D8D6CE] dark:divide-[#33322D]">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2.5">
              <span className="text-sm font-sans text-[#171717] dark:text-[#F8F7F2]">{item.desc}</span>
              <kbd className="px-2.5 py-1 bg-[#F0EFE9] dark:bg-[#252522] border border-[#D8D6CE] dark:border-[#33322D] font-mono text-xs text-[#171717] dark:text-[#F8F7F2]">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-[#D8D6CE] dark:border-[#33322D] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#171717] dark:bg-[#F8F7F2] text-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
