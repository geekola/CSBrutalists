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
          <section>
           
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 3rem' }}>
              <div style={{
                aspectRatio: '16/9', backgroundColor: currentTheme.secondary, marginBottom: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
              }}>
                {heroImages[currentHeroImage]}
              </div>
               <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 3rem' }}>
              <div style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', color: currentTheme.textSecondary, marginBottom: '1rem' }}>
                ({getCurrentDate()})
              </div>
              
              <div style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', color: currentTheme.textSecondary, marginBottom: '1rem', textAlign: 'right' }}>
                HOME &gt; PORTFOLIO &gt; RESUME &gt; ABOUT &gt; CONTACT
              </div>
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
          <section style={{ padding: '3rem', paddingBottom: '6rem' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: '900', color: currentTheme.accent, margin: '0 0 3rem 0', fontFamily: 'Roboto, sans-serif' }}>
                RESUME
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', gap: '3rem' }}>
                <div style={{ aspectRatio: '1/8', backgroundColor: currentTheme.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                </div>
                <div style={{ fontFamily: 'Courier, monospace', fontSize: '0.875rem', lineHeight: '1.8' }}>
                  <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 'bold' }}>EXECUTIVE SUMMARY | INNOVATION LEADER</h3>
                  <p style={{ marginBottom: '2rem' }}>Entrepreneurial leader leveraging over two decades of success in Brand Management, Business Development, and Media to pioneer the next generation of audience engagement through Augmented Reality (AR) SaaS and AI driven strategy. Proven expertise in developing and executing integrated brand strategies, fostering audience loyalty, and identifying new revenue opportunities to drive business growth. My experience is rooted in creating tangible, high impact moments, including directing all IP content and fan engagement at major live events, such as the X-Games, the US Open of Surf, and the launch of Cross Colours - Music Without Prejudice.</p>
                  <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>CORE COMPETENCIES</h3>
                  <p style={{ marginBottom: '2rem' }}>AR/AI Product Development | Integrated Brand Strategy | Digital Paid Media (Google/Meta) | Cross-Functional Leadership | B2B Client Acquisition | Revenue Stream Identification | Creative Concept Direction | Agency & Vendor Coordination</p>
                  <h3 style={{ marginBottom: '1rem', fontWeight: 'bold' }}>PROFESSIONAL EXPERIENCE</h3>
                  <h4 style={{ marginBottom: '0.5rem' }}><strong>C Scott Consulting Group</strong> - Freelance Brand Strategist | Los Angeles, CA</h4>
                  <p style={{ marginBottom: '1rem' }}>Jan 2010–Present</p>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Innovation & Product Development: Conceptualized, directed, and led a new venture to develop a novel Augmented Reality (AR) SaaS product by assembling a cross-industry team of experts in sports, media, and AI for a Q1 2026 launch.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Technology Leadership: Actively utilize AI as a daily efficiency tool for high-speed data analysis and advanced creative brainstorming, driving down time-to-market for strategic initiatives.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Championed integrated brand strategies by mobilizing cross-functional teams, aligning brand messaging with business objectives to drive growth and customer loyalty.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Secured and retained strategic client partnerships from inception to completion, consistently exceeding expectations and strengthening business alignment.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Drove business development by conducting comprehensive brand audits and market research to inform strategic positioning, using analytics and performance metrics to identify new revenue streams.</li>
                  </ul>
                 <h4 style={{ marginBottom: '0.5rem' }}>GreenLabTV - Producer/Business Development | Los Angeles, CA</h4>
                  <p style={{ marginBottom: '1rem' }}>Oct 2024–Present</p>
<ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Served as a key liaison for production goals, ensuring brand and audience alignment with the client's creative vision.</li>
 <li style={{ marginBottom: '0.5rem' }}>Drove operational efficiency and profitability by securing and managing critical vendor relationships and key production logistics, maintaining strict adherence to project budgets.</li>
 <li style={{ marginBottom: '0.5rem' }}>Cultivated and maintained strong relationships through proactive communication with high-profile talent and VIP clients, leveraging these connections to enhance the brand's reputation and reach.</li>
