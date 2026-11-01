import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * FluidButton - Component nút bấm tương tác dòng chảy chất lỏng
 * Khi hover, một lớp sóng chất lỏng (trà sữa / kem / matcha) dâng lên cuộn trào bên trong nút
 */
export default function FluidButton({
  children,
  onClick,
  fluidColor,
  variant = 'milktea',
  className = '',
  style = {},
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Bảng màu chất lỏng theo từng phong cách đồ uống
  const getVariantStyles = () => {
    switch (variant) {
      case 'matcha':
        return {
          baseBg: '#E8F5E9',
          baseText: '#2D6A4F',
          fluidGradient: fluidColor || 'linear-gradient(135deg, #40916C 0%, #1B4332 100%)',
          hoverText: '#FFFFFF',
          border: '1.5px solid rgba(45, 106, 79, 0.2)',
          shadow: '0 6px 18px rgba(45, 106, 79, 0.3)'
        };
      case 'coffee':
        return {
          baseBg: '#F5EBE6',
          baseText: '#4E342E',
          fluidGradient: fluidColor || 'linear-gradient(135deg, #6D4C41 0%, #3E2723 100%)',
          hoverText: '#FFFFFF',
          border: '1.5px solid rgba(78, 52, 46, 0.2)',
          shadow: '0 6px 18px rgba(62, 39, 35, 0.35)'
        };
      case 'peach':
        return {
          baseBg: '#FDF0ED',
          baseText: '#E07A5F',
          fluidGradient: fluidColor || 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
          hoverText: '#FFFFFF',
          border: '1.5px solid rgba(224, 122, 95, 0.2)',
          shadow: '0 6px 18px rgba(224, 122, 95, 0.35)'
        };
      case 'milktea':
      default:
        return {
          baseBg: '#FFF4ED',
          baseText: '#A0522D',
          fluidGradient: fluidColor || 'linear-gradient(135deg, #D4A373 0%, #B06C3B 100%)',
          hoverText: '#FFFFFF',
          border: '1.5px solid rgba(194, 120, 72, 0.2)',
          shadow: '0 6px 18px rgba(176, 108, 59, 0.32)'
        };
    }
  };

  const v = getVariantStyles();

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 450, damping: 18 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`fluid-btn ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '9px 18px',
        borderRadius: '9999px',
        backgroundColor: v.baseBg,
        color: isHovered ? v.hoverText : v.baseText,
        fontSize: '13px',
        fontWeight: 800,
        border: v.border,
        boxShadow: isHovered ? v.shadow : '0 2px 6px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'color 0.35s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        ...style
      }}
      {...props}
    >
      {/* KHỐI SÓNG CHẤT LỎNG TRÀ SỮA DÂNG LÊN KHI HOVER */}
      <div
        style={{
          position: 'absolute',
          left: '-20%',
          width: '140%',
          height: '240%',
          bottom: isHovered ? '-10%' : '-150%',
          background: v.fluidGradient,
          borderRadius: '40%',
          transition: 'bottom 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: isHovered ? 'liquidWaveSpin 4s linear infinite' : 'none'
        }}
      />

      {/* LỚP SÓNG CHẤT LỎNG THỨ 2 TẠO HIỆU ỨNG GỢN SÓNG 3D */}
      <div
        style={{
          position: 'absolute',
          left: '-20%',
          width: '140%',
          height: '240%',
          bottom: isHovered ? '-5%' : '-150%',
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '42%',
          transition: 'bottom 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          zIndex: 2,
          animation: isHovered ? 'liquidWaveSpinReverse 6s linear infinite' : 'none'
        }}
      />

      {/* NỘI DUNG CHỮ & ICON TRÊN MẶT NƯỚC */}
      <span
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          letterSpacing: '0.02em',
          transition: 'transform 0.2s ease',
          transform: isHovered ? 'translateY(-1px)' : 'translateY(0)'
        }}
      >
        {children}
      </span>
    </motion.button>
  );
}

export { FluidButton };
