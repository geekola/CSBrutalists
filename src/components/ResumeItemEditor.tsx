import React, { useState, useEffect } from 'react';
import TipTapEditor from './TipTapEditor';
import { ValidationError, validateResumeItem } from '../utils/validation';

interface ResumeItemEditorProps {
  item: {
    id?: string;
    title: string;
    content: string;
    section?: string;
  };
  isOpen: boolean;
  isLoading?: boolean;
  onSave: (item: any) => void;
  onCancel: () => void;
  theme: any;
}

const ResumeItemEditor: React.FC<ResumeItemEditorProps> = ({
  item,
  isOpen,
  isLoading = false,
  onSave,
  onCancel,
  theme,
}) => {
  const [formData, setFormData] = useState(item);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [originalData, setOriginalData] = useState(item);

  useEffect(() => {
    setFormData(item);
    setOriginalData(item);
    setErrors([]);
    setIsDirty(false);
  }, [item, isOpen]);

  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setIsDirty(hasChanges);
  }, [formData, originalData]);

  const handleSave = () => {
    const validationErrors = validateResumeItem(formData);
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

  const resumeSections = [
    'Experience',
    'Education',
    'Skills',
    'Certifications',
    'Projects',
    'Awards',
    'Publications',
    'Volunteer',
    'Other'
  ];

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
          maxWidth: '700px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
          {item.id ? 'EDIT RESUME SECTION' : 'CREATE RESUME SECTION'}
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
              Section <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <select
              value={formData.section || ''}
              onChange={(e) => {
                setFormData({ ...formData, section: e.target.value });
                setErrors(errors.filter(e => e.field !== 'section'));
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: theme.bg,
                border: hasError('section') ? '1px solid #ff6b6b' : `1px solid ${theme.secondary}`,
                color: theme.text,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="">Select a section...</option>
              {resumeSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            {hasError('section') && (
              <p style={{ margin: '0.25rem 0 0 0', color: '#ff6b6b', fontSize: '0.75rem' }}>
                {getErrorMessage('section')}
              </p>
            )}
          </div>

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
              placeholder="e.g., Senior Software Engineer, Computer Science Degree"
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

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
              Content <span style={{ color: '#ff6b6b' }}>*</span>
            </label>
            <div style={{ border: hasError('content') ? '1px solid #ff6b6b' : 'none' }}>
              <TipTapEditor
                content={formData.content}
                onChange={(html) => {
                  setFormData({ ...formData, content: html });
                  setErrors(errors.filter(e => e.field !== 'content'));
                }}
                theme={theme}
              />
            </div>
            {hasError('content') && (
              <p style={{ margin: '0.25rem 0 0 0', color: '#ff6b6b', fontSize: '0.75rem' }}>
                {getErrorMessage('content')}
              </p>
            )}
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
    </div>
  );
};

export default ResumeItemEditor;
