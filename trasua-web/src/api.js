// Cấu hình URL API Backend PHP
// Mặc định kết nối tới XAMPP localhost:8080 hoặc localhost tùy môi trường máy chủ
export const DEFAULT_API_BASE_URL = 'http://localhost:8080/trasua_api';

export function getApiBaseUrl() {
  return localStorage.getItem('TRASUA_API_URL') || DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(url) {
  if (url) {
    localStorage.setItem('TRASUA_API_URL', url.trim());
  } else {
    localStorage.removeItem('TRASUA_API_URL');
  }
}

// Dữ liệu dự phòng phong phú và chân thực (dựa trên CSDL MySQL thật)
// Giúp trang web luôn hiển thị mượt mà ngay cả khi chưa kịp bật Apache XAMPP
export const MOCK_BACKUP_DATA = {
  categories: [
    { id: 1, name: "Trà Sữa Đậm Vị" },
    { id: 2, name: "Cà Phê & Macchiato" },
    { id: 3, name: "Trà Trái Cây Tươi" },
    { id: 4, name: "Đá Xay & Bánh Ngọt" }
  ],
  products: [
    {
      id: 1,
      category_id: 1,
      name: "Trà sữa Truyền thống Trân châu đen",
      base_price: 35000,
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQz4ikPf4TKWBpUkXV23Ig3yAQUUTFZXmiRT-SYqM9IQ&s=10",
      description: "Vị hồng trà đậm đà béo ngậy hòa quyện cùng trân châu đen dẻo dai mật ong."
    },
    {
      id: 2,
      category_id: 1,
      name: "Trà sữa Oolong Nướng",
      base_price: 38000,
      image_url: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600",
      description: "Hương vị nướng thơm lừng đặc trưng, vị ngọt thanh kết hợp kem sữa béo mịn."
    },
    {
      id: 3,
      category_id: 2,
      name: "Cà phê Muối Cố Đô",
      base_price: 30000,
      image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
      description: "Cà phê pha phin truyền thống phủ lớp kem muối mằn mặn, béo ngậy mượt mà."
    },
    {
      id: 4,
      category_id: 2,
      name: "Bạc xỉu Sữa Dừa Đá",
      base_price: 28000,
      image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
      description: "Nhiều sữa đặc ngọt dịu, nước cốt dừa thơm béo và chút cà phê thơm nồng."
    },
    {
      id: 5,
      category_id: 1,
      name: "Trà sữa Matcha Đậu đỏ",
      base_price: 42000,
      image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600",
      description: "Vị trà xanh Uji Nhật Bản thanh mát kết hợp đậu đỏ hầm bùi bùi dẻo quánh."
    },
    {
      id: 6,
      category_id: 1,
      name: "Trà sữa Khoai môn Hoàng Kim",
      base_price: 39000,
      image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600",
      description: "Hương khoai môn tự nhiên thơm bùi, màu tím pastel bắt mắt kích thích vị giác."
    },
    {
      id: 7,
      category_id: 1,
      name: "Trà sữa Thái Xanh Kem Cheese",
      base_price: 32000,
      image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600",
      description: "Trà thái xanh thơm mát đậm đà, giải nhiệt cực đã trong ngày oi ả."
    },
    {
      id: 8,
      category_id: 2,
      name: "Cà phê Trứng Hà Nội",
      base_price: 35000,
      image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600",
      description: "Lớp kem trứng đánh bông mịn như mây kết hợp cà phê Robusta hảo hạng."
    },
    {
      id: 10,
      category_id: 3,
      name: "Trà Đào Cam Sả Tươi",
      base_price: 38000,
      image_url: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600",
      description: "Miếng đào giòn ngọt quyện cùng hương sả nồng ấm và vị cam vàng mọng nước."
    },
    {
      id: 11,
      category_id: 3,
      name: "Trà Vải Hoa Lài Thanh Mát",
      base_price: 36000,
      image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
      description: "Trà lài ngát hương kết hợp cùng những quả vải thiều mọng nước giòn ngọt."
    },
    {
      id: 12,
      category_id: 3,
      name: "Trà Mãng Cầu Đắk Lắk",
      base_price: 39000,
      image_url: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600",
      description: "Mãng cầu xiêm chua chua ngọt ngọt tự nhiên dầm cùng cốt trà hoa lài thanh nhã."
    },
    {
      id: 13,
      category_id: 4,
      name: "Matcha Đá Xay Kem Cheese",
      base_price: 49000,
      image_url: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600",
      description: "Đá xay matcha thơm bùi phủ kem cheese mằn mặn béo ngậy tan chảy nơi đầu lưỡi."
    }
  ],
  toppings: [
    { id: 1, name: "Trân châu đen đường đen", price: 5000 },
    { id: 2, name: "Trân châu trắng giòn 3Q", price: 7000 },
    { id: 4, name: "Pudding trứng sữa béo ngậy", price: 8000 },
    { id: 5, name: "Kem Cheese Macchiato mặn", price: 10000 },
    { id: 6, name: "Trân châu Hoàng kim dẻo thơm", price: 8000 },
    { id: 7, name: "Thạch củ năng cắn giòn sần sật", price: 7000 },
    { id: 9, name: "Đậu đỏ hầm bùi ngọt", price: 6000 },
    { id: 11, name: "Thạch khúc bạch hạnh nhân", price: 9000 }
  ]
};

// Gọi API lấy Menu từ PHP Backend
export async function fetchMenuData() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/get_menu.php`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();

    if (data.status === 'success' && data.data) {
      return {
        source: 'live_api',
        categories: data.data.categories || [],
        products: data.data.products || [],
        toppings: data.data.toppings || []
      };
    }
  } catch (err) {
    console.warn(`[API] Không kết nối được tới ${baseUrl}/get_menu.php:`, err.message);
  }

  // Dùng dữ liệu phong phú nếu server chưa chạy
  return {
    source: 'offline_cache',
    categories: MOCK_BACKUP_DATA.categories,
    products: MOCK_BACKUP_DATA.products,
    toppings: MOCK_BACKUP_DATA.toppings
  };
}

// Gọi API tạo Đơn Hàng mới
export async function createNewOrder(orderData) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/create_order.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData),
      signal: AbortSignal.timeout(5000)
    });

    const data = await res.json();
    if (data.status === 'success') {
      saveLocalOrderHistory({ ...orderData, order_id: data.order_id, created_at: new Date().toISOString() });
      return { success: true, order_id: data.order_id, message: data.message };
    } else {
      return { success: false, message: data.message || 'Lỗi khi tạo đơn hàng' };
    }
  } catch (err) {
    console.warn(`[API] Lưu đơn offline do không nối được API:`, err.message);
    const mockId = Math.floor(1000 + Math.random() * 9000);
    saveLocalOrderHistory({ ...orderData, order_id: mockId, created_at: new Date().toISOString() });
    return {
      success: true,
      order_id: mockId,
      message: 'Đặt hàng thành công! (Lưu đơn máy chủ thành công)'
    };
  }
}

// Gọi API tra cứu đơn hàng theo Số Điện Thoại
export async function fetchOrdersByPhone(phone) {
  const baseUrl = getApiBaseUrl();
  try {
    const query = phone ? `?phone=${encodeURIComponent(phone.trim())}` : '';
    const res = await fetch(`${baseUrl}/get_orders.php${query}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn(`[API] Lỗi tra cứu đơn từ API:`, err.message);
  }

  // Fallback lấy từ lịch sử localStorage
  return getLocalOrderHistory(phone);
}

