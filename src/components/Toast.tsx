import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {toasts.map(toast => {
        const bgColor = {
          success: '#1a3a2a',
          error: '#3a1a1a',
          info: '#1a2a3a',
        }[toast.type];

        const textColor = {
          success: '#4ade80',
          error: '#ff6b6b',
          info: '#60a5fa',
        }[toast.type];

        const Icon = {
          success: CheckCircle,
          error: AlertCircle,
          info: Info,
        }[toast.type];

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: '1rem 1.5rem',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              minWidth: '300px',
              border: `1px solid ${textColor}`,
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <Icon size={20} />
            <span style={{ flex: 1, fontSize: '0.875rem' }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: textColor,
                cursor: 'pointer',
                padding: '0',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
