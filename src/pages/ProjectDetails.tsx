import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <div style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, minHeight: '100vh' }}>
      <nav style={{
        borderBottom: `1px solid ${currentTheme.secondary}`,
        padding: '1.5rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: `1px solid ${currentTheme.text}`,
            color: currentTheme.text,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <ArrowLeft size={16} /> BACK
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Roboto, sans-serif' }}>
            PROJECT DETAILS
          </div>
          {totalProjects > 0 && (
            <div style={{ fontSize: '0.75rem', color: currentTheme.textSecondary, fontFamily: 'Courier, monospace' }}>
              {currentIndex + 1} / {totalProjects}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onNavigate && totalProjects > 1 && (
            <>
              <button
                onClick={() => onNavigate('prev')}
                style={{
                  background: 'none',
                  border: `1px solid ${currentTheme.text}`,
                  color: currentTheme.text,
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = currentTheme.accent;
                  (e.target as HTMLButtonElement).style.color = currentTheme.bg;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLButtonElement).style.color = currentTheme.text;
                }}
                title="Previous Project"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => onNavigate('next')}
                style={{
                  background: 'none',
                  border: `1px solid ${currentTheme.text}`,
                  color: currentTheme.text,
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = currentTheme.accent;
                  (e.target as HTMLButtonElement).style.color = currentTheme.bg;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                  (e.target as HTMLButtonElement).style.color = currentTheme.text;
                }}
                title="Next Project"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: '900', margin: '0 0 1rem 0', fontFamily: 'Roboto, sans-serif' }}>
              {project.title}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ backgroundColor: currentTheme.secondary, padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '700' }}>
                {project.category}
              </span>
              <span style={{ backgroundColor: currentTheme.secondary, padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '700' }}>
                {project.year}
              </span>
            </div>
            {project.description && (
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: currentTheme.textSecondary, marginBottom: '2rem' }}>
                {project.description}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: currentTheme.textSecondary }}>
            Loading images...
          </div>
        ) : images.length > 0 ? (
          <div>
            <div style={{
              backgroundColor: currentTheme.secondary,
              aspectRatio: '16/9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: '2rem',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onClick={() => openLightbox()}
            title="Click to view fullscreen"
            >
              <img
                src={`data:${images[currentImageIndex].image_type};base64,${images[currentImageIndex].image_data}`}
                alt={images[currentImageIndex].image_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: currentTheme.bg + '99',
                      border: `1px solid ${currentTheme.text}`,
                      color: currentTheme.text,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '0'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      backgroundColor: currentTheme.bg + '99',
                      border: `1px solid ${currentTheme.text}`,
                      color: currentTheme.text,
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '0'
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: currentTheme.bg + '99',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    borderRadius: '0'
                  }}>
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    onClick={() => openLightbox(idx)}
                    style={{
                      aspectRatio: '4/3',
                      backgroundColor: currentTheme.secondary,
                      cursor: 'pointer',
                      border: currentImageIndex === idx ? `2px solid ${currentTheme.accent}` : `2px solid transparent`,
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentImageIndex !== idx) {
                        (e.currentTarget as HTMLDivElement).style.border = `2px solid ${currentTheme.text}`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentImageIndex !== idx) {
                        (e.currentTarget as HTMLDivElement).style.border = `2px solid transparent`;
                      }
                    }}
                    title="Click to view fullscreen"
                  >
                    <img
                      src={`data:${img.image_type};base64,${img.image_data}`}
                      alt={`${project.title} ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            backgroundColor: currentTheme.secondary,
            padding: '3rem',
            textAlign: 'center',
            color: currentTheme.textSecondary,
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            No images for this project yet
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
