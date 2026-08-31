import { useEffect, useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ParticleBackground } from '../components/motion/ParticleBackground';
import { SectionProgressNav } from '../components/motion/SectionProgressNav';
import { HeroSection } from '../components/sections/HeroSection';
import { IdentitySection } from '../components/sections/IdentitySection';
import { ProblemSection } from '../components/sections/ProblemSection';
import { MissionVisionSection } from '../components/sections/MissionVisionSection';
import { PhilosophySection } from '../components/sections/PhilosophySection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { PromiseSection } from '../components/sections/PromiseSection';
import { ContactSection } from '../components/sections/ContactSection';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // 1. Pointer move tracking for mouse gradients and cursor-orb
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 4;
    let rafId: number | null = null;

    const updateMouse = () => {
      document.documentElement.style.setProperty('--mx', `${mouseX}px`);
      document.documentElement.style.setProperty('--my', `${mouseY}px`);
      rafId = null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(updateMouse);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    // 2. IntersectionObserver for reveal effects - early trigger before visible viewport
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px 180px 0px' }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 180) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });

    // 3. IntersectionObserver for active section progress indicator
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2, rootMargin: '-15% 0px -45% 0px' }
    );

    const sectionIds = ['home', 'about', 'problem', 'mission', 'philosophy', 'services', 'promise', 'contact'];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // 4. Hash change listener for direct navigation & back/forward buttons
    const handleHashChange = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      if (rawHash) {
        let el = document.getElementById(rawHash);
        if (!el && (rawHash.startsWith('service-') || [
          'artificial-intelligence-solutions',
          'intelligent-automation',
          'custom-software-development',
          'cloud-devops-services',
          'cybersecurity-compliance',
          'data-analytics',
        ].includes(rawHash))) {
          el = document.getElementById('services');
        }
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    if (window.location.hash) {
      setTimeout(handleHashChange, 100);
    }

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('hashchange', handleHashChange);
      if (rafId !== null) cancelAnimationFrame(rafId);
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="cursor-orb" aria-hidden="true" />
      <ParticleBackground />
      <Navbar activeSection={activeSection} />
      <SectionProgressNav activeSection={activeSection} />
      <main>
        <HeroSection />
        <IdentitySection />
        <ProblemSection />
        <MissionVisionSection />
        <PhilosophySection />
        <ServicesSection />
        <PromiseSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
