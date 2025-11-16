import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Portfolio from './refined-brutalist-portfolio';
import Admin from './pages/Admin';
import { AdminProvider } from './contexts/AdminContext';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);

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
    <AdminProvider>
      {showAdmin ? (
        <Admin onBack={() => setShowAdmin(false)} />
      ) : (
        <Portfolio onAdminClick={() => setShowAdmin(true)} />
      )}
    </AdminProvider>
  );
}

export default App;
