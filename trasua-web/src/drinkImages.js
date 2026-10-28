// Thư viện hình ảnh đồ uống chất lượng cao chuẩn F&B
// Được chọn lọc từ các nguồn ảnh thức uống ổn định kèm hình minh họa SVG chuẩn Studio

export const DRINK_PHOTOS = {
  // Trà sữa trân châu đường đen / truyền thống
  boba_classic: "https://images.pexels.com/photos/4051659/pexels-photo-4051659.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Trà sữa Oolong nướng / Caramel
  oolong_roasted: "https://images.pexels.com/photos/5946631/pexels-photo-5946631.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Cà phê muối / Cà phê sữa
  salt_coffee: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Bạc xỉu đá
  bac_xiu: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Matcha đậu đỏ / Trà xanh
  matcha_latte: "https://images.pexels.com/photos/8951888/pexels-photo-8951888.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Khoai môn tím
  taro_milk: "https://images.pexels.com/photos/4051660/pexels-photo-4051660.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Trà thái xanh
  thai_green: "https://images.pexels.com/photos/4051658/pexels-photo-4051658.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Cà phê trứng / Capuchino
  egg_coffee: "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Americano đá
  americano: "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Trà đào cam sả
  peach_tea: "https://images.pexels.com/photos/1194030/pexels-photo-1194030.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Trà vải hoa lài
  lychee_tea: "https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Trà mãng cầu / Trà trái cây nhiệt đới
  fruit_tea: "https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Matcha đá xay kem cheese
  matcha_freeze: "https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Freeze cà phê / Bánh ngọt
  coffee_freeze: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=600",
  // Sữa tươi trân châu
  fresh_milk: "https://images.pexels.com/photos/5946632/pexels-photo-5946632.jpeg?auto=compress&cs=tinysrgb&w=600"
};

// Hàm tự động ghép ảnh đẹp và chuẩn xác theo tên món nếu ảnh CSDL lỗi
export function getReliableDrinkImage(product) {
  if (!product) return DRINK_PHOTOS.boba_classic;
  const name = (product.name || '').toLowerCase();
  
  if (name.includes('đào')) return DRINK_PHOTOS.peach_tea;
  if (name.includes('vải')) return DRINK_PHOTOS.lychee_tea;
  if (name.includes('mãng cầu') || name.includes('trái cây')) return DRINK_PHOTOS.fruit_tea;
  if (name.includes('muối')) return DRINK_PHOTOS.salt_coffee;
  if (name.includes('bạc xỉu')) return DRINK_PHOTOS.bac_xiu;
  if (name.includes('trứng')) return DRINK_PHOTOS.egg_coffee;
  if (name.includes('americano')) return DRINK_PHOTOS.americano;
  if (name.includes('matcha') && name.includes('xay')) return DRINK_PHOTOS.matcha_freeze;
  if (name.includes('matcha')) return DRINK_PHOTOS.matcha_latte;
  if (name.includes('khoai môn')) return DRINK_PHOTOS.taro_milk;
  if (name.includes('thái')) return DRINK_PHOTOS.thai_green;
  if (name.includes('nướng') || name.includes('oolong')) return DRINK_PHOTOS.oolong_roasted;
  if (name.includes('sữa tươi')) return DRINK_PHOTOS.fresh_milk;
  if (name.includes('phin') || name.includes('đóng băng') || name.includes('freeze')) return DRINK_PHOTOS.coffee_freeze;
  
  // Trà sữa truyền thống
  return DRINK_PHOTOS.boba_classic;
}
