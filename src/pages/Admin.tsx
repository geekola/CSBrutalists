import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../lib/supabase';
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string | null;
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
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [resumeContent, setResumeContent] = useState<ResumeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PortfolioItem | ResumeContent>>({});

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
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await loadData();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating portfolio item:', error);
    }
  };

  const updateResumeContent = async (id: string, updates: Partial<ResumeContent>) => {
    try {
      const { error } = await supabase
        .from('resume_content')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await loadData();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating resume content:', error);
    }
  };

  const deletePortfolioItem = async (id: string) => {
    if (!confirm('Delete this portfolio item?')) return;
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  const deleteResumeContent = async (id: string) => {
    if (!confirm('Delete this resume section?')) return;
    try {
      const { error } = await supabase.from('resume_content').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error deleting resume content:', error);
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
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '2rem' }}>Portfolio Items</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {portfolioItems.map((item, idx) => (
                <div key={item.id} style={{
                  border: `1px solid ${currentTheme.secondary}`, padding: '1.5rem',
                  backgroundColor: editingId === item.id ? currentTheme.secondary : 'transparent'
                }}>
                  {editingId === item.id ? (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <input type="text" defaultValue={item.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" style={{
                        padding: '0.75rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                        color: currentTheme.text, fontFamily: 'inherit'
                      }} />
                      <input type="text" defaultValue={item.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" style={{
                        padding: '0.75rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                        color: currentTheme.text, fontFamily: 'inherit'
                      }} />
                      <input type="text" defaultValue={item.year} onChange={(e) => setEditForm({ ...editForm, year: e.target.value })} placeholder="Year" style={{
                        padding: '0.75rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                        color: currentTheme.text, fontFamily: 'inherit'
                      }} />
                      <input type="text" defaultValue={item.image || ''} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} placeholder="Image (filename)" style={{
                        padding: '0.75rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                        color: currentTheme.text, fontFamily: 'inherit'
                      }} />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => updatePortfolioItem(item.id, editForm)} style={{
                          flex: 1, padding: '0.75rem', backgroundColor: currentTheme.accent, color: currentTheme.bg,
                          border: 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit'
                        }}>
                          SAVE
                        </button>
                        <button onClick={() => setEditingId(null)} style={{
                          flex: 1, padding: '0.75rem', backgroundColor: currentTheme.secondary, color: currentTheme.text,
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                        }}>
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700' }}>{item.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: currentTheme.textSecondary }}>
                          {item.category} | {item.year} {item.image && `| ${item.image}`}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => moveItem(portfolioItems, item.id, 'up')} disabled={idx === 0} style={{
                          padding: '0.5rem', backgroundColor: currentTheme.secondary, border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text, cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.5 : 1
                        }}>
                          <ChevronUp size={16} />
                        </button>
                        <button onClick={() => moveItem(portfolioItems, item.id, 'down')} disabled={idx === portfolioItems.length - 1} style={{
                          padding: '0.5rem', backgroundColor: currentTheme.secondary, border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text, cursor: idx === portfolioItems.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === portfolioItems.length - 1 ? 0.5 : 1
                        }}>
                          <ChevronDown size={16} />
                        </button>
                        <button onClick={() => { setEditingId(item.id); setEditForm(item); }} style={{
                          padding: '0.5rem 1rem', backgroundColor: currentTheme.accent, color: currentTheme.bg,
                          border: 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit'
                        }}>
                          EDIT
                        </button>
                        <button onClick={() => deletePortfolioItem(item.id)} style={{
                          padding: '0.5rem', backgroundColor: '#5a2a2a', border: `1px solid #5a2a2a`,
                          color: '#ff6b6b', cursor: 'pointer'
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'resume' && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '2rem' }}>Resume Content</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {resumeContent.map((item, idx) => (
                <div key={item.id} style={{
                  border: `1px solid ${currentTheme.secondary}`, padding: '1.5rem',
                  backgroundColor: editingId === item.id ? currentTheme.secondary : 'transparent'
                }}>
                  {editingId === item.id ? (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <input type="text" defaultValue={item.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Section Title" style={{
                        padding: '0.75rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                        color: currentTheme.text, fontFamily: 'inherit'
                      }} />
                      <textarea defaultValue={item.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} placeholder="Content" rows={6} style={{
                        padding: '0.75rem', backgroundColor: currentTheme.bg, border: `1px solid ${currentTheme.secondary}`,
                        color: currentTheme.text, fontFamily: 'inherit', resize: 'vertical'
                      }} />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => updateResumeContent(item.id, editForm)} style={{
                          flex: 1, padding: '0.75rem', backgroundColor: currentTheme.accent, color: currentTheme.bg,
                          border: 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit'
                        }}>
                          SAVE
                        </button>
                        <button onClick={() => setEditingId(null)} style={{
                          flex: 1, padding: '0.75rem', backgroundColor: currentTheme.secondary, color: currentTheme.text,
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit'
                        }}>
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '700' }}>{item.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: currentTheme.textSecondary, lineHeight: '1.6' }}>
                          {item.content.substring(0, 100)}...
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                        <button onClick={() => moveItem(resumeContent, item.id, 'up')} disabled={idx === 0} style={{
                          padding: '0.5rem', backgroundColor: currentTheme.secondary, border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text, cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.5 : 1
                        }}>
                          <ChevronUp size={16} />
                        </button>
                        <button onClick={() => moveItem(resumeContent, item.id, 'down')} disabled={idx === resumeContent.length - 1} style={{
                          padding: '0.5rem', backgroundColor: currentTheme.secondary, border: `1px solid ${currentTheme.secondary}`,
                          color: currentTheme.text, cursor: idx === resumeContent.length - 1 ? 'not-allowed' : 'pointer', opacity: idx === resumeContent.length - 1 ? 0.5 : 1
                        }}>
                          <ChevronDown size={16} />
                        </button>
                        <button onClick={() => { setEditingId(item.id); setEditForm(item); }} style={{
                          padding: '0.5rem 1rem', backgroundColor: currentTheme.accent, color: currentTheme.bg,
                          border: 'none', cursor: 'pointer', fontWeight: '700', fontFamily: 'inherit'
                        }}>
                          EDIT
                        </button>
                        <button onClick={() => deleteResumeContent(item.id)} style={{
                          padding: '0.5rem', backgroundColor: '#5a2a2a', border: `1px solid #5a2a2a`,
                          color: '#ff6b6b', cursor: 'pointer'
                        }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
