import { motion } from 'framer-motion';
import type { PageTransitionProps } from './PageTransition.types';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.2, ease: EASE }}
    className="h-full"
  >
    {children}
  </motion.div>
);
