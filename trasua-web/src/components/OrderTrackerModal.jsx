import React, { useState, useEffect } from 'react';
import { X, Search, Phone, Clock, CheckCircle2, Coffee, Bike, PackageCheck, AlertCircle, Printer, RefreshCw } from 'lucide-react';
import { formatVND, fetchOrdersByPhone } from '../api';

export default function OrderTrackerModal({
  isOpen,
  onClose,
  initialPhone,
  onOpenPrintBill
}) {
  if (!isOpen) return null;

  const [phone, setPhone] = useState(initialPhone || localStorage.getItem('SAVED_CUSTOMER_PHONE') || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (phone && phone.trim().length >= 8) {
      handleSearch(phone.trim());
    }
  }, []);

  const handleSearch = async (phoneToQuery) => {
    const q = phoneToQuery !== undefined ? phoneToQuery : phone;
    if (!q || !q.trim()) return;

    setLoading(true);
    setHasSearched(true);
    const result = await fetchOrdersByPhone(q.trim());
    setOrders(result || []);
    setLoading(false);
  };

  // Tính nấc trạng thái hiện tại (1..4)
  const getStatusStep = (statusText) => {
    if (!statusText) return 1;
    const st = statusText.toLowerCase();
    if (st.includes('hoàn thành') || st.includes('thành công')) return 4;
    if (st.includes('giao')) return 3;
    if (st.includes('pha chế')) return 2;
    if (st.includes('hủy')) return -1;
    return 1; // Đang xử lý / Mới nhận
  };

  const steps = [
    { num: 1, label: 'Đã nhận đơn', icon: <Clock size={16} />, desc: 'Quán đang tiếp nhận' },
    { num: 2, label: 'Đang pha chế', icon: <Coffee size={16} />, desc: 'Barista đang chuẩn bị' },
    { num: 3, label: 'Đang giao hàng', icon: <Bike size={16} />, desc: 'Shipper đang trên đường' },
    { num: 4, label: 'Giao thành công', icon: <PackageCheck size={16} />, desc: 'Chúc bạn ngon miệng' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(62, 39, 35, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 105,
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
          maxWidth: '680px',
          maxHeight: '90vh',
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

        {/* Header Tra Cứu */}
        <div style={{
          padding: '24px 28px 18px',
          backgroundColor: 'var(--bg-surface-soft)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>
            Tra Cứu & Theo Dõi Tiến Trình Đơn Hàng 🧋
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Nhập số điện thoại đặt hàng để xem lộ trình pha chế & giao hàng theo thời gian thực
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{ display: 'flex', gap: '8px' }}
          >
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Phone size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-light)' }} />
              <input
                type="tel"
                placeholder="Nhập số điện thoại của bạn (VD: 0912345678)..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--border-soft)',
                  backgroundColor: '#fff',
                  fontSize: '13.5px',
                  color: 'var(--text-dark)',
                  outline: 'none'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {loading ? <RefreshCw size={15} className="spin" /> : <Search size={15} />}
              <span>Tìm Đơn</span>
            </button>
          </form>
        </div>

        {/* Danh Sách Đơn Hàng */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
              <div>Đang tra cứu dữ liệu đơn hàng...</div>
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-light)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ fontSize: '48px' }}>📋</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}>
                {hasSearched ? 'Không tìm thấy đơn hàng nào với số điện thoại này' : 'Hãy nhập số điện thoại để tra cứu'}
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', maxWidth: '320px' }}>
                Đơn hàng của bạn sẽ được hiển thị kèm theo timeline chi tiết từ lúc quán nhận đơn đến khi giao tận tay.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const orderId = order.id || order.order_id;
              const totalAmount = order.total_price || order.total_amount || order.final_total || 0;

              return (
                <div
                  key={orderId}
                  style={{
                    backgroundColor: 'var(--bg-surface-soft)',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-light)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  {/* Hàng Tiêu Đề Đơn */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px dashed var(--border-soft)',
                    paddingBottom: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-700)' }}>
                          #DH{orderId}
                        </span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          backgroundColor: currentStep === 4 ? 'var(--matcha-light)' : (currentStep === -1 ? 'var(--accent-pink-light)' : 'var(--accent-orange-light)'),
                          color: currentStep === 4 ? 'var(--matcha-green)' : (currentStep === -1 ? 'var(--accent-pink)' : 'var(--accent-orange)')
                        }}>
                          {order.status || 'Đang xử lý'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Khách: <strong>{order.customer_name}</strong> • SĐT: {order.customer_phone}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-light)', marginTop: '2px' }}>
                        Địa chỉ: {order.delivery_address}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'Quicksand' }}>
                        {formatVND(totalAmount)}
                      </div>
                      <button
                        onClick={() => onOpenPrintBill && onOpenPrintBill(order)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: 'var(--primary-600)',
                          backgroundColor: '#fff',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-soft)',
                          marginTop: '6px'
                        }}
                      >
                        <Printer size={13} />
                        <span>In Hóa Đơn</span>
                      </button>
                    </div>
                  </div>

                  {/* STEPPER TIẾN TRÌNH ĐƠN HÀNG 4 NẤC */}
                  {currentStep !== -1 ? (
                    <div style={{ padding: '8px 4px' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        position: 'relative',
                        gap: '8px'
                      }}>
                        {/* Thanh line nối giữa các bước */}
                        <div style={{
                          position: 'absolute',
                          top: '18px',
                          left: '12%',
                          right: '12%',
                          height: '3px',
                          backgroundColor: 'var(--border-soft)',
                          zIndex: 1
                        }}>
                          <div style={{
                            height: '100%',
                            backgroundColor: 'var(--matcha-green)',
                            width: currentStep === 1 ? '0%' : (currentStep === 2 ? '33%' : (currentStep === 3 ? '66%' : '100%')),
                            transition: 'width 0.4s ease'
                          }} />
                        </div>

                        {steps.map((st) => {
                          const isDone = currentStep >= st.num;
                          const isCurrent = currentStep === st.num;
                          return (
                            <div key={st.num} style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              zIndex: 2
                            }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: isDone ? 'var(--matcha-green)' : '#fff',
                                color: isDone ? '#fff' : 'var(--text-light)',
                                border: `2px solid ${isDone ? 'var(--matcha-green)' : 'var(--border-soft)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isCurrent ? '0 0 0 4px rgba(46, 125, 50, 0.2)' : 'none',
                                transition: 'all 0.3s ease',
                                marginBottom: '6px'
                              }}>
                                {st.icon}
                              </div>
                              <span style={{
                                fontSize: '11.5px',
                                fontWeight: isCurrent ? 800 : 600,
                                color: isDone ? 'var(--text-dark)' : 'var(--text-light)'
                              }}>
                                {st.label}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '1px' }}>
                                {st.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--accent-pink-light)',
                      color: 'var(--accent-pink)',
                      fontSize: '12.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <AlertCircle size={16} />
                      <span>Đơn hàng này đã bị hủy. Vui lòng liên hệ hotline quán nếu cần hỗ trợ!</span>
                    </div>
                  )}

                  {/* Danh Sách Món Trong Đơn */}
                  {order.items && order.items.length > 0 && (
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      border: '1px solid var(--border-light)'
                    }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-light)', marginBottom: '6px' }}>
                        CHI TIẾT MÓN ({order.items.length} món):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                            <div>
                              <strong style={{ color: 'var(--text-dark)' }}>{item.product_name}</strong>
                              <span style={{ color: 'var(--accent-orange)', fontWeight: 700, marginLeft: '6px' }}>x{item.quantity}</span>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                ↳ {item.toppings_text || 'Mặc định'}
                              </div>
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                              {formatVND(item.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
