import { useRef } from 'react';

export const useMagnetic = () => {
  const ref = useRef<HTMLElement | null>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--local-x', `${x}px`);
    el.style.setProperty('--local-y', `${y}px`);
    el.style.transform = `translate(${(x - r.width / 2) * 0.08}px, ${(y - r.height / 2) * 0.12}px)`;
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = '';
    }
  };

  return { ref, onPointerMove, onPointerLeave };
};

export const useTilt = () => {
  const ref = useRef<HTMLElement | null>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || window.innerWidth < 760) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--local-x', `${px * 100}%`);
    el.style.setProperty('--local-y', `${py * 100}%`);

    const rx = (py - 0.5) * -5;
    const ry = (px - 0.5) * 6;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = '';
    }
  };

  return { ref, onPointerMove, onPointerLeave };
};
