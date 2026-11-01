import React, { useState } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatVND } from '../api';
import CreamDrip from './CreamDrip';
import FluidButton from '@/components/lightswind/fluid-button';

export default function DrinkModal({
  product,
  toppings,
  onClose,
  onAddToCart
}) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState('M'); // 'M' hoặc 'L'
  const [selectedSugar, setSelectedSugar] = useState('100%');
  const [selectedIce, setSelectedIce] = useState('100%');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [itemNote, setItemNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Phụ thu theo Size
  const sizePrice = selectedSize === 'L' ? 10000 : 0;

  // Tính tổng tiền topping đã chọn
  const toppingsPrice = selectedToppings.reduce((sum, topName) => {
    const top = toppings.find(t => t.name === topName);
    return sum + (top ? Number(top.price) : 0);
  }, 0);

  // Đơn giá 1 ly sau khi tùy biến
  const unitPrice = Number(product.base_price) + sizePrice + toppingsPrice;
  // Tổng cộng
  const subtotal = unitPrice * quantity;

  // Toggle Topping
  const handleToggleTopping = (name) => {
    if (selectedToppings.includes(name)) {
      setSelectedToppings(selectedToppings.filter(t => t !== name));
    } else {
      setSelectedToppings([...selectedToppings, name]);
    }
  };

  const handleConfirm = () => {
    onAddToCart({
      id: `${product.id}-${selectedSize}-${selectedSugar}-${selectedIce}-${selectedToppings.sort().join(',')}`,
      product_id: product.id,
      name: product.name,
      image_url: product.image_url,
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings,
      item_note: itemNote.trim(),
      quantity: quantity,
      unit_price: unitPrice,
      subtotal: subtotal
    });
    onClose();
  };

  const sugarLevels = ['0%', '30%', '50%', '70%', '100%'];
  const iceLevels = ['Không đá', '30% đá', '50% đá', '100% đá'];

  const [imgErr, setImgErr] = useState(false);
  const fallbackImg = "https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500";

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
        backgroundColor: 'rgba(62, 39, 35, 0.68)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 35 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 25 }}
        transition={{ type: 'spring', stiffness: 380, damping: 25, mass: 0.85 }}
        className="drink-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(62, 39, 35, 0.45)',
          position: 'relative'
        }}
      >
        {/* LỚP KEM CHEESE CHẢY TRÊN ĐỈNH POPUP */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12 }}>
          <CreamDrip height={22} />
        </div>

        {/* Nút đóng góc phải */}
        <motion.button
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-soft)',
            color: 'var(--text-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </motion.button>

        {/* CỘT TRÁI: Ảnh ly lớn & Giới thiệu hương vị */}
        <div
          className="drink-modal-left"
          style={{
            backgroundColor: 'var(--bg-surface-soft)',
            padding: '34px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid var(--border-light)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="drink-img-box"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(93, 64, 55, 0.15)',
              marginBottom: '16px',
              border: '4px solid var(--border-soft)'
            }}
          >
            <img
              src={imgErr ? fallbackImg : (product.image_url || fallbackImg)}
              alt={product.name}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>

          <h2 style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {product.name}
          </h2>

          <div style={{
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--primary-700)',
            marginBottom: '12px',
            fontFamily: 'Quicksand, sans-serif'
          }}>
            {formatVND(unitPrice)} <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: 500 }}>/ ly</span>
          </div>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '240px'
          }}>
            {product.description || 'Pha chế tươi mới chuẩn công thức đặc quyền.'}
          </p>
        </div>

        {/* CỘT PHẢI: Tùy biến Size, Đường, Đá & Topping */}
        <div
          className="drink-modal-right"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            maxHeight: '90vh'
          }}
        >
          <div style={{ padding: '34px 28px 24px', flex: 1, overflowY: 'auto' }}>
            {/* 1. CHỌN SIZE */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)' }}>
                  1. Chọn Size Ly <span style={{ color: 'var(--accent-orange)' }}>*</span>
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedSize('M')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${selectedSize === 'M' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                    backgroundColor: selectedSize === 'M' ? 'var(--primary-600)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: selectedSize === 'M' ? '0 4px 12px rgba(121, 85, 72, 0.25)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: selectedSize === 'M' ? '#fff' : 'var(--text-dark)' }}>Size Vừa (M)</div>
                    <div style={{ fontSize: '11px', color: selectedSize === 'M' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>Tiêu chuẩn 500ml</div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: selectedSize === 'M' ? '#fff' : 'var(--primary-700)' }}>+0đ</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedSize('L')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${selectedSize === 'L' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                    backgroundColor: selectedSize === 'L' ? 'var(--primary-600)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: selectedSize === 'L' ? '0 4px 12px rgba(121, 85, 72, 0.25)' : 'none'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: selectedSize === 'L' ? '#fff' : 'var(--text-dark)' }}>Size Lớn (L)</div>
                    <div style={{ fontSize: '11px', color: selectedSize === 'L' ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)' }}>Uống đã 700ml</div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: selectedSize === 'L' ? '#fff' : 'var(--accent-orange)' }}>+10.000đ</span>
                </motion.div>
              </div>
            </div>

            {/* 2. CHỌN MỨC ĐƯỜNG */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '10px' }}>
                2. Lượng Đường (Ngọt theo ý bạn)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sugarLevels.map((lvl) => {
                  const isSel = selectedSugar === lvl;
                  return (
                    <motion.button
                      key={lvl}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedSugar(lvl)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isSel ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                        backgroundColor: isSel ? 'var(--primary-600)' : 'var(--bg-surface)',
                        color: isSel ? '#fff' : 'var(--text-body)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {lvl}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 3. CHỌN MỨC ĐÁ */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '10px' }}>
                3. Lượng Đá (Mát lạnh sảng khoái)
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {iceLevels.map((lvl) => {
                  const isSel = selectedIce === lvl;
                  return (
                    <motion.button
                      key={lvl}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedIce(lvl)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: `1.5px solid ${isSel ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                        backgroundColor: isSel ? 'var(--primary-600)' : 'var(--bg-surface)',
                        color: isSel ? '#fff' : 'var(--text-body)',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {lvl}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 4. CHỌN TOPPING */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-dark)' }}>
                  4. Phủ Thêm Topping ({selectedToppings.length} đã chọn)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tự do chọn nhiều loại</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '10px' }}>
                {toppings && toppings.map((top) => {
                  const isChecked = selectedToppings.includes(top.name);
                  return (
                    <motion.div
                      key={top.id || top.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleToggleTopping(top.name)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${isChecked ? 'var(--accent-orange)' : 'var(--border-soft)'}`,
                        backgroundColor: isChecked ? 'var(--accent-orange-light)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: isChecked ? '0 2px 8px rgba(224, 122, 95, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: `1.5px solid ${isChecked ? 'var(--accent-orange)' : 'var(--border-soft)'}`,
                          backgroundColor: isChecked ? 'var(--accent-orange)' : 'var(--bg-surface-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isChecked && <Check size={12} color="#fff" strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            {top.name}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--accent-orange)', fontWeight: 700 }}>
                            +{formatVND(top.price)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 5. GHI CHÚ RIÊNG CHO QUÁN */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                5. Lời nhắn cho Barista (Không bắt buộc)
              </label>
              <input
                type="text"
                placeholder="VD: Để riêng đá giúp mình, cho nhiều kem cheese..."
                value={itemNote}
                onChange={(e) => setItemNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-soft)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  fontSize: '13px',
                  color: 'var(--text-dark)',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* THANH DƯỚI CÙNG: Tăng giảm số lượng & Nút Thêm vào giỏ */}
          <div style={{
            padding: '18px 28px',
            borderTop: '1px solid var(--border-light)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Bộ đếm số lượng */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-surface-soft)',
              borderRadius: 'var(--radius-full)',
              padding: '4px'
            }}>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Minus size={14} />
              </motion.button>
              <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)',
                  border: '1px solid var(--border-soft)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={14} />
              </motion.button>
            </div>

            {/* Nút Thêm Vào Giỏ FluidButton dòng chảy chất lỏng */}
            <div style={{ flex: 1, display: 'flex' }}>
              <FluidButton
                type="button"
                variant="milktea"
                onClick={handleConfirm}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <ShoppingBag size={18} />
                <span>Thêm vào giỏ hàng • {formatVND(subtotal)}</span>
              </FluidButton>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
