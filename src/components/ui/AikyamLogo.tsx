interface AikyamLogoProps {
  className?: string;
  size?: number;
}

export const AikyamLogo = ({ className = '', size = 38 }: AikyamLogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
      width={size}
      height={size}
      className={`aikyam-logo brand-logo-img rounded-full ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: 'block',
      }}
      aria-label="AIKYAM logo"
    >
      <defs>
        <radialGradient id="aikyamBgGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="45%">
          <stop offset="0%" stopColor="#041b4b" />
          <stop offset="55%" stopColor="#021033" />
          <stop offset="85%" stopColor="#010a21" />
          <stop offset="100%" stopColor="#000511" />
        </radialGradient>

        <linearGradient id="aikyamGoldMain" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" />
          <stop offset="20%" stopColor="#F7D872" />
          <stop offset="50%" stopColor="#E2A624" />
          <stop offset="80%" stopColor="#9E6C0C" />
          <stop offset="100%" stopColor="#FCE185" />
        </linearGradient>

        <linearGradient id="aikyamGoldHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#FFEBA3" />
          <stop offset="70%" stopColor="#DCA01C" />
          <stop offset="100%" stopColor="#885705" />
        </linearGradient>

        <linearGradient id="aikyamGoldDark" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6E4804" />
          <stop offset="40%" stopColor="#B88214" />
          <stop offset="100%" stopColor="#FDD968" />
        </linearGradient>

        <linearGradient id="aikyamCyanBeam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00d8ff" stopOpacity={0.2} />
          <stop offset="30%" stopColor="#00f0ff" stopOpacity={0.9} />
          <stop offset="85%" stopColor="#00f0ff" stopOpacity={1} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
        </linearGradient>

        <radialGradient id="aikyamCyanFlare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#66f3ff" />
          <stop offset="60%" stopColor="#00d8ff" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#0088ff" stopOpacity={0} />
        </radialGradient>

        <filter id="aikyamDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity={0.6} />
        </filter>

        <filter id="aikyamCyanGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="2" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="500" cy="500" r="490" fill="url(#aikyamBgGrad)" stroke="#021a48" strokeWidth={4} />

      <circle cx="500" cy="500" r="488" fill="none" stroke="url(#aikyamGoldMain)" strokeWidth={1.5} opacity={0.3} />

      <path d="M 286,270 A 224,224 0 0,1 714,270" fill="none" stroke="url(#aikyamGoldMain)" strokeWidth={10} strokeLinecap="round" filter="url(#aikyamDropShadow)" />

      <g filter="url(#aikyamDropShadow)">
        <path d="M 470,580 C 400,500 240,400 172,120 C 220,200 320,300 450,440 Z" fill="url(#aikyamGoldHighlight)" />
        <path d="M 470,600 C 370,530 200,430 150,250 C 210,320 310,430 440,510 Z" fill="url(#aikyamGoldMain)" />
        <path d="M 465,620 C 350,570 210,480 180,390 C 230,430 330,510 435,560 Z" fill="url(#aikyamGoldDark)" />
      </g>

      <g filter="url(#aikyamDropShadow)">
        <path d="M 530,580 C 600,500 760,400 828,120 C 780,200 680,300 550,440 Z" fill="url(#aikyamGoldHighlight)" />
        <path d="M 530,600 C 630,530 800,430 850,250 C 790,320 690,430 560,510 Z" fill="url(#aikyamGoldMain)" />
        <path d="M 535,620 C 650,570 790,480 820,390 C 770,430 670,510 565,560 Z" fill="url(#aikyamGoldDark)" />
      </g>

      <g filter="url(#aikyamDropShadow)">
        <path d="M 500,255 C 470,285 430,325 450,380 C 470,430 488,520 488,760 C 488,760 500,740 512,760 C 512,520 530,430 550,380 C 570,325 530,285 500,255 Z" fill="url(#aikyamGoldHighlight)" />
        <path d="M 500,255 C 480,265 430,255 430,255 C 460,280 485,305 500,320 C 525,295 565,285 594,338 C 580,310 550,295 520,295 C 508,295 500,275 500,255 Z" fill="url(#aikyamGoldMain)" />
        <path d="M 500,255 C 475,225 430,250 430,250 C 455,250 485,240 500,255 Z" fill="url(#aikyamGoldHighlight)" />
        <path d="M 570,322 L 594,338 L 565,340 Z" fill="#FFF2B2" />
      </g>

      <g stroke="url(#aikyamGoldMain)" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#aikyamDropShadow)">
        <path d="M 180,440 C 190,470 210,510 214,530" strokeWidth={5} />
        <path d="M 820,440 C 810,470 790,510 786,530" strokeWidth={5} />
        <path d="M 220,560 L 280,560 L 320,610 L 410,610" />
        <path d="M 296,650 L 370,650 L 410,700 L 434,700 L 434,860" />
        <path d="M 334,696 L 390,696 L 418,730 L 452,730 L 452,880" />
        <path d="M 404,780 L 470,780 L 470,890" />
        <path d="M 780,560 L 720,560 L 680,610 L 590,610" />
        <path d="M 690,690 L 620,690 L 592,650 L 566,650 L 566,850" />
        <path d="M 666,780 L 610,780 L 590,750 L 548,750 L 548,890" />
        <path d="M 590,860 L 530,860 L 530,890" />
      </g>

      <g fill="url(#aikyamGoldHighlight)" filter="url(#aikyamDropShadow)">
        <circle cx={220} cy={560} r={11} />
        <circle cx={296} cy={650} r={11} />
        <circle cx={334} cy={696} r={11} />
        <circle cx={404} cy={780} r={11} />
        <circle cx={434} cy={860} r={10} />
        <circle cx={452} cy={880} r={10} />
        <circle cx={470} cy={890} r={10} />
        <circle cx={780} cy={560} r={11} />
        <circle cx={666} cy={780} r={11} />
        <circle cx={590} cy={860} r={10} />
        <circle cx={566} cy={850} r={10} />
        <circle cx={548} cy={890} r={10} />
        <circle cx={530} cy={890} r={10} />
        <circle cx={730} cy={650} r={12} fill="none" stroke="#00e5ff" strokeWidth={6} filter="url(#aikyamCyanGlow)" />
        <circle cx={730} cy={650} r={4} fill="#ffffff" />
      </g>

      <g filter="url(#aikyamCyanGlow)">
        <line x1={500} y1={540} x2={500} y2={920} stroke="#00d8ff" strokeWidth={12} opacity={0.6} />
        <line x1={500} y1={540} x2={500} y2={920} stroke="url(#aikyamCyanBeam)" strokeWidth={5} strokeLinecap="round" />
        <line x1={500} y1={540} x2={500} y2={920} stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
        <circle cx={500} cy={918} r={30} fill="url(#aikyamCyanFlare)" />
        <circle cx={500} cy={918} r={8} fill="#ffffff" />
        <ellipse cx={500} cy={918} rx={70} ry={3} fill="#ffffff" opacity={0.85} />
      </g>
    </svg>
  );
};


