import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CartProvider, useCart } from './src/context/CartContext';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

function RootTabs() {
  const { cart } = useCart();

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
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Thực đơn" component={MenuScreen} />
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{
          tabBarBadge: cart.length > 0 ? cart.length : null,
          tabBarBadgeStyle: { backgroundColor: '#e74c3c', fontSize: 11 },
        }}
      />
      <Tab.Screen name="Lịch sử" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <RootTabs />
      </NavigationContainer>
    </CartProvider>
  );
}