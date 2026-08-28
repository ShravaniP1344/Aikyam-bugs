import React from 'react';

interface Hero3DLogoProps {
  size?: number;
  className?: string;
}

export const Hero3DLogo: React.FC<Hero3DLogoProps> = ({ size = 320, className = '' }) => {
  return (
    <div
      className={`hero-3d-logo-container relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '1200px',
      }}
    >
      {/* Background radial glow that guarantees persistent visibility */}
      <div className="absolute inset-0 rounded-full bg-radial from-cyan-500/25 via-blue-600/10 to-transparent blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute inset-4 rounded-full bg-radial from-amber-400/20 via-yellow-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Rotating Outer Cyber Orbital Ring */}
      <div
        className="absolute inset-0 rounded-full border border-cyan-400/30 shadow-[0_0_30px_rgba(0,229,255,0.2)] pointer-events-none"
        style={{
          animation: 'rotateOrbit 28s linear infinite',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#00e5ff]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]" />
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300" />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-300" />
      </div>

      {/* Inner Counter-Rotating Ring */}
      <div
        className="absolute inset-8 rounded-full border border-dashed border-amber-400/25 pointer-events-none"
        style={{
          animation: 'rotateOrbitReverse 20s linear infinite',
        }}
      />

      {/* Main 3D Rotating Aikyam Phoenix Emblem */}
      <div
        className="hero-3d-emblem-wrap w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          animation: 'rotate3DLogo 18s ease-in-out infinite',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 1000"
          className="w-full h-full drop-shadow-[0_10px_35px_rgba(0,216,255,0.4)]"
          aria-label="AIKYAM 3D Emblem"
        >
          <defs>
            <radialGradient id="h3dBgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#041c4d" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#021033" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000617" stopOpacity="0.7" />
            </radialGradient>

            <linearGradient id="h3dGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E0" />
              <stop offset="25%" stopColor="#F8DA75" />
              <stop offset="55%" stopColor="#E5A926" />
              <stop offset="85%" stopColor="#A06E0E" />
              <stop offset="100%" stopColor="#FDE38A" />
            </linearGradient>

            <linearGradient id="h3dGoldHighlight" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FFEEB2" />
              <stop offset="70%" stopColor="#E0A420" />
              <stop offset="100%" stopColor="#915C08" />
            </linearGradient>

            <linearGradient id="h3dGoldDark" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#734B05" />
              <stop offset="50%" stopColor="#BD8817" />
              <stop offset="100%" stopColor="#FEE073" />
            </linearGradient>

            <linearGradient id="h3dCyanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d8ff" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.95" />
              <stop offset="90%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>

            <filter id="h3dGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Emblem Background Plate */}
          <circle cx="500" cy="500" r="480" fill="url(#h3dBgGrad)" stroke="#00d8ff" strokeWidth="2" strokeOpacity="0.4" />
          <circle cx="500" cy="500" r="476" fill="none" stroke="url(#h3dGoldMain)" strokeWidth="1.5" strokeOpacity="0.35" />

          {/* Top Arch Halo */}
          <path d="M 286,270 A 224,224 0 0,1 714,270" fill="none" stroke="url(#h3dGoldMain)" strokeWidth="10" strokeLinecap="round" />

          {/* Left Wing Layers */}
          <g filter="url(#h3dGlow)">
            <path d="M 470,580 C 400,500 240,400 172,120 C 220,200 320,300 450,440 Z" fill="url(#h3dGoldHighlight)" />
            <path d="M 470,600 C 370,530 200,430 150,250 C 210,320 310,430 440,510 Z" fill="url(#h3dGoldMain)" />
            <path d="M 465,620 C 350,570 210,480 180,390 C 230,430 330,510 435,560 Z" fill="url(#h3dGoldDark)" />
          </g>

          {/* Right Wing Layers */}
          <g filter="url(#h3dGlow)">
            <path d="M 530,580 C 600,500 760,400 828,120 C 780,200 680,300 550,440 Z" fill="url(#h3dGoldHighlight)" />
            <path d="M 530,600 C 630,530 800,430 850,250 C 790,320 690,430 560,510 Z" fill="url(#h3dGoldMain)" />
            <path d="M 535,620 C 650,570 790,480 820,390 C 770,430 670,510 565,560 Z" fill="url(#h3dGoldDark)" />
          </g>

          {/* Phoenix Head and Crown */}
          <g filter="url(#h3dGlow)">
            <path d="M 500,255 C 470,285 430,325 450,380 C 470,430 488,520 488,760 C 488,760 500,740 512,760 C 512,520 530,430 550,380 C 570,325 530,285 500,255 Z" fill="url(#h3dGoldHighlight)" />
            <path d="M 500,255 C 480,265 430,255 430,255 C 460,280 485,305 500,320 C 525,295 565,285 594,338 C 580,310 550,295 520,295 C 508,295 500,275 500,255 Z" fill="url(#h3dGoldMain)" />
          </g>

          {/* Circuit Tech Grid Overlay */}
          <g stroke="url(#h3dGoldMain)" strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M 220,560 L 280,560 L 320,610 L 410,610" />
            <path d="M 296,650 L 370,650 L 410,700 L 434,700 L 434,860" />
            <path d="M 780,560 L 720,560 L 680,610 L 590,610" />
            <path d="M 690,690 L 620,690 L 592,650 L 566,650 L 566,850" />
          </g>

          {/* Node Light Points */}
          <g fill="url(#h3dGoldHighlight)">
            <circle cx="220" cy="560" r="12" />
            <circle cx="296" cy="650" r="12" />
            <circle cx="780" cy="560" r="12" />
            <circle cx="690" cy="690" r="12" />
          </g>

          {/* Central Cyan Beam */}
          <g filter="url(#h3dGlow)">
            <line x1="500" y1="540" x2="500" y2="920" stroke="#00f0ff" strokeWidth="10" opacity="0.8" />
            <line x1="500" y1="540" x2="500" y2="920" stroke="url(#h3dCyanBeam)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="500" cy="918" r="22" fill="#00f0ff" opacity="0.8" />
            <circle cx="500" cy="918" r="8" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </div>
  );
};
