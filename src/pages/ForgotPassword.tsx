import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await requestPasswordReset(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Failed to send reset email');
    }

    setIsSubmitting(false);
  };

  if (success) {
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
              marginBottom: '2rem',
              textAlign: 'center',
              letterSpacing: '0.05em',
            }}
          >
            CHECK YOUR EMAIL
          </div>

          <div
            style={{
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: '#0a2a0a',
              border: '1px solid #2a5a2a',
              color: '#6bff6b',
              fontSize: '0.875rem',
              lineHeight: '1.6',
            }}
          >
            We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to reset your password.
          </div>

          <button
            onClick={onBack}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '1px solid #2a2a2a',
              fontSize: '0.875rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#FFD700';
              (e.target as HTMLButtonElement).style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              (e.target as HTMLButtonElement).style.color = '#FFFFFF';
            }}
          >
            BACK TO LOGIN
          </button>

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
            Didn't receive the email? Check your spam folder or try again.
          </div>
        </div>
      </div>
    );
  }

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
          RESET PASSWORD
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
          Enter your email address and we'll send you a link to reset your password.
        </div>

        <form onSubmit={handleSubmit}>
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
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
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
              marginBottom: '1rem',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) (e.target as HTMLButtonElement).style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) (e.target as HTMLButtonElement).style.opacity = '1';
            }}
          >
            {isSubmitting ? 'SENDING...' : 'SEND RESET LINK'}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'transparent',
              color: '#FFFFFF',
              border: '1px solid #2a2a2a',
              fontSize: '0.875rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.backgroundColor = '#1a1a1a';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }
            }}
          >
            BACK TO LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
