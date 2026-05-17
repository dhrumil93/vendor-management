import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { HoverPopoverProps } from './HoverPopover.types';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const HoverPopover = ({
  trigger,
  children,
  align = 'right',
  className = '',
  sideOffset = 8,
}: HoverPopoverProps) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      if (align === 'right') {
        setCoords({ top: rect.top, left: rect.right + sideOffset });
      } else if (align === 'bottom') {
        setCoords({ top: rect.bottom + sideOffset, left: rect.left });
      }
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="flex items-center justify-center w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="hover-popover"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  x: align === 'right' ? -6 : 0,
                  y: align === 'bottom' ? -6 : 0,
                }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: align === 'right' ? -6 : 0,
                  y: align === 'bottom' ? -6 : 0,
                }}
                transition={{ duration: 0.15, ease: EASE }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  originX: align === 'right' ? 0 : 0.5,
                  originY: align === 'bottom' ? 0 : 0.5,
                }}
                className={[
                  'z-[9999] min-w-max',
                  'bg-surface-raised border border-border-dark rounded-xl shadow-xl overflow-hidden py-1',
                  className,
                ].join(' ')}
              >
                {align === 'right' && (
                  <div
                    className="absolute top-0 bg-transparent"
                    style={{ left: -sideOffset, width: sideOffset, height: '100%' }}
                  />
                )}
                {align === 'bottom' && (
                  <div
                    className="absolute left-0 bg-transparent"
                    style={{ top: -sideOffset, height: sideOffset, width: '100%' }}
                  />
                )}

                {children}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
