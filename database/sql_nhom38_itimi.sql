-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 01, 2026 at 03:05 PM
-- Server version: 5.7.43-log
-- PHP Version: 8.3.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sql_nhom38_itimi`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Trà sữa'),
(2, 'Cà phê'),
(3, 'Trà trái cây'),
(4, 'Đá xay - Freeze'),
(5, 'Sữa tươi');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `total_amount` decimal(10,0) NOT NULL,
  `discount` decimal(10,0) DEFAULT '0',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Đang xử lý',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_name`, `customer_phone`, `delivery_address`, `note`, `total_amount`, `discount`, `status`, `created_at`) VALUES
(11, 'voanvkla', '45618645', '658465135', '561324651', 38000, 0, 'Đang xử lý', '2026-10-23 00:43:33'),
(12, 'voanvkla', '45618645', '658465135', '561324651', 38000, 0, 'Đang xử lý', '2026-10-23 00:43:48'),
(13, 'lkh,jhfgsf', '12345', 'bdf', 'gfdbfsd', 28000, 20000, 'Đã hoàn thành', '2026-10-27 07:24:27'),
(14, 'QUAN VO', '123456789', 'TRANG BOM', '', 31000, 20000, 'Đang pha chế', '2026-10-27 11:06:44'),
(15, 'QUAN VO', '11111111', 'TRANG BOM', '', 30000, 20000, 'Đã hoàn thành', '2026-10-27 11:29:56'),
(16, 'thái', '22222222', 'trảng bom', '[GIAO TẬN NƠI] [Thanh toán VietQR]', 63000, 0, 'Đang xử lý', '2026-10-28 10:44:53'),
(17, 'Nguyễn Quốc Thái (Khách VIP)', '0912.345.678', 'dong nai', '[GIAO TẬN NƠI] [Tiền mặt COD]', 61000, 0, 'Đang xử lý', '2026-10-28 10:46:13');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `toppings_text` text COLLATE utf8mb4_unicode_ci,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,0) NOT NULL,
  `subtotal` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `size`, `toppings_text`, `quantity`, `unit_price`, `subtotal`) VALUES
(11, 11, 'Trà sữa Oolong Nướng', 'M', 'Đường: 100% | Đá: 100%', 1, 38000, 38000),
(12, 12, 'Trà sữa Oolong Nướng', 'M', 'Đường: 100% | Đá: 100%', 1, 38000, 38000),
(13, 13, 'Trà sữa Trân châu Đường đen', 'M', 'Đường: 100% | Đá: 100% | Topping: Trân châu đen, Hạt sen bùi', 1, 48000, 48000),
(14, 14, 'Trà Mãng Cầu Đắk Lắk', 'M', 'Đường: 100% | Đá: 100% | Topping: Trân châu đen, Trân châu trắng', 1, 51000, 51000),
(15, 15, 'Trà sữa Oolong Nướng', 'M', 'Đường: 70% | Đá: 70% | Topping: Trân châu đen, Trân châu trắng', 1, 50000, 50000),
(16, 16, 'Trà sữa Oolong Nướng', 'M', 'Đường: 100% | Đá: 30% đá | Topping: Thạch rau câu, Trân châu đen', 1, 48000, 48000),
(17, 17, 'Cà phê Muối Cố Đô', 'M', 'Đường: 100% | Đá: 100% | Topping: Pudding trứng sữa béo ngậy, Trân châu Hoàng kim dẻo thơm', 1, 46000, 46000);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `base_price` decimal(10,0) NOT NULL,
  `image_url` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `base_price`, `image_url`, `description`) VALUES
