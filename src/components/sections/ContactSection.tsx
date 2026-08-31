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

type FieldErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
  companyWebsite: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (field: keyof FieldErrors, value: string): string | undefined => {
  if (field === 'name') {
    if (!value.trim()) return 'Please enter your name.';
  } else if (field === 'email') {
    if (!value.trim()) return 'Please enter your email address.';
    if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.';
  } else if (field === 'subject') {
    if (!value.trim()) return 'Please enter what you would like to build.';
  } else if (field === 'message') {
    if (!value.trim()) return 'Please tell us about your goals, challenges, or ideas.';
    if (value.length > 500) return 'Maximum 500 characters allowed.';
  }
  return undefined;
};

const validateForm = (data: ContactFormData): FieldErrors => {
  const errors: FieldErrors = {};

  const nameError = validateField('name', data.name);
  if (nameError) errors.name = nameError;

  const emailError = validateField('email', data.email);
  if (emailError) errors.email = emailError;

  const subjectError = validateField('subject', data.subject);
  if (subjectError) errors.subject = subjectError;

  const messageError = validateField('message', data.message);
  if (messageError) errors.message = messageError;

  return errors;
};

export const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFieldChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const errorKey = field as keyof FieldErrors;
    if (fieldErrors[errorKey]) {
      const updatedError = validateField(errorKey, value);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (updatedError) {
          next[errorKey] = updatedError;
        } else {
          delete next[errorKey];
        }
        return next;
      });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 500);
    setFormData((prev) => ({ ...prev, message: value }));
    if (fieldErrors.message) {
      const updatedError = validateField('message', value);
      setFieldErrors((prev) => {
        const next = { ...prev };
        if (updatedError) {
          next.message = updatedError;
        } else {
          delete next.message;
        }
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage('');

      if (validationErrors.name) {
        document.getElementById('contact-name')?.focus();
      } else if (validationErrors.email) {
        document.getElementById('contact-email')?.focus();
      } else if (validationErrors.subject) {
        document.getElementById('contact-subject')?.focus();
      } else if (validationErrors.message) {
        document.getElementById('contact-message')?.focus();
      }
      return;
    }

    setFieldErrors({});
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
      setFieldErrors({});
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
      <div className="container section-shell contact-section-shell">
        <div className="contact-grid">
          {/* Left Column: Heading + Contact Methods */}
          <div className="contact-left-col">
            <div className="contact-heading-group">
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
              className="contact-methods text-medium"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px 180px 0px' }}
              variants={methodListVariant}
            >
              <motion.a className="contact-method" variants={methodCardVariant} href="tel:+919730732164">
                <div className="icon-pill text-[#72d7ff] p-3 rounded-full bg-[rgba(114,215,255,0.08)] border border-[rgba(114,215,255,0.18)]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <b className="text-xs uppercase tracking-widest text-[#72d7ff] opacity-90 mb-1">PHONE</b>
                  <span className="text-sm font-semibold text-white block">+91 97307 32164</span>
                </div>
              </motion.a>

              <motion.a className="contact-method" variants={methodCardVariant} href="mailto:business@aikyamaisystem.com">
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

          {/* Right Column: Intro Copy + Contact Form */}
          <div className="contact-right-col">
            <motion.div
              className="contact-intro-copy text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '0px 0px 180px 0px' }}
              variants={messageVariant}
            >
              <p className="contact-intro-heading font-semibold text-base leading-relaxed mb-1">
                Every transformation begins with a conversation.
              </p>
              <p className="contact-intro-subheading font-medium">
                Let's explore what's possible.
              </p>
            </motion.div>

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
                noValidate
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

                <motion.div variants={formFieldVariant} className="contact-field-group">
                  <label className="sr-only" htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className={`field ${fieldErrors.name ? 'field-error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    autoComplete="name"
                    maxLength={120}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                  />
                  {fieldErrors.name && (
                    <span id="contact-name-error" className="contact-field-error" role="alert">
                      {fieldErrors.name}
                    </span>
                  )}
                </motion.div>

                <motion.div variants={formFieldVariant} className="contact-field-group">
                  <label className="sr-only" htmlFor="contact-email">Work Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Work Email"
                    className={`field ${fieldErrors.email ? 'field-error' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    maxLength={254}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                  />
                  {fieldErrors.email && (
                    <span id="contact-email-error" className="contact-field-error" role="alert">
                      {fieldErrors.email}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  variants={formFieldVariant}
                  className="contact-field-group"
                  style={{ gridColumn: '1 / -1' }}
                >
                  <label className="sr-only" htmlFor="contact-subject">What would you like to build?</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="What would you like to build?"
                    className={`field ${fieldErrors.subject ? 'field-error' : ''}`}
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    maxLength={180}
                    aria-invalid={Boolean(fieldErrors.subject)}
                    aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
                  />
                  {fieldErrors.subject && (
                    <span id="contact-subject-error" className="contact-field-error" role="alert">
                      {fieldErrors.subject}
                    </span>
                  )}
                </motion.div>

                <motion.div
                  className="contact-message-group contact-field-group"
                  variants={formFieldVariant}
                  style={{ gridColumn: '1 / -1' }}
                >
                  <label className="sr-only" htmlFor="contact-message">Tell us about your goals, challenges, or ideas</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us about your goals, challenges, or ideas..."
                    className={fieldErrors.message ? 'field-error' : ''}
                    value={formData.message}
                    onChange={handleMessageChange}
                    maxLength={500}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
                  />
                  {fieldErrors.message && (
                    <span id="contact-message-error" className="contact-field-error" role="alert">
                      {fieldErrors.message}
                    </span>
                  )}
                  <div className="contact-message-footer">
                    {formData.message.length >= 500 ? (
                      <span className="contact-char-limit-warning" role="alert" aria-live="polite">
                        Maximum 500 characters allowed.
                      </span>
                    ) : (
                      <span className="contact-char-limit-spacer" aria-hidden="true" />
                    )}
                    <span
                      className={`contact-char-counter ${formData.message.length >= 500 ? 'at-limit' : ''}`}
                      aria-live="polite"
                    >
                      {formData.message.length}/500
                    </span>
                  </div>
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
