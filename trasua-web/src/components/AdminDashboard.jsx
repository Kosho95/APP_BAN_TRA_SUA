import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  Users,
  LogOut,
  ArrowLeft,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  XCircle,
  Plus,
  Trash2,
  Printer,
  TrendingUp,
  DollarSign,
  Package,
  Sparkles,
  Lock,
  Eye,
  ExternalLink
} from 'lucide-react';
import {
  fetchAdminData,
  updateAdminOrderStatus,
  addAdminProduct,
  deleteAdminProduct,
  addAdminTopping,
  formatVND
} from '../api';

export default function AdminDashboard({ onExit, onOpenPrintBill }) {
  // Trạng thái Đăng Nhập Quản Trị
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('COZY_ADMIN_SESSION') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tab đang chọn
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'menu' | 'customers'

  // Dữ liệu từ API
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Bộ lọc đơn hàng
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Form Thêm Món
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState(1);
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  // Form Thêm Topping
  const [newToppingName, setNewToppingName] = useState('');
  const [newToppingPrice, setNewToppingPrice] = useState('');
  const [addingTopping, setAddingTopping] = useState(false);

  // Thông báo Toast nội bộ Admin
  const [adminAlert, setAdminAlert] = useState(null);

  const showAlert = (msg, type = 'success') => {
    setAdminAlert({ msg, type });
    setTimeout(() => setAdminAlert(null), 3500);
  };

  // Tải dữ liệu khi mở trang
  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
    }
  }, [isAdminLoggedIn]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setAdminData(data);
    } catch (e) {
      console.warn('Lỗi load admin data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    showAlert('Đã đồng bộ dữ liệu mới nhất!', 'success');
  };

  // Xử lý đăng nhập Admin
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const u = adminUsername.trim().toLowerCase();
    const p = adminPassword.trim();

    if ((u === 'admin' && (p === '123456' || p === 'admin123')) ||
        (u === 'quanly' && p === '123456') ||
        (p === '123456')) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('COZY_ADMIN_SESSION', 'true');
    } else {
      setLoginError('Sai tài khoản hoặc mật khẩu! (Gợi ý: admin / 123456)');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('COZY_ADMIN_SESSION');
  };

  // Cập nhật trạng thái đơn hàng tức thì
  const handleStatusChange = async (orderId, newStatus) => {
    // Cập nhật Optimistic UI trước
    setAdminData(prev => {
      if (!prev) return prev;
      const updatedOrders = prev.orders.map(o => {
        if (o.id === orderId) {
          return { ...o, status: newStatus };
        }
        return o;
      });
      return { ...prev, orders: updatedOrders };
    });

    const res = await updateAdminOrderStatus(orderId, newStatus);
    if (res.status === 'success') {
      showAlert(`Đã chuyển đơn #${orderId} sang "${newStatus}"!`);
      // Đồng bộ lại stats
      loadData();
    } else {
      showAlert(res.message || 'Lỗi cập nhật', 'error');
    }
  };

  // Xử lý thêm món
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) {
      showAlert('Vui lòng nhập tên món và giá tiền!', 'error');
      return;
    }

    setAddingProduct(true);
    const res = await addAdminProduct({
      category_id: newProdCat,
      name: newProdName,
      price: newProdPrice,
      image_url: newProdImage || 'https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500',
      description: newProdDesc
    });

    setAddingProduct(false);
    if (res.status === 'success') {
      showAlert(res.message || 'Thêm món thành công!');
      setNewProdName('');
      setNewProdPrice('');
      setNewProdImage('');
      setNewProdDesc('');
      loadData();
    } else {
      showAlert(res.message || 'Lỗi khi thêm món', 'error');
    }
  };

  // Xử lý xóa món
  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${prodName}" khỏi thực đơn?`)) return;

    // Optimistic UI update
    setAdminData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        products: prev.products.filter(p => p.id !== prodId)
      };
    });

    const res = await deleteAdminProduct(prodId);
    if (res.status === 'success') {
      showAlert(res.message || 'Đã xóa món!');
      loadData();
    } else {
      showAlert(res.message || 'Lỗi khi xóa món', 'error');
    }
  };

  // Xử lý thêm Topping
  const handleAddToppingSubmit = async (e) => {
    e.preventDefault();
    if (!newToppingName.trim() || !newToppingPrice) {
      showAlert('Vui lòng nhập tên topping và giá tiền!', 'error');
      return;
    }

    setAddingTopping(true);
    const res = await addAdminTopping({
      name: newToppingName,
      price: newToppingPrice
    });
    setAddingTopping(false);

    if (res.status === 'success') {
      showAlert(res.message || 'Thêm topping thành công!');
      setNewToppingName('');
      setNewToppingPrice('');
      loadData();
    } else {
      showAlert(res.message || 'Lỗi khi thêm topping', 'error');
    }
  };

  // Lọc danh sách đơn hàng
  const filteredOrders = useMemo(() => {
    if (!adminData || !adminData.orders) return [];
    return adminData.orders.filter(order => {
      const matchStatus = orderStatusFilter === 'ALL' || order.status === orderStatusFilter;
      const q = orderSearchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        String(order.id).includes(q) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(q)) ||
        (order.customer_phone && order.customer_phone.includes(q));
      return matchStatus && matchSearch;
    });
  }, [adminData, orderStatusFilter, orderSearchQuery]);

  // NẾU CHƯA ĐĂNG NHẬP ADMIN: HIỂN THỊ MÀN HÌNH ĐĂNG NHẬP BẢO MẬT
  if (!isAdminLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#2A170F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Nút thoát về cửa hàng */}
        <button
          onClick={onExit}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '13.5px',
            fontWeight: 700,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s'
          }}
        >
          <ArrowLeft size={16} />
          <span>Về Cửa Hàng Trà Sữa</span>
        </button>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          padding: '40px 32px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#5D4037',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(93, 64, 55, 0.3)'
          }}>
            🧋
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#3E2723', marginBottom: '6px' }}>
            Hệ Thống Quản Trị Cozy Tea
          </h2>
          <p style={{ fontSize: '13px', color: '#8D6E63', marginBottom: '24px' }}>
            Đăng nhập tài khoản Quản lý để xem doanh thu, xử lý đơn hàng và chỉnh sửa thực đơn.
          </p>

          {loginError && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              fontSize: '12.5px',
              marginBottom: '18px',
              fontWeight: 600
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '6px' }}>
                Tài khoản quản trị
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #E5DDD3',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FAF4EB'
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '6px' }}>
                Mật khẩu
              </label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #E5DDD3',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#FAF4EB'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '8px',
                padding: '13px',
                borderRadius: '9999px',
                backgroundColor: '#d35400',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 800,
                boxShadow: '0 6px 18px rgba(211, 84, 0, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              Đăng Nhập Quản Trị
            </button>
          </form>

          {/* Nút bấm nhanh 1 chạm */}
          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setAdminUsername('admin');
                setAdminPassword('123456');
                setIsAdminLoggedIn(true);
                localStorage.setItem('COZY_ADMIN_SESSION', 'true');
              }}
              style={{
                fontSize: '12.5px',
                color: '#d35400',
                fontWeight: 700,
                textDecoration: 'underline'
              }}
            >
              ⚡ Bấm vào đây để đăng nhập tự động (admin / 123456)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN QUẢN TRỊ ADMIN SPA HOÀN CHỈNH

  // Nhận diện phương thức nhận món cho đơn hàng
  const getFulfillmentBadge = (order) => {
    const addr = (order.customer_address || order.delivery_address || '').toLowerCase();
    const note = (order.note || '').toLowerCase();
    if (order.fulfillment_type === 'pickup' || addr.includes('mang đi') || note.includes('mang đi')) {
      return { label: '🛍️ Mang đi', bg: '#FFF3E0', color: '#d35400' };
    }
    if (order.fulfillment_type === 'dinein' || addr.includes('tại quán') || note.includes('tại quán') || order.table_number) {
      return { label: `🪑 Tại quán ${order.table_number ? '• ' + order.table_number : ''}`, bg: '#E8F5E9', color: '#2E7D32' };
    }
    return { label: '🛵 Giao tận nơi', bg: '#E3F2FD', color: '#1565C0' };
  };

  const stats = adminData?.stats || {
    total_orders: 0,
    pending_orders: 0,
    processing_orders: 0,
    completed_orders: 0,
    total_products: 0,
    total_revenue: 0,
    total_users: 0
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5ECE0' }}>
      {/* 1. SIDEBAR THANH ĐIỀU HƯỚNG TỐI MÀU COZY F&B */}
      <aside style={{
        width: '260px',
        backgroundColor: '#2A170F',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
        zIndex: 20
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#d35400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            🧋
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'Quicksand' }}>Cozy Milk Tea</div>
            <div style={{ fontSize: '11px', color: '#D7CCC8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cổng Quản Trị POS
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'dashboard' ? '#d35400' : 'transparent',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Tổng Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'orders' ? '#d35400' : 'transparent',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingBag size={18} />
              <span>Đơn Hàng</span>
            </div>
            {stats.pending_orders > 0 && (
              <span style={{
                backgroundColor: '#e74c3c',
                color: '#fff',
                fontSize: '11px',
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: 800
              }}>
                {stats.pending_orders}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'menu' ? '#d35400' : 'transparent',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <Coffee size={18} />
            <span>Thực Đơn & Topping</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: activeTab === 'customers' ? '#d35400' : 'transparent',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              transition: 'all 0.2s',
              textAlign: 'left'
            }}
          >
            <Users size={18} />
            <span>Khách Hàng</span>
          </button>
        </nav>

        {/* Chân Sidebar */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onExit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#D7CCC8',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            <ArrowLeft size={16} />
            <span>Về Web Đặt Món</span>
          </button>

          <button
            onClick={handleAdminLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(231, 76, 60, 0.15)',
              color: '#e74c3c',
              fontSize: '13px',
              fontWeight: 700
            }}
          >
            <LogOut size={16} />
            <span>Đăng Xuất Admin</span>
          </button>
        </div>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (MAIN WORKSPACE) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <header style={{
          height: '70px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #E5DDD3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 15
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#3E2723' }}>
              {activeTab === 'dashboard' && '📊 Bảng Điều Khiển Tổng Quan'}
              {activeTab === 'orders' && '📋 Quản Lý Đơn Hàng Thời Gian Thực'}
              {activeTab === 'menu' && '🧋 Quản Lý Thực Đơn & Danh Mục'}
              {activeTab === 'customers' && '👥 Danh Sách Khách Hàng Thành Viên'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                backgroundColor: '#FAF4EB',
                color: '#5D4037',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid #E5DDD3'
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
            </button>

            <button
              onClick={onExit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: '#d35400',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              <span>Xem Web Đặt Món</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </header>

        {/* Thông báo Toast bên trong Admin */}
        {adminAlert && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '12px 20px',
            borderRadius: '12px',
            backgroundColor: adminAlert.type === 'error' ? '#C62828' : '#2E7D32',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} />
            <span>{adminAlert.msg}</span>
          </div>
        )}

        {/* Nội dung từng Tab */}
        <main style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {loading && !adminData ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#8D6E63' }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>⏳</div>
              <p>Đang tải dữ liệu máy chủ...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: TỔNG QUAN (DASHBOARD) */}
              {activeTab === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {/* 4 Thẻ Thống Kê */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px'
                  }}>
                    {/* Thẻ 1: Doanh thu */}
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '22px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      border: '1px solid #E5DDD3'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#8D6E63' }}>Tổng Doanh Thu</span>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <DollarSign size={20} />
                        </div>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#2E7D32', fontFamily: 'Quicksand' }}>
                        {formatVND(stats.total_revenue)}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#8D6E63', marginTop: '4px' }}>
                        Doanh thu từ các đơn thành công
                      </div>
                    </div>

                    {/* Thẻ 2: Tổng số đơn */}
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '22px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      border: '1px solid #E5DDD3'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#8D6E63' }}>Tổng Đơn Hàng</span>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFF3E0', color: '#d35400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBag size={20} />
                        </div>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#3E2723', fontFamily: 'Quicksand' }}>
                        {stats.total_orders} đơn
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#8D6E63', marginTop: '4px' }}>
                        Đã giao thành công: {stats.completed_orders}
                      </div>
                    </div>

                    {/* Thẻ 3: Chờ xử lý */}
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '22px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      border: '1px solid #E5DDD3'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#8D6E63' }}>Đơn Cần Pha Chế</span>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#FFEBEE', color: '#C62828', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Clock size={20} />
                        </div>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#C62828', fontFamily: 'Quicksand' }}>
                        {stats.pending_orders + stats.processing_orders} đơn
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#8D6E63', marginTop: '4px' }}>
                        {stats.pending_orders} mới • {stats.processing_orders} đang pha chế
                      </div>
                    </div>

                    {/* Thẻ 4: Tổng số món */}
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '22px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      border: '1px solid #E5DDD3'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#8D6E63' }}>Thực Đơn Hoạt Động</span>
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFEBE9', color: '#5D4037', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Coffee size={20} />
                        </div>
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#3E2723', fontFamily: 'Quicksand' }}>
                        {stats.total_products} món
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#8D6E63', marginTop: '4px' }}>
                        Kèm {adminData?.toppings?.length || 0} loại Topping hấp dẫn
                      </div>
                    </div>
                  </div>

                  {/* Bảng 5 đơn hàng mới nhất */}
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    border: '1px solid #E5DDD3'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3E2723' }}>
                        ⚡ Đơn Hàng Mới Nhất Vừa Nhận
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        style={{ fontSize: '13px', color: '#d35400', fontWeight: 700 }}
                      >
                        Xem tất cả đơn →
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #F5ECE0', color: '#8D6E63', fontSize: '12.5px' }}>
                            <th style={{ padding: '10px 12px' }}>MÃ ĐƠN</th>
                            <th style={{ padding: '10px 12px' }}>KHÁCH HÀNG</th>
                            <th style={{ padding: '10px 12px' }}>TỔNG TIỀN</th>
                            <th style={{ padding: '10px 12px' }}>TRẠNG THÁI</th>
                            <th style={{ padding: '10px 12px' }}>HÀNH ĐỘNG</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminData?.orders?.slice(0, 5).map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #F5ECE0' }}>
                              <td style={{ padding: '12px', fontWeight: 800, color: '#3E2723' }}>#{order.id}</td>
                              <td style={{ padding: '12px' }}>
                                <div style={{ fontWeight: 700, color: '#3E2723' }}>{order.customer_name || 'Khách Vãng Lai'}</div>
                                <div style={{ fontSize: '12px', color: '#8D6E63' }}>{order.customer_phone}</div>
                              </td>
                              <td style={{ padding: '12px', fontWeight: 800, color: '#d35400' }}>
                                {formatVND(order.total_amount)}
                              </td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  backgroundColor:
                                    order.status === 'Đã hoàn thành' ? '#E8F5E9' :
                                    order.status === 'Đang pha chế' ? '#FFF3E0' :
                                    order.status === 'Đang giao' ? '#E3F2FD' :
                                    order.status === 'Đã hủy' ? '#FFEBEE' : '#FAF4EB',
                                  color:
                                    order.status === 'Đã hoàn thành' ? '#2E7D32' :
                                    order.status === 'Đang pha chế' ? '#E65100' :
                                    order.status === 'Đang giao' ? '#1565C0' :
                                    order.status === 'Đã hủy' ? '#C62828' : '#5D4037'
                                }}>
                                  {order.status}
                                </span>
                              </td>
                              <td style={{ padding: '12px' }}>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #E5DDD3',
                                    fontSize: '12.5px',
                                    fontWeight: 600,
                                    outline: 'none',
                                    backgroundColor: '#FAF4EB'
                                  }}
                                >
                                  <option value="Đang xử lý">Đang xử lý</option>
                                  <option value="Đang pha chế">Đang pha chế</option>
                                  <option value="Đang giao">Đang giao</option>
                                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                                  <option value="Đã hủy">Đã hủy</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: QUẢN LÝ ĐƠN HÀNG CHI TIẾT (ORDERS) */}
              {activeTab === 'orders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Thanh lọc & tìm kiếm */}
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '18px 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    border: '1px solid #E5DDD3'
                  }}>
                    {/* Status Tabs */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        { label: 'Tất cả', val: 'ALL' },
                        { label: 'Đang xử lý', val: 'Đang xử lý' },
                        { label: 'Đang pha chế', val: 'Đang pha chế' },
                        { label: 'Đang giao', val: 'Đang giao' },
                        { label: 'Đã hoàn thành', val: 'Đã hoàn thành' },
                        { label: 'Đã hủy', val: 'Đã hủy' }
                      ].map(pill => (
                        <button
                          key={pill.val}
                          onClick={() => setOrderStatusFilter(pill.val)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: '9999px',
                            fontSize: '13px',
                            fontWeight: 700,
                            backgroundColor: orderStatusFilter === pill.val ? '#d35400' : '#FAF4EB',
                            color: orderStatusFilter === pill.val ? '#fff' : '#5D4037',
                            border: '1px solid #E5DDD3',
                            transition: 'all 0.15s'
                          }}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', width: '280px' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8D6E63' }} />
                      <input
                        type="text"
                        placeholder="Tìm theo Mã đơn, Tên, SĐT..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          borderRadius: '9999px',
                          border: '1.5px solid #E5DDD3',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: '#FAF4EB'
                        }}
                      />
                    </div>
                  </div>

                  {/* Danh sách đơn hàng chi tiết */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {filteredOrders.length === 0 ? (
                      <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        backgroundColor: '#fff',
                        borderRadius: '16px',
                        border: '1.5px dashed #E5DDD3',
                        color: '#8D6E63'
                      }}>
                        🍃 Không tìm thấy đơn hàng nào phù hợp!
                      </div>
                    ) : (
                      filteredOrders.map(order => (
                        <div
                          key={order.id}
                          style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '20px 24px',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                            border: '1px solid #E5DDD3',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px'
                          }}
                        >
                          {/* Dòng 1: Header đơn hàng */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #F5ECE0',
                            paddingBottom: '12px',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '18px', fontWeight: 800, color: '#3E2723' }}>
                                Đơn hàng #{order.id}
                              </span>
                              {(() => {
                                const fBadge = getFulfillmentBadge(order);
                                return (
                                  <span style={{
                                    fontSize: '11.5px',
                                    fontWeight: 800,
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    backgroundColor: fBadge.bg,
                                    color: fBadge.color
                                  }}>
                                    {fBadge.label}
                                  </span>
                                );
                              })()}
                              <span style={{ fontSize: '12px', color: '#8D6E63' }}>
                                {order.created_at || 'Vừa xong'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {/* Dropdown đổi trạng thái */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12.5px', color: '#8D6E63', fontWeight: 600 }}>Trạng thái:</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                  style={{
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    border: '1.5px solid #d35400',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    outline: 'none',
                                    backgroundColor: '#FFF3E0',
                                    color: '#d35400',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <option value="Đang xử lý">⏳ Đang xử lý</option>
                                  <option value="Đang pha chế">🧋 Đang pha chế</option>
                                  <option value="Đang giao">🛵 Đang giao hàng</option>
                                  <option value="Đã hoàn thành">✅ Đã hoàn thành</option>
                                  <option value="Đã hủy">❌ Đã hủy</option>
                                </select>
                              </div>

                              {/* Nút in Bill K80 */}
                              {onOpenPrintBill && (
                                <button
                                  onClick={() => onOpenPrintBill(order)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FAF4EB',
                                    color: '#5D4037',
                                    fontSize: '12.5px',
                                    fontWeight: 700,
                                    border: '1px solid #E5DDD3'
                                  }}
                                  title="In hóa đơn K80"
                                >
                                  <Printer size={14} />
                                  <span>In Bill</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Dòng 2: Thông tin khách & Địa chỉ & Món */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px'
                          }}>
                            {/* Cột Khách hàng */}
                            <div>
                              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8D6E63', fontWeight: 700, marginBottom: '6px' }}>
                                Người nhận & Địa chỉ
                              </div>
                              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#3E2723' }}>
                                {order.customer_name || 'Khách vãng lai'} • {order.customer_phone}
                              </div>
                              <div style={{ fontSize: '13px', color: '#5D4037', marginTop: '4px' }}>
                                📍 {order.customer_address || order.delivery_address || 'Nhận tại quầy'}
                              </div>
                              {order.note && (
                                <div style={{ fontSize: '12.5px', color: '#d35400', marginTop: '6px', fontStyle: 'italic' }}>
                                  💬 Ghi chú: {order.note}
                                </div>
                              )}
                            </div>

                            {/* Cột Chi tiết ly nước */}
                            <div>
                              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8D6E63', fontWeight: 700, marginBottom: '6px' }}>
                                Chi tiết món đặt
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((it, idx) => (
                                    <div key={idx} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontSize: '13px',
                                      padding: '4px 0',
                                      borderBottom: '1px dashed #F5ECE0'
                                    }}>
                                      <span>
                                        <strong>{it.quantity || 1}x</strong> {it.product_name || it.name || 'Ly trà sữa'}
                                        {it.size ? ` (Size ${it.size})` : ''}
                                      </span>
                                      <span style={{ fontWeight: 700, color: '#5D4037' }}>
                                        {formatVND(it.price || it.subtotal)}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: '13px', color: '#8D6E63' }}>
                                    Chi tiết món được lưu trong tổng đơn
                                  </div>
                                )}
                              </div>

                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '10px',
                                paddingTop: '8px',
                                borderTop: '1.5px solid #F5ECE0'
                              }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#3E2723' }}>Tổng thanh toán:</span>
                                <span style={{ fontSize: '17px', fontWeight: 800, color: '#d35400', fontFamily: 'Quicksand' }}>
                                  {formatVND(order.total_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: QUẢN LÝ THỰC ĐƠN (MENU & TOPPING) */}
              {activeTab === 'menu' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                  {/* Cột Trái: Form Thêm Món Mới & Topping */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Form Thêm Món */}
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      border: '1px solid #E5DDD3'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3E2723', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} color="#d35400" />
                        <span>Thêm Món Mới Vào Menu</span>
                      </h3>

                      <form onSubmit={handleAddProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '5px' }}>
                            Danh mục món
                          </label>
                          <select
                            value={newProdCat}
                            onChange={(e) => setNewProdCat(Number(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #E5DDD3',
                              fontSize: '13.5px',
                              outline: 'none',
                              backgroundColor: '#FAF4EB'
                            }}
                          >
                            {adminData?.categories?.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '5px' }}>
                            Tên món trà sữa / cà phê *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="VD: Trà Sữa Oolong Lài Kem Phô Mai"
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #E5DDD3',
                              fontSize: '13.5px',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '5px' }}>
                            Giá bán cơ bản (VND) *
                          </label>
                          <input
                            type="number"
                            required
                            placeholder="38000"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #E5DDD3',
                              fontSize: '13.5px',
                              outline: 'none'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '5px' }}>
                            URL Hình ảnh món
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={newProdImage}
                            onChange={(e) => setNewProdImage(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #E5DDD3',
                              fontSize: '13.5px',
                              outline: 'none'
                            }}
                          />
                          {newProdImage && (
                            <div style={{ marginTop: '8px', textAlign: 'center' }}>
                              <img
                                src={newProdImage}
                                alt="Xem trước"
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                onError={(e) => e.target.style.display = 'none'}
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#3E2723', display: 'block', marginBottom: '5px' }}>
                            Mô tả hương vị
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Hương vị thơm béo đậm đà..."
                            value={newProdDesc}
                            onChange={(e) => setNewProdDesc(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #E5DDD3',
                              fontSize: '13.5px',
                              outline: 'none',
                              resize: 'none'
                            }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={addingProduct}
                          style={{
                            padding: '12px',
                            borderRadius: '9999px',
                            backgroundColor: '#d35400',
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: 800,
                            boxShadow: '0 4px 14px rgba(211, 84, 0, 0.3)'
                          }}
                        >
                          {addingProduct ? 'Đang thêm...' : '+ Thêm Món Vào Menu'}
                        </button>
                      </form>
                    </div>

                    {/* Form Thêm Topping */}
                    <div style={{
                      backgroundColor: '#fff',
                      borderRadius: '16px',
                      padding: '24px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      border: '1px solid #E5DDD3'
                    }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3E2723', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={18} color="#2E7D32" />
                        <span>Thêm Topping Mới</span>
                      </h3>

                      <form onSubmit={handleAddToppingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                          type="text"
                          required
                          placeholder="Tên topping (VD: Trân Châu Sợi)"
                          value={newToppingName}
                          onChange={(e) => setNewToppingName(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #E5DDD3',
                            fontSize: '13.5px',
                            outline: 'none'
                          }}
                        />

                        <input
                          type="number"
                          required
                          placeholder="Giá topping (VD: 8000)"
                          value={newToppingPrice}
                          onChange={(e) => setNewToppingPrice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1.5px solid #E5DDD3',
                            fontSize: '13.5px',
                            outline: 'none'
                          }}
                        />

                        <button
                          type="submit"
                          disabled={addingTopping}
                          style={{
                            padding: '10px',
                            borderRadius: '9999px',
                            backgroundColor: '#2E7D32',
                            color: '#fff',
                            fontSize: '13.5px',
                            fontWeight: 700
                          }}
                        >
                          {addingTopping ? 'Đang lưu...' : '+ Thêm Topping'}
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Cột Phải: Danh Sách Món Ăn Đang Bán */}
                  <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                    border: '1px solid #E5DDD3',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3E2723', marginBottom: '16px' }}>
                      📋 Danh Sách Món ({adminData?.products?.length || 0} món)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '700px', overflowY: 'auto' }}>
                      {adminData?.products?.map(prod => (
                        <div
                          key={prod.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            backgroundColor: '#FAF4EB',
                            border: '1px solid #E5DDD3',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <img
                              src={prod.image_url || 'https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500'}
                              alt={prod.name}
                              style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#3E2723', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#d35400', fontWeight: 700 }}>
                                {formatVND(prod.base_price || prod.price)}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            style={{
                              padding: '6px',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(231, 76, 60, 0.1)',
                              color: '#e74c3c'
                            }}
                            title="Xóa món này"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DANH SÁCH KHÁCH HÀNG (CUSTOMERS) */}
              {activeTab === 'customers' && (
                <div style={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  border: '1px solid #E5DDD3'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3E2723', marginBottom: '18px' }}>
                    👥 Khách Hàng Thành Viên Đã Đăng Ký ({adminData?.users?.length || 0} thành viên)
                  </h3>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #F5ECE0', color: '#8D6E63', fontSize: '12.5px' }}>
                          <th style={{ padding: '10px 12px' }}>ID</th>
                          <th style={{ padding: '10px 12px' }}>KHÁCH HÀNG</th>
                          <th style={{ padding: '10px 12px' }}>SỐ ĐIỆN THOẠI</th>
                          <th style={{ padding: '10px 12px' }}>ĐỊA CHỈ</th>
                          <th style={{ padding: '10px 12px' }}>NGÀY ĐĂNG KÝ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminData?.users?.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #F5ECE0' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#8D6E63' }}>#{u.id}</td>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#3E2723' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: '#FAF4EB',
                                  color: '#5D4037',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800
                                }}>
                                  {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span>{u.name || 'Thành viên Cozy'}</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#d35400' }}>{u.phone}</td>
                            <td style={{ padding: '12px', color: '#5D4037' }}>{u.address || 'Chưa cập nhật'}</td>
                            <td style={{ padding: '12px', color: '#8D6E63' }}>{u.created_at || 'Mới đây'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

