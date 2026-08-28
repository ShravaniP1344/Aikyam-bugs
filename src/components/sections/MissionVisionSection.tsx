import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, Variants } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const SUPPORTING_STATEMENTS = [
  {
    num: '01',
    text: 'Innovative AI products that solve real-world business problems.',
  },
  {
    num: '02',
    text: 'Intelligent automation, data-driven decisions, and faster growth.',
  },
  {
    num: '03',
    text: 'Ethical, transparent, secure technology designed around people.',
  },
  {
    num: '04',
    text: 'Long-term partnerships based on trust and measurable value.',
  },
];

// Variants for Stage 1 (Header Label)
const stage1LabelVariant: Variants = {
  hidden: { opacity: 0, y: 12, letterSpacing: '0.12em' },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0.24em',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// Variants for Stage 3 (Vision & Mission Cards)
const visionSlideVariant: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const missionSlideVariant: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// Stage 4 Connection Line Variant
const connectionLineVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
  },
};

// Stage 6 Ending Statement Variant
const endingStatementVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
  },
};

// Stage 5 Principles Variants
const principlesContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
};

const principleItemVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * STAGE 1 & 2: Header Label + Statement Morphing
 */
interface StoryHeaderProps {
  prefersReducedMotion: boolean;
}

const StoryHeader = ({ prefersReducedMotion }: StoryHeaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    margin: '0px 0px 180px 0px',
    once: true,
  });

  const [statementIndex, setStatementIndex] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Sequence: Start at "We don't build software.", then transition to "We build intelligent systems people trust."
    const timer = setTimeout(() => {
      setStatementIndex(1);
    }, 1800);

    return () => clearTimeout(timer);
  }, [isInView]);

  const animateState = prefersReducedMotion ? 'visible' : isInView ? 'visible' : 'hidden';

  return (
    <div ref={containerRef} className="story-header-wrap" style={{ position: 'relative' }}>
      {/* Stage 1: Label */}
      <motion.span
        className="story-kicker-label"
        initial="hidden"
        animate={animateState}
        variants={stage1LabelVariant}
      >
        VISION • MISSION
      </motion.span>

      {/* Stage 2: Statement Morphing */}
      <div className="story-statement-stage">
        <AnimatePresence mode="wait">
          {statementIndex === 0 ? (
            <motion.p
              key="statement-1"
              className="story-morph-text text-dimmed"
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              We don't build software.
            </motion.p>
          ) : (
            <motion.p
              key="statement-2"
              className="story-morph-text text-highlight"
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              We build intelligent systems people trust.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/**
 * STAGE 3, 4 & 6: Vision & Mission Cards + Glowing Connection Line + Ending Statement
 */
interface StoryPanelsProps {
  prefersReducedMotion: boolean;
}

const StoryPanels = ({ prefersReducedMotion }: StoryPanelsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    margin: '0px 0px 180px 0px',
    once: true,
  });

  const animateState = prefersReducedMotion ? 'visible' : isInView ? 'visible' : 'hidden';

  return (
    <div ref={containerRef} className="story-panels-wrap" style={{ position: 'relative' }}>
      <div className="story-panels-grid">
        {/* LEFT: VISION CARD */}
        <motion.div
          className="story-panel vision-story-panel"
          initial="hidden"
          animate={animateState}
          variants={visionSlideVariant}
        >
          <div className="panel-badge-row">
            <span className="story-badge vision-badge">VISION</span>
            <span className="story-subhead">Where we are going.</span>
          </div>
          <p className="story-body-text">
            To become the world’s most trusted intelligence partner, where Artificial Intelligence, human creativity, and innovation unite to redefine how businesses operate, grow, and create value.
          </p>
        </motion.div>

        {/* STAGE 4: GLOWING CONNECTION LINE (DESKTOP / BETWEEN CARDS) */}
        <div className="story-connector-device" aria-hidden="true">
          <svg className="connector-svg" viewBox="0 0 160 120" fill="none">
            <motion.path
              d="M 10 60 C 50 60, 110 60, 150 60"
              stroke="url(#storyLineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              initial="hidden"
              animate={animateState}
              variants={connectionLineVariant}
            />
            <defs>
              <linearGradient id="storyLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#72d7ff" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#72d7ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          <motion.div
            className="connector-sparkle-wrapper"
            initial="hidden"
            animate={animateState}
            variants={{
              hidden: { opacity: 0, scale: 0 },
              visible: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.5 } },
            }}
          >
            <motion.svg
              className="connector-sparkle-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              animate={
                animateState === 'visible' && !prefersReducedMotion
                  ? { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }
                  : {}
              }
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path
                d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
                fill="url(#sparkleGrad)"
              />
              <defs>
                <radialGradient id="sparkleGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#b3ebff" />
                  <stop offset="100%" stopColor="#72d7ff" />
                </radialGradient>
              </defs>
            </motion.svg>
          </motion.div>
        </div>

        {/* RIGHT: MISSION CARD */}
        <motion.div
          className="story-panel mission-story-panel"
          initial="hidden"
          animate={animateState}
          variants={missionSlideVariant}
        >
          <div className="panel-badge-row">
            <span className="story-badge mission-badge">MISSION</span>
            <span className="story-subhead">How we move forward.</span>
          </div>
          <p className="story-body-text">
            To empower organizations with intelligent, secure, and scalable AI-driven solutions that transform ideas into measurable outcomes and challenges into opportunities.
          </p>
        </motion.div>
      </div>

      {/* STAGE 6: FINAL ENDING STATEMENT */}
      <motion.div
        className="story-ending-statement"
        initial="hidden"
        animate={animateState}
        variants={endingStatementVariant}
      >
        <span className="ending-dot" />
        <p className="ending-text">Turning vision into measurable impact.</p>
        <span className="ending-dot" />
      </motion.div>
    </div>
  );
};

/**
 * STAGE 5: Supporting Principles (120ms Staggered Slide Up)
 */
interface StoryPrinciplesProps {
  prefersReducedMotion: boolean;
}

const StoryPrinciples = ({ prefersReducedMotion }: StoryPrinciplesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, {
    margin: '0px 0px 180px 0px',
    once: true,
  });

  const animateState = prefersReducedMotion ? 'visible' : isInView ? 'visible' : 'hidden';

  return (
    <div ref={containerRef} className="story-principles-wrap" style={{ position: 'relative' }}>
      <motion.div
        className="story-principles-grid"
        initial="hidden"
        animate={animateState}
        variants={principlesContainerVariant}
      >
        {SUPPORTING_STATEMENTS.map((item) => (
          <motion.div
            key={item.num}
            className="story-principle-card"
            variants={principleItemVariant}
          >
            <div className="principle-card-header">
              <span className="principle-number">{item.num}</span>
              <span className="principle-glow-dot" />
            </div>
            <p className="principle-body">{item.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export const MissionVisionSection = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="mission" data-label="Mission" className="mission-story-section">
      <div className="mission-story-container">
        <StoryHeader prefersReducedMotion={prefersReducedMotion} />
        <StoryPanels prefersReducedMotion={prefersReducedMotion} />
        <StoryPrinciples prefersReducedMotion={prefersReducedMotion} />
      </div>
    </section>
  );
};
