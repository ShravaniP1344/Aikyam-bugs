import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { servicesData } from '../../data/servicesData';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Custom impact statements for each capability chapter to enhance storytelling
const CAPABILITY_IMPACT_STATEMENTS: Record<string, string> = {
  'Artificial Intelligence Solutions':
    'Turning autonomous intelligence into measurable enterprise value.',
  'Intelligent Automation':
    'Eliminating operational friction with self-correcting workflows.',
  'Custom Software Development':
    'Architecting resilient, API-first software built for extreme scale.',
  'Cloud & DevOps Services':
    'Engineering continuous delivery across high-availability cloud systems.',
  'Cybersecurity & Compliance':
    'Embedding zero-trust security and proactive compliance by design.',
  'Data & Analytics':
    'Transforming fragmented data into real-time decision intelligence.',
  'Digital Transformation Consulting':
    'Modernizing legacy architecture into future-ready enterprise platforms.',
  'Managed IT Services':
    'Ensuring zero-downtime reliability with proactive infrastructure support.',
  'Emerging Technologies':
    'Pioneering edge, IoT, and next-generation enterprise innovation.',
  'AI Training & Workforce Enablement':
    'Empowering human talent with practical AI fluency and leadership.',
};

// Section Header Animations
const labelVariant: Variants = {
  hidden: { opacity: 0, y: 12, letterSpacing: '0.12em' },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0.24em',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const titleVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] },
  },
};

const copyVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
  },
};

// Chapter Heading & Statement Animations
const chapterTitleVariant: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const chapterParagraphVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const keywordContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const keywordItemVariant: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.92, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const impactStatementVariant: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Interactive Particle & Network Background Component
 */
interface NetworkCanvasProps {
  activeCapabilityIndex: number;
  mousePos: { x: number; y: number };
  prefersReducedMotion: boolean;
}

