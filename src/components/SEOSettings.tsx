import React, { useState, useEffect } from 'react';
import { useSEOContext } from '../contexts/SEOContext';
import { useToast } from '../contexts/ToastContext';

const SEOSettings: React.FC = () => {
  const { seoSettings, updateSEOSettings, reloadSettings } = useSEOContext();
  const { addToast } = useToast();
  const [isDark] = useState(true);
  const [formData, setFormData] = useState({
    site_title: '',
    site_tagline: '',
    meta_description: '',
    meta_keywords: '',
    author_name: '',
    business_name: '',
    location_city: '',
    service_areas: '',
    phone: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);

  const theme = {
    dark: { bg: '#000000', secondary: '#2a2a2a', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#a0a0a0' },
    light: { bg: '#FFFFFF', secondary: '#f5f5f5', accent: '#FFD700', text: '#000000', textSecondary: '#666666' }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  useEffect(() => {
    if (seoSettings) {
      setFormData({
        site_title: seoSettings.site_title || '',
        site_tagline: seoSettings.site_tagline || '',
        meta_description: seoSettings.meta_description || '',
        meta_keywords: seoSettings.meta_keywords || '',
        author_name: seoSettings.author_name || '',
        business_name: seoSettings.business_name || '',
        location_city: seoSettings.location_city || '',
        service_areas: seoSettings.service_areas || '',
        phone: seoSettings.phone || '',
        email: seoSettings.email || '',
      });
    }
  }, [seoSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Attempting to save SEO settings:', formData);
      const success = await updateSEOSettings(formData);
      if (success) {
        addToast('SEO settings updated successfully', 'success');
        await reloadSettings();
      } else {
        console.error('Update returned false');
        addToast('Failed to update SEO settings. Check console for details.', 'error');
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      addToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: currentTheme.bg,
    border: `1px solid ${currentTheme.secondary}`,
    color: currentTheme.text,
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: currentTheme.textSecondary,
    textTransform: 'uppercase' as const,
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '900',
        marginBottom: '2rem',
        fontFamily: 'Roboto, sans-serif',
        color: currentTheme.accent
      }}>
        SEO SETTINGS
      </h2>

      <div style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: currentTheme.secondary }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            General Information
          </h3>

          <label style={labelStyle}>Site Title</label>
          <input
            type="text"
            value={formData.site_title}
            onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
            style={inputStyle}
            placeholder="CS Brutalists"
          />

          <label style={labelStyle}>Site Tagline</label>
          <input
            type="text"
            value={formData.site_tagline}
            onChange={(e) => setFormData({ ...formData, site_tagline: e.target.value })}
            style={inputStyle}
            placeholder="Brand Strategy & Innovation Leader | Los Angeles"
          />

          <label style={labelStyle}>Meta Description</label>
          <textarea
            value={formData.meta_description}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            placeholder="Brief description of your services and expertise for search engines"
          />

          <label style={labelStyle}>Meta Keywords (comma separated)</label>
          <textarea
            value={formData.meta_keywords}
            onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="brand strategy, Los Angeles, AR/AI development, etc."
          />
        </div>

        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: currentTheme.secondary }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Business Information
          </h3>

          <label style={labelStyle}>Author Name</label>
          <input
            type="text"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            style={inputStyle}
            placeholder="C Scott"
          />

          <label style={labelStyle}>Business Name</label>
          <input
            type="text"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            style={inputStyle}
            placeholder="C Scott Consulting Group"
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle}
            placeholder="contact@csbrut.com"
          />

          <label style={labelStyle}>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={inputStyle}
            placeholder="(555) 123-4567"
          />
        </div>

        <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: currentTheme.secondary }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Local SEO (Los Angeles)
          </h3>

          <label style={labelStyle}>Primary Location</label>
          <input
            type="text"
            value={formData.location_city}
            onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
            style={inputStyle}
            placeholder="Los Angeles"
          />

          <label style={labelStyle}>Service Areas (comma separated)</label>
          <textarea
            value={formData.service_areas}
            onChange={(e) => setFormData({ ...formData, service_areas: e.target.value })}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="Los Angeles, Santa Monica, Beverly Hills, Culver City, West Hollywood, Southern California"
          />

          <div style={{
            padding: '1rem',
            backgroundColor: currentTheme.bg,
            border: `1px solid ${currentTheme.accent}`,
            marginTop: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: currentTheme.textSecondary }}>
              <strong style={{ color: currentTheme.accent }}>Local SEO Tip:</strong> Include specific cities and neighborhoods in your service areas to improve visibility in local search results for Los Angeles and Southern California.
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: currentTheme.accent,
            color: currentTheme.bg,
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '0.875rem',
            fontWeight: '700',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'SAVING...' : 'SAVE SEO SETTINGS'}
        </button>
      </div>
    </div>
  );
};

export default SEOSettings;
