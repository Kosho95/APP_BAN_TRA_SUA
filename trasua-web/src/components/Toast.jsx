import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2400);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div
      className="animate-toast"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 130,
        backgroundColor: 'var(--primary-700)',
        color: '#fff',
        padding: '12px 18px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 8px 24px rgba(62, 39, 35, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13.5px',
        fontWeight: 600
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'var(--matcha-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CheckCircle2 size={16} color="#fff" />
      </div>
      <span>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '2px',
          marginLeft: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
