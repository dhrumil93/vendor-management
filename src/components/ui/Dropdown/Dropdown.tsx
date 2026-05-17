import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { DropdownProps } from './Dropdown.types';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const Dropdown = ({ trigger, children, align = 'right', className = '' }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen((p) => !p)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setOpen((p) => !p);
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown-panel"
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{ originX: align === 'right' ? 1 : 0, originY: 0 }}
            className={[
              'absolute top-full mt-2 z-50 min-w-max',
              'bg-surface border border-border rounded-xl shadow-2xl overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0',
              className,
            ].join(' ')}
            onClick={() => setOpen(false)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
