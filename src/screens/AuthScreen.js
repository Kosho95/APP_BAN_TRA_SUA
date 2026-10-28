import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Dùng 10.0.2.2 cho máy ảo Android Studio, localhost cho trình duyệt web
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/trasua_api',
  default: 'http://localhost:8080/trasua_api',
});

export default function AuthScreen({ navigation }) {
  const { user, isLoggedIn, login, logout } = useAuth();

  // isLogin = true là tab Đăng nhập, false là tab Đăng ký
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Xử lý submit Đăng nhập / Đăng ký
  const handleSubmit = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại và mật khẩu.');
      return;
    }

    if (!isLogin && !name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập họ tên của bạn.');
      return;
    }

    setLoading(true);
    const endpoint = isLogin ? 'login.php' : 'register.php';
    const payload = isLogin
      ? { phone: phone.trim(), password: password.trim() }
      : { name: name.trim(), phone: phone.trim(), password: password.trim(), address: address.trim() };

    try {
      const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (res.status === 'success') {
        if (isLogin) {
          // Lưu vào context
          login(res.user);
          Alert.alert('Thành công', `Xin chào, ${res.user.name}!`, [
            {
              text: 'Bắt đầu đặt món',
              onPress: () => {
                navigation.navigate('Thực đơn');
              },
            },
          ]);
        } else {
          // Đăng ký thành công
          Alert.alert('Thành công', res.message || 'Đăng ký thành công!', [
            {
              text: 'Đăng nhập ngay',
              onPress: () => {
                if (res.user) {
                  login(res.user);
                  navigation.navigate('Thực đơn');
                } else {
                  setIsLogin(true);
                  setPassword('');
                }
              },
            },
          ]);
        }
      } else {
        Alert.alert('Thất bại', res.message || 'Thao tác không thành công.');
      }
    } catch (error) {
      Alert.alert('Lỗi mạng', 'Không thể kết nối đến máy chủ PHP XAMPP (Port 8080).');
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận đăng xuất
  const handleLogout = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          logout();
          setIsLogin(true);
          setPassword('');
        },
      },
    ]);
  };

  // Mở trang Admin
  const handleOpenAdmin = () => {
    const adminUrl = Platform.select({
      android: 'http://10.0.2.2:8080/trasua_api/admin.php',
      default: 'http://localhost:8080/trasua_api/admin.php',
    });
    Linking.openURL(adminUrl);
  };

  // NẾU ĐÃ ĐĂNG NHẬP: Hiển thị màn hình Profile tài khoản
  if (isLoggedIn && user) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileBadge}>Thành Viên Thân Thiết</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#d35400" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoVal}>{user.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#d35400" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Địa chỉ giao hàng mặc định</Text>
                <Text style={styles.infoVal}>{user.address || 'Chưa cập nhật'}</Text>
              </View>
            </View>

            {user.created_at ? (
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#d35400" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ngày tham gia</Text>
                  <Text style={styles.infoVal}>{user.created_at}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Các nút chức năng */}
          <View style={styles.actionGroup}>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => navigation.navigate('Thực đơn')}
            >
              <Ionicons name="cafe" size={18} color="#fff" />
              <Text style={styles.actionBtnPrimaryText}>Đặt Thức Uống Ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnSecondary}
              onPress={() => navigation.navigate('Lịch sử', { phone: user.phone })}
            >
              <Ionicons name="receipt-outline" size={18} color="#d35400" />
              <Text style={styles.actionBtnSecondaryText}>Xem Lịch Sử Đơn Hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.adminBtn} onPress={handleOpenAdmin}>
              <Ionicons name="settings-outline" size={18} color="#2c3e50" />
              <Text style={styles.adminBtnText}>Quản Trị Hệ Thống (Admin)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
              <Text style={styles.logoutBtnText}>Đăng Xuất Tài Khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // NẾU CHƯA ĐĂNG NHẬP: Hiển thị Form Đăng Nhập / Đăng Ký
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Tiêu đề & Logo */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>🧋 TRÀ SỮA & CÀ PHÊ</Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Đăng nhập để đặt hàng nhanh và tích lũy ưu đãi'
            : 'Tạo tài khoản thành viên mới trong tích tắc'}
        </Text>
      </View>

      {/* 2 Tab chuyển đổi Đăng nhập / Đăng ký */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, isLogin && styles.activeTabBtn]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={[styles.tabText, isLogin && styles.activeTabText]}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, !isLogin && styles.activeTabBtn]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>ĐĂNG KÝ</Text>
        </TouchableOpacity>
      </View>

      {/* Form nhập liệu */}
      <View style={styles.form}>
        {!isLogin && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên *</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Nguyễn Văn A"
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: 0912345678"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu..."
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {!isLogin && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ nhận hàng mặc định</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Trảng Bom, Đồng Nai"
              value={address}
              onChangeText={setAddress}
            />
          </View>
        )}

        {/* Nút bấm Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>
              {isLogin ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN MỚI'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFBF5',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFEBE9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabBtn: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabText: {
    fontWeight: '700',
    color: '#888',
    fontSize: 13,
  },
  activeTabText: {
    color: '#8B4513',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  submitBtn: {
    backgroundColor: '#8B4513',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#d35400',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#27ae60',
    backgroundColor: '#e8f8f5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    backgroundColor: '#fbfbfb',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 2,
  },
  actionGroup: {
    width: '100%',
    gap: 10,
  },
  actionBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d35400',
    paddingVertical: 13,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fdf2e9',
    borderWidth: 1,
    borderColor: '#f5cba7',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  actionBtnSecondaryText: {
    color: '#d35400',
    fontWeight: 'bold',
    fontSize: 14,
  },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 8,
  },
  adminBtnText: {
    color: '#2c3e50',
    fontWeight: '600',
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    gap: 8,
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 14,
  },
});