import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { formatVND } from '../api';

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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(62, 39, 35, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
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
          maxWidth: '860px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        {/* Nút đóng góc phải */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-200)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-100)'}
        >
          <X size={18} />
        </button>

        {/* CỘT TRÁI: Ảnh ly lớn & Giới thiệu hương vị */}
        <div style={{
          width: '38%',
          backgroundColor: 'var(--bg-surface-soft)',
          padding: '30px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid var(--border-light)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '220px',
            height: '220px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '20px',
            border: '4px solid #fff'
          }}>
            <img
              src={imgErr ? fallbackImg : (product.image_url || fallbackImg)}
              alt={product.name}
              onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h3 style={{
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            {product.name}
          </h3>

          <p style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.5,
            padding: '0 8px'
          }}>
            {product.description || 'Pha chế tươi mới chuẩn vị, nguyên liệu chọn lọc cao cấp.'}
          </p>

          <div style={{
            marginTop: '16px',
            padding: '6px 14px',
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Sparkles size={14} color="var(--accent-orange)" />
            <span>Tùy chỉnh theo khẩu vị</span>
          </div>
        </div>

        {/* CỘT PHẢI: Các bước Tùy Chọn (Size, Đường, Đá, Topping, Ghi chú) */}
        <div style={{
          width: '62%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}>
          {/* Header bên phải */}
          <div style={{
            padding: '24px 28px 16px',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>
              Tùy biến ly đồ uống của bạn
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Quicksand' }}>
                {formatVND(unitPrice)}
              </div>
              {selectedSize === 'L' && (
                <span style={{ fontSize: '12px', color: 'var(--accent-orange)', fontWeight: 600 }}>
                  (Đã gồm +10k Size L)
                </span>
              )}
            </div>
          </div>

          {/* Vùng cuộn các tùy chọn */}
          <div style={{
            padding: '20px 28px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '22px'
          }}>
            {/* 1. CHỌN SIZE */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '10px' }}>
                1. Kích Cỡ Ly (Size) <span style={{ color: 'var(--accent-orange)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Size M */}
                <button
                  type="button"
                  onClick={() => setSelectedSize('M')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${selectedSize === 'M' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                    backgroundColor: selectedSize === 'M' ? 'var(--primary-50)' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.18s'
                  }}
                >
                  <div style={{
                    fontSize: '22px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: selectedSize === 'M' ? 'var(--primary-100)' : 'var(--bg-surface-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🥤
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>Size M (500ml)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tiêu chuẩn (Gốc)</div>
                  </div>
                  {selectedSize === 'M' && <Check size={18} color="var(--primary-600)" style={{ marginLeft: 'auto' }} />}
                </button>

                {/* Size L */}
                <button
                  type="button"
                  onClick={() => setSelectedSize('L')}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${selectedSize === 'L' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                    backgroundColor: selectedSize === 'L' ? 'var(--primary-50)' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.18s'
                  }}
                >
                  <div style={{
                    fontSize: '26px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: selectedSize === 'L' ? 'var(--primary-100)' : 'var(--bg-surface-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    🧋
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>Size L (700ml)</div>
                    <div style={{ fontSize: '12px', color: 'var(--accent-orange)', fontWeight: 600 }}>+10.000 đ</div>
                  </div>
                  {selectedSize === 'L' && <Check size={18} color="var(--primary-600)" style={{ marginLeft: 'auto' }} />}
                </button>
              </div>
            </div>

            {/* 2. CHỌN MỨC ĐƯỜNG */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '10px' }}>
                2. Lượng Đường (Độ ngọt)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sugarLevels.map((lvl) => {
                  const isAct = selectedSugar === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedSugar(lvl)}
                      style={{
                        flex: '1 0 16%',
                        minWidth: '60px',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: `1.5px solid ${isAct ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                        backgroundColor: isAct ? 'var(--primary-600)' : '#fff',
                        color: isAct ? '#fff' : 'var(--text-body)',
                        transition: 'all 0.15s'
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. CHỌN MỨC ĐÁ */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '10px' }}>
                3. Lượng Đá (Độ lạnh)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {iceLevels.map((lvl) => {
                  const isAct = selectedIce === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedIce(lvl)}
                      style={{
                        flex: '1 0 22%',
                        minWidth: '85px',
                        padding: '9px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: `1.5px solid ${isAct ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                        backgroundColor: isAct ? 'var(--primary-600)' : '#fff',
                        color: isAct ? '#fff' : 'var(--text-body)',
                        transition: 'all 0.15s'
                      }}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. CHỌN TOPPING */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  4. Thêm Topping Yêu Thích
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>Chọn nhiều loại tùy thích</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {toppings.map((top) => {
                  const isChosen = selectedToppings.includes(top.name);
                  return (
                    <div
                      key={top.id || top.name}
                      onClick={() => handleToggleTopping(top.name)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${isChosen ? 'var(--primary-500)' : 'var(--border-light)'}`,
                        backgroundColor: isChosen ? 'var(--primary-50)' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: `1.5px solid ${isChosen ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                          backgroundColor: isChosen ? 'var(--primary-600)' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff'
                        }}>
                          {isChosen && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)' }}>
                            {top.name}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--accent-orange)', fontWeight: 700 }}>
                            +{formatVND(top.price)}
                          </div>
                        </div>
                      </div>
                    </div>
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
                placeholder="VD: Để riêng đá giúp mình, cho ít trân châu..."
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
            backgroundColor: '#fff',
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
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 800, fontSize: '15px' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-dark)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Nút Thêm Vào Giỏ */}
            <button
              type="button"
              onClick={handleConfirm}
              style={{
                flex: 1,
                padding: '13px 24px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '15px',
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
              <ShoppingBag size={18} />
              <span>Thêm vào giỏ hàng • {formatVND(subtotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
