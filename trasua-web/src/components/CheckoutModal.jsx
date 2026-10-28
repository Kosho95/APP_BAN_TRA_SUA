import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, Banknote, MapPin, Phone, User, FileText, ArrowRight, Printer, Sparkles, ShoppingBag, Coffee, Bike } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatVND, createNewOrder } from '../api';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  discountAmount,
  couponCode,
  currentUser,
  onOrderSuccess,
  onOpenTracker,
  onOpenPrintBill
}) {
  if (!isOpen) return null;

  // 1. PHƯƠNG THỨC NHẬN MÓN: 'delivery' (Giao tận nơi) | 'pickup' (Mang đi) | 'dinein' (Uống tại quán)
  const [fulfillmentType, setFulfillmentType] = useState('delivery');
  const [tableNumber, setTableNumber] = useState('Bàn 01');

  // Khôi phục thông tin đã lưu trước đó nếu có
  const savedPhone = localStorage.getItem('SAVED_CUSTOMER_PHONE') || '';
  const savedName = localStorage.getItem('SAVED_CUSTOMER_NAME') || '';
  const savedAddress = localStorage.getItem('SAVED_CUSTOMER_ADDRESS') || '';

  const [customerName, setCustomerName] = useState(savedName);
  const [customerPhone, setCustomerPhone] = useState(savedPhone);
  const [deliveryAddress, setDeliveryAddress] = useState(savedAddress);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vietqr'); // 'vietqr' hoặc 'cod'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // { order_id, ... }

  // Tự động điền thông tin nếu khách hàng đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !customerName) setCustomerName(currentUser.name);
      if (currentUser.phone && !customerPhone) setCustomerPhone(currentUser.phone);
      if (currentUser.address && !deliveryAddress) setDeliveryAddress(currentUser.address);
    }
  }, [currentUser, isOpen]);

  // TÍNH TIỀN: Phí ship chỉ áp dụng khi chọn 'Giao hàng tận nơi'
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = (fulfillmentType === 'delivery')
    ? ((itemsSubtotal >= 100000 || couponCode === 'FREESHIP' || cartItems.length === 0) ? 0 : 15000)
    : 0;
  const finalTotal = Math.max(0, itemsSubtotal + shippingFee - discountAmount);

  // Kích hoạt pháo hoa chúc mừng khi tạo đơn thành công
  useEffect(() => {
    if (orderResult) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [orderResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Vui lòng điền Họ tên và Số điện thoại!');
      return;
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      alert('Vui lòng nhập Địa chỉ nhận hàng chi tiết để shipper giao đến!');
      return;
    }

    setIsSubmitting(true);

    // Lưu thông tin khách hàng cho lần sau
    localStorage.setItem('SAVED_CUSTOMER_NAME', customerName.trim());
    localStorage.setItem('SAVED_CUSTOMER_PHONE', customerPhone.trim());
    if (fulfillmentType === 'delivery') {
      localStorage.setItem('SAVED_CUSTOMER_ADDRESS', deliveryAddress.trim());
    }

    // Nhận diện địa chỉ và ghi chú theo hình thức nhận món
    const fulfillmentLabel =
      fulfillmentType === 'delivery' ? '[GIAO TẬN NƠI]' :
      fulfillmentType === 'pickup' ? '[ĐẾN MANG ĐI]' :
      `[TẠI QUÁN - ${tableNumber}]`;

    const resolvedAddress =
      fulfillmentType === 'delivery' ? deliveryAddress.trim() :
      fulfillmentType === 'pickup' ? 'Nhận tại quầy (Mang đi) - 280 An Dương Vương, Q5' :
      `Uống tại quán • ${tableNumber} (280 An Dương Vương, Q5)`;

    const orderPayload = {
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_address: resolvedAddress,
      fulfillment_type: fulfillmentType,
      table_number: fulfillmentType === 'dinein' ? tableNumber : '',
      shipping_fee: shippingFee,
      note: `${fulfillmentLabel} ${note.trim() ? note.trim() + ' • ' : ''}${paymentMethod === 'vietqr' ? '[Thanh toán VietQR]' : '[Tiền mặt COD]'}`,
      total_amount: finalTotal,
      discount: discountAmount,
      cart: cartItems
    };

    const result = await createNewOrder(orderPayload);
    setIsSubmitting(false);

    if (result.success) {
      setOrderResult({
        order_id: result.order_id,
        orderData: { ...orderPayload, order_id: result.order_id, finalTotal }
      });
      onOrderSuccess && onOrderSuccess();
    } else {
      alert(result.message || 'Không thể tạo đơn hàng. Vui lòng thử lại!');
    }
  };

  // Link VietQR Động
  const getVietQrUrl = (orderId, amount) => {
    const bankId = 'MB';
    const accountNo = '0987654321';
    const accountName = encodeURIComponent('TIEM TRA SUA COZY');
    const memo = encodeURIComponent(`DH${orderId}`);
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
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
      zIndex: 110,
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
          maxWidth: '560px',
          maxHeight: '90vh',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
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
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={18} />
        </button>

        {/* TRƯỜNG HỢP 1: ĐÃ ĐẶT HÀNG THÀNH CÔNG */}
        {orderResult ? (
          <div style={{ padding: '36px 32px', textAlign: 'center', overflowY: 'auto' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--matcha-light)',
              color: 'var(--matcha-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>
              Đặt Hàng Thành Công! 🎉
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Mã đơn hàng của bạn: <strong style={{ color: 'var(--primary-700)', fontSize: '18px' }}>#DH{orderResult.order_id}</strong>
            </p>

            {/* Pill phương thức nhận món */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '20px',
              backgroundColor: 'var(--accent-orange-light)',
              color: 'var(--accent-orange)',
              fontSize: '13px',
              fontWeight: 800,
              marginBottom: '20px'
            }}>
              {fulfillmentType === 'delivery' && <span>🛵 Giao Hàng Tận Nơi</span>}
              {fulfillmentType === 'pickup' && <span>🛍️ Đến Lấy Mang Đi</span>}
              {fulfillmentType === 'dinein' && <span>🪑 Uống Tại Quán • {tableNumber}</span>}
            </div>

            {/* Khung VietQR Động nếu chọn chuyển khoản */}
            {paymentMethod === 'vietqr' && (
              <div style={{
                backgroundColor: 'var(--bg-surface-soft)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: '1.5px dashed var(--primary-300)',
                marginBottom: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  color: 'var(--primary-700)',
                  marginBottom: '10px'
                }}>
                  <QrCode size={18} />
                  <span>Quét mã VietQR chuyển khoản chính xác:</span>
                </div>

                <div style={{
                  display: 'inline-block',
                  padding: '10px',
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '12px'
                }}>
                  <img
                    src={getVietQrUrl(orderResult.order_id, finalTotal)}
                    alt="VietQR Chuyển Khoản"
                    style={{ width: '220px', height: '220px', display: 'block' }}
                  />
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <div>Số tiền: <strong style={{ color: 'var(--accent-orange)' }}>{formatVND(finalTotal)}</strong></div>
                  <div>Nội dung CK: <strong style={{ color: 'var(--primary-700)' }}>DH{orderResult.order_id}</strong></div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '4px' }}>
                    *App ngân hàng quét mã sẽ tự điền đúng số tiền và nội dung đơn.
                  </div>
                </div>
              </div>
            )}

            {/* Nút Hành Động Sau Đặt Hàng */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  onClose();
                  onOpenTracker && onOpenTracker(customerPhone);
                }}
                style={{
                  padding: '13px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-600)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>Xem Tiến Trình Đơn Hàng</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  onOpenPrintBill && onOpenPrintBill(orderResult.orderData);
                }}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  color: 'var(--primary-700)',
                  border: '1px solid var(--border-soft)',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Printer size={16} />
                <span>In Hóa Đơn Thu Ngân (K80)</span>
              </button>
            </div>
          </div>
        ) : (
          /* TRƯỜNG HỢP 2: FORM ĐIỀN THÔNG TIN ĐẶT HÀNG */
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Header Form */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-surface-soft)',
              flexShrink: 0
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>
                Xác Nhận Đặt Hàng Trà Sữa 🧋
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Chọn hình thức nhận món và phương thức thanh toán phù hợp
              </p>
            </div>

            {/* Nội dung các ô nhập */}
            <div style={{
              padding: '20px 24px',
              overflowY: 'auto',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* 1. LỰA CHỌN PHƯƠNG THỨC: GIAO TẬN NƠI / MANG ĐI / UỐNG TẠI QUÁN */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                  Hình thức nhận món <span style={{ color: 'var(--accent-orange)' }}>*</span>
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  backgroundColor: 'var(--bg-surface-soft)',
                  padding: '6px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-soft)'
                }}>
                  {/* Option 1: Giao hàng tận nơi */}
                  <div
                    onClick={() => setFulfillmentType('delivery')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 4px',
                      borderRadius: '12px',
                      backgroundColor: fulfillmentType === 'delivery' ? '#fff' : 'transparent',
                      color: fulfillmentType === 'delivery' ? 'var(--primary-700)' : 'var(--text-muted)',
                      boxShadow: fulfillmentType === 'delivery' ? 'var(--shadow-sm)' : 'none',
                      border: fulfillmentType === 'delivery' ? '1.5px solid var(--accent-orange)' : '1.5px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🛵</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800 }}>Giao Tận Nơi</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-light)' }}>Phí ship 15k</span>
                  </div>

                  {/* Option 2: Đến mang đi */}
                  <div
                    onClick={() => setFulfillmentType('pickup')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 4px',
                      borderRadius: '12px',
                      backgroundColor: fulfillmentType === 'pickup' ? '#fff' : 'transparent',
                      color: fulfillmentType === 'pickup' ? 'var(--primary-700)' : 'var(--text-muted)',
                      boxShadow: fulfillmentType === 'pickup' ? 'var(--shadow-sm)' : 'none',
                      border: fulfillmentType === 'pickup' ? '1.5px solid var(--accent-orange)' : '1.5px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🛍️</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800 }}>Đến Mang Đi</span>
                    <span style={{ fontSize: '10px', color: 'var(--matcha-green)', fontWeight: 700 }}>Freeship 0đ</span>
                  </div>

                  {/* Option 3: Uống tại quán */}
                  <div
                    onClick={() => setFulfillmentType('dinein')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '10px 4px',
                      borderRadius: '12px',
                      backgroundColor: fulfillmentType === 'dinein' ? '#fff' : 'transparent',
                      color: fulfillmentType === 'dinein' ? 'var(--primary-700)' : 'var(--text-muted)',
                      boxShadow: fulfillmentType === 'dinein' ? 'var(--shadow-sm)' : 'none',
                      border: fulfillmentType === 'dinein' ? '1.5px solid var(--accent-orange)' : '1.5px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>🪑</span>
                    <span style={{ fontSize: '12.5px', fontWeight: 800 }}>Uống Tại Quán</span>
                    <span style={{ fontSize: '10px', color: 'var(--matcha-green)', fontWeight: 700 }}>Phục vụ bàn</span>
                  </div>
                </div>
              </div>

              {/* Họ và tên */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Họ và tên người nhận <span style={{ color: 'var(--accent-orange)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn Anh"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-soft)',
                      fontSize: '13.5px',
                      color: 'var(--text-dark)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Số điện thoại liên hệ <span style={{ color: 'var(--accent-orange)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0912345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-soft)',
                      fontSize: '13.5px',
                      color: 'var(--text-dark)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* CÁC TRƯỜNG THÔNG TIN LINH HOẠT THEO HÌNH THỨC NHẬN */}
              {/* TRƯỜNG HỢP 1: GIAO TẬN NƠI -> BẮT BUỘC NHẬP ĐỊA CHỈ */}
              {fulfillmentType === 'delivery' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                    Địa chỉ nhận hàng chi tiết <span style={{ color: 'var(--accent-orange)' }}>*</span>
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
                    <input
                      type="text"
                      required
                      placeholder="VD: Số 280 An Dương Vương, Phường 4, Quận 5"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border-soft)',
                        fontSize: '13.5px',
                        color: 'var(--text-dark)',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '4px' }}>
                    ⏱️ Thời gian giao dự kiến: 20 - 30 phút • Phí ship: {formatVND(shippingFee)}
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP 2: ĐẾN MANG ĐI -> HIỂN THỊ ĐỊA CHỈ QUÁN LẤY */}
              {fulfillmentType === 'pickup' && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface-soft)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}>
                  <MapPin size={18} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: '12.5px', lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Địa điểm ghé lấy trà sữa:</div>
                    <div style={{ color: 'var(--text-body)' }}>280 An Dương Vương, Phường 4, Quận 5, TP.HCM</div>
                    <div style={{ color: 'var(--matcha-green)', fontWeight: 700, marginTop: '3px' }}>
                      ✓ Quán sẽ chuẩn bị món trong 10 - 15 phút • Miễn phí ship 0đ!
                    </div>
                  </div>
                </div>
              )}

              {/* TRƯỜNG HỢP 3: UỐNG TẠI QUÁN -> CHỌN SỐ BÀN */}
              {fulfillmentType === 'dinein' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                    Chọn Số Bàn của bạn <span style={{ color: 'var(--accent-orange)' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    {['Bàn 01', 'Bàn 02', 'Bàn 03', 'Bàn 04', 'Bàn 05', 'Bàn 06', 'Tầng Lửng', 'Sân Vườn'].map(table => (
                      <button
                        type="button"
                        key={table}
                        onClick={() => setTableNumber(table)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          backgroundColor: tableNumber === table ? 'var(--primary-600)' : 'var(--bg-surface-soft)',
                          color: tableNumber === table ? '#fff' : 'var(--text-body)',
                          border: '1px solid var(--border-soft)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {table}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Hoặc nhập số bàn khác (VD: Bàn 12, Khu ngoài trời...)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1.5px solid var(--border-soft)',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <div style={{ fontSize: '11.5px', color: 'var(--matcha-green)', fontWeight: 600, marginTop: '4px' }}>
                    ☕ Barista sẽ mang món tới tận bàn ngay khi làm xong • Miễn phí phục vụ 0đ!
                  </div>
                </div>
              )}

              {/* Phương thức thanh toán */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                  Phương thức thanh toán
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${paymentMethod === 'vietqr' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                      backgroundColor: paymentMethod === 'vietqr' ? 'var(--primary-50)' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <QrCode size={18} color="var(--primary-600)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>Mã VietQR</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quét app ngân hàng</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${paymentMethod === 'cod' ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                      backgroundColor: paymentMethod === 'cod' ? 'var(--primary-50)' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <Banknote size={18} color="var(--primary-600)" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>Tiền mặt</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trả khi nhận món</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lời nhắn / Ghi chú */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Ghi chú cho quán (Nếu có)
                </label>
                <input
                  type="text"
                  placeholder="VD: Không lấy ống hút nhựa, mang thêm muỗng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border-soft)',
                    fontSize: '13px',
                    color: 'var(--text-dark)',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Tóm tắt chi phí rõ ràng */}
              <div style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                border: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <span>Tiền món ({cartItems.reduce((s, i) => s + i.quantity, 0)} ly):</span>
                  <span>{formatVND(itemsSubtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <span>Phí giao hàng:</span>
                  <span style={{ color: shippingFee === 0 ? 'var(--matcha-green)' : 'var(--text-body)', fontWeight: 600 }}>
                    {shippingFee === 0 ? 'Miễn phí (0đ)' : formatVND(shippingFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#c0392b' }}>
                    <span>Voucher giảm giá ({couponCode}):</span>
                    <span>-{formatVND(discountAmount)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '6px',
                  borderTop: '1px dashed var(--border-soft)',
                  marginTop: '2px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-dark)' }}>
                    Tổng thanh toán:
                  </span>
                  <span style={{ fontSize: '19px', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Quicksand' }}>
                    {formatVND(finalTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Nút Đặt */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#fff',
              flexShrink: 0
            }}>
              <button
                type="submit"
                disabled={isSubmitting}
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
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <span>Đang gửi đơn hàng...</span>
                ) : (
                  <>
                    <span>Hoàn tất Đặt hàng • {formatVND(finalTotal)}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