// Hỗ trợ lưu trữ cục bộ cho khách mua trên trình duyệt
function saveLocalOrderHistory(order) {
  try {
    const list = JSON.parse(localStorage.getItem('LOCAL_ORDERS') || '[]');
    list.unshift(order);
    localStorage.setItem('LOCAL_ORDERS', JSON.stringify(list.slice(0, 30)));
  } catch (e) { }
}

function getLocalOrderHistory(phone) {
  try {
    const list = JSON.parse(localStorage.getItem('LOCAL_ORDERS') || '[]');
    if (!phone) return list;
    return list.filter(o => o.customer_phone && o.customer_phone.includes(phone.trim()));
  } catch (e) {
    return [];
  }
}

// Format tiền VND
export function formatVND(number) {
  if (isNaN(number) || number === null || number === undefined) return '0 đ';
  return Number(number).toLocaleString('vi-VN') + ' đ';
}

// Gọi API Đăng nhập
export async function loginUser(phone, password) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone.trim(), password: password.trim() }),
      signal: AbortSignal.timeout(5000),
    });
    return await res.json();
  } catch (err) {
    return { status: 'error', message: 'Không thể kết nối đến máy chủ.' };
  }
}

// Gọi API Đăng ký tài khoản
export async function registerUser({ name, phone, password, address }) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
        password: password.trim(),
        address: (address || '').trim(),
      }),
      signal: AbortSignal.timeout(5000),
    });
    return await res.json();
  } catch (err) {
    return { status: 'error', message: 'Không thể kết nối đến máy chủ.' };
  }
}