const NetworkCanvas = ({ activeCapabilityIndex, mousePos, prefersReducedMotion }: NetworkCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = prefersReducedMotion ? 18 : 36;
    const particles = Array.from({ length: particleCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.8 + 1,
      baseAlpha: Math.random() * 0.35 + 0.15,
      colorHue: i % 3 === 0 ? '#ffd700' : '#72d7ff',
    }));

    let currentMouseX = mousePos.x;
    let currentMouseY = mousePos.y;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      currentMouseX += (mousePos.x - currentMouseX) * 0.05;
      currentMouseY += (mousePos.y - currentMouseY) * 0.05;

      // Color accent based on active capability index
      const accentGlow = activeCapabilityIndex % 2 === 0 ? 'rgba(114, 215, 255, ' : 'rgba(255, 215, 0, ';

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (!prefersReducedMotion) {
          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;
        }

        const dxMouse = currentMouseX - p1.x;
        const dyMouse = currentMouseY - p1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const isHovered = distMouse < 180;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22 * (isHovered ? 1.6 : 1);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = accentGlow + `${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        const alpha = isHovered ? Math.min(p1.baseAlpha + 0.45, 0.9) : p1.baseAlpha;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, isHovered ? p1.radius * 1.5 : p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.colorHue;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeCapabilityIndex, mousePos, prefersReducedMotion]);

  return <canvas ref={canvasRef} className="capability-network-canvas" aria-hidden="true" />;
};

export const ServicesSection = () => {
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastInteractionTimeRef = useRef<number>(0);

  const isSectionInView = useInView(sectionRef, {
    margin: '0px 0px 180px 0px',
    once: true,
  });

  const activeService = servicesData[activeCapabilityIndex];

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveCapabilityIndex((prev) => (prev + 1) % servicesData.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveCapabilityIndex((prev) => (prev - 1 + servicesData.length) % servicesData.length);
  }, []);

  const selectService = useCallback(
    (index: number) => {
      if (index === activeCapabilityIndex) return;
      setDirection(index > activeCapabilityIndex ? 1 : -1);
      setActiveCapabilityIndex(index);
    },
    [activeCapabilityIndex]
  );

  const handleUserAction = useCallback(() => {
    lastInteractionTimeRef.current = Date.now();
  }, []);

  // Autoplay interval effect
  useEffect(() => {
    if (!isSectionInView || isPaused || isHovered || isFocused) {
      return;
    }

    const interval = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteractionTimeRef.current;
      // If user interacted recently (<14s ago), delay auto-advance
      if (timeSinceInteraction < 14000) {
        return;
      }
      goNext();
    }, 7000);

    return () => clearInterval(interval);
  }, [isSectionInView, isPaused, isHovered, isFocused, goNext]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  // Magnetic offset for keyword nodes relative to mouse
  const getMagneticOffset = (itemIndex: number) => {
    if (prefersReducedMotion || !cardRef.current) return { x: 0, y: 0 };

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (mousePos.x - centerX) * 0.015 * (1 + (itemIndex % 3) * 0.2);
    const deltaY = (mousePos.y - centerY) * 0.015 * (1 + (itemIndex % 2) * 0.2);

    const clampedX = Math.max(-8, Math.min(8, deltaX));
    const clampedY = Math.max(-8, Math.min(8, deltaY));

    return { x: clampedX, y: clampedY };
  };

  const impactStatement =
    CAPABILITY_IMPACT_STATEMENTS[activeService.title] ||
    'Transforming enterprise operations through intelligent engineering.';

  // Carousel card Motion Variants
  const carouselCardVariants: Variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? 32 : -32,
      scale: prefersReducedMotion ? 1 : 0.985,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(4px)',
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? -32 : 32,
      scale: prefersReducedMotion ? 1 : 0.985,
      filter: prefersReducedMotion ? 'blur(0px)' : 'blur(4px)',
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="services"
      data-label="Services"
      className="capability-journey-section"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Background Interactive Particle Network */}
      <NetworkCanvas
        activeCapabilityIndex={activeCapabilityIndex}
        mousePos={mousePos}
        prefersReducedMotion={prefersReducedMotion}
      />

      <div className="capability-journey-container">
        {/* SECTION HEADER */}
        <div className="capability-journey-header">
          <motion.span
            className="capability-kicker"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px 180px 0px' }}
            variants={labelVariant}
          >
            OUR CAPABILITIES
          </motion.span>

          <motion.h2
            className="capability-main-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px 180px 0px' }}
            variants={titleVariant}
          >
            Intelligent solutions built for transformation.
          </motion.h2>

          <motion.p
            className="capability-header-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px 180px 0px' }}
            variants={copyVariant}
          >
            Select a capability and discover how AIKYAM helps businesses transform through intelligent technology.
          </motion.p>
        </div>

        {/* JOURNEY CONTENT LAYOUT */}
        <div className="capability-journey-layout">
          {/* DESKTOP STICKY INDEX TRACK */}
          <aside className="capability-sticky-index" aria-label="Capabilities index">
            <div className="index-track-inner">
              <span className="index-track-title">CAPABILITY CHAPTERS</span>
              <div className="index-buttons-list" role="tablist" aria-label="Services List">
                {servicesData.map((service, idx) => {
                  const isActive = idx === activeCapabilityIndex;
                  return (
                    <button
                      key={service.title}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`View ${service.title}`}
                      className={`index-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        handleUserAction();
                        selectService(idx);
                      }}
                    >
                      <span className="nav-item-num">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="nav-item-title">{service.title}</span>
                      {isActive && (
                        <motion.span
                          className="nav-active-indicator"
                          layoutId="activeNavIndicator"
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CAPABILITY CAROUSEL VIEWPORT */}
          <div className="capability-carousel-viewport" ref={cardRef}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.article
                key={activeCapabilityIndex}
                custom={direction}
                variants={carouselCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="capability-chapter-card active-chapter carousel-active-card"
              >
                {/* Header Meta & Controls Row */}
                <div className="chapter-meta-row">
                  <span className="chapter-index-badge">
                    {String(activeCapabilityIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="chapter-label-line" aria-hidden="true" />

                  <span className="carousel-counter-tag">
                    {String(activeCapabilityIndex + 1).padStart(2, '0')} /{' '}
                    {String(servicesData.length).padStart(2, '0')}
                  </span>

                  {/* Carousel Controls */}
                  <div className="carousel-action-controls">
                    <button
                      type="button"
                      className="carousel-ctrl-btn"
                      aria-label="Previous service"
                      onClick={() => {
                        handleUserAction();
                        goPrev();
                      }}
                    >
                      <ChevronLeft className="ctrl-icon" />
                    </button>

                    <button
                      type="button"
                      className="carousel-ctrl-btn"
                      aria-label={isPaused ? 'Play service carousel' : 'Pause service carousel'}
                      onClick={() => {
                        handleUserAction();
                        setIsPaused((prev) => !prev);
                      }}
                    >
                      {isPaused ? <Play className="ctrl-icon" /> : <Pause className="ctrl-icon" />}
                    </button>

                    <button
                      type="button"
                      className="carousel-ctrl-btn"
                      aria-label="Next service"
                      onClick={() => {
                        handleUserAction();
                        goNext();
                      }}
                    >
                      <ChevronRight className="ctrl-icon" />
                    </button>
                  </div>
                </div>

                {/* Service Title */}
                <motion.h3
                  className="chapter-title"
                  initial="hidden"
                  animate="visible"
                  variants={chapterTitleVariant}
                >
                  {activeService.title}
                </motion.h3>

                {/* Service Description */}
                <motion.p
                  className="chapter-description"
                  initial="hidden"
                  animate="visible"
                  variants={chapterParagraphVariant}
                >
                  {activeService.short}
                </motion.p>

                {/* Constellation Keywords Grid */}
                <motion.div
                  className="chapter-keywords-constellation"
                  initial="hidden"
                  animate="visible"
                  variants={keywordContainerVariant}
                >
                  {activeService.items.map((keyword, kIdx) => {
                    const offset = getMagneticOffset(kIdx);

                    return (
                      <motion.div
                        key={keyword}
                        className="constellation-keyword-node"
                        variants={keywordItemVariant}
                        animate={{
                          x: offset.x,
                          y: offset.y,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 150,
                          damping: 15,
                          mass: 0.2,
                        }}
                      >
                        <span className="keyword-node-star" aria-hidden="true" />
                        <span className="keyword-node-text">{keyword}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Impact Statement */}
                <motion.div
                  className="chapter-impact-statement"
                  initial="hidden"
                  animate="visible"
                  variants={impactStatementVariant}
                >
                  <span className="impact-accent-dot" />
                  <p className="impact-text">"{impactStatement}"</p>
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM ENDING STATEMENT */}
        <div className="capability-ending-stage">
          <motion.div
            className="ending-statement-box"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px 180px 0px' }}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <p className="capability-ending-headline">
              Every capability.
              <span className="ending-highlight"> One intelligent ecosystem.</span>
            </p>
            <motion.div
              className="capability-ending-glowline"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px 180px 0px' }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
