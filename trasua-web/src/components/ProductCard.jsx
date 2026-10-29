import React, { useState } from 'react';
import { Plus, Flame, Sparkles, Tag, Heart } from 'lucide-react';
import { formatVND } from '../api';

export default function ProductCard({ product, categoryName, onSelectProduct }) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(false);

  // Gắn nhãn badge thông minh cho sinh động
  const getBadge = () => {
    const id = Number(product.id);
    if (id === 1 || id === 2 || id === 3 || id === 10) {
      return { text: 'Best Seller', icon: <Flame size={12} color="#fff" />, bg: 'var(--accent-orange)' };
    }
    if (id === 5 || id === 6 || id === 12 || id === 13) {
      return { text: 'Món Mới', icon: <Sparkles size={12} color="#fff" />, bg: 'var(--matcha-green)' };
    }
    if (id % 3 === 0) {
      return { text: 'Giảm 15%', icon: <Tag size={12} color="#fff" />, bg: 'var(--primary-600)' };
    }
    return null;
  };

  const badge = getBadge();

  // Ảnh dự phòng khi URL lỗi
  const fallbackImg = "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500";

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: `1.5px solid ${isHovered ? 'rgba(255, 112, 67, 0.45)' : 'var(--border-light)'}`,
        boxShadow: isHovered ? '0 18px 38px -6px rgba(93, 64, 55, 0.2), 0 8px 18px -4px rgba(255, 112, 67, 0.15)' : 'var(--shadow-md)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer'
      }}
      onClick={() => onSelectProduct(product)}
    >
      {/* Container Ảnh 1:1 */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '72%', // Tỉ lệ đồ uống chuẩn gọn đẹp
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
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)'
          }}
        />

        {/* Badge góc trên bên trái */}
        {badge && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: badge.bg,
            color: '#fff',
            fontSize: '11px',
            fontWeight: 800,
            padding: '4px 9px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            zIndex: 2
          }}>
            {badge.icon}
            <span>{badge.text}</span>
          </div>
        )}

        {/* Nút thả tim yêu thích */}
        <button
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.15s'
          }}
          title="Yêu thích món này"
        >
          <Heart
            size={16}
            color={isFav ? 'var(--accent-orange)' : 'var(--text-light)'}
            fill={isFav ? 'var(--accent-orange)' : 'none'}
          />
        </button>
      </div>

      {/* Nội dung thông tin món */}
      <div className="product-card-body" style={{
        padding: '16px 18px 18px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {categoryName && (
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--text-light)',
              display: 'inline-block',
              marginBottom: '6px'
            }}>
              {categoryName}
            </span>
          )}

          <h3 className="product-card-title" style={{
            fontSize: '16px',
            fontWeight: 700,
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
            {product.description || 'Hương vị trà sữa đặc trưng, nguyên liệu tươi mới mỗi ngày.'}
          </p>
        </div>

        {/* Chân thẻ: Giá & Nút Chọn món */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '12px',
          borderTop: '1px dashed var(--border-light)',
          marginTop: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block' }}>Giá từ</span>
            <div className="product-card-price" style={{
              fontSize: '17px',
              fontWeight: 800,
              color: 'var(--primary-700)',
              fontFamily: 'Quicksand, sans-serif'
            }}>
              {formatVND(product.base_price)}
            </div>
          </div>

          <button
            className="product-card-btn"
            onClick={() => onSelectProduct(product)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isHovered ? 'var(--accent-orange)' : 'var(--primary-100)',
              color: isHovered ? '#fff' : 'var(--primary-700)',
              fontSize: '13px',
              fontWeight: 700,
              transition: 'all 0.25s ease',
              boxShadow: isHovered ? '0 6px 16px rgba(255, 112, 67, 0.35)' : 'none',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <Plus size={15} />
            <span>Chọn món</span>
          </button>
        </div>
      </div>
    </div>
  );
}
