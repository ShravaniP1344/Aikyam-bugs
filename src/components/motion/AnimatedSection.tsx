import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AnimatedSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export const AnimatedSection = ({ children, id, className = '' }: AnimatedSectionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <motion.section
      id={id}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={prefersReducedMotion ? false : { opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
