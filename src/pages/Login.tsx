import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }

    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #2a2a2a',
          padding: '3rem',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            marginBottom: '3rem',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          PORTFOLIO
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                color: '#a0a0a0',
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0a0a0a',
                border: '1px solid #2a2a2a',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                cursor: isSubmitting ? 'not-allowed' : 'text',
                opacity: isSubmitting ? 0.6 : 1,
              }}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
                color: '#a0a0a0',
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0a0a0a',
                border: '1px solid #2a2a2a',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                cursor: isSubmitting ? 'not-allowed' : 'text',
                opacity: isSubmitting ? 0.6 : 1,
              }}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '1.5rem',
                padding: '0.75rem',
                backgroundColor: '#2a0a0a',
                border: '1px solid #5a2a2a',
                color: '#ff6b6b',
                fontSize: '0.875rem',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#FFD700',
              color: '#000000',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'opacity 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) (e.target as HTMLButtonElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) (e.target as HTMLButtonElement).style.opacity = '1';
            }}
          >
            {isSubmitting ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <div
          style={{
            marginTop: '2rem',
            fontSize: '0.75rem',
            color: '#666666',
            textAlign: 'center',
            fontFamily: 'Courier, monospace',
            lineHeight: '1.6',
          }}
        >
          Enter your credentials to access the portfolio.
        </div>
      </div>
    </div>
  );
};

export default Login;
