ĐỒ ÁN: ỨNG DỤNG ĐẶT TRÀ SỮA & CÀ PHÊ TRỰC TUYẾN

Hệ thống đặt thức uống di động tích hợp cổng Web Quản trị thời gian thực.

1. THÔNG TIN ĐỀ TÀI & CÔNG NGHỆ

Frontend Di động: React Native (Expo SDK), React Navigation, Context API.

Backend & Quản trị: PHP thuần (PDO), Apache (XAMPP), Bootstrap 5.

Cơ sở dữ liệu: MySQL (utf8mb4_unicode_ci), Transaction đảm bảo toàn vẹn dữ liệu đơn hàng.

2. THÔNG TIN CƠ SỞ DỮ LIỆU DÙNG CHUNG (ONLINE MYSQL)

Hệ thống sử dụng cơ sở dữ liệu chung lưu trữ trực tuyến để đồng bộ tức thì giữa Mobile App và Web Admin:

Host / IP Máy chủ: 103.139.203.43

Cổng phpMyAdmin: 887 (Đường dẫn: http://103.139.203.43:887)

Tên Database: sql_nhom38_itimi

Tài khoản đăng nhập (Username): sql_nhom38_itimi

Mật khẩu (Password): af7d66ef605cd8

(File cấu hình kết nối trực tiếp trong mã nguồn: trasua_api/db.php)

3. CẤU TRÚC DỰ ÁN

trasua-app/
├── src/
│   ├── context/          # Quản lý giỏ hàng tập trung (CartContext.js)
│   └── screens/          # Màn hình MenuScreen, CartScreen, HistoryScreen
├── trasua_api/           # Tầng Backend RESTful API & Web Admin
│   ├── db.php            # Kết nối PDO MySQL
│   ├── get_menu.php      # API danh mục, món, topping
│   ├── create_order.php  # API kiểm tra & ghi đơn hàng
│   ├── get_orders.php    # API tra cứu đơn theo số điện thoại
│   └── admin.php         # Web Dashboard quản trị & điều phối đơn
├── App.js                # Khởi tạo Navigation & Context
├── package.json          # Danh sách thư viện phụ thuộc
└── README.md             # Hướng dẫn chi tiết


4. HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY

Bước 1: Khởi chạy Backend & Web Admin

Sao chép thư mục trasua_api vào thư mục web server của XAMPP:

C:\xampp\htdocs\trasua_api


Mở XAMPP Control Panel và nhấn Start dịch vụ Apache.

Mở trình duyệt truy cập Web Quản trị:

http://localhost:8080/trasua_api/admin.php


(Hoặc http://localhost/trasua_api/admin.php tùy cấu hình cổng Apache)

Bước 2: Khởi chạy Ứng dụng Di động (Mobile App)

Mở cửa sổ dòng lệnh tại thư mục trasua-app:

cd trasua-app


Cài đặt các gói thư viện cần thiết:

npm install


Khởi động Expo Server:

npx expo start -c


Chạy ứng dụng:

Máy ảo Android: Nhấn phím a trên bàn phím.

Điện thoại thật: Cài app Expo Go và quét mã QR hiển thị ở Terminal.

5. KỊCH BẢN TRÌNH DIỄN HỆ THỐNG (DEMO WORKFLOW)

Khách hàng đặt món (Mobile):

Duyệt menu, chọn thức uống, cấu hình Size, Đường, Đá và Topping.

Thêm vào giỏ hàng, áp dụng voucher khuyến mãi (DNTU), điền thông tin và bấm Xác nhận.

Quản trị tiếp nhận & xử lý (Web Admin):

Đơn hàng mới lập tức hiển thị trên trang admin.php với đầy đủ chi tiết cấu hình từng ly.

Quản trị viên cập nhật trạng thái đơn sang "Đang pha chế".

Đối soát đơn hàng (Mobile):

Khách chuyển sang tab Lịch sử trên app di động, nhập số điện thoại để thấy trạng thái đơn đã được cập nhật đồng bộ.
