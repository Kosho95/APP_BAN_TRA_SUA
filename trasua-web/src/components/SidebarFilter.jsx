import React from 'react';
import { Filter, SlidersHorizontal, MapPin, Phone, Star, Sparkles, ChevronRight } from 'lucide-react';

export default function SidebarFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  products
}) {
  const getCategoryCount = (catId) => {
    if (catId === null) return products.length;
    return products.filter(p => Number(p.category_id) === Number(catId)).length;
  };

  const getEmoji = (name) => {
    if (!name) return '✨';
    const l = name.toLowerCase();
    if (l.includes('sữa')) return '🧋';
    if (l.includes('phê')) return '☕';
    if (l.includes('trái cây') || l.includes('quả')) return '🍓';
    if (l.includes('đá xay') || l.includes('bánh')) return '🍧';
    return '🍃';
  };

  return (
    <aside style={{
      width: '260px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* 1. KHU DANH MỤC THỨC UỐNG */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '15px',
          color: 'var(--text-dark)',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <Sparkles size={16} color="var(--primary-600)" />
          <span>Danh Mục Đồ Uống</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Nút Tất cả */}
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: selectedCategoryId === null ? 'var(--primary-50)' : 'transparent',
              color: selectedCategoryId === null ? 'var(--primary-700)' : 'var(--text-body)',
              fontWeight: selectedCategoryId === null ? 700 : 500,
              fontSize: '13.5px',
              border: `1px solid ${selectedCategoryId === null ? 'var(--primary-200)' : 'transparent'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✨</span>
              <span>Tất cả món</span>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '10px',
              backgroundColor: selectedCategoryId === null ? 'var(--primary-600)' : 'var(--bg-surface-soft)',
              color: selectedCategoryId === null ? '#fff' : 'var(--text-light)'
            }}>
              {getCategoryCount(null)}
            </span>
          </button>

          {/* Các danh mục */}
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isSelected ? 'var(--primary-50)' : 'transparent',
                  color: isSelected ? 'var(--primary-700)' : 'var(--text-body)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '13.5px',
                  border: `1px solid ${isSelected ? 'var(--primary-200)' : 'transparent'}`,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{getEmoji(cat.name)}</span>
                  <span>{cat.name}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? 'var(--primary-600)' : 'var(--bg-surface-soft)',
                  color: isSelected ? '#fff' : 'var(--text-light)'
                }}>
                  {getCategoryCount(cat.id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. BỘ LỌC KHOẢNG GIÁ & SẮP XẾP */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '15px',
          color: 'var(--text-dark)',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <SlidersHorizontal size={16} color="var(--primary-600)" />
          <span>Bộ Lọc Thông Minh</span>
        </div>

        {/* Lọc theo giá */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
            Khoảng Giá
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { val: 'all', label: 'Tất cả mức giá' },
              { val: 'under30', label: 'Dưới 30.000 đ' },
              { val: '30to40', label: '30.000 đ - 40.000 đ' },
              { val: 'over40', label: 'Trên 40.000 đ' }
            ].map(r => (
              <label
                key={r.val}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--text-dark)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="price_filter"
                  checked={priceRange === r.val}
                  onChange={() => setPriceRange(r.val)}
                  style={{ accentColor: 'var(--primary-600)' }}
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sắp xếp */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
            Sắp Xếp Theo
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-soft)',
              backgroundColor: 'var(--bg-surface-soft)',
              fontSize: '13px',
              color: 'var(--text-dark)',
              outline: 'none'
            }}
          >
            <option value="default">Phổ biến nhất 🔥</option>
            <option value="price_asc">Giá: Thấp đến cao ↗</option>
            <option value="price_desc">Giá: Cao đến thấp ↘</option>
            <option value="name_asc">Tên món: A - Z</option>
          </select>
        </div>
      </div>

      {/* 3. THẺ CHỌN CHI NHÁNH NHẬN HÀNG */}
      <div style={{
        backgroundColor: 'var(--bg-surface-soft)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        border: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
          <MapPin size={16} color="var(--accent-orange)" />
          <span>Chi nhánh giao hàng</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '8px' }}>
          <strong>CS1: 280 An Dương Vương, Q.5</strong>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--matcha-green)', fontWeight: 600 }}>
          ● Đang mở cửa • Giao trong 20-30 phút
        </div>
      </div>
    </aside>
  );
}
