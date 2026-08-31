import { GlassCard } from '../ui/GlassCard';

export const PhilosophySection = () => {
  return (
    <section id="philosophy" data-label="Philosophy">
      <div className="container section-shell reveal">
        <div className="section-head">
          <div>
            <span className="section-kicker">Our Philosophy</span>
            <h2 className="section-title">AI should amplify human intelligence, not replace it.</h2>
          </div>
          <p className="section-copy">
            At AIKYAM, we believe the future belongs to organizations where human ingenuity and Artificial Intelligence work together as one. When technology understands people, learns continuously, and acts with purpose, it unlocks possibilities once thought unimaginable.
          </p>
        </div>
        <div className="grid-3">
          <GlassCard className="principle-card" delayClass="reveal">
            <span className="num">01</span>
            <h3>Human-Centered Intelligence</h3>
            <p>Design AI solutions that augment human capabilities, enhance creativity, improve decisions, and create meaningful experiences.</p>
          </GlassCard>
          <GlassCard className="principle-card" delayClass="delay-1">
            <span className="num">02</span>
            <h3>Trusted AI by Design</h3>
            <p>Build with security, privacy, transparency, ethical AI, explainability, and responsible decision-making at the core.</p>
          </GlassCard>
          <GlassCard className="principle-card" delayClass="delay-2">
            <span className="num">03</span>
            <h3>Innovation Without Boundaries</h3>
            <p>Use emerging technologies, continuous experimentation, and bold thinking to solve complex challenges.</p>
          </GlassCard>
          <GlassCard className="principle-card" delayClass="reveal">
            <span className="num">04</span>
            <h3>Intelligence Through Unity</h3>
            <p>Bring together people, data, technology, and business expertise to create connected intelligence.</p>
          </GlassCard>
          <GlassCard className="principle-card" delayClass="delay-1">
            <span className="num">05</span>
            <h3>Continuous Evolution</h3>
            <p>Keep learning, researching, and improving so solutions remain intelligent, relevant, and future-ready.</p>
          </GlassCard>
          <GlassCard className="principle-card" delayClass="delay-2">
            <span className="num">06</span>
            <h3>Purposeful Impact</h3>
            <p>Every algorithm has a purpose. Every innovation solves a real problem. Every solution strengthens connection.</p>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};
