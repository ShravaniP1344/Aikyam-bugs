import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  Variants,
} from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ChallengeData {
  id: string;
  number: string;
  title: string;
  statement: string;
}

const CHALLENGES: ChallengeData[] = [
  {
    id: '01',
    number: '01',
    title: 'Fragmented Intelligence',
    statement: 'Data is distributed across tools, teams, and business systems.',
  },
  {
    id: '02',
    number: '02',
    title: 'Operational Friction',
    statement: 'Manual workflows slow down growth and reduce operational agility.',
  },
  {
    id: '03',
    number: '03',
    title: 'Delayed Insight',
    statement: 'Decision-making often lacks real-time intelligence and actionable insight.',
  },
  {
    id: '04',
    number: '04',
    title: 'Responsible Scale',
    statement: 'Organizations need ethical, secure, explainable, and scalable AI adoption.',
  },
];

const headerLabelVariant: Variants = {
  hidden: { opacity: 0, y: 12, letterSpacing: '0.12em' },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0.22em',
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const headerTitleVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] },
  },
};

const leftChallengeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
    y: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const rightChallengeVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 24,
    y: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const challengeNodeVariants: Variants = {
  hidden: {
    opacity: 0.4,
    scale: 0.65,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface ProblemHeaderProps {
  prefersReducedMotion: boolean;
}

const ProblemHeader = ({ prefersReducedMotion }: ProblemHeaderProps) => {
  return (
    <div className="problem-header">
      <motion.span
        className="problem-kicker"
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px 180px 0px' }}
        variants={headerLabelVariant}
      >
        THE CHALLENGES WE SOLVE
      </motion.span>

      <motion.h2
        className="problem-title"
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px 180px 0px' }}
        variants={headerTitleVariant}
      >
        Where complexity becomes clarity.
      </motion.h2>
    </div>
  );
};

interface ChallengeItemProps {
  item: ChallengeData;
  index: number;
  prefersReducedMotion: boolean;
}

const ChallengeItem = ({ item, index, prefersReducedMotion }: ChallengeItemProps) => {
  const isRight = index % 2 === 1; // 01 & 03 on left, 02 & 04 on right
  const side = isRight ? 'right' : 'left';
  const challengeVariant = isRight ? rightChallengeVariants : leftChallengeVariants;

  return (
    <div className={`pathway-item ${isRight ? 'item-right' : 'item-left'}`}>
      {/* Central Node */}
      <motion.div
        className="pathway-node"
        variants={challengeNodeVariants}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{
          once: true,
          margin: '0px 0px 180px 0px',
        }}
      >
        <span className="node-dot" />
        <span className="node-ring" />
      </motion.div>

      {/* Challenge Content Statement */}
      <motion.article
        className={`pathway-content challenge-content challenge-content--${side}`}
        variants={challengeVariant}
        initial={prefersReducedMotion ? 'visible' : 'hidden'}
        whileInView="visible"
        viewport={{
          once: true,
          margin: '0px 0px 180px 0px',
        }}
      >
        <span className="challenge-num">{item.number}</span>
        <h3 className="challenge-title">{item.title}</h3>
        <p className="challenge-statement">{item.statement}</p>
      </motion.article>
    </div>
  );
};

export const ProblemSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 40%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.4,
  });

  const pathScaleY = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section id="problem" data-label="Problem" className="problem-pathway-section" ref={sectionRef}>
      <div className="problem-container">
        {/* SECTION INTRODUCTION */}
        <ProblemHeader prefersReducedMotion={prefersReducedMotion} />

        {/* CHALLENGE PATHWAY */}
        <div className="problem-pathway-body">
          {/* Central Vertical Luminous Track */}
          <div className="pathway-track-line" />
          <motion.div
            className="pathway-active-line"
            style={{
              scaleY: prefersReducedMotion ? 1 : pathScaleY,
            }}
          />

          {/* 4 Challenge Items */}
          <div className="pathway-items-list">
            {CHALLENGES.map((item, index) => (
              <ChallengeItem
                key={item.id}
                item={item}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
