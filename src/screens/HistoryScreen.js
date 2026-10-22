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

export default function HistoryScreen({ route }) {
  const [phone, setPhone] = useState(route.params?.phone || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!phone.trim()) {
      Alert.alert('Nhập SĐT', 'Vui lòng nhập số điện thoại để tra cứu.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/get_orders.php?phone=${phone.trim()}`);
      const json = await response.json();
      if (json.status === 'success') {
        setOrders(json.data);
      } else {
        Alert.alert('Thông báo', json.message || 'Không tìm thấy đơn hàng.');
      }
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Nhập số điện thoại đặt hàng..."
          keyboardType="phone-pad"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchOrders}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tra cứu</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#d35400" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>Chưa có lịch sử đơn hàng nào.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                <Text style={styles.orderStatus}>{item.status}</Text>
              </View>
              <Text style={styles.orderDate}>Ngày đặt: {item.created_at}</Text>
              <Text style={styles.orderAddr}>Địa chỉ: {item.delivery_address}</Text>

              {/* Chi tiết từng món */}
              <View style={styles.itemList}>
                {item.items &&
                  item.items.map((subItem, idx) => (
                    <Text key={idx} style={styles.itemText}>
                      • {subItem.product_name} (Size {subItem.size}) x{subItem.quantity}
                      {subItem.toppings_text !== 'Không' && ` (+${subItem.toppings_text})`}
                    </Text>
                  ))}
              </View>

              <Text style={styles.orderTotal}>
                Tổng: {Number(item.total_amount).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 12 },
  searchBox: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchBtn: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
  },
  empty: { textAlign: 'center', color: '#999', marginTop: 30 },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 6,
  },
  orderId: { fontWeight: 'bold', fontSize: 16, color: '#2c3e50' },
  orderStatus: { color: '#27ae60', fontWeight: 'bold' },
  orderDate: { fontSize: 12, color: '#95a5a6', marginTop: 4 },
  orderAddr: { fontSize: 13, color: '#555', marginTop: 2 },
  itemList: { marginVertical: 8, backgroundColor: '#fcfcfc', padding: 6, borderRadius: 4 },
  itemText: { fontSize: 13, color: '#333', marginBottom: 2 },
  orderTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#d35400',
  },
});