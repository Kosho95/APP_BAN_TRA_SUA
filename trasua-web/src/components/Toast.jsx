import React, { useEffect } from 'react';
import { CheckCircle2, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2600);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 480, damping: 25 }}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 130,
          background: 'linear-gradient(135deg, #4E342E 0%, #2D1B16 100%)',
          color: '#FFF8EE',
          padding: '14px 20px',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 12px 32px rgba(45, 27, 22, 0.4), 0 2px 6px rgba(255, 255, 255, 0.1) inset',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: 700,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          maxWidth: '90vw'
        }}
      >
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-orange)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(224, 122, 95, 0.4)'
        }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <span>{toast.message}</span>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={onClose}
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '2px',
            marginLeft: '6px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={15} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
