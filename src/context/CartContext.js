import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Thêm một món vào giỏ
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  // Xóa một món theo vị trí index
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Làm sạch giỏ hàng khi đặt hàng thành công
  const clearCart = () => setCart([]);

  // Tính tổng tiền toàn bộ giỏ hàng nha
  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);