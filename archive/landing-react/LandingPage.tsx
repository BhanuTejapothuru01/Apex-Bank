import { useState } from 'react';
import { Menu, X, Shield, Building2, Phone, Mail } from 'lucide-react';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import {
  NAV_LINKS,
  HERO_STATS,
  FEATURES,
  SERVICES,
  LOANS,
  VALUES,
  FAQS,
  BRANCHES,
} from './content';
import './landing.css';

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleNavClick = (id: string) => {
    scrollToSection(id);
    setMobileNavOpen(false);
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <a href="#home" className="landing-brand" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          <div className="landing-brand-mark">A</div>
          <div className="landing-brand-text">
            <strong>Apex Bank</strong>
            <span>Digital Banking</span>
          </div>
        </a>

        <nav className="landing-nav" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="landing-header-actions">
          <button type="button" className="landing-btn landing-btn-ghost" onClick={() => setRegisterOpen(true)}>
            Register
          </button>
          <button type="button" className="landing-btn landing-btn-primary" onClick={() => setLoginOpen(true)}>
            Login
          </button>
          <button
            type="button"
            className="landing-menu-btn"
            aria-label="Toggle menu"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <nav className={`landing-mobile-nav ${mobileNavOpen ? 'open' : ''}`} aria-label="Mobile">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <section id="home" className="landing-hero">
        <div className="landing-hero-bg" />
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <h1>
              Banking built for <span>trust, growth</span> and everyday confidence
            </h1>
            <p>
              Apex Bank brings together secure digital accounts, intelligent lending, and
              round-the-clock service — designed for individuals, businesses, and institutions
              across India.
            </p>
            <div className="landing-hero-cta">
              <button type="button" className="landing-btn landing-btn-primary" onClick={() => setRegisterOpen(true)}>
                Open an account
              </button>
              <button type="button" className="landing-btn landing-btn-ghost" onClick={() => setLoginOpen(true)}>
                Sign in to your portal
              </button>
            </div>
          </div>

          <div className="landing-hero-card">
            <h3>At a glance</h3>
            <div className="landing-stat-grid">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="landing-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-header">
          <h2>Why customers choose Apex</h2>
          <p>Modern banking with the reliability of a traditional institution and the speed of digital-first service.</p>
        </div>
        <div className="landing-grid-4">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="landing-card">
              <div className="landing-card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="landing-section">
        <div className="landing-section-header">
          <h2>Our services</h2>
          <p>Comprehensive financial products for savings, business operations, credit, and wealth management.</p>
        </div>
        <div className="landing-grid-3">
          {SERVICES.map((service) => (
            <article key={service.title} className="landing-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="loans" className="landing-section">
        <div className="landing-section-header">
          <h2>Loan solutions</h2>
          <p>Flexible lending with transparent terms, competitive rates, and fast digital processing.</p>
        </div>
        <div className="landing-grid-3">
          {LOANS.map((loan) => (
            <article key={loan.title} className="landing-card">
              <h3>{loan.title}</h3>
              <p>{loan.description}</p>
              <button
                type="button"
                className="landing-btn landing-btn-ghost"
                style={{ marginTop: '1rem' }}
                onClick={() => setLoginOpen(true)}
              >
                Apply after login →
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="landing-section landing-about">
        <div className="landing-section-header">
          <h2>About Apex Bank</h2>
          <p>
            We combine trusted banking practices with modern technology to deliver secure,
            accessible financial services for customers nationwide.
          </p>
        </div>
        <div className="landing-grid-2" style={{ marginBottom: '1.5rem' }}>
          <article className="landing-card">
            <h3>Our mission</h3>
            <p>To provide secure, transparent, and technology-driven financial services that help customers achieve their personal and business goals.</p>
          </article>
          <article className="landing-card">
            <h3>Our vision</h3>
            <p>To be a leading digital banking institution recognized for innovation, customer trust, and excellence in financial services.</p>
          </article>
        </div>
        <div className="landing-grid-4">
          {VALUES.map((value) => (
            <article key={value.title} className="landing-card">
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="landing-section landing-faq">
        <div className="landing-section-header">
          <h2>Frequently asked questions</h2>
          <p>Quick answers about accounts, loans, security, and digital banking.</p>
        </div>
        {FAQS.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </section>

      <section id="contact" className="landing-section">
        <div className="landing-section-header">
          <h2>Branches & contact</h2>
          <p>Visit us in person or reach our teams during business hours, Monday to Saturday.</p>
        </div>
        <div className="landing-grid-3">
          {BRANCHES.map((branch) => (
            <article key={branch.city} className="landing-card landing-contact-card">
              <Building2 size={20} color="#63339f" />
              <h4>{branch.city}</h4>
              <p>{branch.address}</p>
              <div className="landing-contact-meta">
                <span><Phone size={14} style={{ display: 'inline', marginRight: 6 }} />{branch.phone}</span>
                <span><Mail size={14} style={{ display: 'inline', marginRight: 6 }} />{branch.email}</span>
                <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div>
            <h3>Apex Bank</h3>
            <p>Secure digital banking for individuals and businesses. Licensed financial institution committed to transparency and customer protection.</p>
          </div>
          <div>
            <h3>Quick links</h3>
            {NAV_LINKS.map((link) => (
              <p key={link.id}>
                <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}>
                  {link.label}
                </a>
              </p>
            ))}
          </div>
          <div>
            <h3>Secure access</h3>
            <p><Shield size={14} style={{ display: 'inline', marginRight: 6 }} />256-bit encryption & multi-factor authentication</p>
            <p style={{ marginTop: '0.75rem' }}>
              <button type="button" className="landing-btn landing-btn-primary" onClick={() => setLoginOpen(true)}>
                Login to portal
              </button>
            </p>
          </div>
        </div>
        <div className="landing-footer-bottom">
          © {new Date().getFullYear()} Apex Bank. All rights reserved. Terms & conditions apply.
        </div>
      </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={() => setLoginOpen(true)}
      />
    </div>
  );
}
