import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
      <div
        className="w-full max-w-md bg-[#F8F7F2] border border-[#171717] p-6 shadow-md transition-all text-[#171717]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="flex items-start gap-3 mb-3">
          {isDestructive && (
            <AlertCircle className="w-5 h-5 text-[#171717] mt-0.5 shrink-0" />
          )}
          <div>
            <h3 id="modal-headline" className="font-editorial-heading text-xl font-bold tracking-tight text-[#171717]">
              {title}
            </h3>
            <p className="mt-2 text-sm text-[#77756F] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#D8D6CE]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 border border-[#D8D6CE] text-xs font-mono uppercase tracking-wider text-[#171717] hover:bg-[#F0EFE9] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              isDestructive
                ? 'bg-[#171717] text-[#F8F7F2] hover:bg-black'
                : 'bg-[#171717] text-[#F8F7F2] hover:bg-neutral-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
