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
} from 'react-native';
import { useCart } from '../context/CartContext';

// Dùng 10.0.2.2 cho máy ảo Android Studio, localhost cho trình duyệt web
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8080/trasua_api',
  default: 'http://localhost:8080/trasua_api',
});

export default function MenuScreen() {
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

  // Bộ lọc & Tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null); // null = Tất cả

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
  const extraToppingPrice = selectedToppings.reduce((sum, t) => sum + Number(t.price), 0);
  const unitPrice = (selectedProduct ? Number(selectedProduct.base_price) : 0) + extraSizePrice + extraToppingPrice;
  const currentSubtotal = unitPrice * quantity;

  const handleConfirmAddToCart = () => {
    addToCart({
      product_id: selectedProduct.id,
      name: selectedProduct.name,
      size: selectedSize,
      sugar: selectedSugar,
      ice: selectedIce,
      toppings: selectedToppings.map((t) => t.name),
      item_note: itemNote.trim(),
      quantity: quantity,
      unit_price: unitPrice,
      subtotal: currentSubtotal,
    });
    setModalVisible(false);
    Alert.alert('Thành công', `Đã thêm ${selectedProduct.name} vào giỏ!`);
  };

  // Logic lọc món theo từ khóa và danh mục
  const filteredProducts = products.filter((item) => {
    const matchName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === null || String(item.category_id) === String(selectedCategory);
    return matchName && matchCategory;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d35400" />
        <Text style={{ marginTop: 8 }}>Đang tải thực đơn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút mở trang Quản trị Admin */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 15, paddingTop: 10 }}>
        <TouchableOpacity 
          onPress={handleOpenAdmin}
          style={{
            backgroundColor: '#212529',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>⚙️ Quản trị Admin</Text>
        </TouchableOpacity>
      </View>
      {/* 1. Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="🔍 Tìm trà sữa, cà phê, topping..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearch}>
            <Text style={{ color: '#888' }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      

      {/* 2. Danh mục món cuộn ngang */}
      <View style={styles.categoryWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            style={[styles.catChip, selectedCategory === null && styles.catChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.catChipText, selectedCategory === null && styles.catChipTextActive]}>Tất cả</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.catChipText, selectedCategory === cat.id && styles.catChipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Danh sách món */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy món phù hợp</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleOpenDetail(item)}>
            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.cardPrice}>{Number(item.base_price).toLocaleString('vi-VN')} đ</Text>
                <View style={styles.addBadge}><Text style={styles.addBadgeText}>+ Chọn</Text></View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 4. Modal Tùy chọn Món */}
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
  container: { flex: 1, backgroundColor: '#f4f5f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#2c3e50' },
  clearSearch: { padding: 8 },
  categoryWrapper: { marginVertical: 6 },
  categoryScroll: { paddingHorizontal: 14, gap: 8 },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catChipActive: {
    backgroundColor: '#d35400',
    borderColor: '#d35400',
  },
  catChipText: { fontSize: 13, color: '#4a5568', fontWeight: '500' },
  catChipTextActive: { color: '#fff', fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 50, fontSize: 14 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  cardImage: { width: 105, height: 105 },
  cardInfo: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1a202c' },
  cardDesc: { fontSize: 12, color: '#718096', marginVertical: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 15, fontWeight: '700', color: '#d35400' },
  addBadge: { backgroundColor: '#fff3e0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  addBadgeText: { color: '#d35400', fontWeight: '700', fontSize: 12 },
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