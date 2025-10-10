import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, Download } from 'lucide-react';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectImage, setSelectedProjectImage] = useState(0);

  const heroImages = ['Hero Image 1', 'Hero Image 2', 'Hero Image 3', 'Hero Image 4'];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    setCurrentHeroImage(Math.floor(Math.random() * heroImages.length));
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const theme = {
    dark: { bg: '#000000', secondary: '#2a2a2a', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#a0a0a0' },
    light: { bg: '#FFFFFF', secondary: '#f5f5f5', accent: '#FFD700', text: '#000000', textSecondary: '#666666' }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  const portfolioItems = [
    { id: 1, title: 'Project Alpha', category: 'Media', year: '2024' },
    { id: 2, title: 'Digital Campaign', category: 'Branding', year: '2024' },
    { id: 3, title: 'Visual Identity', category: 'Branding', year: '2023' },
    { id: 4, title: 'Product Launch', category: 'Live Events', year: '2023' },
    { id: 5, title: 'Brand Refresh', category: 'Print', year: '2023' },
    { id: 6, title: 'Web Experience', category: 'Media', year: '2024' },
    { id: 7, title: 'Conference Design', category: 'Live Events', year: '2024' },
    { id: 8, title: 'Magazine Layout', category: 'Print', year: '2023' },
    { id: 9, title: 'Documentary Film', category: 'Media', year: '2024' },
    { id: 10, title: 'Corporate Identity', category: 'Branding', year: '2023' }
  ];

  const getCurrentDate = () => {
    const options = { month: '2-digit', day: '2-digit', year: '2-digit' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.subject && formData.message) {
      alert('Message sent! This is a demo');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, minHeight: '100vh' }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: currentTheme.bg,
        borderBottom: `1px solid ${currentTheme.secondary}`, padding: '1.5rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Roboto, sans-serif' }}>LOGO</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setIsDark(!isDark)} style={{
            background: 'none', border: `1px solid ${currentTheme.text}`, borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: currentTheme.text
          }}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{
            background: 'none', border: 'none', color: currentTheme.text, cursor: 'pointer', padding: 0
          }}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: currentTheme.bg + 'BF', zIndex: 999, display: 'flex',
          flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2rem'
        }}>
          {['HOME', 'PORTFOLIO', 'RESUME', 'ABOUT', 'CONTACT'].map((section) => (
            <button key={section} onClick={() => handleNavClick(section.toLowerCase())} style={{
              background: 'none', border: 'none',
              color: activeSection === section.toLowerCase() ? currentTheme.accent : currentTheme.text,
              fontSize: isMobile ? '2rem' : '3rem', fontWeight: '900', cursor: 'pointer',
              fontFamily: 'Roboto, sans-serif'
            }}>
              {section}
            </button>
          ))}
        </div>
      )}

      <main style={{ paddingTop: '73px' }}>
        {activeSection === 'home' && (
          <section style={{ padding: '3rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', color: currentTheme.textSecondary, marginBottom: '1rem' }}>
                HOME &gt; PORTFOLIO &gt; RESUME &gt; ABOUT &gt; CONTACT
              </div>
              <div style={{
                aspectRatio: '16/9', backgroundColor: currentTheme.secondary, marginBottom: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
              }}>
                {heroImages[currentHeroImage]}
              </div>
              <div style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', color: currentTheme.textSecondary, marginBottom: '3rem' }}>
                ({getCurrentDate()})
              </div>
              
              <div style={{ marginBottom: '3rem' }}>
                {['HOME', 'PORTFOLIO', 'RESUME', 'ABOUT', 'CONTACT'].map((section) => (
                  <button
                    key={section}
                    onClick={() => handleNavClick(section.toLowerCase())}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: currentTheme.text,
                      fontSize: 'clamp(3rem, 8vw, 5rem)',
                      fontWeight: '900',
                      cursor: 'pointer',
                      letterSpacing: '-0.02em',
                      padding: 0,
                      display: 'block',
                      fontFamily: 'Roboto, sans-serif',
                      textAlign: 'left',
                      lineHeight: '1',
                      marginBottom: '0.5rem',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = currentTheme.accent}
                    onMouseLeave={(e) => e.target.style.color = currentTheme.text}
                  >
                    {section}
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {portfolioItems.slice(0, 10).map((item, idx) => (
                  <div key={item.id} style={{ minWidth: '250px', cursor: 'pointer', position: 'relative' }}>
                    <div style={{
                      aspectRatio: '4/3', backgroundColor: currentTheme.secondary, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '2rem', position: 'relative'
                    }}>
                      {item.id}
                      <div style={{
                        position: 'absolute', bottom: '0.5rem', left: '0.5rem',
                        fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem', fontWeight: '700'
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'portfolio' && (
          <section style={{ padding: '3rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <h2 style={{
                fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: '900', color: currentTheme.accent,
                margin: '0 0 2rem 0', fontFamily: 'Roboto, sans-serif'
              }}>
                PORTFOLIO
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px', backgroundColor: currentTheme.secondary }}>
                {portfolioItems.map((item) => (
                  <div key={item.id} style={{ backgroundColor: currentTheme.bg, padding: '3rem', cursor: 'pointer' }}>
                    <div style={{ aspectRatio: '4/3', backgroundColor: currentTheme.secondary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                      {item.id}
                    </div>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, fontFamily: 'Roboto, sans-serif' }}>
                      {item.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'resume' && (
          <section style={{ padding: '3rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: '900', color: currentTheme.accent, margin: '0 0 3rem 0', fontFamily: 'Roboto, sans-serif' }}>
                RESUME
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '3rem' }}>
                <div style={{ aspectRatio: '3/4', backgroundColor: currentTheme.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                  📷
                </div>
                <div style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', lineHeight: '1.8' }}>
                  <h3>EXECUTIVE SUMMARY</h3>
                  <p>Professional summary content...</p>
                  <h3>EXPERIENCE</h3>
                  <p>Job details...</p>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent',
                    border: `2px solid ${currentTheme.text}`, color: currentTheme.text, padding: '1rem 2rem',
                    cursor: 'pointer', fontFamily: 'Roboto, sans-serif', marginTop: '2rem'
                  }}>
                    <Download size={20} /> DOWNLOAD CV
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section style={{ padding: '3rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '3rem' }}>
                <div>
                  <h2 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '900', margin: '0 0 2rem 0', fontFamily: 'Roboto, sans-serif' }}>
                    ABOUT
                  </h2>
                  <p style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', lineHeight: '1.8' }}>
                    About content here...
                  </p>
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <a href="#" style={{ color: currentTheme.text, fontSize: '1.5rem' }}>📌</a>
                    <a href="#" style={{ color: currentTheme.text, fontSize: '1.5rem' }}>📷</a>
                  </div>
                </div>
                <div style={{ aspectRatio: '4/3', backgroundColor: currentTheme.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                  📷
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contact' && (
          <section style={{ padding: '3rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: '900', color: currentTheme.accent, margin: '0 0 3rem 0', fontFamily: 'Roboto, sans-serif' }}>
                CONTACT
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '3rem' }}>
                <div>
                  <p style={{ fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '3rem' }}>
                    Get in touch for collaborations and inquiries.
                  </p>
                </div>
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <input type="text" placeholder="YOUR NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{
                      width: '100%', padding: '1rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                      color: currentTheme.text, fontSize: '1rem', fontFamily: 'inherit'
                    }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <input type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{
                      width: '100%', padding: '1rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                      color: currentTheme.text, fontSize: '1rem', fontFamily: 'inherit'
                    }} />
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <select value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} style={{
                      width: '100%', padding: '1rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                      color: formData.subject ? currentTheme.text : currentTheme.textSecondary, fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer'
                    }}>
                      <option value="">Select a subject...</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Job Prospect">Job Prospect</option>
                      <option value="Speaking Engagement">Speaking Engagement</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <textarea rows={6} placeholder="MESSAGE" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{
                      width: '100%', padding: '1rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                      color: currentTheme.text, fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical'
                    }} />
                  </div>
                  <button onClick={handleSubmit} style={{
                    backgroundColor: currentTheme.accent, color: currentTheme.bg, border: 'none',
                    padding: '1.25rem 3rem', fontSize: '0.875rem', fontWeight: '700', cursor: 'pointer',
                    fontFamily: 'inherit', width: isMobile ? '100%' : 'auto'
                  }}>
                    SEND MESSAGE
                  </button>
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <a href="#" style={{ color: currentTheme.text, fontSize: '1.5rem' }}>📌</a>
                    <a href="#" style={{ color: currentTheme.text, fontSize: '1.5rem' }}>📷</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={{
        borderTop: `1px solid ${currentTheme.secondary}`, padding: '2rem 3rem', textAlign: 'center',
        fontSize: '0.75rem', color: currentTheme.textSecondary, fontFamily: 'Courier, monospace'
      }}>
        © 2024 CS BRUTALISTS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default Portfolio;