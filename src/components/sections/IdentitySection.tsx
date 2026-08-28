import { motion } from 'framer-motion';
import { useTilt } from '../../hooks/useInteractionEffects';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface PrincipleCardProps {
  icon: string;
  title: string;
  description: string;
}

const PrincipleCard = ({ icon, title, description }: PrincipleCardProps) => {
  const { ref, onPointerMove, onPointerLeave } = useTilt();

  return (
    <article
      ref={ref as React.RefObject<HTMLDivElement>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="identity-card"
    >
      <div className="icon-pill">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const IdentitySection = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const revealVariant = {
    hidden: prefersReducedMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const containerStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const earlyViewport = { once: true, margin: '0px 0px 180px 0px' };

  return (
    <section id="about" data-label="Identity" className="identity-section identity-story">
      <div className="identity-natural-container">
        <div className="identity-content-wrap">
          {/* STAGE 1: WHO WE ARE */}
          <motion.div
            className="identity-kicker-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={earlyViewport}
            variants={revealVariant}
          >
            <span className="identity-kicker">WHO WE ARE</span>
          </motion.div>

          {/* STAGE 2: COMPANY DESCRIPTION */}
          <motion.div
            className="identity-flow-block identity-description-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={earlyViewport}
            variants={containerStagger}
          >
            <motion.p className="identity-description" variants={containerStagger}>
              <motion.span className="desc-group" variants={revealVariant}>
                AIKYAM is a next-generation technology company committed to transforming businesses through Artificial Intelligence, intelligent automation, and innovative digital solutions.{' '}
              </motion.span>
              <motion.span className="desc-group" variants={revealVariant}>
                Derived from the Sanskrit word “ऐक्यम्”, meaning Oneness, Unity, and Harmony,{' '}
              </motion.span>
              <motion.span className="desc-group" variants={revealVariant}>
                AIKYAM reflects the belief that true innovation happens when technology, people, and business goals work together seamlessly.
              </motion.span>
            </motion.p>
          </motion.div>

          {/* STAGE 3: QUOTED STATEMENT */}
          <motion.div
            className="identity-flow-block identity-quote-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={earlyViewport}
            variants={containerStagger}
          >
            <motion.div className="identity-quote-statement" variants={containerStagger}>
              <span className="quote-mark">“</span>
              <motion.span className="quote-highlight" variants={containerStagger}>
                <motion.span className="quote-line" variants={revealVariant}>
                  Engineering oneness{' '}
                </motion.span>
                <motion.span className="quote-line" variants={revealVariant}>
                  between people,{' '}
                </motion.span>
                <motion.span className="quote-line" variants={revealVariant}>
                  technology, and business.
                </motion.span>
              </motion.span>
              <span className="quote-mark">”</span>
            </motion.div>
          </motion.div>

          {/* STAGE 4: PRINCIPLE CARDS */}
          <motion.div
            className="identity-flow-block identity-cards-wrapper"
            initial="hidden"
            whileInView="visible"
            viewport={earlyViewport}
            variants={containerStagger}
          >
            <motion.div className="identity-cards-grid" variants={containerStagger}>
              <motion.div variants={revealVariant}>
                <PrincipleCard
                  icon="◎"
                  title="Human-Centric"
                  description="Technology should empower people, strengthen collaboration, and unlock opportunities for growth."
                />
              </motion.div>
              <motion.div variants={revealVariant}>
                <PrincipleCard
                  icon="✦"
                  title="Secure & Scalable"
                  description="Solutions are designed to be future-ready, reliable, secure, and adaptable for evolving business needs."
                />
              </motion.div>
              <motion.div variants={revealVariant}>
                <PrincipleCard
                  icon="⌁"
                  title="Intelligent Automation"
                  description="AI-powered workflows reduce complexity, improve productivity, and create measurable outcomes."
                />
              </motion.div>
              <motion.div variants={revealVariant}>
                <PrincipleCard
                  icon="◈"
                  title="Business Value"
                  description="Every solution is focused on operational efficiency, better decisions, and sustainable transformation."
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
