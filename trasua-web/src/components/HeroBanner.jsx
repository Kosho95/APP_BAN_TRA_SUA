import React from 'react';
import { Tag, Sparkles, Zap, ShieldCheck, Heart } from 'lucide-react';

export default function HeroBanner({ onApplyCoupon, activeCoupon }) {
  const coupons = [
    { code: 'GIAM15K', title: 'Giảm 15.000đ', desc: 'Đơn từ 60.000đ', badge: 'HOT' },
    { code: 'FREESHIP', title: 'Freeship 100%', desc: 'Đơn từ 50.000đ', badge: 'TIỆN LỢI' },
    { code: 'BANMOI', title: 'Giảm 20% Đơn', desc: 'Mừng bạn mới', badge: 'ƯU ĐÃI' }
  ];

  return (
    <div style={{
      marginTop: '24px',
      marginBottom: '32px'
    }}>
      <div className="container">
        {/* Main Hero Card */}
        <div className="hero-card" style={{
          background: 'linear-gradient(135deg, #FAF4EB 0%, #F5ECE0 60%, #EFE5D8 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 40px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '28px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Milk Tea Bubble pattern */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(224, 122, 95, 0.12) 0%, rgba(121, 85, 72, 0.04) 70%, transparent 100%)',
            pointerEvents: 'none'
          }} />

          {/* Left Text Content */}
          <div style={{ flex: '1 1 520px', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-full)',
              color: 'var(--primary-600)',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(121, 85, 72, 0.08)',
              marginBottom: '14px'
            }}>
              <Sparkles size={14} color="var(--accent-orange)" />
              <span>Menu Mới Siêu Ngon & Đậm Vị</span>
            </div>

            <h1 className="hero-title" style={{
              fontSize: '34px',
              fontWeight: 800,
              color: 'var(--text-dark)',
              lineHeight: 1.25,
              marginBottom: '12px'
            }}>
              Thưởng thức vị trà ngọt ngào, <br />
              <span style={{ color: 'var(--primary-600)', fontStyle: 'italic' }}>ấm cúng & tươi mới mỗi ngày 🧋</span>
            </h1>

            <p style={{
              fontSize: '15px',
              color: 'var(--text-muted)',
              maxWidth: '520px',
              lineHeight: 1.6,
              marginBottom: '22px'
            }}>
              Chọn mức đường, lượng đá và phủ đầy topping yêu thích. Đồ uống được pha chế thủ công ngay khi bạn đặt hàng!
            </p>

            {/* Quick Feature Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-body)', fontWeight: 600 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--matcha-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={13} color="var(--matcha-green)" />
                </div>
                <span>Giao nhanh 20 phút</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-body)', fontWeight: 600 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--accent-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={13} color="var(--accent-orange)" />
                </div>
                <span>Trà lá tự nhiên 100%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-body)', fontWeight: 600 }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--accent-pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={13} color="var(--accent-pink)" />
                </div>
                <span>Topping nấu mới mỗi sáng</span>
              </div>
            </div>
          </div>

          {/* Right Coupon Strip */}
          <div style={{ flex: '1 1 360px', zIndex: 1 }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px dashed var(--primary-200)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--text-dark)',
                marginBottom: '12px'
              }}>
                <Tag size={16} color="var(--accent-orange)" />
                <span>Mã giảm giá hôm nay dành cho bạn:</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {coupons.map((c) => {
                  const isApplied = activeCoupon === c.code;
                  return (
                    <div
                      key={c.code}
                      onClick={() => onApplyCoupon && onApplyCoupon(c.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: isApplied ? 'var(--accent-orange-light)' : '#fff',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isApplied ? 'var(--accent-orange)' : 'var(--border-light)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                      onMouseEnter={(e) => !isApplied && (e.currentTarget.style.borderColor = 'var(--primary-300)')}
                      onMouseLeave={(e) => !isApplied && (e.currentTarget.style.borderColor = 'var(--border-light)')}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            color: 'var(--primary-700)',
                            backgroundColor: 'var(--primary-100)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}>
                            {c.code}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>
                            {c.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {c.desc}
                        </div>
                      </div>

                      <button
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isApplied ? 'var(--accent-orange)' : 'var(--primary-600)',
                          color: '#fff',
                          transition: 'background 0.2s'
                        }}
                      >
                        {isApplied ? 'Đang dùng' : 'Áp dụng'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
