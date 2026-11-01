import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatVND } from '../api';
import CreamDrip from './CreamDrip';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(62, 39, 35, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 90,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 50px rgba(62, 39, 35, 0.35)',
          position: 'relative'
        }}
      >
        {/* LỚP KEM CHEESE CHẢY TRÊN ĐỈNH DRAWER */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12 }}>
          <CreamDrip height={18} />
        </div>

        {/* Header Drawer */}
        <div style={{
          padding: '24px 24px 18px',
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
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(121, 85, 72, 0.25)'
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClearCart}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-light)',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title="Xóa tất cả món"
              >
                Xóa hết
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
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
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </motion.button>
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
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '54px' }}
              >
                🧋
              </motion.div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>
                Giỏ hàng của bạn đang trống
              </h4>
              <p style={{ fontSize: '13px', maxWidth: '240px', lineHeight: 1.5 }}>
                Hãy chọn món trà sữa hoặc cà phê thơm ngon vào giỏ nhé!
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                {/* Ảnh nhỏ */}
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=100'}
                  alt={item.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-sm)',
                    objectFit: 'cover'
                  }}
                />

                {/* Chi tiết */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onRemoveItem(item.id)}
                        style={{
                          color: 'var(--text-light)',
                          padding: '2px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                        title="Xóa món này"
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>

                    {/* Tùy chọn Size, Đường, Đá */}
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Size {item.size} • {item.sugar} đường • {item.ice} đá
                    </div>

                    {/* Topping */}
                    {item.toppings && item.toppings.length > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--primary-700)', marginTop: '3px' }}>
                        + {item.toppings.join(', ')}
                      </div>
                    )}

                    {/* Ghi chú */}
                    {item.item_note && (
                      <div style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--accent-orange)', marginTop: '3px' }}>
                        "{item.item_note}"
                      </div>
                    )}
                  </div>

                  {/* Giá và nút tăng giảm */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '10px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary-700)' }}>
                      {formatVND(item.subtotal)}
                    </span>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 4px',
                      border: '1px solid var(--border-soft)'
                    }}>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-dark)',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span style={{ minWidth: '26px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-dark)',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
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
            boxShadow: '0 -6px 20px rgba(121, 85, 72, 0.06)'
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
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                type="submit"
                style={{
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Áp dụng
              </motion.button>
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 450, damping: 18 }}
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
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(93, 64, 55, 0.32)'
              }}
            >
              <span>Tiến hành Đặt hàng</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
