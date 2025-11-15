import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Portfolio from './refined-brutalist-portfolio';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

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

  return isAuthenticated ? <Portfolio /> : <Login />;
}

export default App;
