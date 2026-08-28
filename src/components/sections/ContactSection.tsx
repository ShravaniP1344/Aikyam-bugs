import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { MagneticButton } from '../ui/MagneticButton';
import { Phone, Mail, MapPin, CheckCircle2, AlertCircle, ArrowRight, LoaderCircle } from 'lucide-react';

const kickerVariant: Variants = {
  hidden: { opacity: 0, y: 12, letterSpacing: '0.12em' },
  visible: {
    opacity: 1,
    y: 0,
    letterSpacing: '0.24em',
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const headingVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.04, ease: [0.22, 1, 0.36, 1] },
  },
};

const messageVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
  },
};

const methodListVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const methodCardVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const formContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
};

const formFieldVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  companyWebsite: string;
};

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  companyWebsite: '',
};

export const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || 'We could not send your message. Please try again.');
      }

      setSubmitted(true);
      setFormData(initialFormData);
      window.setTimeout(() => setSubmitted(false), 6000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not send your message. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" data-label="Contact">
      <div className="container section-shell">
        <div className="section-head">
          <div>
            <motion.span
              className="section-kicker"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px 180px 0px' }}
              variants={kickerVariant}
            >
              LET'S BUILD TOGETHER
            </motion.span>
            <motion.h2
              className="section-title"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px 180px 0px' }}
              variants={headingVariant}
            >
              Let's build
              <br />
              intelligence that lasts.
            </motion.h2>
          </div>

          <motion.div
            className="section-copy text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '0px 0px 180px 0px' }}
            variants={messageVariant}
          >
            <p className="font-semibold text-white dark:text-white light:text-slate-900 text-base leading-relaxed mb-1">
              Every transformation begins with a conversation.
            </p>
            <p className="text-cyan-400 dark:text-cyan-300 light:text-sky-700 font-medium">
              Let's explore what's possible.
            </p>
          </motion.div>
        </div>

        <div className="contact-grid">
          <div>
            <motion.div
              className="contact-methods text-medium"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px 180px 0px' }}
              variants={methodListVariant}
            >
              <motion.a className="contact-method" variants={methodCardVariant} href="tel:+919591491155">
                <div className="icon-pill text-[#72d7ff] p-3 rounded-full bg-[rgba(114,215,255,0.08)] border border-[rgba(114,215,255,0.18)]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xs uppercase tracking-widest text-[#72d7ff] opacity-90 mb-1">PHONE</b>
                  <span className="text-sm font-semibold text-white block">+91 97307 32164</span>
                </div>
              </motion.a>

              <motion.a className="contact-method" variants={methodCardVariant} href="mailto:info@aikyam.co">
                <div className="icon-pill text-[#72d7ff] p-3 rounded-full bg-[rgba(114,215,255,0.08)] border border-[rgba(114,215,255,0.18)]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xs uppercase tracking-widest text-[#72d7ff] opacity-90 mb-1">EMAIL</b>
                  <span className="text-sm font-semibold text-white block">business@aikyamaisystem.com</span>
                </div>
              </motion.a>

              <motion.div className="contact-method" variants={methodCardVariant}>
                <div className="icon-pill text-[#72d7ff] p-3 rounded-full bg-[rgba(114,215,255,0.08)] border border-[rgba(114,215,255,0.18)]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xs uppercase tracking-widest text-[#72d7ff] opacity-90 mb-1">OFFICE</b>
                  <span className="text-sm font-semibold text-white block">Pune, Maharashtra</span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card flex flex-col justify-center items-center text-center p-6 h-full min-h-[280px]"
                role="status"
                aria-live="polite"
              >
                <CheckCircle2 className="w-10 h-10 mb-4 text-[#72d7ff]" />
                <h3 className="text-lg font-bold mb-2 text-white">Message Sent Successfully!</h3>
                <p className="text-[#cfe6ff] max-w-md">
                  Thank you for reaching out. An AIKYAM representative will get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                className="contact-form"
                onSubmit={handleSubmit}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '0px 0px 180px 0px' }}
                variants={formContainerVariant}
              >
                <div className="contact-honeypot" aria-hidden="true">
                  <label htmlFor="companyWebsite">Company website</label>
                  <input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  />
                </div>

                <motion.div variants={formFieldVariant}>
                  <label className="sr-only" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className="field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                    maxLength={120}
                    required
                  />
                </motion.div>

                <motion.div variants={formFieldVariant}>
                  <label className="sr-only" htmlFor="contact-email">Work Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Work Email"
                    className="field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    required
                  />
                </motion.div>

                <motion.div variants={formFieldVariant} style={{ gridColumn: '1 / -1' }}>
                  <label className="sr-only" htmlFor="contact-subject">What would you like to build?</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="What would you like to build?"
                    className="field"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    maxLength={180}
                    required
                  />
                </motion.div>

                <motion.div variants={formFieldVariant} style={{ gridColumn: '1 / -1' }}>
                  <label className="sr-only" htmlFor="contact-message">Tell us about your goals, challenges, or ideas</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us about your goals, challenges, or ideas..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    maxLength={5000}
                    required
                  />
                </motion.div>

                {errorMessage && (
                  <motion.div
                    className="contact-form-error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    aria-live="assertive"
                  >
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                <motion.div className="form-actions" variants={formFieldVariant}>
                  <MagneticButton type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        Sending <LoaderCircle className="w-4 h-4 inline-block ml-1 contact-submit-spinner" />
                      </>
                    ) : (
                      <>
                        Start the Conversation <ArrowRight className="w-4 h-4 inline-block ml-1" />
                      </>
                    )}
                  </MagneticButton>
                </motion.div>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
