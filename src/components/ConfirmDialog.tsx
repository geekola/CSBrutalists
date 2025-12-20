import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  theme: any;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  isDangerous = false,
  onConfirm,
  onCancel,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: theme.bg,
          border: `1px solid ${theme.secondary}`,
          borderRadius: '0.25rem',
          padding: '2rem',
          maxWidth: '400px',
          width: '90%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '700' }}>
          {title}
        </h2>
        <p style={{ margin: '0 0 2rem 0', color: theme.textSecondary, lineHeight: '1.6' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: theme.secondary,
              color: theme.text,
              border: `1px solid ${theme.secondary}`,
              cursor: 'pointer',
              fontWeight: '700',
              fontFamily: 'inherit',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: isDangerous ? '#8b3a3a' : theme.accent,
              color: isDangerous ? '#ff6b6b' : theme.bg,
              border: isDangerous ? '1px solid #8b3a3a' : 'none',
              cursor: 'pointer',
              fontWeight: '700',
              fontFamily: 'inherit',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