(1, 1, 'Trà sữa Trân châu Đường đen', 35000, 'https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500', 'Vị trà đậm đà kèm trân châu dẻo thơm.'),
(2, 1, 'Trà sữa Oolong Nướng', 38000, 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500', 'Hương vị nướng thơm lừng kết hợp kem sữa béo ngậy.'),
(3, 2, 'Cà phê Muối', 30000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', 'Cà phê pha phin truyền thống phủ lớp kem mặn mịn màng.'),
(4, 2, 'Bạc xỉu Đá', 28000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500', 'Nhiều sữa, ít cà phê, vị ngọt béo dễ uống.'),
(5, 1, 'Trà sữa Matcha Đậu đỏ', 42000, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', 'Vị trà xanh Nhật Bản thanh mát kết hợp đậu đỏ bùi ngọt.'),
(6, 1, 'Trà sữa Khoai môn', 39000, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', 'Hương khoai môn tự nhiên thơm béo, màu tím bắt mắt.'),
(7, 1, 'Trà sữa Thái Xanh', 32000, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500', 'Trà thái xanh đậm đà, giải nhiệt cực đã.'),
(8, 2, 'Cà phê Trứng', 35000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', 'Lớp kem trứng đánh bông mịn ngậy kết hợp cà phê Robusta đậm vị.'),
(9, 2, 'Americano Đá', 25000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500', 'Cà phê nguyên chất pha loãng với đá, thanh nhẹ, tỉnh táo.'),
(10, 3, 'Trà Đào Cam Sả', 38000, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500', 'Miếng đào giòn ngọt quyện cùng hương sả nồng ấm và vị cam tươi.'),
(11, 3, 'Trà Vải Hoa Lài', 36000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', 'Trà lài ngát hương kết hợp những quả vải thiều mọng nước.'),
(12, 3, 'Trà Mãng Cầu Đắk Lắk', 39000, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500', 'Mãng cầu xiêm chua ngọt tự nhiên dầm cùng trà lài.'),
(13, 4, 'Matcha Đá Xay Kem Cheese', 49000, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500', 'Đá xay matcha thơm bùi phủ kem cheese mằn mặn béo ngậy.'),
(14, 4, 'Cà phê Phin Đóng Băng', 45000, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500', 'Cà phê đá xay cùng thạch cà phê giòn dai.'),
(15, 1, 'Trà sữa Matcha Đậu đỏ', 42000, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500', 'Vị trà xanh Nhật Bản thanh mát kết hợp đậu đỏ bùi ngọt.'),
(16, 1, 'Trà sữa Khoai môn', 39000, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500', 'Hương khoai môn tự nhiên thơm béo, màu tím bắt mắt.'),
(17, 1, 'Trà sữa Thái Xanh', 32000, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500', 'Trà thái xanh đậm đà, giải nhiệt cực đã.'),
(18, 2, 'Cà phê Trứng', 35000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500', 'Lớp kem trứng đánh bông mịn ngậy kết hợp cà phê Robusta đậm vị.'),
(19, 2, 'Americano Đá', 25000, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500', 'Cà phê nguyên chất pha loãng với đá, thanh nhẹ, tỉnh táo.'),
(20, 3, 'Trà Đào Cam Sả', 38000, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500', 'Miếng đào giòn ngọt quyện cùng hương sả nồng ấm và vị cam tươi.'),
(21, 3, 'Trà Vải Hoa Lài', 36000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500', 'Trà lài ngát hương kết hợp những quả vải thiều mọng nước.'),
(22, 3, 'Trà Mãng Cầu Đắk Lắk', 39000, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500', 'Mãng cầu xiêm chua ngọt tự nhiên dầm cùng trà lài.'),
(23, 4, 'Matcha Đá Xay Kem Cheese', 49000, 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500', 'Đá xay matcha thơm bùi phủ kem cheese mằn mặn béo ngậy.'),
(24, 4, 'Cà phê Phin Đóng Băng', 45000, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500', 'Cà phê đá xay cùng thạch cà phê giòn dai.'),
(25, 1, 'sữa tươi con bò cười', 35000, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUaiSYiwai493VGFX0s3xFg9_tfbh_u7pScAu7gr7cNw&s=10', 'ngon'),
(26, 1, 'Trà Sữa Lài Kem Cheese', 42000, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc', 'Hương hoa lài thanh nhẹ kết hợp cùng lớp kem phô mai béo ngậy mằn mặn.'),
(27, 1, 'Trà Sữa Thái Đỏ Trân Châu', 32000, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', 'Trà Thái đỏ đậm vị trà thảo mộc truyền thống, thơm ngon dễ uống.'),
(28, 1, 'Hồng Trà Macchiato', 36000, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5', 'Hồng trà ủ lạnh thơm đậm kết hợp cùng lớp kem sữa sủi bọt mềm mịn.'),
(29, 1, 'Trà Đào Cam Sả', 39000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd', 'Vị chua ngọt thanh mát của cam vàng hòa quyện hương sả và miếng đào giòn ngọt.'),
(30, 2, 'Cà Phê Sữa Sài Gòn', 25000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd', 'Cà phê Robusta đậm vị rang xay truyền thống pha với sữa đặc ngọt ngào.'),
(31, 2, 'Cà Phê Dừa Đá Xay', 45000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735', 'Cốt dừa đá xay béo thơm kết hợp cùng shot Espresso thơm lừng.'),
(32, 2, 'Cold Brew Cam Vàng', 42000, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38', 'Cà phê ủ lạnh 16 tiếng thanh mát, hương cam tươi dịu nhẹ dễ chịu.'),
(33, 2, 'Caramel Macchiato', 48000, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2', 'Sữa tươi béo ngậy hòa cùng cà phê Espresso và sốt Caramel ngọt ngào.');

-- --------------------------------------------------------

--
-- Table structure for table `toppings`
--

CREATE TABLE `toppings` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `toppings`
--

INSERT INTO `toppings` (`id`, `name`, `price`) VALUES
(1, 'Trân châu đen', 5000),
(2, 'Trân châu trắng', 7000),
(3, 'Thạch rau câu', 5000),
(4, 'Pudding trứng', 8000),
(5, 'Kem Cheese (Macchiato)', 10000),
(6, 'Trân châu Hoàng kim', 8000),
(7, 'Thạch củ năng', 7000),
(8, 'Nha đam đường phèn', 6000),
(9, 'Đậu đỏ ngọt', 6000),
(10, 'Hạt sen bùi', 8000),
(11, 'Thạch khúc bạch', 9000),
(12, 'thach dua', 3000);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `password`, `address`, `created_at`) VALUES
(1, 'Nguyen Van A', '0987654321', '$2y$10$EzSdOxqA9mnoMi09NSWTlO4I9xCyAsv76Nk3Axf3LL2exnjFrFCr2', 'TP. Bien Hoa', '2026-10-27 17:15:31'),
(2, 'Tran Thi B', '0912345678', '$2y$10$X1hyLJwEfrXDjfokCLmSVuXa5b56dgoQrDqL/stj7Iyn1i6SQhzGS', 'Trang Bom, Dong Nai', '2026-10-27 17:23:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `toppings`
--
ALTER TABLE `toppings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `toppings`
--
ALTER TABLE `toppings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
