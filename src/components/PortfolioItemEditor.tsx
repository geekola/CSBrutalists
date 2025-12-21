import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Edit2, ChevronUp, ChevronDown, Star, Image as ImageIcon } from 'lucide-react';
import TipTapEditor from './TipTapEditor';
import { ValidationError, validatePortfolioItem } from '../utils/validation';
import { supabase } from '../lib/supabase';
import { processImage } from '../utils/imageUtils';

interface ProjectImage {
  id: string;
  project_id: string;
  image_data: string;
  image_name: string;
  image_type: string;
  order: number;
  caption: string;
  alt_text: string;
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
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [editingImage, setEditingImage] = useState<ProjectImage | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editAltText, setEditAltText] = useState('');
  const [savingCaption, setSavingCaption] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0 || !item.id) return;

    const fileArray = Array.from(files);
    const fileNames = fileArray.map(f => f.name);
    setUploadingFiles(prev => [...prev, ...fileNames]);

    for (const file of fileArray) {
      try {
        const base64WithPrefix = await processImage(file);
        const base64 = base64WithPrefix.split(',')[1];

        const { error } = await supabase
          .from('project_images')
          .insert([{
            project_id: item.id,
            image_data: base64,
            image_name: file.name,
            image_type: file.type,
            order: (projectImages.length || 0) + 1,
            caption: '',
            alt_text: ''
          }]);

        if (error) throw error;
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setUploadingFiles(prev => prev.filter(name => name !== file.name));
      }
    }

    if (item.id) {
      await loadProjectImages(item.id);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      if (formData.featured_image_id === imageId) {
        setFormData({ ...formData, featured_image_id: undefined });
        setIsDirty(true);
      }

      if (item.id) {
        await loadProjectImages(item.id);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const openEditCaption = (image: ProjectImage) => {
    setEditingImage(image);
    setEditCaption(image.caption || '');
    setEditAltText(image.alt_text || '');
  };

  const saveCaption = async () => {
    if (!editingImage) return;

    setSavingCaption(true);
    try {
      const { error } = await supabase
        .from('project_images')
        .update({
          caption: editCaption,
          alt_text: editAltText
        })
        .eq('id', editingImage.id);

      if (error) throw error;

      if (item.id) {
        await loadProjectImages(item.id);
      }
      setEditingImage(null);
    } catch (error) {
      console.error('Error saving caption:', error);
      alert('Failed to save caption');
    } finally {
      setSavingCaption(false);
    }
  };

  const moveImage = async (imageId: string, direction: 'up' | 'down') => {
    const index = projectImages.findIndex(img => img.id === imageId);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === projectImages.length - 1) return;

    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const currentOrder = projectImages[index].order;
    const swapOrder = projectImages[swapIndex].order;

    try {
      await supabase
        .from('project_images')
        .update({ order: swapOrder })
        .eq('id', projectImages[index].id);

      await supabase
        .from('project_images')
        .update({ order: currentOrder })
        .eq('id', projectImages[swapIndex].id);

      if (item.id) {
        await loadProjectImages(item.id);
      }
    } catch (error) {
      console.error('Error reordering images:', error);
      alert('Failed to reorder images');
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
    if (uploadingFiles.length > 0) {
      alert('Please wait for image uploads to complete before closing.');
      return;
    }
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
          maxWidth: '900px',
          width: '95%',
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

          {item.id && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                Gallery Images
              </label>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.75rem', color: theme.textSecondary }}>
                Upload images (max 5MB each, JPEG/PNG/GIF/WebP). Click star icon to set featured image.
              </p>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragActive ? theme.accent : theme.secondary}`,
                  borderRadius: '0.25rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: dragActive ? theme.secondary : 'transparent',
                  transition: 'all 0.2s',
                  marginBottom: '1rem',
                }}
              >
                <Upload size={32} style={{ margin: '0 auto 0.5rem', display: 'block', color: theme.textSecondary }} />
                <p style={{ margin: 0, fontSize: '0.875rem', color: theme.text }}>
                  Click to browse or drag and drop images here
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  style={{ display: 'none' }}
                />
              </div>

              {uploadingFiles.length > 0 && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: theme.secondary }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: theme.textSecondary }}>
                    Uploading: {uploadingFiles.join(', ')}
                  </p>
                </div>
              )}

              {loadingImages && (
                <p style={{ fontSize: '0.75rem', color: theme.textSecondary, marginBottom: '1rem' }}>
                  Loading images...
                </p>
              )}

              {projectImages.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '0.75rem',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  border: `1px solid ${theme.secondary}`,
                }}>
                  {projectImages.map((img, idx) => (
                    <div
                      key={img.id}
                      style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        border: formData.featured_image_id === img.id
                          ? `3px solid ${theme.accent}`
                          : `1px solid ${theme.secondary}`,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={`data:${img.image_type};base64,${img.image_data}`}
                        alt={img.alt_text || img.image_name}
                        title={img.caption || img.image_name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />

                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        display: 'flex',
                        gap: '0.25rem',
                        padding: '0.25rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      }}>
                        <button
                          onClick={() => setFormData({ ...formData, featured_image_id: img.id })}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: formData.featured_image_id === img.id ? theme.accent : 'transparent',
                            color: formData.featured_image_id === img.id ? theme.bg : theme.accent,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Set as featured image"
                        >
                          <Star size={14} fill={formData.featured_image_id === img.id ? theme.bg : 'none'} />
                        </button>
                        <button
                          onClick={() => openEditCaption(img)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Edit caption and alt text"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteImage(img.id)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#ff6b6b',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Delete image"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        gap: '0.25rem',
                        padding: '0.25rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        justifyContent: 'center',
                      }}>
                        <button
                          onClick={() => moveImage(img.id, 'up')}
                          disabled={idx === 0}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: idx === 0 ? 'not-allowed' : 'pointer',
                            opacity: idx === 0 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => moveImage(img.id, 'down')}
                          disabled={idx === projectImages.length - 1}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: idx === projectImages.length - 1 ? 'not-allowed' : 'pointer',
                            opacity: idx === projectImages.length - 1 ? 0.3 : 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {img.caption && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2rem',
                          left: 0,
                          right: 0,
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          fontSize: '0.65rem',
                          color: '#FFFFFF',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!loadingImages && projectImages.length === 0 && (
                <div style={{
                  padding: '2rem',
                  backgroundColor: theme.secondary,
                  textAlign: 'center',
                  border: `1px solid ${theme.secondary}`,
                }}>
                  <ImageIcon size={48} style={{ margin: '0 auto 1rem', display: 'block', color: theme.textSecondary }} />
                  <p style={{ margin: 0, fontSize: '0.875rem', color: theme.textSecondary }}>
                    No images uploaded yet. Upload your first image above.
                  </p>
                </div>
              )}
            </div>
          )}

          {!item.id && (
            <div style={{
              padding: '1rem',
              backgroundColor: theme.secondary,
              border: `1px solid ${theme.secondary}`,
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: theme.textSecondary }}>
                Save this portfolio item first before uploading images.
              </p>
            </div>
          )}

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

      {editingImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001,
          }}
          onClick={() => setEditingImage(null)}
        >
          <div
            style={{
              backgroundColor: theme.bg,
              border: `1px solid ${theme.secondary}`,
              borderRadius: '0.25rem',
              padding: '1.5rem',
              maxWidth: '500px',
              width: '90%',
              pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '700' }}>
              Edit Image Caption and Alt Text
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <img
                src={`data:${editingImage.image_type};base64,${editingImage.image_data}`}
                alt={editingImage.image_name}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  marginBottom: '1rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                Caption (visible to users)
              </label>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="e.g., Project mockup on laptop screen"
                autoFocus={true}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.secondary}`,
                  color: theme.text,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  pointerEvents: 'auto',
                }}
              />
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: theme.textSecondary }}>
                {editCaption.length} characters
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                Alt Text (for accessibility)
              </label>
              <input
                type="text"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
                placeholder="e.g., Website design mockup displayed on a laptop"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.secondary}`,
                  color: theme.text,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  pointerEvents: 'auto',
                }}
              />
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: theme.textSecondary }}>
                {editAltText.length} characters
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setEditingImage(null)}
                disabled={savingCaption}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: theme.secondary,
                  color: theme.text,
                  border: `1px solid ${theme.secondary}`,
                  cursor: savingCaption ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  opacity: savingCaption ? 0.6 : 1,
                }}
              >
                CANCEL
              </button>
              <button
                onClick={saveCaption}
                disabled={savingCaption}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: theme.accent,
                  color: theme.bg,
                  border: 'none',
                  cursor: savingCaption ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  opacity: savingCaption ? 0.6 : 1,
                }}
              >
                {savingCaption ? 'SAVING...' : 'SAVE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioItemEditor;
