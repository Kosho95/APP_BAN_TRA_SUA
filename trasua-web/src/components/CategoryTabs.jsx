import React from 'react';

export default function CategoryTabs({ categories, selectedCategoryId, onSelectCategory, totalProductsCount }) {
  // Mapping emoji cho từng danh mục cho sinh động và dễ nhận diện
  const getCategoryEmoji = (name) => {
    if (!name) return '✨';
    const lower = name.toLowerCase();
    if (lower.includes('sữa') || lower.includes('tea')) return '🧋';
    if (lower.includes('phê') || lower.includes('coffee')) return '☕';
    if (lower.includes('trái cây') || lower.includes('quả') || lower.includes('fruit')) return '🍓';
    if (lower.includes('đá xay') || lower.includes('bánh') || lower.includes('cake')) return '🍧';
    return '🍃';
  };

  return (
    <div style={{
      position: 'sticky',
      top: '76px',
      zIndex: 30,
      backgroundColor: 'rgba(255, 251, 245, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '14px 0',
      borderBottom: '1px solid var(--border-light)',
      marginBottom: '28px'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        paddingBottom: '2px'
      }}>
        {/* Nút Tất Cả */}
        <button
          onClick={() => onSelectCategory(null)}
          style={{
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: selectedCategoryId === null ? 'var(--primary-600)' : '#fff',
            color: selectedCategoryId === null ? '#fff' : 'var(--text-body)',
            fontWeight: 700,
            fontSize: '14px',
            border: `1.5px solid ${selectedCategoryId === null ? 'var(--primary-600)' : 'var(--border-soft)'}`,
            boxShadow: selectedCategoryId === null ? '0 4px 14px rgba(93, 64, 55, 0.22)' : 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            if (selectedCategoryId !== null) {
              e.currentTarget.style.backgroundColor = 'var(--primary-50)';
              e.currentTarget.style.borderColor = 'var(--primary-300)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategoryId !== null) {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.borderColor = 'var(--border-soft)';
            }
          }}
        >
          <span>✨</span>
          <span>Tất cả món</span>
          {totalProductsCount > 0 && (
            <span style={{
              fontSize: '12px',
              padding: '1px 7px',
              borderRadius: '10px',
              backgroundColor: selectedCategoryId === null ? 'rgba(255,255,255,0.25)' : 'var(--primary-100)',
              color: selectedCategoryId === null ? '#fff' : 'var(--primary-700)'
            }}>
              {totalProductsCount}
            </span>
          )}
        </button>

        {/* Các Danh Mục */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isSelected ? 'var(--primary-600)' : '#fff',
                color: isSelected ? '#fff' : 'var(--text-body)',
                fontWeight: 700,
                fontSize: '14px',
                border: `1.5px solid ${isSelected ? 'var(--primary-600)' : 'var(--border-soft)'}`,
                boxShadow: isSelected ? '0 4px 14px rgba(93, 64, 55, 0.22)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                  e.currentTarget.style.borderColor = 'var(--primary-300)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = 'var(--border-soft)';
                }
              }}
            >
              <span>{getCategoryEmoji(cat.name)}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
