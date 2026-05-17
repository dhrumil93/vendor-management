import { useRef, useEffect, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../Button';
import type { ModalProps } from './Modal.types';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement;
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    firstFocusable?.focus();
    return () => {
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className={`relative bg-surface border border-border rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 id="modal-title" className="text-lg font-semibold text-text">
                {title}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

            {footer && (
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
