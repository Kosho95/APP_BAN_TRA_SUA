import React, { useState } from 'react';
import { Plus, Flame, Sparkles, Tag, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatVND } from '../api';
import FluidButton from '@/components/lightswind/fluid-button';

export default function ProductCard({ product, categoryName, onSelectProduct }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const id = Number(product.id) || 1;
  const catId = Number(product.category_id) || 1;

  // 1. Phân loại Theme & Fluid Variant theo Danh mục sản phẩm
  const getCategoryTheme = () => {
    const name = (product.name || '').toLowerCase();
    const cat = (categoryName || '').toLowerCase();

    if (catId === 2 || name.includes('cà phê') || name.includes('bạc xỉu') || name.includes('americano')) {
      return {
        accent: '#5D4037',
        accentLight: '#F3ECE7',
        glow: 'rgba(93, 64, 55, 0.28)',
        btnBg: 'linear-gradient(135deg, #6D4C41 0%, #3E2723 100%)',
        emoji: '☕',
        tagText: 'Cà Phê Nguyên Chất',
        fluidVariant: 'coffee'
      };
    }
    if (name.includes('matcha') || catId === 4 || name.includes('đá xay') || cat.includes('matcha')) {
      return {
        accent: '#2D6A4F',
        accentLight: '#E8F5E9',
        glow: 'rgba(45, 106, 79, 0.28)',
        btnBg: 'linear-gradient(135deg, #40916C 0%, #1B4332 100%)',
        emoji: '🍃',
        tagText: 'Matcha Uji Tươi',
        fluidVariant: 'matcha'
      };
    }
    if (catId === 3 || name.includes('trà đào') || name.includes('vải') || name.includes('mãng cầu') || name.includes('dâu')) {
      return {
        accent: '#E07A5F',
        accentLight: '#FDF0ED',
        glow: 'rgba(224, 122, 95, 0.3)',
        btnBg: 'linear-gradient(135deg, #F4A261 0%, #E76F51 100%)',
        emoji: '🍓',
        tagText: 'Trái Cây Tươi Mọng',
        fluidVariant: 'peach'
      };
    }
    // Mặc định: Trà Sữa Đậm Vị
    return {
      accent: '#C27848',
      accentLight: '#FFF4ED',
      glow: 'rgba(194, 120, 72, 0.28)',
      btnBg: 'linear-gradient(135deg, #D4A373 0%, #B06C3B 100%)',
      emoji: '🧋',
      tagText: 'Trà Sữa Đậm Vị',
      fluidVariant: 'milktea'
    };
  };

  const theme = getCategoryTheme();

  // 2. Gắn nhãn badge thông minh cho sinh động
  const getBadge = () => {
    if (id === 1 || id === 2 || id === 3 || id === 10) {
      return { text: 'Best Seller', icon: <Flame size={12} color="#fff" />, bg: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)' };
    }
    if (id === 5 || id === 6 || id === 12 || id === 13) {
      return { text: 'Món Mới', icon: <Sparkles size={12} color="#fff" />, bg: 'linear-gradient(135deg, #48BB78 0%, #2F855A 100%)' };
    }
    if (id % 3 === 0) {
      return { text: 'Giảm 15%', icon: <Tag size={12} color="#fff" />, bg: 'linear-gradient(135deg, #ED8936 0%, #C05621 100%)' };
    }
    return null;
  };

  const badge = getBadge();
  const fallbackImg = "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500";

  // Tạo số sao rating & lượt bán tự nhiên
  const rating = (4.8 + ((id * 7) % 3) / 10).toFixed(1);
  const salesCount = 450 + (id * 97) % 1200;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 360, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1.5px solid ${isHovered ? theme.accent : 'rgba(121, 85, 72, 0.12)'}`,
        boxShadow: isHovered
          ? `0 20px 40px -10px ${theme.glow}, 0 6px 16px rgba(0,0,0,0.06)`
          : '0 8px 24px rgba(62, 39, 35, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
      }}
      onClick={() => onSelectProduct(product)}
    >
      {/* VẠCH MÀU TRANG TRÍ ĐỈNH THẺ */}
      <div style={{ height: '4px', width: '100%', background: theme.btnBg }} />

      {/* CONTAINER ẢNH MÓN VỚI HIỆU ỨNG VỆT SÁNG LƯỚT QUA (SHIMMER) */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '74%',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface-soft)'
      }}>
        <img
          src={imgError ? fallbackImg : (product.image_url || fallbackImg)}
          alt={product.name}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.09)' : 'scale(1)'
          }}
        />

        {/* Lớp phủ vệt sáng lướt qua khi hover */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: isHovered ? '140%' : '-60%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
          transform: 'skewX(-25deg)',
          transition: 'left 0.75s ease',
          pointerEvents: 'none'
        }} />

        {/* Badge góc trên bên trái */}
        {badge && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: badge.bg,
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 3px 10px rgba(0,0,0,0.22)',
              zIndex: 3,
              letterSpacing: '0.02em'
            }}
          >
            {badge.icon}
            <span>{badge.text}</span>
          </motion.div>
        )}

        {/* Tag Phân loại nhỏ ở góc dưới ảnh */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(6px)',
          color: theme.accent,
          fontSize: '10.5px',
          fontWeight: 800,
          padding: '3px 8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          zIndex: 2
        }}>
          <span>{theme.emoji}</span>
          <span>{theme.tagText}</span>
        </div>

        {/* Nút thả tim yêu thích */}
        <motion.button
          whileTap={{ scale: 0.75 }}
          whileHover={{ scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsFav(!isFav);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 3px 10px rgba(0,0,0,0.12)'
          }}
          title="Yêu thích món này"
        >
          <Heart
            size={16}
            color={isFav ? '#FF4757' : '#8D6E63'}
            fill={isFav ? '#FF4757' : 'none'}
          />
        </motion.button>
      </div>

      {/* THÔNG TIN CHI TIẾT SẢN PHẨM */}
      <div className="product-card-body" style={{
        padding: '16px 18px 18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div>
          {/* Hàng Đánh Giá Sao & Lượt Bán */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-body)' }}>{rating}</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Đã bán {salesCount}+
            </span>
          </div>

          {/* Tên Món */}
          <h3 className="product-card-title" style={{
            fontSize: '16px',
            fontWeight: 800,
            color: 'var(--text-dark)',
            lineHeight: 1.35,
            marginBottom: '6px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '43px'
          }}>
            {product.name}
          </h3>

          {/* Mô tả món */}
          <p className="product-card-desc" style={{
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            lineHeight: 1.45,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '36px'
          }}>
            {product.description || 'Pha chế tươi mới chuẩn vị, nguyên liệu tuyển chọn chất lượng.'}
          </p>
        </div>

        {/* CHÂN THẺ: GIÁ TIỀN & NÚT CHỌN MÓN FLUID BUTTON */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px dashed #E5E7EB',
          marginTop: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, display: 'block' }}>
              Giá chỉ từ
            </span>
            <div className="product-card-price" style={{
              fontSize: '18px',
              fontWeight: 900,
              color: theme.accent,
              fontFamily: 'Quicksand, sans-serif'
            }}>
              {formatVND(product.base_price)}
            </div>
          </div>

          {/* NÚT FLUID BUTTON VỚI HIỆU ỨNG DÒNG CHẢY TRÀ SỮA DÂNG LÊN */}
          <FluidButton
            variant={theme.fluidVariant}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
          >
            <Plus size={15} strokeWidth={3} />
            <span>Chọn món</span>
          </FluidButton>
        </div>
      </div>
    </motion.div>
  );
}
