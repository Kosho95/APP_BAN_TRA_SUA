import React from 'react';
import { X, Printer } from 'lucide-react';
import { formatVND } from '../api';

export default function PrintBillModal({ isOpen, onClose, orderData }) {
  if (!isOpen || !orderData) return null;

  const orderId = orderData.id || orderData.order_id || '---';
  const totalAmount = orderData.total_price || orderData.total_amount || orderData.finalTotal || 0;
  const items = orderData.items || orderData.cart || [];

  // Xác định hình thức nhận món
  const addr = (orderData.customer_address || orderData.delivery_address || '').toLowerCase();
  const noteText = (orderData.note || '').toLowerCase();

  let fulfillmentTitle = '🛵 GIAO HÀNG TẬN NƠI';
  if (orderData.fulfillment_type === 'pickup' || addr.includes('mang đi') || noteText.includes('mang đi')) {
    fulfillmentTitle = '🛍️ ĐẾN MANG ĐI (TAKEAWAY)';
  } else if (orderData.fulfillment_type === 'dinein' || addr.includes('tại quán') || noteText.includes('tại quán') || orderData.table_number) {
    fulfillmentTitle = `🪑 UỐNG TẠI QUÁN • ${orderData.table_number || 'TẠI BÀN'}`;
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleString('vi-VN');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 120,
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
          borderRadius: 'var(--radius-md)',
          width: '100%',
          maxWidth: '440px',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Nút Đóng & Nút In Trên Cùng */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          backgroundColor: 'var(--bg-surface-soft)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: 'var(--primary-600)',
              color: '#fff',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            <Printer size={15} />
            <span>In Phiếu Thu Ngân (K80)</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Khung Hóa Đơn Chuẩn K80 (80mm) */}
        <div
          id="printable-receipt"
          style={{
            padding: '24px 20px',
            fontFamily: '"Courier New", Courier, monospace',
            color: '#111',
            lineHeight: 1.4,
            fontSize: '13px'
          }}
        >
          {/* Header Quán */}
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2px' }}>
              TRÀ SỮA TEA & COFFEE
            </h2>
            <div style={{ fontSize: '11px', color: '#555' }}>280 An Dương Vương, P.4, Q.5, TP.HCM</div>
            <div style={{ fontSize: '11px', color: '#555' }}>Hotline: 0912.345.678 • Web: trasua-cozy.vn</div>
            <div style={{
              margin: '10px auto',
              borderBottom: '1px dashed #333'
            }} />

            {/* Banner Hình thức nhận món cực nổi bật trên bill */}
            <div style={{
              fontSize: '14px',
              fontWeight: 900,
              backgroundColor: '#eee',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              margin: '4px 0'
            }}>
              {fulfillmentTitle}
            </div>

            <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '4px' }}>PHIẾU THU NGÂN & PHA CHẾ</div>
            <div style={{ fontSize: '12px', fontWeight: 700 }}>MÃ ĐƠN: #DH{orderId}</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Thời gian: {currentDate}</div>
          </div>

          {/* Thông tin khách */}
          <div style={{ marginBottom: '10px', fontSize: '12px' }}>
            <div>Khách hàng: <strong>{orderData.customer_name || 'Khách vãng lai'}</strong></div>
            <div>SĐT: <strong>{orderData.customer_phone || '---'}</strong></div>
            <div>Vị trí / ĐC: {orderData.customer_address || orderData.delivery_address || 'Nhận tại quầy'}</div>
            {orderData.note && <div style={{ fontStyle: 'italic', color: '#555', marginTop: '3px' }}>Ghi chú: {orderData.note}</div>}
          </div>

          <div style={{ borderBottom: '1px dashed #333', marginBottom: '8px' }} />

          {/* Bảng Món */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                <th style={{ paddingBottom: '4px' }}>Tên món</th>
                <th style={{ paddingBottom: '4px', textAlign: 'center' }}>SL</th>
                <th style={{ paddingBottom: '4px', textAlign: 'right' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const name = it.product_name || it.name;
                const qty = it.quantity || 1;
                const sub = it.subtotal || (it.unit_price * qty) || it.price;
                const desc = it.toppings_text || (it.toppings ? it.toppings.join(', ') : '');

                return (
                  <tr key={idx} style={{ verticalAlign: 'top', borderBottom: '1px dotted #ccc' }}>
                    <td style={{ padding: '6px 0' }}>
                      <strong>{name}</strong> {it.size ? `(Size ${it.size})` : ''}
                      {desc && <div style={{ fontSize: '10.5px', color: '#555' }}>↳ {desc}</div>}
                    </td>
                    <td style={{ padding: '6px 0', textAlign: 'center' }}>{qty}</td>
                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: 700 }}>{formatVND(sub)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ borderBottom: '1px dashed #333', marginBottom: '10px' }} />

          {/* Tính tiền */}
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {orderData.shipping_fee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555' }}>
                <span>Phí giao hàng:</span>
                <span>{formatVND(orderData.shipping_fee)}</span>
              </div>
            )}
            {orderData.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c0392b' }}>
                <span>Giảm giá voucher:</span>
                <span>-{formatVND(orderData.discount)}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: 900,
              paddingTop: '4px'
            }}>
              <span>TỔNG THANH TOÁN:</span>
              <span>{formatVND(totalAmount)}</span>
            </div>
          </div>

          <div style={{ borderBottom: '1px dashed #333', margin: '12px 0 10px' }} />

          {/* Footer Lời cảm ơn */}
          <div style={{ textAlign: 'center', fontSize: '11.5px', color: '#555' }}>
            <div>Cảm ơn quý khách đã tin dùng sản phẩm! 💖</div>
            <div>Chúc quý khách một ngày thật ngọt ngào & nhiều niềm vui!</div>
            <div style={{ fontSize: '10px', marginTop: '6px' }}>--- www.trasua-cozy.vn ---</div>
          </div>
        </div>
      </div>
    </div>
  );
}
