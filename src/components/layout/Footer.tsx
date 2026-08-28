import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Identity', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
] as const;

const serviceLinks = [
  'Artificial Intelligence Solutions',
  'Intelligent Automation',
  'Custom Software Development',
  'Cloud & DevOps Services',
  'Cybersecurity & Compliance',
  'Data & Analytics',
] as const;

// Social links temporarily disabled until official company pages are live
const socialLinks: readonly { label: string; href: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }> }[] = [
  // {
  //   label: 'LinkedIn',
  //   href: 'https://www.linkedin.com/',
  //   icon: Linkedin,
  // },
  // {
  //   label: 'Instagram',
  //   href: 'https://www.instagram.com/',
  //   icon: Instagram,
  // },
];

const contactItems = [
  {
    icon: MapPin,
    label: 'Location',
    value: 'Pune, Maharashtra',
    href: undefined,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 97307 32164',
    href: 'tel:+919730732164',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'business@aikyamaisystem.com',
    href: 'mailto:business@aikyamaisystem.com',
  },
  {
    icon: Globe,
    label: 'Website',
    value: 'aikyam.co',
    href: 'https://aikyam.co',
  },
] as const;

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        {/* Column 1: Brand & Socials */}
        <div className="footer-brand-column">
          <a className="footer-brand" href="#home" aria-label="AIKYAM home">
            <img
              src="/assets/brand/aikyam-navbar-logo.png"
              alt=""
              className="footer-brand-logo"
              aria-hidden="true"
            />
            <span className="footer-brand-name">AIKYAM</span>
          </a>
          <p className="footer-brand-copy">
            AI-powered software, automation and intelligent systems built for scalable business growth.
          </p>

          {socialLinks.length > 0 && (
            <div className="footer-social-group" aria-label="Social media links">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="footer-social-btn"
                    aria-label={`Visit AIKYAM on ${social.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent size={16} strokeWidth={1.8} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 2: Quick Links */}
        <nav className="footer-nav-column" aria-label="Quick links">
          <h2 className="footer-column-title">Quick Links</h2>
          <ul className="footer-link-list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 3: Services */}
        <nav className="footer-nav-column" aria-label="Services links">
          <h2 className="footer-column-title">Services</h2>
          <ul className="footer-link-list">
            {serviceLinks.map((service) => (
              <li key={service}>
                <a href="#services" aria-label={`${service} section`}>
                  {service}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Column 4: Contact & Location */}
        <div className="footer-nav-column" aria-label="Contact information">
          <h2 className="footer-column-title">Contact</h2>
          <ul className="footer-contact-list">
            {contactItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.label} className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <IconComponent size={15} strokeWidth={1.8} />
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="footer-contact-link"
                      {...(item.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="footer-contact-text">{item.value}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-row">
          <p className="footer-copyright">
            © {new Date().getFullYear()} AIKYAM. All rights reserved.
          </p>
          <p className="footer-tagline">
            Intelligent Systems • Scalable Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};

