import React from 'react';
import { Tag, Sparkles, Zap, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import CreamDrip from './CreamDrip';

export default function HeroBanner({ onApplyCoupon, activeCoupon }) {
  const coupons = [
    { code: 'GIAM15K', title: 'Giảm 15.000đ', desc: 'Đơn từ 60.000đ', badge: 'HOT', color: '#E07A5F' },
    { code: 'FREESHIP', title: 'Freeship 100%', desc: 'Đơn từ 50.000đ', badge: 'TIỆN LỢI', color: '#2D6A4F' },
    { code: 'BANMOI', title: 'Giảm 20% Đơn', desc: 'Mừng bạn mới', badge: 'ƯU ĐÃI', color: '#B06C3B' }
  ];

  // Bắn pháo hoa mini ngọt ngào khi bấm áp mã
  const handleApplyCoupon = (code, e) => {
    if (onApplyCoupon) onApplyCoupon(code);
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 35,
        spread: 65,
        origin: { x, y },
        colors: ['#E07A5F', '#52B788', '#F4A261', '#FFFFFF', '#6F4E37'],
        disableForReducedMotion: true
      });
    } catch (err) {}
  };

  return (
    <div style={{ marginTop: '16px', marginBottom: '28px', position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div className="container" style={{ padding: '0 14px' }}>
        {/* Main Hero Card */}
        <div
          className="hero-card"
          style={{
            background: 'linear-gradient(135deg, #3E2723 0%, #2E1B16 45%, #1C0F0B 100%)',
            borderRadius: '24px',
            padding: '44px 36px 36px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px -10px rgba(46, 27, 22, 0.45)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '28px',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            boxBox: 'border-box'
          }}
        >
          {/* LỚP KEM TUYẾT TRẮNG TINH KHÔI NỔI BẬT */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4, width: '100%' }}>
            <CreamDrip height={32} theme="white" />
          </div>

          {/* CÁC HẠT TRÂN CHÂU ĐA SẮC ĐÀN HỒI (ẨN TRÊN MOBILE ĐỂ TRÁNH TRÀN TRANG) */}
          <div
            className="boba-pearl hero-boba-decor"
            title="Trân châu đường đen (Bấm để nảy!)"
            style={{
              position: 'absolute',
              right: '340px',
              top: '55px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 32% 32%, #795548 0%, #3E2723 60%, #1A0C08 100%)',
              boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.6), 0 8px 18px rgba(0,0,0,0.5)',
              animation: 'bobaFloatSine 5.2s ease-in-out infinite',
              zIndex: 3
            }}
          >
            <div style={{
              position: 'absolute',
              top: '7px',
              left: '10px',
              width: '11px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.85)',
              transform: 'rotate(-30deg)'
            }} />
          </div>

          <div
            className="boba-pearl hero-boba-decor"
            title="Trân châu hoàng kim"
            style={{
              position: 'absolute',
              right: '420px',
              bottom: '35px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #F4A261 0%, #C27848 65%, #7F4217 100%)',
              boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.4)',
              animation: 'bobaFloatSine 4.5s ease-in-out infinite',
              animationDelay: '1.2s',
              zIndex: 3
            }}
          >
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '8px',
              width: '8px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              transform: 'rotate(-35deg)'
            }} />
          </div>

          {/* Vầng sáng hồng hào ấm cúng góc nền */}
          <div
            style={{
              position: 'absolute',
              right: '-60px',
              bottom: '-60px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244, 162, 97, 0.16) 0%, rgba(224, 122, 95, 0.06) 60%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* KHỐI NỘI DUNG BÊN TRÁI */}
          <div className="hero-left-col" style={{ flex: '1 1 320px', minWidth: 0, maxWidth: '100%', zIndex: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-full)',
                color: '#FFE8D6',
                fontSize: '12.5px',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                marginBottom: '14px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Sparkles size={14} color="#F4A261" />
              <span>Hương Vị Trà Lá Tự Nhiên & Kem Sữa Tươi</span>
            </motion.div>

            <h1
              className="hero-title"
              style={{
                fontSize: '34px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.25,
                marginBottom: '12px',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Thưởng thức vị trà ngọt ngào, <br />
              <span style={{
                background: 'linear-gradient(90deg, #F4A261 0%, #E76F51 50%, #FFD166 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontStyle: 'italic',
                fontWeight: 900
              }}>
                lớp kem sánh mịn & trân châu dẻo bùi 🧋
              </span>
            </h1>

            <p
              style={{
                fontSize: '14.5px',
                color: '#D7CCC8',
                maxWidth: '520px',
                lineHeight: 1.6,
                marginBottom: '22px'
              }}
            >
              Chọn mức đường, lượng đá và phủ đầy topping yêu thích. Đồ uống được pha chế thủ công ngay khi bạn đặt hàng!
            </p>

            {/* QUICK FEATURE CHIPS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backgroundColor: 'rgba(45, 106, 79, 0.45)',
                  border: '1px solid rgba(82, 183, 136, 0.4)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#52B788', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={12} color="#fff" />
                </div>
                <span>Giao nhanh 20 phút</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backgroundColor: 'rgba(224, 122, 95, 0.35)',
                  border: '1px solid rgba(244, 162, 97, 0.4)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#F4A261', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={12} color="#fff" />
                </div>
                <span>Trà lá tự nhiên 100%</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backgroundColor: 'rgba(194, 120, 72, 0.35)',
                  border: '1px solid rgba(212, 163, 115, 0.4)',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#E76F51', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={12} color="#fff" />
                </div>
                <span>Kem Cheese trắng tươi mỗi ngày</span>
              </div>
            </div>
          </div>

          {/* KHỐI MÃ GIẢM GIÁ BÊN PHẢI */}
          <div className="hero-right-col" style={{ flex: '1 1 280px', minWidth: 0, maxWidth: '100%', zIndex: 5 }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '18px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#2D1B16',
                  marginBottom: '12px'
                }}
              >
                <Tag size={16} color="#E07A5F" />
                <span>Mã giảm giá hôm nay dành cho bạn:</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {coupons.map((c) => {
                  const isApplied = activeCoupon === c.code;
                  return (
                    <motion.div
                      key={c.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                      onClick={(e) => handleApplyCoupon(c.code, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        backgroundColor: isApplied ? '#FFF4ED' : '#F8F9FA',
                        borderRadius: '12px',
                        border: `1.5px solid ${isApplied ? c.color : '#E5E7EB'}`,
                        cursor: 'pointer',
                        boxShadow: isApplied
                          ? '0 6px 16px rgba(224, 122, 95, 0.2)'
                          : '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 900,
                              color: c.color,
                              backgroundColor: '#fff',
                              border: `1px solid ${c.color}`,
                              padding: '2px 6px',
                              borderRadius: '5px',
                              fontSize: '11.5px'
                            }}
                          >
                            {c.code}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#2D1B16' }}>
                            {c.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                          {c.desc}
                        </div>
                      </div>

                      <button
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          padding: '5px 12px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isApplied ? c.color : '#3E2723',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                      >
                        {isApplied ? 'Đang dùng' : 'Áp dụng'}
                      </button>
                    </motion.div>
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