</ul>
                  <h4 style={{ marginBottom: '0.5rem' }}>Cross Colours - Music Without Prejudice - Creative Consultant | Venice, CA</h4>
                    <p style={{ marginBottom: '1rem' }}>Sep 2014–May 2015</p>
<ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Developed and executed immersive brand experiences and high-impact events.</li>
<li style={{ marginBottom: '0.5rem' }}>Created and executed a range of events, including brand activations and product launches, to foster engagement and create memorable experiences for fans.</li>
<li style={{ marginBottom: '0.5rem' }}>B2B & Agency Coordination: Developed B2B-focused marketing materials and presentations to secure business partnerships, and managed projects coordinating with multiple third-party agencies (PR, Media Buying, Creatives).</li>
<li style={{ marginBottom: '0.5rem' }}>Managed project budgets to ensure financial viability and profitability, implementing cost-saving measures to optimize resource allocation.</li>
                    </ul>

<h4 style={{ marginBottom: '0.5rem' }}>All Action Sports Radio - Producer/Brand Manager | Los Angeles, CA</h4>
                 <p style={{ marginBottom: '1rem' }}>Feb 2010–Jan 2014</p>
<ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Led the launch and growth of a start-up radio show from concept to syndication, demonstrating strong entrepreneurial acumen.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Developed and implemented a comprehensive brand strategy that successfully positioned the brand and secured a syndication deal.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Digital Marketing & Paid Media: Successfully managed digital ad budgets on platforms including Google Ads and Facebook/Meta to drive brand awareness.</li>
<li style={{ marginBottom: '0.5rem' }}>SEO/Email Marketing: Implemented strategies to improve search ranking and managed keywords for search ads; utilized Mailchimp to develop and maintain audience communication and loyalty.</li>
                  <li style={{ marginBottom: '0.5rem' }}>Grew the audience through compelling content and interactive experiences via social media and live events, deepening industry relationships.</li>
<li style={{ marginBottom: '0.5rem' }}>Maintained adherence to project schedules and budget constraints through KPI analysis.</li>
                </ul>
                  <h4 style={{ marginBottom: '0.5rem' }}>Corporate Contractors - Project Manager | Los Angeles, CA</h4>
                    <p style={{ marginBottom: '1rem' }}>Oct 2005–Jan 2010</p>
<ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Directed all phases of commercial construction projects, from conceptualization to completion.</li>
<li style={{ marginBottom: '0.5rem' }}>Drove operational efficiency by securing and managing critical vendor relationships and key production logistics, maintaining profitability across project budgets.</li>
<li style={{ marginBottom: '0.5rem' }}>Vendor Management: Managed procurement, change orders, and price negotiations, adhering to project timeline and budget</li>
  </ul>
                  <h4 style={{ marginBottom: '0.5rem' }}>Paradigm Developers - Project Manager | Los Angeles, CA</h4>
                  <p style={{ marginBottom: '1rem' }}>Jun 2003–Aug 2005</p>
<ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Managed all phases of residential construction projects.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Coordinated with subcontractors, vendors and local municipalities.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Translated client vision into tangible workflow for development projects.</li>
</ul>
                  <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 'bold' }}>TECHNICAL & PLATFORM SKILLS</h3>
<p style={{ marginBottom: '1rem' }}>Analytics & CRM: Mailchimp, KPI Analysis, Performance Metrics</p>
<p>Creative Suite: Adobe Creative Suite, Da Vinci Editing Suite</p>
<p>Productivity: Trello & Slack, Microsoft Office, Windows & Mac</p>
 <p style={{ marginBottom: '1rem' }}>Design/Other: AutoCAD, AR/AI Conceptualization Tools</p>
<h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 'bold' }}>EDUCATION</h3>
<p style={{ marginBottom: '1rem' }}>Wilmington University</p>
<p>Sept. 1998–Dec 2002</p>
<p>Bachelor of Science, Business Management</p>
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
        © 2025 CS BRUTALISTS. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
};

export default Portfolio;