import React, { useState, useEffect } from 'react';
import TipTapEditor from './TipTapEditor';
import { ValidationError, validatePortfolioItem } from '../utils/validation';
import { supabase } from '../lib/supabase';

interface ProjectImage {
  id: string;
  project_id: string;
  image_data: string;
  image_name: string;
  image_type: string;
  order: number;
}

interface PortfolioItemEditorProps {
  item: {
    id?: string;
    title: string;
    category: string;
    year: string;
    image?: string;
    description?: string;
    featured_image_id?: string;
  };
  isOpen: boolean;
  isLoading?: boolean;
  onSave: (item: any) => void;
  onCancel: () => void;
  theme: any;
}

const PortfolioItemEditor: React.FC<PortfolioItemEditorProps> = ({
  item,
  isOpen,
  isLoading = false,
  onSave,
  onCancel,
  theme,
}) => {
  const [formData, setFormData] = useState(item);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(item);

  useEffect(() => {
    setFormData(item);
    setOriginalData(item);
    setErrors([]);
    setIsDirty(false);
    if (item.id && isOpen) {
      loadProjectImages(item.id);
    } else {
      setProjectImages([]);
    }
  }, [item, isOpen]);

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setIsDirty(hasChanges);
  }, [formData, originalData]);

  const loadProjectImages = async (projectId: string) => {
    setLoadingImages(true);
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('order');

      if (error) throw error;
      if (data) setProjectImages(data);
    } catch (error) {
      console.error('Error loading project images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSave = () => {
    const validationErrors = validatePortfolioItem(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const getErrorMessage = (field: string) => {
    return errors.find(e => e.field === field)?.message;
  };

  const hasError = (field: string) => !!getErrorMessage(field);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          backgroundColor: theme.bg,
          border: `1px solid ${theme.secondary}`,
          borderRadius: '0.25rem',
          padding: '2rem',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
          {item.id ? 'EDIT PORTFOLIO ITEM' : 'CREATE PORTFOLIO ITEM'}
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
              Title <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                setErrors(errors.filter(e => e.field !== 'title'));
              }}
              placeholder="Enter project title"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: theme.bg,
                border: hasError('title') ? '1px solid #ff6b6b' : `1px solid ${theme.secondary}`,
                color: theme.text,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            {hasError('title') && (
              <p style={{ margin: '0.25rem 0 0 0', color: '#ff6b6b', fontSize: '0.75rem' }}>
                {getErrorMessage('title')}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                Category <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  setErrors(errors.filter(e => e.field !== 'category'));
                }}
                placeholder="e.g., Web Design"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: theme.bg,
                  border: hasError('category') ? '1px solid #ff6b6b' : `1px solid ${theme.secondary}`,
                  color: theme.text,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              {hasError('category') && (
                <p style={{ margin: '0.25rem 0 0 0', color: '#ff6b6b', fontSize: '0.75rem' }}>
                  {getErrorMessage('category')}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                Year <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => {
                  setFormData({ ...formData, year: e.target.value });
                  setErrors(errors.filter(e => e.field !== 'year'));
                }}
                placeholder="e.g., 2024"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: theme.bg,
                  border: hasError('year') ? '1px solid #ff6b6b' : `1px solid ${theme.secondary}`,
                  color: theme.text,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              {hasError('year') && (
                <p style={{ margin: '0.25rem 0 0 0', color: '#ff6b6b', fontSize: '0.75rem' }}>
                  {getErrorMessage('year')}
                </p>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
              Image (filename)
            </label>
            <input
              type="text"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="e.g., project-thumbnail.jpg"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: theme.bg,
                border: `1px solid ${theme.secondary}`,
                color: theme.text,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
              Description
            </label>
            <TipTapEditor
              content={formData.description || ''}
              onChange={(html) => setFormData({ ...formData, description: html })}
              theme={theme}
            />
          </div>

          {item.id && projectImages.length > 0 && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                Featured Image
              </label>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: theme.textSecondary }}>
                Select which image to use as the featured image for this project
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.75rem',
                maxHeight: '250px',
                overflowY: 'auto',
                padding: '0.5rem',
                border: `1px solid ${theme.secondary}`,
              }}>
                {projectImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setFormData({ ...formData, featured_image_id: img.id })}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      cursor: 'pointer',
                      border: formData.featured_image_id === img.id
                        ? '3px solid ' + theme.accent
                        : '1px solid ' + theme.secondary,
                      padding: '0.25rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <img
                      src={`data:${img.image_type};base64,${img.image_data}`}
                      alt={img.image_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {formData.featured_image_id === img.id && (
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: theme.accent,
                        color: theme.bg,
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                      }}>
                        FEATURED
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {loadingImages && (
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: theme.textSecondary }}>
                  Loading images...
                </p>
              )}
            </div>
          )}

          {item.id && projectImages.length === 0 && !loadingImages && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme.secondary,
              border: `1px solid ${theme.secondary}`,
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: theme.textSecondary }}>
                No images uploaded yet. Go back to the admin panel to upload images for this project.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: theme.secondary,
                color: theme.text,
                border: `1px solid ${theme.secondary}`,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '700',
                fontFamily: 'inherit',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: theme.accent,
                color: theme.bg,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: '700',
                fontFamily: 'inherit',
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemEditor;
