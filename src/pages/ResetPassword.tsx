import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ResetPasswordProps {
  onSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    const result = await resetPassword(password);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Failed to reset password');
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
            marginBottom: '1rem',
            textAlign: 'center',
            letterSpacing: '0.05em',
          }}
        >
          SET NEW PASSWORD
        </div>

        <div
          style={{
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#a0a0a0',
            textAlign: 'center',
            lineHeight: '1.6',
          }}
        >
          Enter your new password below.
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
              NEW PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
              minLength={6}
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
              autoComplete="new-password"
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
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              required
              minLength={6}
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
              autoComplete="new-password"
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
            {isSubmitting ? 'RESETTING...' : 'RESET PASSWORD'}
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
          Your password must be at least 6 characters long.
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
