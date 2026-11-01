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
    <div style={{ marginTop: '20px', marginBottom: '32px', position: 'relative' }}>
      <div className="container">
        {/* Main Hero Card - PHỐI MÀU NÂU CAFE & HỒNG TRÀ ẤM ÁP ĐỂ KEM TRẮNG NỔI RỰC RỠ */}
        <div
          className="hero-card"
          style={{
            background: 'linear-gradient(135deg, #3E2723 0%, #2E1B16 45%, #1C0F0B 100%)',
            borderRadius: '24px',
            padding: '48px 42px 40px 42px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px -10px rgba(46, 27, 22, 0.45)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* LỚP KEM TUYẾT TRẮNG TINH KHÔI NỔI BẬT HOÀN TOÀN TRÊN NỀN NÂU */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4 }}>
            <CreamDrip height={34} theme="white" />
          </div>

          {/* CÁC HẠT TRÂN CHÂU ĐA SẮC ĐÀN HỒI (BOBA PEARLS) */}
          {/* Trân châu đen óng ánh */}
          <div
            className="boba-pearl"
            title="Trân châu đường đen (Bấm để nảy!)"
            style={{
              position: 'absolute',
              right: '360px',
              top: '55px',
              width: '42px',
              height: '42px',
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
              width: '12px',
              height: '7px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.85)',
              transform: 'rotate(-30deg)'
            }} />
          </div>

          {/* Trân châu hoàng kim */}
          <div
            className="boba-pearl"
            title="Trân châu hoàng kim béo ngậy"
            style={{
              position: 'absolute',
              right: '440px',
              bottom: '35px',
              width: '32px',
              height: '32px',
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

          {/* Trân châu ngọc bích Matcha */}
          <div
            className="boba-pearl"
            title="Trân châu ngọc bích Matcha"
            style={{
              position: 'absolute',
              left: '490px',
              top: '40px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #74C69D 0%, #2D6A4F 65%, #1B4332 100%)',
              boxShadow: '0 6px 14px rgba(0,0,0,0.35)',
              animation: 'bobaFloatSine 6s ease-in-out infinite',
              animationDelay: '2.5s',
              zIndex: 3
            }}
          >
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '6px',
              width: '7px',
              height: '4px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)'
            }} />
          </div>

          {/* Vầng sáng hồng hào ấm cúng góc nền */}
          <div
            style={{
              position: 'absolute',
              right: '-60px',
              bottom: '-60px',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244, 162, 97, 0.18) 0%, rgba(224, 122, 95, 0.08) 60%, transparent 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* KHỐI NỘI DUNG BÊN TRÁI - CHỮ TRẮNG NỔI BẬT & SANG TRỌNG */}
          <div style={{ flex: '1 1 520px', zIndex: 5 }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-full)',
                color: '#FFE8D6',
                fontSize: '13px',
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                marginBottom: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Sparkles size={15} color="#F4A261" />
              <span>Hương Vị Trà Lá Tự Nhiên & Kem Sữa Tươi Tinh Khiết</span>
            </motion.div>

            <h1
              className="hero-title"
              style={{
                fontSize: '36px',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.25,
                marginBottom: '14px',
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
                fontSize: '15px',
                color: '#D7CCC8',
                maxWidth: '520px',
                lineHeight: 1.6,
                marginBottom: '24px'
              }}
            >
              Chọn mức đường, lượng đá và phủ đầy topping yêu thích. Đồ uống được pha chế thủ công ngay khi bạn đặt hàng!
            </p>

            {/* QUICK FEATURE CHIPS - ĐA SẮC: XANH MATCHA, CAM ĐÀO, HỒNG DÂU */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backgroundColor: 'rgba(45, 106, 79, 0.45)',
                  border: '1px solid rgba(82, 183, 136, 0.4)',
                  padding: '7px 14px',
                  borderRadius: '18px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#52B788',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Zap size={13} color="#fff" />
                </div>
                <span>Giao nhanh 20 phút</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backgroundColor: 'rgba(224, 122, 95, 0.35)',
                  border: '1px solid rgba(244, 162, 97, 0.4)',
                  padding: '7px 14px',
                  borderRadius: '18px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F4A261',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck size={13} color="#fff" />
                </div>
                <span>Trà lá tự nhiên 100%</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  backgroundColor: 'rgba(194, 120, 72, 0.35)',
                  border: '1px solid rgba(212, 163, 115, 0.4)',
                  padding: '7px 14px',
                  borderRadius: '18px',
                  backdropFilter: 'blur(6px)'
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#E76F51',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Heart size={13} color="#fff" />
                </div>
                <span>Kem Cheese trắng tươi mỗi ngày</span>
              </motion.div>
            </div>
          </div>

          {/* KHỐI MÃ GIẢM GIÁ BÊN PHẢI - NỀN TRẮNG SÁNG SẮC NÉT TƯƠNG PHẢN */}
          <div style={{ flex: '1 1 360px', zIndex: 5 }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '22px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  color: '#2D1B16',
                  marginBottom: '14px'
                }}
              >
                <Tag size={17} color="#E07A5F" />
                <span>Mã giảm giá hôm nay dành cho bạn:</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {coupons.map((c) => {
                  const isApplied = activeCoupon === c.code;
                  return (
                    <motion.div
                      key={c.code}
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                      onClick={(e) => handleApplyCoupon(c.code, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '11px 14px',
                        backgroundColor: isApplied ? '#FFF4ED' : '#F8F9FA',
                        borderRadius: '14px',
                        border: `1.5px solid ${isApplied ? c.color : '#E5E7EB'}`,
                        cursor: 'pointer',
                        boxShadow: isApplied
                          ? '0 6px 16px rgba(224, 122, 95, 0.2)'
                          : '0 2px 6px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontWeight: 900,
                              color: c.color,
                              backgroundColor: '#fff',
                              border: `1px solid ${c.color}`,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}
                          >
                            {c.code}
                          </span>
                          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#2D1B16' }}>
                            {c.title}
                          </span>
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '3px' }}>
                          {c.desc}
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: isApplied ? c.color : '#3E2723',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                        }}
                      >
                        {isApplied ? 'Đang dùng' : 'Áp dụng'}
                      </motion.button>
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
