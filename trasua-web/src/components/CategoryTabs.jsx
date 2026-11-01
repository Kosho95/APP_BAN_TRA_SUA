import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryTabs({ categories, selectedCategoryId, onSelectCategory, totalProductsCount }) {
  // Mapping emoji & màu sắc đặc trưng cho từng danh mục
  const getCategoryMeta = (name) => {
    if (!name) return { emoji: '✨', activeBg: '#3E2723', glow: 'rgba(62, 39, 35, 0.25)' };
    const lower = name.toLowerCase();
    if (lower.includes('sữa') || lower.includes('tea')) {
      return { emoji: '🧋', activeBg: '#C27848', glow: 'rgba(194, 120, 72, 0.35)' };
    }
    if (lower.includes('phê') || lower.includes('coffee')) {
      return { emoji: '☕', activeBg: '#5D4037', glow: 'rgba(93, 64, 55, 0.35)' };
    }
    if (lower.includes('trái cây') || lower.includes('quả') || lower.includes('fruit')) {
      return { emoji: '🍓', activeBg: '#E07A5F', glow: 'rgba(224, 122, 95, 0.35)' };
    }
    if (lower.includes('đá xay') || lower.includes('bánh') || lower.includes('matcha')) {
      return { emoji: '🍃', activeBg: '#2D6A4F', glow: 'rgba(45, 106, 79, 0.35)' };
    }
    return { emoji: '✨', activeBg: '#3E2723', glow: 'rgba(62, 39, 35, 0.25)' };
  };

  return (
    <div style={{
      position: 'sticky',
      top: '76px',
      zIndex: 30,
      backgroundColor: 'rgba(255, 251, 245, 0.95)',
      backdropFilter: 'blur(12px)',
      padding: '14px 0',
      borderBottom: '1px solid rgba(121, 85, 72, 0.1)',
      marginBottom: '28px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: '2px'
      }}>
        {/* Nút Tất Cả Món */}
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          onClick={() => onSelectCategory(null)}
          style={{
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: selectedCategoryId === null ? '#3E2723' : '#FFFFFF',
            color: selectedCategoryId === null ? '#FFFFFF' : '#4B5563',
            fontWeight: 800,
            fontSize: '14px',
            border: `1.5px solid ${selectedCategoryId === null ? '#3E2723' : '#E5E7EB'}`,
            boxShadow: selectedCategoryId === null ? '0 6px 18px rgba(62, 39, 35, 0.3)' : '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer'
          }}
        >
          <span>✨</span>
          <span>Tất cả món</span>
          {totalProductsCount > 0 && (
            <span style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: selectedCategoryId === null ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
              color: selectedCategoryId === null ? '#fff' : '#1F2937',
              fontWeight: 900
            }}>
              {totalProductsCount}
            </span>
          )}
        </motion.button>

        {/* Các Danh Mục Đa Sắc Màu (Matcha, Nâu Trà Sữa, Cam Đào, Cà Phê) */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const meta = getCategoryMeta(cat.name);

          return (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? meta.activeBg : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#4B5563',
                fontWeight: 800,
                fontSize: '14px',
                border: `1.5px solid ${isSelected ? meta.activeBg : '#E5E7EB'}`,
                boxShadow: isSelected ? `0 8px 20px ${meta.glow}` : '0 2px 6px rgba(0,0,0,0.03)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '16px' }}>{meta.emoji}</span>
              <span>{cat.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
