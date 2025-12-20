import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Portfolio from './refined-brutalist-portfolio';
import ProjectDetails from './pages/ProjectDetails';
import Admin from './pages/Admin';
import { AdminProvider } from './contexts/AdminContext';
import { ToastProvider } from './contexts/ToastContext';
import Toast from './components/Toast';

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

  return (
    <ToastProvider>
      <AdminProvider>
        {showAdmin ? (
          <Admin onBack={() => setShowAdmin(false)} />
        ) : selectedProject ? (
          <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />
        ) : (
          <Portfolio onAdminClick={() => setShowAdmin(true)} onProjectClick={setSelectedProject} />
        )}
      </AdminProvider>
      <Toast />
    </ToastProvider>
  );
}

export default App;
