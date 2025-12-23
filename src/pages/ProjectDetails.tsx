import React, { useState, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ImageLightbox from '../components/ImageLightbox';

interface ProjectImage {
  id: string;
  image_data: string;
  image_name: string;
  image_type?: string;
  order: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string | null;
  order: number;
  description?: string;
  featured_image_id?: string;
}

interface ProjectDetailsProps {
  project: PortfolioItem;
  onBack: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  currentIndex?: number;
  totalProjects?: number;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  project,
  onBack,
  onNavigate,
  currentIndex = -1,
  totalProjects = 0
}) => {
  const [isDark, setIsDark] = useState(true);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const theme = {
    dark: { bg: '#000000', secondary: '#2a2a2a', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#a0a0a0' },
    light: { bg: '#FFFFFF', secondary: '#f5f5f5', accent: '#FFD700', text: '#000000', textSecondary: '#666666' }
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  useEffect(() => {
    loadImages();
  }, [project.id]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', project.id)
        .order('order');

      if (error) throw error;
      if (data) {
        setImages(data as ProjectImage[]);
      }
    } catch (error) {
      console.error('Error loading project images:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const handleLightboxNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      prevImage();
    } else {
      nextImage();
    }
  };

  const openLightbox = (index?: number) => {
    if (index !== undefined) {
      setCurrentImageIndex(index);
    }
    setLightboxOpen(true);
  };

  const visibleImages = images.slice(0, 7);

  return (
    <div style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        borderBottom: `3px solid ${currentTheme.text}`,
        padding: '1.5rem 3rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <img
              src="/logo.png"
              alt="Logo"
              style={{
                height: '40px',
                width: 'auto'
              }}
            />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: currentTheme.text,
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <Menu size={32} strokeWidth={2} />
          </button>
        </div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '400',
          color: currentTheme.textSecondary,
          fontFamily: 'Courier, monospace'
        }}>
          Portfolio / {project.title}
        </div>
      </nav>

      <div style={{ flex: 1, padding: '3rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '3rem',
          marginBottom: '3rem',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        } as React.CSSProperties}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: '900',
              margin: '0 0 1.5rem 0',
              fontFamily: 'Roboto, sans-serif',
              lineHeight: '1',
              letterSpacing: '-0.02em'
            }}>
              {project.title}
            </h1>

            {project.description && (
              <div style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                color: currentTheme.text,
                marginBottom: '2rem',
                fontFamily: 'system-ui, sans-serif'
              }}>
                <div dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{
                backgroundColor: currentTheme.secondary,
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentTheme.textSecondary
              }}>
                Loading...
              </div>
            ) : images.length > 0 ? (
              <div
                style={{
                  backgroundColor: currentTheme.secondary,
                  aspectRatio: '4/3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `2px solid ${currentTheme.text}`
                }}
                onClick={() => openLightbox()}
                title="Click to view fullscreen"
              >
                <img
                  src={`data:${images[currentImageIndex].image_type};base64,${images[currentImageIndex].image_data}`}
                  alt={images[currentImageIndex].image_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div style={{
                backgroundColor: currentTheme.secondary,
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: currentTheme.textSecondary,
                border: `2px solid ${currentTheme.text}`
              }}>
                No images available
              </div>
            )}
          </div>
        </div>

        {images.length > 1 && (
          <div style={{
            borderTop: `3px solid ${currentTheme.text}`,
            paddingTop: '2rem',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative'
            }}>
              <button
                onClick={prevImage}
                disabled={currentImageIndex === 0}
                style={{
                  background: currentTheme.bg,
                  border: `2px solid ${currentTheme.text}`,
                  color: currentTheme.text,
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentImageIndex === 0 ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  opacity: currentImageIndex === 0 ? 0.3 : 1
                }}
              >
                <ChevronLeft size={24} strokeWidth={3} />
              </button>

              <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                scrollBehavior: 'smooth',
                flex: 1,
                paddingBottom: '0.5rem'
              }}>
                {visibleImages.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      position: 'relative',
                      minWidth: '180px',
                      height: '120px',
                      backgroundColor: currentTheme.secondary,
                      cursor: 'pointer',
                      border: currentImageIndex === idx ? `3px solid ${currentTheme.accent}` : `2px solid ${currentTheme.text}`,
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={`data:${img.image_type};base64,${img.image_data}`}
                      alt={`${project.title} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '0.5rem',
                      backgroundColor: currentTheme.bg + 'CC',
                      color: currentTheme.text,
                      padding: '0.25rem 0.75rem',
                      fontSize: '1rem',
                      fontWeight: '900',
                      fontFamily: 'Roboto, sans-serif',
                      border: `1px solid ${currentTheme.text}`
                    }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={nextImage}
                disabled={currentImageIndex >= visibleImages.length - 1}
                style={{
                  background: currentTheme.bg,
                  border: `2px solid ${currentTheme.text}`,
                  color: currentTheme.text,
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentImageIndex >= visibleImages.length - 1 ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  opacity: currentImageIndex >= visibleImages.length - 1 ? 0.3 : 1
                }}
              >
                <ChevronRight size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </div>

      {lightboxOpen && images.length > 0 && (
        <ImageLightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={handleLightboxNavigate}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
