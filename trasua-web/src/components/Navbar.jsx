import React, { useState } from 'react';
import { Search, ShoppingBag, Clock, ExternalLink, Sparkles, X, Coffee } from 'lucide-react';
import { formatVND } from '../api';

export default function Navbar({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracker,
  searchQuery,
  setSearchQuery,
  adminUrl
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
            <span>Tra Cứu Đơn</span>
          </button>

          {/* Admin Dashboard Link */}
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-surface-soft)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid var(--border-soft)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-100)';
              e.currentTarget.style.color = 'var(--primary-700)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-surface-soft)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            title="Mở cổng Web Quản trị Admin"
          >
            <ExternalLink size={15} />
            <span>Quản Trị</span>
          </a>

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
                    top: '-8px',
                    right: '-10px',
                    backgroundColor: 'var(--accent-orange)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 800,
                    minWidth: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    boxShadow: '0 2px 6px rgba(255, 112, 67, 0.4)'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <span>Giỏ hàng</span>
            {cartTotal > 0 && (
              <span style={{
                paddingLeft: '6px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '13px'
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
