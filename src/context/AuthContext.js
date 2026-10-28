import React, { createContext, useState, useContext, useEffect } from 'react';
import { Platform } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi tải ứng dụng (hỗ trợ môi trường web và mobile)
  useEffect(() => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('trasua_auth_user');
        if (saved) {
          setUser(JSON.parse(saved));
        }
      }
    } catch (e) {
      console.warn('Lỗi khôi phục tài khoản:', e);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Lưu thông tin người dùng khi đăng nhập thành công
  const login = (userData) => {
    setUser(userData);
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('trasua_auth_user', JSON.stringify(userData));
      }
    } catch (e) {
      console.warn('Lỗi lưu tài khoản:', e);
    }
  };

  // Đăng xuất tài khoản
  const logout = () => {
    setUser(null);
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem('trasua_auth_user');
      }
    } catch (e) {
      console.warn('Lỗi xóa tài khoản:', e);
    }
  };

  // Cập nhật thông tin tài khoản (ví dụ địa chỉ, số điện thoại, tên)
  const updateUser = (fields) => {
    setUser((prev) => {
      const updated = { ...prev, ...fields };
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('trasua_auth_user', JSON.stringify(updated));
        }
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        authLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
