import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider, useCart } from './src/context/CartContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AuthScreen from './src/screens/AuthScreen';

const Tab = createBottomTabNavigator();

function RootTabs() {
  const { cart } = useCart();
  const { user, isLoggedIn } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#d35400', elevation: 4 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        tabBarActiveTintColor: '#d35400',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Thực đơn') {
            iconName = focused ? 'cafe' : 'cafe-outline';
          } else if (route.name === 'Giỏ hàng') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Lịch sử') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Tài khoản') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName || 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Thực đơn"
        component={MenuScreen}
        options={{
          headerTitle: '🧋 Trà Sữa & Cà Phê',
        }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{
          tabBarBadge: cart.length > 0 ? cart.length : null,
          tabBarBadgeStyle: { backgroundColor: '#e74c3c', fontSize: 11 },
          headerTitle: '🛒 Giỏ Hàng Của Bạn',
        }}
      />
      <Tab.Screen
        name="Lịch sử"
        component={HistoryScreen}
        options={{
          headerTitle: '📜 Lịch Sử Đơn Hàng',
        }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={AuthScreen}
        options={{
          headerTitle: isLoggedIn ? `👤 Tài Khoản (${user?.name || ''})` : '🔐 Đăng Nhập / Đăng Ký',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <RootTabs />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}