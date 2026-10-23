import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useCart } from '../context/CartContext';

// Dùng 10.0.2.2 cho máy ảo Android Studio, localhost cho trình duyệt web
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/trasua_api',
  default: 'http://localhost:8080/trasua_api',
});

// Danh sách mã giảm giá mẫu
const VOUCHERS = {
  DNTU: { discount: 20000, desc: 'Giảm 20.000đ từ ĐH DNTU' },
  FREESHIP: { discount: 15000, desc: 'Miễn phí giao hàng (15.000đ)' },
  CHAOBANMOI: { discount: 10000, desc: 'Ưu đãi bạn mới (10.000đ)' },
};

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, clearCart, getTotalAmount } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Voucher
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const rawTotal = getTotalAmount();
  const discountAmount = appliedVoucher ? Math.min(appliedVoucher.discount, rawTotal) : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const handleApplyVoucher = () => {
    const code = voucherCode.trim().toUpperCase();
    if (!code) return;

    if (VOUCHERS[code]) {
      setAppliedVoucher({ code, ...VOUCHERS[code] });
      Alert.alert('Thành công', `Đã áp dụng mã ${code}: ${VOUCHERS[code].desc}`);
    } else {
      Alert.alert('Mã không hợp lệ', 'Mã giảm giá không tồn tại hoặc đã hết hạn.');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng chọn món trước khi đặt hàng.');
      return;
    }
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Họ tên, SĐT và Địa chỉ.');
      return;
    }

    setSubmitting(true);
    const payload = {
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      note: orderNote,
      discount: discountAmount,
      total_amount: finalTotal,
      cart: cart,
    };

   try {
      const response = await fetch(`${BASE_URL}/create_order.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.status === 'success') {
        // Xóa giỏ hàng ngay khi đặt đơn thành công
        clearCart();

        Alert.alert(
          '🎉 Đặt hàng thành công!',
          `Mã đơn: #${res.order_id}\nTổng thanh toán: ${finalTotal.toLocaleString('vi-VN')} đ\nCửa hàng đã tiếp nhận đơn và đang chuẩn bị đồ uống.`,
          [
            {
              text: 'Xem lịch sử',
              onPress: () => {
                navigation.navigate('Lịch sử', { phone: phone });
              },
            },
            {
              text: 'Về thực đơn',
              onPress: () => {
                navigation.navigate('Thực đơn');
              },
              style: 'cancel',
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Đặt hàng thất bại', res.message || 'Không thể tạo đơn hàng.');
      }
    } catch (err) {
      Alert.alert('Lỗi mạng', 'Không thể kết nối đến Backend XAMPP.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giỏ hàng ({cart.length} món)</Text>

      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
      ) : (
        cart.map((item, index) => (
          <View key={index} style={styles.cartItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>
                {item.name} (Size {item.size}) x{item.quantity}
              </Text>
              <Text style={styles.itemDetail}>
                {item.sugar} đường, {item.ice} đá
              </Text>
              {item.toppings && item.toppings.length > 0 && (
                <Text style={styles.itemDetail}>Topping: {item.toppings.join(', ')}</Text>
              )}
              {item.item_note ? (
                <Text style={[styles.itemDetail, { fontStyle: 'italic', color: '#e67e22' }]}>
                  Ghi chú: {item.item_note}
                </Text>
              ) : null}
              <Text style={styles.itemPrice}>{item.subtotal.toLocaleString('vi-VN')} đ</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(index)} style={styles.deleteBtn}>
              <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Xóa</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {cart.length > 0 && (
        <View style={styles.formCard}>
          {/* Ô Nhập Voucher */}
          <Text style={styles.sectionHeader}>Mã giảm giá (Khuyến mãi)</Text>
          <View style={styles.voucherBox}>
            <TextInput
              placeholder="Nhập DNTU, FREESHIP..."
              value={voucherCode}
              onChangeText={setVoucherCode}
              autoCapitalize="characters"
              style={styles.voucherInput}
            />
            <TouchableOpacity style={styles.voucherBtn} onPress={handleApplyVoucher}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
          {appliedVoucher && (
            <Text style={styles.voucherSuccess}>
              ✓ Đã áp dụng: {appliedVoucher.desc} (-{discountAmount.toLocaleString('vi-VN')} đ)
            </Text>
          )}

          {/* Thông tin giao hàng */}
          <Text style={[styles.sectionHeader, { marginTop: 14 }]}>Thông tin nhận hàng</Text>
          <TextInput
            placeholder="Họ và tên người nhận"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Số điện thoại liên hệ"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            placeholder="Địa chỉ giao hàng chi tiết"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            placeholder="Ghi chú đơn hàng (ví dụ: giao giờ nghỉ trưa...)"
            style={styles.input}
            value={orderNote}
            onChangeText={setOrderNote}
          />

          {/* Bảng tính tổng tiền */}
          <View style={styles.billBox}>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Tạm tính:</Text>
              <Text style={styles.billVal}>{rawTotal.toLocaleString('vi-VN')} đ</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Giảm giá:</Text>
                <Text style={[styles.billVal, { color: '#27ae60' }]}>
                  -{discountAmount.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}
            <View style={[styles.billRow, styles.billRowFinal]}>
              <Text style={styles.finalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.finalVal}>{finalTotal.toLocaleString('vi-VN')} đ</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.checkoutBtn, submitting && { opacity: 0.7 }]}
            onPress={handleCheckout}
            disabled={submitting}
          >
            <Text style={styles.checkoutBtnText}>
              {submitting ? 'ĐANG ĐẶT HÀNG...' : 'ĐẶT HÀNG NGAY'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 30 },
  cartItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, elevation: 1 },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#2c3e50' },
  itemDetail: { fontSize: 12, color: '#666', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#d35400', marginTop: 4 },
  deleteBtn: { justifyContent: 'center', paddingHorizontal: 8 },
  formCard: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginTop: 10, marginBottom: 30, elevation: 2 },
  sectionHeader: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  voucherBox: { flexDirection: 'row', gap: 8 },
  voucherInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, paddingHorizontal: 10, height: 40 },
  voucherBtn: { backgroundColor: '#27ae60', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 6 },
  voucherSuccess: { color: '#27ae60', fontSize: 12, marginTop: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 14 },
  billBox: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 10, marginTop: 6 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  billLabel: { color: '#666', fontSize: 14 },
  billVal: { fontSize: 14, fontWeight: 'bold' },
  billRowFinal: { borderTopWidth: 1, borderColor: '#eee', paddingTop: 8, marginTop: 4 },
  finalLabel: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  finalVal: { fontSize: 18, fontWeight: 'bold', color: '#d35400' },
  checkoutBtn: { backgroundColor: '#d35400', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 14 },
  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});