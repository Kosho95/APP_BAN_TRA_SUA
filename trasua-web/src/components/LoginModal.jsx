import React, { useState } from 'react';
import { X, User, Lock, Phone, Gift, Award, LogOut, CheckCircle2, Sparkles, CreditCard, Ticket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatVND } from '../api';

export default function LoginModal({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onOpenTracker
}) {
  if (!isOpen) return null;

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại!');
      return;
    }

    const userData = {
      phone: phone.trim(),
      name: name.trim() || (isRegisterMode ? 'Thành Viên Cozy' : (currentUser?.name || 'Khách Hàng Thân Thiết')),
      points: 7, // Giả lập đã uống 7 ly (cần 3 ly nữa là nhận quà)
      tier: 'Thành Viên Vàng 👑',
      joinedDate: '10/2026',
      vouchers: ['GIAM15K', 'FREESHIP', 'BANMOI', 'TANG_TOPPING']
    };

    onLogin(userData);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(62, 39, 35, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 140,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      overflowY: 'auto'
    }} onClick={onClose}>
      <div
        className="animate-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '460px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* NẾU ĐÃ ĐĂNG NHẬP: HIỂN THỊ THẺ THÀNH VIÊN COZY CLUB & TÍCH ĐIỂM */}
        {currentUser ? (
          <div style={{ padding: '32px 28px' }}>
            {/* Header User */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 12px',
                boxShadow: '0 4px 14px rgba(93, 64, 55, 0.25)'
              }}>
                🧋
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
                {currentUser.name}
              </h3>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent-orange-light)',
                color: 'var(--accent-orange)',
                fontSize: '12px',
                fontWeight: 700
              }}>
                <Award size={14} />
                <span>{currentUser.tier}</span>
              </div>
            </div>

            {/* Thẻ tích điểm Cozy Loyalty Card */}
            <div style={{
              background: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>
                  Cozy Tea Club • Thẻ Tích Ly
                </span>
                <Sparkles size={16} color="var(--accent-orange)" />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Quicksand' }}>{currentUser.points || 7}</span>
                <span style={{ fontSize: '14px', opacity: 0.85 }}>/ 10 ly trà sữa</span>
              </div>

              {/* Progress Bar */}
              <div style={{
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${((currentUser.points || 7) / 10) * 100}%`,
                  backgroundColor: 'var(--accent-orange)',
                  borderRadius: '4px'
                }} />
              </div>

              <div style={{ fontSize: '12px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gift size={14} />
                <span>Uống thêm {10 - (currentUser.points || 7)} ly nữa để nhận 1 ly Free! 🎁</span>
              </div>
            </div>

            {/* Kho Voucher & Đơn hàng của tôi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-soft)',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Ticket size={18} color="var(--accent-orange)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>Kho Voucher Cá Nhân</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>4 mã ưu đãi đang sẵn sàng</div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-700)' }}>4 Voucher</span>
              </div>

              <div
                onClick={() => {
                  onClose();
                  onOpenTracker && onOpenTracker(currentUser.phone);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={18} color="var(--primary-600)" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>Đơn Hàng Đã Đặt</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SĐT: {currentUser.phone}</div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-700)' }}>Xem tiến trình →</span>
              </div>
            </div>

            {/* Nút Đăng Xuất */}
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-surface-soft)',
                color: 'var(--accent-orange)',
                border: '1px solid var(--border-soft)',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} />
              <span>Đăng Xuất Tài Khoản</span>
            </button>
          </div>
        ) : (
          /* FORM ĐĂNG NHẬP / ĐĂNG KÝ */
          <div style={{ padding: '32px 28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ fontSize: '36px', marginBottom: '6px' }}>🧋</div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>
                {isRegisterMode ? 'Tạo Tài Khoản Thành Viên' : 'Chào Mừng Trở Lại!'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isRegisterMode ? 'Đăng ký ngay để nhận ưu đãi và tích điểm đổi ly trà sữa' : 'Đăng nhập để xem tích điểm và voucher ưu đãi'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegisterMode && (
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                    Họ và tên của bạn
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                    <input
                      type="text"
                      required={isRegisterMode}
                      placeholder="VD: Nguyễn Văn Anh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-soft)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Số điện thoại <span style={{ color: 'var(--accent-orange)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-soft)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Mật khẩu
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu (hoặc để trống để đăng nhập nhanh)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-soft)',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  padding: '13px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(93, 64, 55, 0.25)'
                }}
              >
                {isRegisterMode ? 'Đăng Ký Thành Viên Ngay' : 'Đăng Nhập'}
              </button>
            </form>

            {/* Chuyển qua lại Đăng nhập / Đăng ký */}
            <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isRegisterMode ? (
                <>
                  Đã có tài khoản?{' '}
                  <span
                    onClick={() => setIsRegisterMode(false)}
                    style={{ color: 'var(--primary-700)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Đăng nhập ngay
                  </span>
                </>
              ) : (
                <>
                  Chưa có tài khoản?{' '}
                  <span
                    onClick={() => setIsRegisterMode(true)}
                    style={{ color: 'var(--primary-700)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Đăng ký nhận 1 ly Free
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