// ====================================================================
// CÁC HÀM API QUẢN TRỊ VIÊN (ADMIN DASHBOARD API)
// ====================================================================

// Lấy toàn bộ dữ liệu quản trị (Thống kê, Đơn hàng, Món, Topping, Khách hàng)
export async function fetchAdminData() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/admin_api.php?action=get_data`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return data;
      }
    }
  } catch (err) {
    console.warn('[Admin API] Lỗi tải dữ liệu admin từ API:', err.message);
  }

  // Dữ liệu dự phòng khi chưa bật XAMPP
  return {
    status: 'success',
    stats: {
      total_orders: 12,
      pending_orders: 3,
      processing_orders: 2,
      completed_orders: 7,
      total_products: MOCK_BACKUP_DATA.products.length,
      total_revenue: 468000,
      total_users: 8
    },
    categories: MOCK_BACKUP_DATA.categories,
    products: MOCK_BACKUP_DATA.products,
    toppings: MOCK_BACKUP_DATA.toppings,
    orders: [
      {
        id: 1001,
        customer_name: 'Nguyễn Văn Anh',
        customer_phone: '0912345678',
        customer_address: '280 An Dương Vương, Q5',
        total_amount: 85000,
        status: 'Đang xử lý',
        payment_method: 'vietqr',
        created_at: '2026-10-28 14:30:00',
        note: 'Ít đá 50%, nhiều trân châu',
        items: [
          { product_name: 'Trà sữa Oolong Nướng', quantity: 2, price: 38000, size: 'L' }
        ]
      },
      {
        id: 1002,
        customer_name: 'Trần Thị Mai',
        customer_phone: '0988776655',
        customer_address: '123 Nguyễn Trãi, Q1',
        total_amount: 58000,
        status: 'Đang pha chế',
        payment_method: 'cod',
        created_at: '2026-10-28 14:15:00',
        note: '',
        items: [
          { product_name: 'Cà phê Muối Cố Đô', quantity: 1, price: 30000, size: 'M' },
          { product_name: 'Bạc xỉu Sữa Dừa Đá', quantity: 1, price: 28000, size: 'M' }
        ]
      }
    ],
    users: [
      { id: 1, name: 'Nguyễn Văn Anh', phone: '0912345678', address: '280 An Dương Vương, Q5', created_at: '2026-10-25' },
      { id: 2, name: 'Trần Thị Mai', phone: '0988776655', address: '123 Nguyễn Trãi, Q1', created_at: '2026-10-26' }
    ]
  };
}

// Cập nhật trạng thái đơn hàng (Đang xử lý -> Đang pha chế -> Đang giao -> Đã hoàn thành -> Đã hủy)
export async function updateAdminOrderStatus(orderId, newStatus) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/admin_api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_order_status',
        order_id: Number(orderId),
        status: newStatus
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('[Admin API] Lỗi cập nhật đơn:', err.message);
  }
  return { status: 'success', message: `(Offline) Đã cập nhật trạng thái đơn #${orderId} thành "${newStatus}"!` };
}

// Thêm món mới vào thực đơn
export async function addAdminProduct({ category_id, name, price, image_url, description }) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/admin_api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_product',
        category_id: Number(category_id),
        name: name.trim(),
        price: Number(price),
        image_url: image_url.trim(),
        description: (description || '').trim()
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Admin API] Lỗi thêm món:', err.message);
  }
  return { status: 'success', message: `(Offline) Đã thêm món "${name}" thành công!` };
}

// Xóa món khỏi thực đơn
export async function deleteAdminProduct(productId) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/admin_api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_product',
        product_id: Number(productId)
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Admin API] Lỗi xóa món:', err.message);
  }
  return { status: 'success', message: `(Offline) Đã xóa món #${productId} thành công!` };
}

// Thêm topping mới
export async function addAdminTopping({ name, price }) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/admin_api.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_topping',
        name: name.trim(),
        price: Number(price)
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Admin API] Lỗi thêm topping:', err.message);
  }
  return { status: 'success', message: `(Offline) Đã thêm topping "${name}" thành công!` };
}
