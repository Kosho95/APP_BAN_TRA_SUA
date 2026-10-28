import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { formatVND } from '../api';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  couponCode,
  setCouponCode,
  discountAmount,
  onProceedCheckout
}) {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState(couponCode || '');

  // Tính tổng tạm tính
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Phí ship: miễn phí nếu đơn >= 100k hoặc dùng mã FREESHIP, còn lại 15.000đ
  const shippingFee = (itemsSubtotal >= 100000 || couponCode === 'FREESHIP' || cartItems.length === 0) ? 0 : 15000;

  // Tổng thanh toán sau giảm giá
  const finalTotal = Math.max(0, itemsSubtotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput) {
      setCouponCode(couponInput.trim().toUpperCase());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(62, 39, 35, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 90,
      display: 'flex',
      justifyContent: 'flex-end',
      transition: 'opacity 0.25s ease'
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'toastSlideIn 0.25s ease',
          position: 'relative'
        }}
      >
        {/* Header Drawer */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-600)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-dark)' }}>
                Giỏ Hàng Của Bạn
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {cartItems.length} loại món đã chọn
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-light)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
                title="Xóa tất cả món"
              >
                Xóa hết
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Danh Sách Món Trong Giỏ */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-light)',
              textAlign: 'center',
              gap: '12px'
            }}>
              <div style={{ fontSize: '54px' }}>🧋</div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>
                Giỏ hàng đang trống
              </h4>
              <p style={{ fontSize: '13px', maxWidth: '240px', color: 'var(--text-muted)' }}>
                Hãy chọn cho mình một ly trà sữa mát lạnh, thơm ngon trong thực đơn nhé!
              </p>
              <button
                onClick={onClose}
                style={{
                  marginTop: '10px',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                Khám phá Menu ngay
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.id || index}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-light)',
                  position: 'relative'
                }}
              >
                {/* Ảnh nhỏ */}
                <img
                  src={item.image_url || "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=120"}
                  alt={item.name}
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=120"; }}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    objectFit: 'cover'
                  }}
                />

                {/* Thông tin ly */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {item.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      style={{ color: 'var(--text-light)', padding: '2px' }}
                      title="Xóa món này"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Chi tiết tùy biến: Size, Đường, Đá, Topping */}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>Size {item.size}</span>
                    <span> • {item.sugar} đường</span>
                    <span> • {item.ice}</span>
                  </div>

                  {item.toppings && item.toppings.length > 0 && (
                    <div style={{ fontSize: '11.5px', color: 'var(--primary-600)', marginTop: '2px' }}>
                      + Topping: {item.toppings.join(', ')}
                    </div>
                  )}

                  {item.item_note && (
                    <div style={{ fontSize: '11px', color: 'var(--text-light)', fontStyle: 'italic', marginTop: '2px' }}>
                      ↳ Ghi chú: {item.item_note}
                    </div>
                  )}

                  {/* Giá & Stepper */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                  }}>
                    <div style={{
                      fontWeight: 800,
                      color: 'var(--primary-700)',
                      fontSize: '15px',
                      fontFamily: 'Quicksand'
                    }}>
                      {formatVND(item.subtotal)}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px',
                      border: '1px solid var(--border-soft)'
                    }}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-dark)'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ minWidth: '28px', textAlign: 'center', fontSize: '13px', fontWeight: 800 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-dark)'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Thanh Toán */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 -4px 16px rgba(121, 85, 72, 0.05)'
          }}>
            {/* Nhập mã Voucher */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Tag size={15} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi (GIAM15K, FREESHIP...)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border-soft)',
                    backgroundColor: 'var(--bg-surface-soft)',
                    fontSize: '13px',
                    fontWeight: 700,
                    outline: 'none',
                    letterSpacing: '0.04em'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                Áp dụng
              </button>
            </form>

            {/* Chi tiết tính tiền */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Tạm tính ({cartItems.reduce((s, i) => s + i.quantity, 0)} ly)</span>
                <span>{formatVND(itemsSubtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Phí giao hàng</span>
                <span>{shippingFee === 0 ? <strong style={{ color: 'var(--matcha-green)' }}>Miễn phí</strong> : formatVND(shippingFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-orange)' }}>
                  <span>Voucher giảm giá ({couponCode})</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px dashed var(--border-light)',
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--text-dark)'
              }}>
                <span>Tổng cộng</span>
                <span style={{ color: 'var(--primary-700)', fontSize: '20px', fontFamily: 'Quicksand' }}>
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {/* Nút Đặt Hàng */}
            <button
              onClick={onProceedCheckout}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(93, 64, 55, 0.3)',
                transition: 'all 0.18s'
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
              <span>Tiến hành Đặt hàng</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
