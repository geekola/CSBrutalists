import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { ChevronUp, ChevronDown, Trash2, Plus, Copy } from 'lucide-react';
import PortfolioItemEditor from '../components/PortfolioItemEditor';
import ResumeItemEditor from '../components/ResumeItemEditor';
import ConfirmDialog from '../components/ConfirmDialog';

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

interface ProjectImage {
  id: string;
  project_id: string;
  image_data: string;
  image_name: string;
  image_type: string;
  order: number;
}

interface ResumeContent {
  id: string;
  section: string;
  title: string;
  content: string;
  order: number;
}

interface AdminProps {
  onBack?: () => void;
}

const Admin: React.FC<AdminProps> = ({ onBack }) => {
  const { username } = useAuth();
  const { currentView, setCurrentView } = useAdmin();
  const { addToast } = useToast();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [projectImages, setProjectImages] = useState<{ [key: string]: ProjectImage[] }>({});
  const [resumeContent, setResumeContent] = useState<ResumeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  // Modal states
  const [portfolioEditorOpen, setPortfolioEditorOpen] = useState(false);
  const [portfolioEditingItem, setPortfolioEditingItem] = useState<PortfolioItem>({
    id: '',
    title: '',
    category: '',
    year: '',
    order: 0,
  });
  const [resumeEditorOpen, setResumeEditorOpen] = useState(false);
  const [resumeEditingItem, setResumeEditingItem] = useState<ResumeContent>({
    id: '',
    title: '',
    content: '',
    section: '',
    order: 0,
  });
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDangerous?: boolean;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [operationLoading, setOperationLoading] = useState(false);

  const theme = {
    dark: { bg: '#000000', secondary: '#2a2a2a', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#a0a0a0' },
    light: { bg: '#FFFFFF', secondary: '#f5f5f5', accent: '#FFD700', text: '#000000', textSecondary: '#666666' }
  };
  const currentTheme = isDark ? theme.dark : theme.light;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [portfolioRes, resumeRes] = await Promise.all([
        supabase.from('portfolio_items').select('*').order('order'),
        supabase.from('resume_content').select('*').order('order')
      ]);

      if (portfolioRes.data) setPortfolioItems(portfolioRes.data);
      if (resumeRes.data) setResumeContent(resumeRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioItem = async (id: string, updates: Partial<PortfolioItem>) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await loadData();
      setPortfolioEditorOpen(false);
      addToast('Portfolio item updated successfully', 'success');
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      addToast('Failed to update portfolio item', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const createPortfolioItem = async (item: Partial<PortfolioItem>) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .insert([{
          ...item,
          order: (portfolioItems.length || 0) + 1,
        }]);

      if (error) throw error;
      await loadData();
      setPortfolioEditorOpen(false);
      addToast('Portfolio item created successfully', 'success');
    } catch (error) {
      console.error('Error creating portfolio item:', error);
      addToast('Failed to create portfolio item', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const duplicatePortfolioItem = async (id: string) => {
    setOperationLoading(true);
    try {
      const item = portfolioItems.find(p => p.id === id);
      if (!item) throw new Error('Item not found');

      const { error } = await supabase
        .from('portfolio_items')
        .insert([{
          title: `${item.title} (Copy)`,
          category: item.category,
          year: item.year,
          image: item.image,
          description: item.description,
          order: (portfolioItems.length || 0) + 1,
        }]);

      if (error) throw error;
      await loadData();
      addToast('Portfolio item duplicated successfully', 'success');
    } catch (error) {
      console.error('Error duplicating portfolio item:', error);
      addToast('Failed to duplicate portfolio item', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const updateResumeContent = async (id: string, updates: Partial<ResumeContent>) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase
        .from('resume_content')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await loadData();
      setResumeEditorOpen(false);
      addToast('Resume section updated successfully', 'success');
    } catch (error) {
      console.error('Error updating resume content:', error);
      addToast('Failed to update resume section', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const createResumeContent = async (item: Partial<ResumeContent>) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase
        .from('resume_content')
        .insert([{
          ...item,
          order: (resumeContent.length || 0) + 1,
        }]);

      if (error) throw error;
      await loadData();
      setResumeEditorOpen(false);
      addToast('Resume section created successfully', 'success');
    } catch (error) {
      console.error('Error creating resume content:', error);
      addToast('Failed to create resume section', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const duplicateResumeContent = async (id: string) => {
    setOperationLoading(true);
    try {
      const item = resumeContent.find(r => r.id === id);
      if (!item) throw new Error('Item not found');

      const { error } = await supabase
        .from('resume_content')
        .insert([{
          title: `${item.title} (Copy)`,
          content: item.content,
          section: item.section,
          order: (resumeContent.length || 0) + 1,
        }]);

      if (error) throw error;
      await loadData();
      addToast('Resume section duplicated successfully', 'success');
    } catch (error) {
      console.error('Error duplicating resume content:', error);
      addToast('Failed to duplicate resume section', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const deletePortfolioItem = async (id: string) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      await loadData();
      addToast('Portfolio item deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      addToast('Failed to delete portfolio item', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteResumeContent = async (id: string) => {
    setOperationLoading(true);
    try {
      const { error } = await supabase.from('resume_content').delete().eq('id', id);
      if (error) throw error;
      await loadData();
      addToast('Resume section deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting resume content:', error);
      addToast('Failed to delete resume section', 'error');
    } finally {
      setOperationLoading(false);
    }
  };

  const moveItem = async (items: any[], id: string, direction: 'up' | 'down') => {
    const index = items.findIndex(item => item.id === id);
    if (direction === 'up' && index > 0) {
      const temp = items[index].order;
      items[index].order = items[index - 1].order;
      items[index - 1].order = temp;
    } else if (direction === 'down' && index < items.length - 1) {
      const temp = items[index].order;
      items[index].order = items[index + 1].order;
      items[index + 1].order = temp;
    }

    if (currentView === 'portfolio') {
      await updatePortfolioItem(id, { order: items[index].order });
    } else {
      await updateResumeContent(id, { order: items[index].order });
    }
  };

  const loadProjectImages = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectId)
        .order('order');

      if (error) throw error;
      if (data) {
        setProjectImages(prev => ({ ...prev, [projectId]: data }));
      }
    } catch (error) {
      console.error('Error loading project images:', error);
    }
  };

  const handleImageUpload = async (projectId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setUploadingImageId(projectId);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const { error } = await supabase
          .from('project_images')
          .insert([
            {
              project_id: projectId,
              image_data: base64,
              image_name: file.name,
              image_type: file.type,
              order: (projectImages[projectId]?.length || 0) + 1
            }
          ]);

        if (error) throw error;
        await loadProjectImages(projectId);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImageId(null);
    }
  };

  const deleteProjectImage = async (projectId: string, imageId: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      await loadProjectImages(projectId);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: currentTheme.bg, color: currentTheme.text, minHeight: '100vh' }}>
      <nav style={{
        borderBottom: `1px solid ${currentTheme.secondary}`, padding: '1.5rem 3rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', fontFamily: 'Roboto, sans-serif' }}>ADMIN PANEL</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: currentTheme.textSecondary, fontFamily: 'Courier, monospace' }}>{username}</span>
          {onBack && (
            <button onClick={onBack} style={{
              backgroundColor: currentTheme.secondary, color: currentTheme.text, border: `1px solid ${currentTheme.secondary}`,
              padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit'
            }}>
              BACK
            </button>
          )}
        </div>
      </nav>

      <div style={{ display: 'flex', borderBottom: `1px solid ${currentTheme.secondary}` }}>
        <button onClick={() => setCurrentView('portfolio')} style={{
          flex: 1, padding: '1rem', backgroundColor: currentView === 'portfolio' ? currentTheme.accent : 'transparent',
          color: currentView === 'portfolio' ? currentTheme.bg : currentTheme.text,
          border: 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'Roboto, sans-serif'
        }}>
          PORTFOLIO ITEMS
        </button>
        <button onClick={() => setCurrentView('resume')} style={{
          flex: 1, padding: '1rem', backgroundColor: currentView === 'resume' ? currentTheme.accent : 'transparent',
          color: currentView === 'resume' ? currentTheme.bg : currentTheme.text,
          border: 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'Roboto, sans-serif'
        }}>
          RESUME CONTENT
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 3rem' }}>
        {currentView === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0 }}>Portfolio Items</h2>
              <button
                onClick={() => {
                  setPortfolioEditingItem({ id: '', title: '', category: '', year: '', order: 0 });
                  setPortfolioEditorOpen(true);
                }}
                disabled={operationLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: currentTheme.accent,
                  color: currentTheme.bg,
                  border: 'none',
                  cursor: operationLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: operationLoading ? 0.6 : 1,
                }}
              >
                <Plus size={18} />
                NEW ITEM
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {portfolioItems.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    border: `1px solid ${currentTheme.secondary}`,
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700' }}>{item.title}</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: currentTheme.textSecondary }}>
                        {item.category} | {item.year} {item.image && `| ${item.image}`}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={() => { setExpandedProject(expandedProject === item.id ? null : item.id); if (expandedProject !== item.id) loadProjectImages(item.id); }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: currentTheme.secondary,
                          color: currentTheme.text,
                          border: `1px solid ${currentTheme.secondary}`,
                          cursor: 'pointer',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          fontSize: '0.75rem',
                        }}
                      >
                        {expandedProject === item.id ? 'HIDE' : 'IMAGES'}
                      </button>
                      <button
                        onClick={() => moveItem(portfolioItems, item.id, 'up')}
                        disabled={idx === 0 || operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: currentTheme.secondary,
                          border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text,
                          cursor: idx === 0 || operationLoading ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 || operationLoading ? 0.5 : 1,
                        }}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveItem(portfolioItems, item.id, 'down')}
                        disabled={idx === portfolioItems.length - 1 || operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: currentTheme.secondary,
                          border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text,
                          cursor: idx === portfolioItems.length - 1 || operationLoading ? 'not-allowed' : 'pointer',
                          opacity: idx === portfolioItems.length - 1 || operationLoading ? 0.5 : 1,
                        }}
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setPortfolioEditingItem(item);
                          setPortfolioEditorOpen(true);
                        }}
                        disabled={operationLoading}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: currentTheme.accent,
                          color: currentTheme.bg,
                          border: 'none',
                          cursor: operationLoading ? 'not-allowed' : 'pointer',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          opacity: operationLoading ? 0.6 : 1,
                        }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => duplicatePortfolioItem(item.id)}
                        disabled={operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: currentTheme.secondary,
                          border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text,
                          cursor: operationLoading ? 'not-allowed' : 'pointer',
                          opacity: operationLoading ? 0.6 : 1,
                        }}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Delete Portfolio Item',
                            message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
                            isDangerous: true,
                            onConfirm: () => {
                              deletePortfolioItem(item.id);
                              setConfirmDialog({ ...confirmDialog, isOpen: false });
                            },
                          });
                        }}
                        disabled={operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#5a2a2a',
                          border: `1px solid #5a2a2a`,
                          color: '#ff6b6b',
                          cursor: operationLoading ? 'not-allowed' : 'pointer',
                          opacity: operationLoading ? 0.6 : 1,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {expandedProject === item.id && (
                    <div style={{ borderTop: `1px solid ${currentTheme.secondary}`, paddingTop: '1rem', marginTop: '1rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>
                          Upload Images:
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            const files = e.currentTarget.files;
                            if (files) {
                              Array.from(files).forEach(file => handleImageUpload(item.id, file));
                            }
                          }}
                          disabled={uploadingImageId === item.id}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: currentTheme.bg,
                            border: `1px solid ${currentTheme.secondary}`,
                            color: currentTheme.text,
                            fontFamily: 'inherit',
                            width: '100%',
                            cursor: uploadingImageId === item.id ? 'not-allowed' : 'pointer',
                            opacity: uploadingImageId === item.id ? 0.6 : 1,
                          }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                        {projectImages[item.id]?.map((img) => (
                          <div key={img.id} style={{ position: 'relative', aspectRatio: '1' }}>
                            <img
                              src={`data:${img.image_type};base64,${img.image_data}`}
                              alt={img.image_name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Delete Image',
                                  message: 'Are you sure you want to delete this image?',
                                  isDangerous: true,
                                  onConfirm: () => {
                                    deleteProjectImage(item.id, img.id);
                                    setConfirmDialog({ ...confirmDialog, isOpen: false });
                                  },
                                });
                              }}
                              style={{
                                position: 'absolute',
                                top: '0.25rem',
                                right: '0.25rem',
                                backgroundColor: '#5a2a2a',
                                color: '#ff6b6b',
                                border: 'none',
                                padding: '0.25rem',
                                cursor: 'pointer',
                                borderRadius: '0',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      {!projectImages[item.id]?.length && (
                        <p style={{ fontSize: '0.875rem', color: currentTheme.textSecondary }}>No images yet</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {portfolioItems.length === 0 && (
                <p style={{ color: currentTheme.textSecondary, textAlign: 'center', padding: '2rem' }}>
                  No portfolio items yet. Click "New Item" to create one.
                </p>
              )}
            </div>
          </div>
        )}

        {currentView === 'resume' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0 }}>Resume Content</h2>
              <button
                onClick={() => {
                  setResumeEditingItem({ id: '', title: '', content: '', section: '', order: 0 });
                  setResumeEditorOpen(true);
                }}
                disabled={operationLoading}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: currentTheme.accent,
                  color: currentTheme.bg,
                  border: 'none',
                  cursor: operationLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: operationLoading ? 0.6 : 1,
                }}
              >
                <Plus size={18} />
                NEW SECTION
              </button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {resumeContent.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    border: `1px solid ${currentTheme.secondary}`,
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700' }}>{item.title}</h3>
                      <div
                        style={{ margin: 0, fontSize: '0.875rem', color: currentTheme.textSecondary, lineHeight: '1.6' }}
                        dangerouslySetInnerHTML={{
                          __html: item.content.replace(/<[^>]*>/g, '').substring(0, 100) + (item.content.length > 100 ? '...' : ''),
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      <button
                        onClick={() => moveItem(resumeContent, item.id, 'up')}
                        disabled={idx === 0 || operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: currentTheme.secondary,
                          border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text,
                          cursor: idx === 0 || operationLoading ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 || operationLoading ? 0.5 : 1,
                        }}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveItem(resumeContent, item.id, 'down')}
                        disabled={idx === resumeContent.length - 1 || operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: currentTheme.secondary,
                          border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text,
                          cursor: idx === resumeContent.length - 1 || operationLoading ? 'not-allowed' : 'pointer',
                          opacity: idx === resumeContent.length - 1 || operationLoading ? 0.5 : 1,
                        }}
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setResumeEditingItem(item);
                          setResumeEditorOpen(true);
                        }}
                        disabled={operationLoading}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: currentTheme.accent,
                          color: currentTheme.bg,
                          border: 'none',
                          cursor: operationLoading ? 'not-allowed' : 'pointer',
                          fontWeight: '700',
                          fontFamily: 'inherit',
                          opacity: operationLoading ? 0.6 : 1,
                        }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => duplicateResumeContent(item.id)}
                        disabled={operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: currentTheme.secondary,
                          border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text,
                          cursor: operationLoading ? 'not-allowed' : 'pointer',
                          opacity: operationLoading ? 0.6 : 1,
                        }}
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Delete Resume Section',
                            message: `Are you sure you want to delete "${item.title}"? This action cannot be undone.`,
                            isDangerous: true,
                            onConfirm: () => {
                              deleteResumeContent(item.id);
                              setConfirmDialog({ ...confirmDialog, isOpen: false });
                            },
                          });
                        }}
                        disabled={operationLoading}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#5a2a2a',
                          border: `1px solid #5a2a2a`,
                          color: '#ff6b6b',
                          cursor: operationLoading ? 'not-allowed' : 'pointer',
                          opacity: operationLoading ? 0.6 : 1,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {resumeContent.length === 0 && (
                <p style={{ color: currentTheme.textSecondary, textAlign: 'center', padding: '2rem' }}>
                  No resume sections yet. Click "New Section" to create one.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <PortfolioItemEditor
        item={portfolioEditingItem}
        isOpen={portfolioEditorOpen}
        isLoading={operationLoading}
        onSave={(item) => {
          if (item.id) {
            updatePortfolioItem(item.id, item);
          } else {
            createPortfolioItem(item);
          }
        }}
        onCancel={() => setPortfolioEditorOpen(false)}
        theme={currentTheme}
      />

      <ResumeItemEditor
        item={resumeEditingItem}
        isOpen={resumeEditorOpen}
        isLoading={operationLoading}
        onSave={(item) => {
          if (item.id) {
            updateResumeContent(item.id, item);
          } else {
            createResumeContent(item);
          }
        }}
        onCancel={() => setResumeEditorOpen(false)}
        theme={currentTheme}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDangerous={confirmDialog.isDangerous}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        theme={currentTheme}
      />
    </div>
  );
};

export default Admin;
