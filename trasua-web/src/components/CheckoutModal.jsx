import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, QrCode, Banknote, MapPin, Phone, User, FileText, ArrowRight, Printer, Sparkles } from 'lucide-react';
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

  // Tính tiền
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFee = (itemsSubtotal >= 100000 || couponCode === 'FREESHIP' || cartItems.length === 0) ? 0 : 15000;
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
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    setIsSubmitting(true);

    // Lưu thông tin khách hàng cho lần sau
    localStorage.setItem('SAVED_CUSTOMER_NAME', customerName.trim());
    localStorage.setItem('SAVED_CUSTOMER_PHONE', customerPhone.trim());
    localStorage.setItem('SAVED_CUSTOMER_ADDRESS', deliveryAddress.trim());

    const orderPayload = {
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      delivery_address: deliveryAddress.trim(),
      note: note.trim() + (paymentMethod === 'vietqr' ? ' [Thanh toán VietQR]' : ' [Tiền mặt COD]'),
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
    // Ngân hàng MB Bank (Mã 970422), STK demo đồ án
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
          maxHeight: '92vh',
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
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Mã đơn hàng của bạn là: <strong style={{ color: 'var(--primary-700)', fontSize: '18px' }}>#DH{orderResult.order_id}</strong>
            </p>

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
          /* TRƯỜNG HỢP 2: FORM ĐIỀN THÔNG TIN GIAO HÀNG */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Form */}
            <div style={{
              padding: '22px 28px',
              borderBottom: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-surface-soft)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>
                Xác Nhận Đặt Hàng Giao Nhanh 🛵
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Vui lòng điền thông tin để shipper giao trà sữa tận tay bạn
              </p>
            </div>

            {/* Nội dung các ô nhập */}
            <div style={{
              padding: '24px 28px',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Họ và tên */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Họ và tên của bạn <span style={{ color: 'var(--accent-orange)' }}>*</span>
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
                  Số điện thoại nhận hàng <span style={{ color: 'var(--accent-orange)' }}>*</span>
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

              {/* Địa chỉ giao */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Địa chỉ giao hàng chi tiết <span style={{ color: 'var(--accent-orange)' }}>*</span>
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
              </div>

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
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)' }}>Tiền mặt COD</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trả khi nhận hàng</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lời nhắn shipper */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>
                  Lời nhắn giao hàng (Nếu có)
                </label>
                <input
                  type="text"
                  placeholder="VD: Giao lên lầu 3 giúp mình, gọi trước 5 phút..."
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

              {/* Tóm tắt tổng tiền */}
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface-soft)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Tổng thanh toán ({cartItems.reduce((s, i) => s + i.quantity, 0)} món):
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Quicksand' }}>
                  {formatVND(finalTotal)}
                </span>
              </div>
            </div>

            {/* Footer Nút Đặt */}
            <div style={{
              padding: '18px 28px',
              borderTop: '1px solid var(--border-light)',
              backgroundColor: '#fff'
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
