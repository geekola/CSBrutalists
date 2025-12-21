import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: Array<{
    id: string;
    image_data: string;
    image_type?: string;
    image_name: string;
  }>;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  isDark?: boolean;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
  isDark = true
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNavigate]);

  if (images.length === 0 || currentIndex < 0 || currentIndex >= images.length) {
    return null;
  }

  const currentImage = images[currentIndex];
  const bgColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const accentColor = '#FFD700';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: bgColor + 'F5',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          background: 'none',
          border: `2px solid ${textColor}`,
          color: textColor,
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 10000
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = accentColor;
          (e.target as HTMLButtonElement).style.borderColor = accentColor;
          (e.target as HTMLButtonElement).style.color = bgColor;
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
          (e.target as HTMLButtonElement).style.borderColor = textColor;
          (e.target as HTMLButtonElement).style.color = textColor;
        }}
        title="Close (ESC)"
      >
        <X size={24} />
      </button>

      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`data:${currentImage.image_type || 'image/jpeg'};base64,${currentImage.image_data}`}
          alt={currentImage.image_name}
          style={{
            maxWidth: '100%',
            maxHeight: '85vh',
            objectFit: 'contain',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            border: `2px solid ${textColor}`
          }}
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('prev');
              }}
              style={{
                position: 'absolute',
                left: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: `2px solid ${textColor}`,
                color: textColor,
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = accentColor;
                (e.target as HTMLButtonElement).style.borderColor = accentColor;
                (e.target as HTMLButtonElement).style.color = bgColor;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.target as HTMLButtonElement).style.borderColor = textColor;
                (e.target as HTMLButtonElement).style.color = textColor;
              }}
              title="Previous (←)"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('next');
              }}
              style={{
                position: 'absolute',
                right: '-60px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: `2px solid ${textColor}`,
                color: textColor,
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = accentColor;
                (e.target as HTMLButtonElement).style.borderColor = accentColor;
                (e.target as HTMLButtonElement).style.color = bgColor;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                (e.target as HTMLButtonElement).style.borderColor = textColor;
                (e.target as HTMLButtonElement).style.color = textColor;
              }}
              title="Next (→)"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: bgColor + 'DD',
          padding: '0.75rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: textColor,
          fontFamily: 'Roboto, sans-serif',
          border: `1px solid ${textColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem'
        }}
      >
        <div>{currentImage.image_name}</div>
        {images.length > 1 && (
          <div style={{ fontSize: '0.75rem', color: textColor + 'AA' }}>
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightbox;
