import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { useTheme } from '../../hooks/useTheme';

interface NavbarProps {
  activeSection?: string;
}

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'Identity' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const;

export const Navbar = ({ activeSection = 'home' }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      setIsMenuOpen(false);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    const closeOnDesktop = () => {
      if (window.innerWidth > 1024) setIsMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);

    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, []);

  const isActive = (id: (typeof navItems)[number]['id']) => {
    if (id === 'home') return activeSection === 'home';
    if (id === 'about') return ['about', 'identity', 'problem', 'mission', 'philosophy'].includes(activeSection);
    if (id === 'services') return ['services', 'promise'].includes(activeSection);
    return activeSection === 'contact';
  };

  return (
    <header className="topbar">
      <button
        onClick={() => scrollToSection('home')}
        className="brand bg-transparent border-none text-left cursor-pointer p-0"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        aria-label="AIKYAM Home"
      >
        <img
          src="/assets/brand/aikyam-navbar-logo.png"
          alt=""
          className="aikyam-navbar-logo"
          aria-hidden="true"
        />
        <span className="brand-text">AIKYAM</span>
      </button>

      <nav className="nav-links" aria-label="Primary Navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={isActive(item.id) ? 'active' : ''}
            aria-current={isActive(item.id) ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="theme-toggle-icon" size={18} />
          ) : (
            <Moon className="theme-toggle-icon" size={18} />
          )}
        </button>

        <div className="desktop-nav-cta">
          <MagneticButton
            onClick={() => scrollToSection('contact')}
            variant="nav-cta"
          >
            Let’s Talk <span className="arrow">→</span>
          </MagneticButton>
        </div>

        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-navigation" className="mobile-nav-panel" aria-label="Mobile Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`mobile-nav-link ${isActive(item.id) ? 'active' : ''}`}
              aria-current={isActive(item.id) ? 'page' : undefined}
            >
              <span>{item.label}</span>
              <span aria-hidden="true">→</span>
            </button>
          ))}
          <button
            type="button"
            className="mobile-nav-contact"
            onClick={() => scrollToSection('contact')}
          >
            Start a Conversation <span aria-hidden="true">→</span>
          </button>
        </nav>
      )}
    </header>
  );
};
