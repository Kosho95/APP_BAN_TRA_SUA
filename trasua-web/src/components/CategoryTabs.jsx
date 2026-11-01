import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalProductsCount,
  isDark = false
}) {
  // Mapping emoji & màu sắc đặc trưng cho từng danh mục
  const getCategoryMeta = (name) => {
    if (!name) return { emoji: '✨', activeBg: '#3E2723', glow: 'rgba(62, 39, 35, 0.25)' };
    const lower = name.toLowerCase();
    if (lower.includes('sữa') || lower.includes('tea')) {
      return { emoji: '🧋', activeBg: isDark ? '#D48B55' : '#C27848', glow: 'rgba(212, 139, 85, 0.4)' };
    }
    if (lower.includes('phê') || lower.includes('coffee')) {
      return { emoji: '☕', activeBg: isDark ? '#795548' : '#5D4037', glow: 'rgba(121, 85, 72, 0.4)' };
    }
    if (lower.includes('trái cây') || lower.includes('quả') || lower.includes('fruit')) {
      return { emoji: '🍓', activeBg: '#E07A5F', glow: 'rgba(224, 122, 95, 0.4)' };
    }
    if (lower.includes('đá xay') || lower.includes('bánh') || lower.includes('matcha')) {
      return { emoji: '🍃', activeBg: isDark ? '#388E3C' : '#2D6A4F', glow: 'rgba(56, 142, 60, 0.4)' };
    }
    return { emoji: '✨', activeBg: isDark ? '#E07A5F' : '#3E2723', glow: 'rgba(224, 122, 95, 0.4)' };
  };

  return (
    <div
      className="category-tabs-sticky"
      style={{
        position: 'sticky',
        top: '70px',
        zIndex: 30,
        backgroundColor: isDark ? 'rgba(24, 17, 14, 0.96)' : 'rgba(255, 251, 245, 0.96)',
        backdropFilter: 'blur(12px)',
        padding: '12px 0',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(121, 85, 72, 0.1)',
        marginBottom: '24px',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2px'
        }}
      >
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
            padding: '9px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: selectedCategoryId === null
              ? (isDark ? '#E07A5F' : '#3E2723')
              : (isDark ? '#261B16' : '#FFFFFF'),
            color: selectedCategoryId === null
              ? '#FFFFFF'
              : (isDark ? '#E6DDD8' : '#4B5563'),
            fontWeight: 800,
            fontSize: '13.5px',
            border: selectedCategoryId === null
              ? `1.5px solid ${isDark ? '#E07A5F' : '#3E2723'}`
              : `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB'}`,
            boxShadow: selectedCategoryId === null
              ? `0 6px 18px ${isDark ? 'rgba(224, 122, 95, 0.4)' : 'rgba(62, 39, 35, 0.3)'}`
              : '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <span>✨</span>
          <span>Tất cả món</span>
          {totalProductsCount > 0 && (
            <span
              style={{
                fontSize: '11.5px',
                padding: '2px 7px',
                borderRadius: '10px',
                backgroundColor: selectedCategoryId === null
                  ? 'rgba(255,255,255,0.25)'
                  : (isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6'),
                color: selectedCategoryId === null
                  ? '#fff'
                  : (isDark ? '#E6DDD8' : '#1F2937'),
                fontWeight: 900
              }}
            >
              {totalProductsCount}
            </span>
          )}
        </motion.button>

        {/* Các Danh Mục Đa Sắc Màu */}
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
                padding: '9px 20px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected
                  ? meta.activeBg
                  : (isDark ? '#261B16' : '#FFFFFF'),
                color: isSelected
                  ? '#FFFFFF'
                  : (isDark ? '#E6DDD8' : '#4B5563'),
                fontWeight: 800,
                fontSize: '13.5px',
                border: isSelected
                  ? `1.5px solid ${meta.activeBg}`
                  : `1.5px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : '#E5E7EB'}`,
                boxShadow: isSelected
                  ? `0 8px 20px ${meta.glow}`
                  : '0 2px 6px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <span style={{ fontSize: '15px' }}>{meta.emoji}</span>
              <span>{cat.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
