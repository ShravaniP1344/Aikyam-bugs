import { ReactNode, RefObject } from 'react';
import { useTilt } from '../../hooks/useInteractionEffects';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delayClass?: string;
}

export const GlassCard = ({ children, className = '', delayClass = '' }: GlassCardProps) => {
  const { ref, onPointerMove, onPointerLeave } = useTilt();

  return (
    <article
      ref={ref as RefObject<HTMLElement | null>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`glass-card reveal ${delayClass} ${className}`}
    >
      {children}
    </article>
  );
};
