interface SectionProgressNavProps {
  activeSection: string;
}

export const SectionProgressNav = ({ activeSection }: SectionProgressNavProps) => {
  const sections = [
    { id: 'home', label: 'Home', num: '00' },
    { id: 'about', label: 'Identity', num: '01' },
    { id: 'problem', label: 'Problem', num: '02' },
    { id: 'mission', label: 'Mission', num: '03' },
    { id: 'philosophy', label: 'Philosophy', num: '04' },
    { id: 'services', label: 'Services', num: '05' },
    { id: 'promise', label: 'Promise', num: '06' },
    { id: 'contact', label: 'Contact', num: '07' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="progress-nav" aria-label="Page Progress Indicator">
      {sections.map((sec) => (
        <button
          key={sec.id}
          className={`progress-item ${activeSection === sec.id ? 'active' : ''}`}
          onClick={() => scrollToSection(sec.id)}
          data-section={sec.id}
        >
          <span className="dot" aria-hidden="true" />
          <span className="progress-label">
            {sec.num} • {sec.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
