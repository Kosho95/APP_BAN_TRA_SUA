import React, { useState } from 'react';
import { Search, ShoppingBag, Clock, ExternalLink, Sparkles, X, Coffee, User, ShieldCheck } from 'lucide-react';
import { formatVND } from '../api';

export default function Navbar({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracker,
  searchQuery,
  setSearchQuery,
  adminUrl,
  currentUser,
  onOpenLogin,
  onOpenAdmin
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(255, 251, 245, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      transition: 'all 0.2s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: 'var(--primary-600)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            boxShadow: '0 4px 14px rgba(93, 64, 55, 0.25)',
            transition: 'transform 0.2s'
          }}>
            🧋
          </div>
          <div>
            <div style={{
              fontSize: '20px',
              fontWeight: 800,
              fontFamily: 'Quicksand, sans-serif',
              color: 'var(--text-dark)',
              lineHeight: 1.15,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Trà Sữa Tea & Coffee
              <span style={{
                fontSize: '11px',
                padding: '2px 7px',
                backgroundColor: 'var(--accent-orange-light)',
                color: 'var(--accent-orange)',
                borderRadius: '20px',
                fontWeight: 700
              }}>Cozy</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Hương Vị Đậm Đà • Pha Chế Tươi Mới
            </div>
          </div>
        </div>

        {/* Live Search Bar */}
        <div style={{
          flex: 1,
          maxWidth: '420px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '14px',
            color: searchFocused ? 'var(--primary-600)' : 'var(--text-light)',
            transition: 'color 0.2s'
          }} />
          <input
            type="text"
            placeholder="Tìm món trà sữa, cà phê, topping yêu thích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 38px 0 42px',
              borderRadius: 'var(--radius-full)',
              border: `1.5px solid ${searchFocused ? 'var(--primary-500)' : 'var(--border-soft)'}`,
              backgroundColor: searchFocused ? '#fff' : 'var(--bg-surface-soft)',
              color: 'var(--text-dark)',
              fontSize: '14px',
              outline: 'none',
              boxShadow: searchFocused ? '0 4px 16px rgba(121, 85, 72, 0.12)' : 'none',
              transition: 'all 0.2s ease'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                color: 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Nút Đăng nhập / Thẻ thành viên VIP */}
          <button
            onClick={onOpenLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: currentUser ? '6px 14px 6px 8px' : '9px 15px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: currentUser ? 'var(--accent-orange-light)' : 'var(--bg-surface-soft)',
              color: currentUser ? 'var(--accent-orange)' : 'var(--text-body)',
              fontSize: '13px',
              fontWeight: 700,
              border: `1.5px solid ${currentUser ? 'rgba(255,112,67,0.35)' : 'var(--border-soft)'}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title={currentUser ? "Xem Thẻ tích điểm Cozy Loyalty" : "Đăng nhập khách hàng"}
          >
            {currentUser ? (
              <>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-orange)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px'
                }}>
                  🧋
                </div>
                <span style={{ maxWidth: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser.name}
                </span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  color: 'var(--accent-orange)',
                  fontWeight: 800,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                  ⭐ {currentUser.points || 7}
                </span>
              </>
            ) : (
              <>
                <User size={16} color="var(--primary-600)" />
                <span>Đăng Nhập</span>
              </>
            )}
          </button>

          {/* Track Orders Button */}
          <button
            onClick={onOpenTracker}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-soft)',
              color: 'var(--text-body)',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid var(--border-soft)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-100)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-soft)'}
          >
            <Clock size={16} color="var(--primary-500)" />
            <span>Tra Cứu</span>
          </button>

          {/* Admin Dashboard Button (SPA Direct Switch) */}
          <button
            onClick={onOpenAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-50)',
              color: 'var(--primary-700)',
              fontSize: '13px',
              fontWeight: 700,
              border: '1px solid var(--primary-200)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-50)';
            }}
            title="Mở Bảng Điều Khiển Quản Trị Viên (SPA)"
          >
            <ShieldCheck size={16} color="var(--primary-600)" />
            <span>Quản Trị</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-600)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(93, 64, 55, 0.25)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-700)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-600)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="badge-bounce"
                  style={{
                    position: 'absolute',
                    top: '-9px',
                    right: '-11px',
                    backgroundColor: 'var(--accent-orange)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span>Giỏ hàng</span>
            {cartTotal > 0 && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontFamily: 'Quicksand, sans-serif'
              }}>
                {formatVND(cartTotal)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
