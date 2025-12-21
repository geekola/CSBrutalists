import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Portfolio from './refined-brutalist-portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';
import { AdminProvider } from './contexts/AdminContext';
import { ToastProvider } from './contexts/ToastContext';
import { SEOProvider } from './contexts/SEOContext';
import Toast from './components/Toast';
import { supabase } from './lib/supabase';

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

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolioItems();
    }
  }, [isAuthenticated]);

  const loadPortfolioItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('order');

      if (error) throw error;
      if (data) setPortfolioItems(data);
    } catch (error) {
      console.error('Error loading portfolio items:', error);
    }
  };

  const handleProjectNavigation = (direction: 'prev' | 'next') => {
    if (!selectedProject || portfolioItems.length === 0) return;

    const currentIndex = portfolioItems.findIndex(item => item.id === selectedProject.id);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : portfolioItems.length - 1;
    } else {
      newIndex = currentIndex < portfolioItems.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedProject(portfolioItems[newIndex]);
  };

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const getCurrentProjectIndex = () => {
    if (!selectedProject) return -1;
    return portfolioItems.findIndex(item => item.id === selectedProject.id);
  };

  return (
    <SEOProvider>
      <ToastProvider>
        <AdminProvider>
          {showAdmin ? (
            <Admin onBack={() => setShowAdmin(false)} />
          ) : selectedProject ? (
            <ProjectDetails
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
              onNavigate={handleProjectNavigation}
              currentIndex={getCurrentProjectIndex()}
              totalProjects={portfolioItems.length}
            />
          ) : (
            <Portfolio onAdminClick={() => setShowAdmin(true)} onProjectClick={setSelectedProject} />
          )}
        </AdminProvider>
        <Toast />
      </ToastProvider>
    </SEOProvider>
  );
}

export default App;
