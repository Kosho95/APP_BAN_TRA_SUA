import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Linking,
  Dimensions,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// Dùng 10.0.2.2 cho máy ảo Android Studio, localhost cho trình duyệt web
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/trasua_api',
  default: 'http://localhost:8080/trasua_api',
});

// Component Thẻ sản phẩm Dạng LƯỚI (Grid 2 cột) có hiệu ứng Hover
function ProductGridCard({ item, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const isHot = Number(item.id) % 3 === 0 || Number(item.id) === 1 || Number(item.id) === 2;
  const isNew = Number(item.id) === 5 || Number(item.id) === 6 || Number(item.id) === 12;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onSelect(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={[
        styles.gridCard,
        isHovered && styles.gridCardHovered,
      ]}
    >
      {/* Vùng ảnh và badge */}
      <View style={styles.gridImageWrap}>
        <Image
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500' }}
          style={[styles.gridImage, isHovered && styles.gridImageHovered]}
          resizeMode="cover"
        />

        {isHot && (
          <View style={styles.gridBadgeHot}>
            <Text style={styles.gridBadgeText}>🔥 Hot</Text>
          </View>
        )}
        {!isHot && isNew && (
          <View style={[styles.gridBadgeHot, { backgroundColor: '#2e7d32' }]}>
            <Text style={styles.gridBadgeText}>✨ Mới</Text>
          </View>
        )}
      </View>

      {/* Thông tin món */}
      <View style={styles.gridCardBody}>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.gridDesc} numberOfLines={1}>
          {item.description || 'Thơm ngon, đậm vị trà sữa'}
        </Text>

        <View style={styles.gridFooter}>
          <Text style={styles.gridPrice}>
            {Number(item.base_price).toLocaleString('vi-VN')} đ
          </Text>
          <View style={[styles.gridAddBtn, isHovered && styles.gridAddBtnHovered]}>
            <Ionicons name="add" size={15} color={isHovered ? '#fff' : '#d35400'} />
            <Text style={[styles.gridAddBtnText, isHovered && styles.gridAddBtnTextHovered]}>
              Chọn
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Component Thẻ sản phẩm Dạng DANH SÁCH (List 1 hàng) có hiệu ứng Hover
function ProductListCard({ item, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onSelect(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={[styles.card, isHovered && styles.cardHovered]}
    >
      <Image
        source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1558857563-b37cf5b62b1a?w=500' }}
        style={[styles.cardImage, isHovered && styles.cardImageHovered]}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.cardPrice}>{Number(item.base_price).toLocaleString('vi-VN')} đ</Text>
          <View style={[styles.addBadge, isHovered && styles.addBadgeHovered]}>
            <Text style={[styles.addBadgeText, isHovered && styles.addBadgeTextHovered]}>+ Chọn món</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MenuScreen({ navigation }) {
  const { user, isLoggedIn } = useAuth();
  const handleOpenAdmin = () => {
    const adminUrl = Platform.select({
      android: 'http://10.0.2.2:8080/trasua_api/admin.php',
      default: 'http://localhost:8080/trasua_api/admin.php',
    });
    Linking.openURL(adminUrl);
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc & Chế độ xem (Grid 2 cột / List 1 hàng)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // null = Tất cả
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // State chọn món trong Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedSugar, setSelectedSugar] = useState('100%');
  const [selectedIce, setSelectedIce] = useState('100%');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [itemNote, setItemNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      console.log('Đang gọi API từ URL:', `${BASE_URL}/get_menu.php`);
      const response = await fetch(`${BASE_URL}/get_menu.php`);
      const json = await response.json();
      console.log('Dữ liệu nhận được:', json);
      if (json.status === 'success') {
        setProducts(json.data.products);
        setCategories(json.data.categories || []);
        setToppings(json.data.toppings);
      }
    } catch (error) {
      console.error('Lỗi khi fetch menu:', error);
      Alert.alert('Lỗi kết nối', 'Không thể nạp dữ liệu từ máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (item) => {
    setSelectedProduct(item);
    setSelectedSize('M');
    setSelectedSugar('100%');
    setSelectedIce('100%');
    setSelectedToppings([]);
    setItemNote('');
    setQuantity(1);
    setModalVisible(true);
  };

  const toggleTopping = (topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Tính tiền
  const extraSizePrice = selectedSize === 'L' ? 6000 : 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + Number(t.price), 0);
  const currentSubtotal = selectedProduct
    ? (Number(selectedProduct.base_price) + extraSizePrice + toppingsPrice) * quantity
    : 0;

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;

    // Tạo mã định danh duy nhất dựa theo cấu hình
    const customId = `${selectedProduct.id}_${selectedSize}_${selectedSugar}_${selectedIce}_${selectedToppings.map(t => t.id).sort().join('-')}`;

    const customItem = {
      id: customId,
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      image_url: selectedProduct.image_url,
      base_price: Number(selectedProduct.base_price),
      unit_price: Number(selectedProduct.base_price) + extraSizePrice + toppingsPrice,
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings,
      note: itemNote,
      quantity: quantity,
      subtotal: currentSubtotal,
    };

    addToCart(customItem);
    setModalVisible(false);
    Alert.alert('Thành công', `Đã thêm ${quantity}x ${selectedProduct.name} vào giỏ hàng!`);
  };

  // Lọc sản phẩm
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === null || Number(p.category_id) === Number(selectedCategory);
    const matchSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d35400" />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải thực đơn thơm ngon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. Thanh chào hỏi người dùng & Nút mở trang Quản trị Admin */}
      <View style={styles.topBar}>
        {isLoggedIn && user ? (
          <TouchableOpacity
            onPress={() => navigation?.navigate('Tài khoản')}
            style={styles.userBadge}
          >
            <Ionicons name="person-circle" size={18} color="#d35400" />
            <Text style={styles.userBadgeText}>Chào, {user.name}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation?.navigate('Tài khoản')}
            style={styles.guestBadge}
          >
            <Ionicons name="log-in-outline" size={16} color="#666" />
            <Text style={styles.guestBadgeText}>Đăng nhập / Đăng ký</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={handleOpenAdmin}
          style={styles.adminTopBtn}
        >
          <Ionicons name="shield-checkmark" size={14} color="#ffd54f" style={{ marginRight: 4 }} />
          <Text style={styles.adminTopBtnText}>Quản trị Admin</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Tìm trà sữa, matcha, cà phê, topping..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* 3. Danh mục món cuộn ngang */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            style={[styles.catChip, selectedCategory === null && styles.catChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.catChipText, selectedCategory === null && styles.catChipTextActive]}>
              ✨ Tất cả ({products.length})
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => {
            const count = products.filter(p => Number(p.category_id) === Number(cat.id)).length;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.catChipText, selectedCategory === cat.id && styles.catChipTextActive]}>
                  {cat.name} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Thanh điều khiển Chế độ xem: Bố cục Lưới 2 cột / Danh sách 1 hàng */}
      <View style={styles.viewModeBar}>
        <Text style={styles.productCountText}>
          {filteredProducts.length} món sẵn sàng phục vụ
        </Text>
        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            onPress={() => setViewMode('grid')}
            style={[styles.viewToggleBtn, viewMode === 'grid' && styles.viewToggleBtnActive]}
            title="Xem dạng Lưới 2 cột"
          >
            <Ionicons
              name="grid"
              size={15}
              color={viewMode === 'grid' ? '#d35400' : '#718096'}
            />
            <Text style={[styles.viewToggleText, viewMode === 'grid' && styles.viewToggleTextActive]}>
              Lưới
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
            title="Xem dạng Danh sách dọc"
          >
            <Ionicons
              name="list"
              size={16}
              color={viewMode === 'list' ? '#d35400' : '#718096'}
            />
            <Text style={[styles.viewToggleText, viewMode === 'list' && styles.viewToggleTextActive]}>
              Dọc
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. DANH SÁCH SẢN PHẨM (Grid 2 cột hoặc List dọc) */}
      <FlatList
        key={viewMode} // Đổi key khi thay đổi numColumns để tránh lỗi React Native
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridColumnWrapper : null}
        contentContainerStyle={styles.listContentContainer}
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 40, marginBottom: 8 }}>🧋</Text>
            <Text style={styles.emptyText}>Không tìm thấy thức uống nào phù hợp</Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              style={styles.emptyResetBtn}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Xem tất cả menu</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) =>
          viewMode === 'grid' ? (
            <ProductGridCard item={item} onSelect={handleOpenDetail} />
          ) : (
            <ProductListCard item={item} onSelect={handleOpenDetail} />
          )
        }
      />

      {/* 6. Modal Tùy chọn Món (Size, Đường, Đá, Topping, Ghi chú) */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedProduct && (
                <>
                  <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                  <Text style={styles.modalSub}>
                    Giá cơ bản: {Number(selectedProduct.base_price).toLocaleString('vi-VN')} đ
                  </Text>

                  {/* Chọn Size */}
                  <Text style={styles.sectionHeader}>Chọn Size:</Text>
                  <View style={styles.row}>
                    {['M', 'L'].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[styles.optionBtn, selectedSize === s && styles.optionBtnActive]}
                        onPress={() => setSelectedSize(s)}
                      >
                        <Text style={[styles.optionBtnText, selectedSize === s && styles.optionBtnTextActive]}>
                          Size {s} {s === 'L' ? '(+6.000đ)' : '(+0đ)'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Chọn Mức Đường */}
                  <Text style={styles.sectionHeader}>Mức đường:</Text>
                  <View style={styles.rowWrap}>
                    {['100%', '70%', '50%', '30%', '0%'].map((sugar) => (
                      <TouchableOpacity
                        key={sugar}
                        style={[styles.pillBtn, selectedSugar === sugar && styles.pillBtnActive]}
                        onPress={() => setSelectedSugar(sugar)}
                      >
                        <Text style={[styles.pillText, selectedSugar === sugar && styles.pillTextActive]}>{sugar}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Chọn Mức Đá */}
                  <Text style={styles.sectionHeader}>Mức đá:</Text>
                  <View style={styles.rowWrap}>
                    {['100%', '70%', '50%', 'Đá riêng', 'Không đá'].map((ice) => (
                      <TouchableOpacity
                        key={ice}
                        style={[styles.pillBtn, selectedIce === ice && styles.pillBtnActive]}
                        onPress={() => setSelectedIce(ice)}
                      >
                        <Text style={[styles.pillText, selectedIce === ice && styles.pillTextActive]}>{ice}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Chọn Topping */}
                  <Text style={styles.sectionHeader}>Topping thêm:</Text>
                  {toppings.map((top) => {
                    const isChecked = selectedToppings.some((t) => t.id === top.id);
                    return (
                      <TouchableOpacity
                        key={top.id}
                        style={[styles.toppingItem, isChecked && styles.toppingItemActive]}
                        onPress={() => toggleTopping(top)}
                      >
                        <Text style={isChecked ? { fontWeight: 'bold', color: '#d35400' } : {}}>
                          {isChecked ? '✓ ' : '+ '} {top.name}
                        </Text>
                        <Text>+{Number(top.price).toLocaleString('vi-VN')} đ</Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Ghi chú cho quán */}
                  <Text style={styles.sectionHeader}>Ghi chú cho món:</Text>
                  <TextInput
                    placeholder="VD: Ít thạch, làm ấm, nhiều ống hút..."
                    value={itemNote}
                    onChangeText={setItemNote}
                    style={styles.noteInput}
                  />

                  {/* Tăng giảm số lượng */}
                  <View style={[styles.row, { marginVertical: 14 }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Số lượng:</Text>
                    <View style={styles.qtyBox}>
                      <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                        <Text style={styles.qtyText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{quantity}</Text>
                      <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            {/* Chân Modal */}
            <View style={styles.modalFooter}>
              <Text style={styles.totalText}>Tổng: {currentSubtotal.toLocaleString('vi-VN')} đ</Text>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.actionBtn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                  <Text style={{ fontWeight: 'bold' }}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.btnSubmit]} onPress={handleConfirmAddToCart}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Thêm vào giỏ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f6f4' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  userBadgeText: { color: '#d35400', fontSize: 13, fontWeight: 'bold' },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guestBadgeText: { color: '#555', fontSize: 12, fontWeight: '600' },
  adminTopBtn: {
    backgroundColor: '#2d3748',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  adminTopBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ede7df',
    shadowColor: '#5d4037',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 13.5, color: '#2c3e50' },
  clearSearch: { padding: 6 },

  categoryWrapper: { marginVertical: 6 },
  categoryScroll: { paddingHorizontal: 14, gap: 8 },
  catChip: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catChipActive: {
    backgroundColor: '#d35400',
    borderColor: '#d35400',
    shadowColor: '#d35400',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  catChipText: { fontSize: 12.5, color: '#555', fontWeight: '600' },
  catChipTextActive: { color: '#fff', fontWeight: '800' },

  // Thanh điều khiển view mode
  viewModeBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 4,
  },
  productCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#718096',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#edf2f7',
    borderRadius: 10,
    padding: 2,
  },
  viewToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewToggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  viewToggleText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#718096',
  },
  viewToggleTextActive: {
    color: '#d35400',
    fontWeight: '800',
  },

  listContentContainer: {
    paddingBottom: 80,
  },
  gridColumnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },

  // STYLES CHO BỐ CỤC LƯỚI 2 CỘT (Grid Card)
  gridCard: {
    width: '48.5%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0ece6',
    shadowColor: '#5d4037',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    transition: 'all 0.22s ease-in-out',
  },
  gridCardHovered: {
    borderColor: '#ffcc80',
    transform: [{ translateY: -4 }],
    shadowColor: '#d35400',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  gridImageWrap: {
    position: 'relative',
    width: '100%',
    height: 135,
    backgroundColor: '#faf6f0',
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    transition: 'transform 0.3s ease',
  },
  gridImageHovered: {
    transform: [{ scale: 1.06 }],
  },
  gridBadgeHot: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#d35400',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  gridBadgeText: {
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '800',
  },
  gridCardBody: {
    padding: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  gridTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2d3748',
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 2,
  },
  gridDesc: {
    fontSize: 11,
    color: '#8c7b75',
    marginBottom: 8,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: '#f7f4f0',
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#d35400',
  },
  gridAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
    transition: 'all 0.18s ease',
  },
  gridAddBtnHovered: {
    backgroundColor: '#d35400',
  },
  gridAddBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#d35400',
  },
  gridAddBtnTextHovered: {
    color: '#fff',
  },

  // STYLES CHO BỐ CỤC DANH SÁCH 1 HÀNG DỌC (List Card)
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0ece6',
    shadowColor: '#5d4037',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
    transition: 'all 0.2s ease',
  },
  cardHovered: {
    borderColor: '#ffcc80',
    transform: [{ translateY: -2 }],
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  cardImage: { width: 100, height: 100 },
  cardImageHovered: { transform: [{ scale: 1.05 }] },
  cardInfo: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 14.5, fontWeight: '700', color: '#1a202c' },
  cardDesc: { fontSize: 12, color: '#718096', marginVertical: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#d35400' },
  addBadge: { backgroundColor: '#fff3e0', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  addBadgeHovered: { backgroundColor: '#d35400' },
  addBadgeText: { color: '#d35400', fontWeight: '700', fontSize: 12 },
  addBadgeTextHovered: { color: '#fff' },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: { textAlign: 'center', color: '#a0aec0', fontSize: 14, marginBottom: 12 },
  emptyResetBtn: {
    backgroundColor: '#d35400',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 18,
    maxHeight: '85%',
  },
  modalTitle: { fontSize: 19, fontWeight: '800', color: '#2d3748' },
  modalSub: { fontSize: 13, color: '#718096', marginTop: 2, marginBottom: 10 },
  sectionHeader: { fontWeight: '700', marginTop: 12, marginBottom: 6, color: '#2d3748', fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#edf2f7',
    alignItems: 'center',
  },
  optionBtnActive: { backgroundColor: '#d35400' },
  optionBtnText: { color: '#4a5568', fontWeight: '600' },
  optionBtnTextActive: { color: '#fff', fontWeight: '700' },
  pillBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#edf2f7',
  },
  pillBtnActive: { backgroundColor: '#d35400' },
  pillText: { fontSize: 12, color: '#4a5568', fontWeight: '500' },
  pillTextActive: { color: '#fff', fontWeight: '700' },
  toppingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 6,
  },
  toppingItemActive: { backgroundColor: '#fffaf0', borderColor: '#ed8936' },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#fafafa',
  },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#edf2f7', borderRadius: 20, padding: 3 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 1 },
  qtyText: { fontSize: 16, fontWeight: '700', color: '#2d3748' },
  qtyValue: { paddingHorizontal: 14, fontSize: 15, fontWeight: '700', color: '#1a202c' },
  modalFooter: { borderTopWidth: 1, borderColor: '#edf2f7', paddingTop: 12, marginTop: 10 },
  totalText: { fontSize: 18, fontWeight: '800', color: '#d35400', marginBottom: 12, textAlign: 'right' },
  actionBtn: { flex: 1, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  btnCancel: { backgroundColor: '#e2e8f0' },
  btnSubmit: { backgroundColor: '#d35400' },
});
