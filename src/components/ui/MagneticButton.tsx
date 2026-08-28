import { ReactNode, RefObject } from 'react';
import { useMagnetic } from '../../hooks/useInteractionEffects';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'ghost' | 'nav-cta';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const MagneticButton = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  type,
  disabled,
}: MagneticButtonProps) => {
  const { ref, onPointerMove, onPointerLeave } = useMagnetic();

  const baseClass = {
    primary: 'btn primary',
    ghost: 'btn ghost',
    'nav-cta': 'nav-cta',
  }[variant];

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={`${baseClass} ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`${baseClass} ${className}`}
    >
      {children}
    </button>
  );
};
