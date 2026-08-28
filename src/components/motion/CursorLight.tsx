import React, { useEffect, useRef } from 'react';

export const CursorLight: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Disable on mobile/touch devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number | null = null;
    let isVisible = false;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible && orbRef.current) {
        isVisible = true;
        orbRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (orbRef.current) {
        orbRef.current.style.opacity = '0';
        isVisible = false;
      }
    };

    const animate = () => {
      // Smooth interpolation for subtle lag
      const lerpFactor = 0.12;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div
      ref={orbRef}
      className="ambient-cursor-glow"
      aria-hidden="true"
    />
  );
};
