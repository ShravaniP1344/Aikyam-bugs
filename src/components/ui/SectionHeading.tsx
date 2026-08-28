import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
}

export const SectionHeading = ({ title, subtitle, align = 'left' }: SectionHeadingProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  const subtitleInitial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 };
  const titleInitial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 };
  const whileInViewAnim = { opacity: 1, y: 0 };

  return (
    <div className={`mb-16 ${alignClass}`}>
      {subtitle && (
        <motion.p
          initial={subtitleInitial}
          whileInView={whileInViewAnim}
          viewport={{ once: true, margin: '0px 0px 180px 0px' }}
          transition={{ duration: 0.4, delay: 0.04 }}
          className="text-cyan-400 font-medium tracking-widest uppercase mb-4"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        initial={titleInitial}
        whileInView={whileInViewAnim}
        viewport={{ once: true, margin: '0px 0px 180px 0px' }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold"
      >
        {title}
      </motion.h2>
    </div>
  );
};
