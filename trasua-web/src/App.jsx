import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryTabs from './components/CategoryTabs';
import ProductCard from './components/ProductCard';
import DrinkModal from './components/DrinkModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import PrintBillModal from './components/PrintBillModal';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import { fetchMenuData, getApiBaseUrl, setApiBaseUrl } from './api';
import { Sparkles, CupSoda, Heart, Coffee, ShieldCheck, MapPin, Phone, Clock, Settings, RefreshCw } from 'lucide-react';

export default function App() {
  // State Chế độ Quản Trị Admin SPA
  const [isAdminMode, setIsAdminMode] = useState(false);

  // State Khách hàng Thành viên & Đăng nhập
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('COZY_CURRENT_USER') || 'null');
    } catch (e) {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // State Dữ liệu Menu & Danh mục
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');

  // Bộ lọc & Tìm kiếm
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Giỏ hàng & Voucher
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('SAVED_CART_ITEMS') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackerPhone, setTrackerPhone] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [printBillOrder, setPrintBillOrder] = useState(null);
  const [toast, setToast] = useState(null);

  // Load Menu khi khởi động
  useEffect(() => {
    loadMenu();
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('SAVED_CART_ITEMS', JSON.stringify(cartItems));
  }, [cartItems]);

  // Lưu thông tin khách đăng nhập
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('COZY_CURRENT_USER', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('COZY_CURRENT_USER');
    }
  }, [currentUser]);

  // Tính lại mức giảm giá khi mã voucher hoặc giỏ hàng thay đổi
  useEffect(() => {
    const subtotal = cartItems.reduce((s, i) => s + i.subtotal, 0);
    if (!couponCode || subtotal === 0) {
      setDiscountAmount(0);
      return;
    }

    if (couponCode === 'GIAM15K') {
      setDiscountAmount(subtotal >= 60000 ? 15000 : 0);
    } else if (couponCode === 'BANMOI') {
      setDiscountAmount(Math.round(subtotal * 0.2)); // Giảm 20%
    } else if (couponCode === 'FREESHIP') {
      setDiscountAmount(15000); // Tương đương phí ship
    } else {
      setDiscountAmount(0);
    }
  }, [couponCode, cartItems]);

  const loadMenu = async () => {
    setLoading(true);
    const data = await fetchMenuData();
    setCategories(data.categories || []);
    setProducts(data.products || []);
    setToppings(data.toppings || []);
    setDataSource(data.source);
    setLoading(false);
  };

  // Thao tác Thêm món vào Giỏ
  const handleAddToCart = (customDrink) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(item => item.id === customDrink.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += customDrink.quantity;
        next[existingIndex].subtotal = next[existingIndex].quantity * next[existingIndex].unit_price;
        return next;
      }
      return [...prev, customDrink];
    });

    setToast({
      message: `Đã thêm ${customDrink.quantity}x ${customDrink.name} (Size ${customDrink.size}) vào giỏ! 🧋`
    });
  };

  // Cập nhật số lượng trong giỏ
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.unit_price
        };
      }
      return item;
    }));
  };

  // Xóa món khỏi giỏ
  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Xóa toàn bộ giỏ
  const handleClearCart = () => {
    setCartItems([]);
    setCouponCode('');
  };

  // Áp dụng mã Voucher từ Hero Banner
  const handleApplyCoupon = (code) => {
    setCouponCode(code);
    setIsCartOpen(true);
    setToast({ message: `Đã chọn mã ưu đãi: ${code} 🏷️` });
  };

  // Lọc sản phẩm theo danh mục và tìm kiếm tức thì
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategoryId === null || Number(p.category_id) === Number(selectedCategoryId);
    const matchSearch = !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.trim().toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Tính tổng số lượng ly trong giỏ
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Link Web Quản Trị PHP Dự phòng
  const adminUrl = `${getApiBaseUrl()}/admin.php`;

  // NẾU ĐANG Ở CHẾ ĐỘ QUẢN TRỊ ADMIN SPA: HIỂN THỊ ADMIN DASHBOARD
  if (isAdminMode) {
    return (
      <>
        <AdminDashboard
          onExit={() => {
            setIsAdminMode(false);
            loadMenu(); // Reload menu khi thoát admin
          }}
          onOpenPrintBill={(order) => setPrintBillOrder(order)}
        />

        {/* Modal in hóa đơn thu ngân (nếu cần in từ admin) */}
        <PrintBillModal
          isOpen={Boolean(printBillOrder)}
          onClose={() => setPrintBillOrder(null)}
          orderData={printBillOrder}
        />
      </>
    );
  }

  // GIAO DIỆN BÁN HÀNG DÀNH CHO KHÁCH
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. THANH ĐIỀU HƯỚNG CỐ ĐỊNH (STICKY NAVBAR) */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        adminUrl={adminUrl}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAdmin={() => setIsAdminMode(true)}
      />

      {/* 2. HERO BANNER CHÀO MỪNG & VOUCHER DẠNG COUPON */}
      <HeroBanner
        onApplyCoupon={handleApplyCoupon}
        activeCoupon={couponCode}
      />

      {/* 3. THANH DANH MỤC DÍNH (STICKY CATEGORY TABS) */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => {
          setSelectedCategoryId(id);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        totalProductsCount={products.length}
      />

      {/* 4. VÙNG HIỂN THỊ DANH SÁCH MÓN ĂN */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px', width: '100%' }}>
        {/* Tiêu đề khu vực món */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '22px'
        }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)' }}>
              {selectedCategoryId === null
                ? 'Tất Cả Thức Uống Đặc Sắc'
                : (categories.find(c => c.id === selectedCategoryId)?.name || 'Thực Đơn')}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {filteredProducts.length} thức uống thơm ngon sẵn sàng phục vụ bạn
            </p>
          </div>

          {searchQuery && (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Kết quả tìm kiếm cho: "<strong style={{ color: 'var(--primary-700)' }}>{searchQuery}</strong>"
            </div>
          )}
        </div>

        {/* TRƯỜNG HỢP: SKELETON LOADING KHI ĐANG TẢI DỮ LIỆU */}
        {loading ? (
          <div className="products-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} style={{
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div className="skeleton" style={{ width: '100%', height: '180px' }} />
                <div className="skeleton" style={{ width: '40%', height: '14px' }} />
                <div className="skeleton" style={{ width: '85%', height: '20px' }} />
                <div className="skeleton" style={{ width: '100%', height: '32px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div className="skeleton" style={{ width: '35%', height: '22px' }} />
                  <div className="skeleton" style={{ width: '35%', height: '34px', borderRadius: '20px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* TRƯỜNG HỢP: KHÔNG TÌM THẤY MÓN */
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px dashed var(--border-soft)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{ fontSize: '56px' }}>🍃</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)' }}>
              Chưa tìm thấy món trà sữa nào phù hợp!
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '340px' }}>
              Bạn hãy thử tìm bằng từ khóa khác (ví dụ: Trà sữa, Oolong, Cà phê, Trân châu...) nhé.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId(null);
              }}
              style={{
                marginTop: '6px',
                padding: '10px 22px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary-600)',
                color: '#fff',
                fontSize: '13.5px',
                fontWeight: 700
              }}
            >
              Xem tất cả thực đơn
            </button>
          </div>
        ) : (
          /* GRID SẢN PHẨM HOÀN CHỈNH - 4 CỘT CHUẨN ĐẸP */
          <div className="products-grid">
            {filteredProducts.map((prod) => {
              const catName = categories.find(c => c.id === prod.category_id)?.name;
              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  categoryName={catName}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* 5. CỬA SỔ TÙY CHỌN LY ĐỒ UỐNG (INTERACTIVE DRINK CUSTOMIZER) */}
      {selectedProduct && (
        <DrinkModal
          product={selectedProduct}
          toppings={toppings}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 6. GIỎ HÀNG TRƯỢT TỪ BÊN PHẢI (SLIDE-OVER CART DRAWER) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        discountAmount={discountAmount}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 7. MODAL THANH TOÁN & VIETQR ĐỘNG */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        discountAmount={discountAmount}
        couponCode={couponCode}
        currentUser={currentUser}
        onOrderSuccess={() => {
          setCartItems([]);
          setCouponCode('');
        }}
        onOpenTracker={(phone) => {
          setTrackerPhone(phone);
          setIsTrackerOpen(true);
        }}
        onOpenPrintBill={(order) => setPrintBillOrder(order)}
      />

      {/* 8. MODAL TRA CỨU & TIẾN TRÌNH ĐƠN HÀNG (LIVE TRACKER) */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialPhone={trackerPhone}
        onOpenPrintBill={(order) => setPrintBillOrder(order)}
      />

      {/* 9. MODAL IN HÓA ĐƠN THU NGÂN (K80 THERMAL RECEIPT) */}
      <PrintBillModal
        isOpen={Boolean(printBillOrder)}
        onClose={() => setPrintBillOrder(null)}
        orderData={printBillOrder}
      />

      {/* 10. MODAL ĐĂNG NHẬP & THẺ THÀNH VIÊN COZY CLUB */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={(u) => {
          setCurrentUser(u);
          setToast({ message: `Chào mừng ${u.name} đến với Cozy Milk Tea! 🧋` });
        }}
        onLogout={() => {
          setCurrentUser(null);
          setToast({ message: 'Đã đăng xuất tài khoản!' });
        }}
        onOpenTracker={(phone) => {
          setTrackerPhone(phone);
          setIsTrackerOpen(true);
        }}
      />

      {/* 11. TOAST NOTIFICATION TRƯỢT NHẸ */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 12. FOOTER ẤM CÚNG */}
      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid var(--border-light)',
        padding: '48px 0 32px',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
            marginBottom: '36px'
          }}>
            {/* Cột 1: Thông tin quán */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '26px' }}>🧋</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>
                  Trà Sữa Tea & Coffee
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '14px' }}>
                Hương vị trà sữa Oolong nguyên bản và trà hoa quả thanh mát. Đậm đà từng giọt, trọn vẹn yêu thương.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--matcha-green)', fontWeight: 700 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--matcha-green)', display: 'inline-block' }} />
                <span>Đang mở cửa • Phục vụ từ 08:00 - 22:30</span>
              </div>
            </div>

            {/* Cột 2: Liên hệ & Địa chỉ */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '12px' }}>
                Thông Tin Quán
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-body)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={16} color="var(--primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Phường Trảng Bom, Thành Phố Đồng Nai</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="var(--primary-600)" style={{ flexShrink: 0 }} />
                  <span>Hotline đặt hàng: <strong>0912.345.678</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--primary-600)" style={{ flexShrink: 0 }} />
                  <span>Thời gian giao hàng: 20 - 30 phút</span>
                </div>
              </div>
            </div>

            {/* Cột 3: Quản trị & Kết nối API */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '12px' }}>
                Hệ Thống Quản Trị
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                Dành cho quản lý quán để theo dõi đơn hàng thời gian thực, in bill K80 và thêm món mới.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setIsAdminMode(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 16px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--primary-600)',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Cổng Quản Trị SPA</span>
                </button>

                <a
                  href={adminUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-surface-soft)',
                    color: 'var(--text-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: '1px solid var(--border-soft)'
                  }}
                >
                  <span>admin.php</span>
                  <span>↗</span>
                </a>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px' }}>
                Trạng thái API: <span style={{ color: dataSource === 'live_api' ? 'var(--matcha-green)' : 'var(--accent-orange)', fontWeight: 700 }}>
                  {dataSource === 'live_api' ? '● Đang kết nối Online DB MySQL' : '● Chế độ Dự Phòng Offline'}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-light)'
          }}>
            © 2026 Trà Sữa Tea & Coffee • Đồ án Lập trình Mobile & Web • Nhóm 9 Quán Thái
          </div>
        </div>
      </footer>
    </div>
  );
}
