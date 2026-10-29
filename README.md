# ĐỒ ÁN: ỨNG DỤNG ĐẶT TRÀ SỮA & CÀ PHÊ TRỰC TUYẾN
> Hệ thống đặt thức uống di động tích hợp cổng Web Quản trị thời gian thực.

---

## 1. THÔNG TIN ĐỀ TÀI & CÔNG NGHỆ
- **Frontend Di động:** React Native (Expo SDK), React Navigation, Context API.
- **Frontend Web / Admin:** React + Vite, Bootstrap 5.
- **Backend API:** PHP thuần (PDO), Apache (XAMPP).
- **Cơ sở dữ liệu:** MySQL (`utf8mb4_unicode_ci`), Transaction đảm bảo toàn vẹn dữ liệu đơn hàng.

---

## 2. THÔNG TIN CƠ SỞ DỮ LIỆU DÙNG CHUNG (ONLINE MYSQL)
Hệ thống sử dụng cơ sở dữ liệu chung lưu trữ trực tuyến để đồng bộ tức thì giữa Mobile App và Web Admin:
- **Host / IP Máy chủ:** `103.139.203.43`
- **Cổng phpMyAdmin:** `887` (Đường dẫn: `http://103.139.203.43:887`)
- **Tên Database:** `sql_nhom38_itimi`

*(File cấu hình kết nối trực tiếp trong mã nguồn: `trasua_api/db.php`)*

---

## 3. CẤU TRÚC DỰ ÁN
```text
APP_BAN_TRA_SUA/
├── src/                  # Mã nguồn Mobile App (Context, Screens, Navigation)
├── trasua-web/           # Web Quản trị (React + Vite)
├── trasua_api/           # Tầng Backend RESTful API & Kết nối DB
│   ├── db.php            # Kết nối PDO MySQL
│   ├── get_menu.php      # API danh mục, món, topping
│   ├── create_order.php  # API kiểm tra & ghi đơn hàng
│   ├── get_orders.php    # API tra cứu đơn theo số điện thoại
│   └── admin.php         # Web Dashboard quản trị & điều phối đơn
├── App.js                # Khởi tạo Navigation & Context
├── package.json          # Danh sách thư viện phụ thuộc
└── README.md             # Hướng dẫn chi tiết
4. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠYBước 1: Khởi chạy Backend APISao chép thư mục trasua_api vào thư mục web server của XAMPP:PlaintextC:\xampp\htdocs\trasua_api
Mở XAMPP Control Panel và nhấn Start dịch vụ Apache.Kiểm tra API hoặc dashboard PHP:Plaintexthttp://localhost/trasua_api/admin.php
(Hoặc http://localhost:8080/trasua_api/admin.php tùy cổng Apache của máy bạn)Bước 2: Khởi chạy Web Quản trị (trasua-web)Mở terminal tại thư mục trasua-web:Bashcd trasua-web
npm install
npm run dev
Mở trình duyệt truy cập:Plaintexthttp://localhost:5173/
Bước 3: Khởi chạy Ứng dụng Di động (Mobile App)Mở cửa sổ dòng lệnh tại thư mục gốc của app:Bashnpm install
npx expo start -c
Chạy ứng dụng:   Máy ảo Android: Nhấn phím a trên bàn phím.   Điện thoại thật: Cài app Expo Go và quét mã QR hiển thị ở Terminal.   5. KỊCH BẢN TRÌNH DIỄN HỆ THỐNG (DEMO WORKFLOW)   Khách hàng đặt món (Mobile):Duyệt menu, chọn thức uống, cấu hình Size, Đường, Đá và Topping.Thêm vào giỏ hàng, áp dụng voucher khuyến mãi (DNTU), điền thông tin và bấm Xác nhận.Quản trị tiếp nhận & xử lý (Web Admin):Đơn hàng mới lập tức hiển thị trên Web Quản trị với đầy đủ chi tiết cấu hình từng ly.Quản trị viên cập nhật trạng thái đơn sang "Đang pha chế".Đối soát đơn hàng (Mobile):Khách chuyển sang tab Lịch sử trên app di động, nhập số điện thoại để thấy trạng thái đơn đã được cập nhật đồng bộ.
