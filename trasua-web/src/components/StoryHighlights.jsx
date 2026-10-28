import React from 'react';

export default function StoryHighlights({ onSelectCategory, onApplyCoupon, onOpenLogin }) {
  const stories = [
    {
      id: 'best',
      emoji: '🧋',
      title: 'Bestseller',
      subtitle: 'Oolong Nướng',
      bg: 'linear-gradient(135deg, #795548, #FF7043)',
      onClick: () => onSelectCategory(1)
    },
    {
      id: 'flash',
      emoji: '🔥',
      title: 'Flash Sale',
      subtitle: 'Giảm 20%',
      bg: 'linear-gradient(135deg, #FF7043, #F06292)',
      onClick: () => onApplyCoupon('BANMOI')
    },
    {
      id: 'fruit',
      emoji: '🍓',
      title: 'Trà Trái Cây',
      subtitle: 'Tươi Mát',
      bg: 'linear-gradient(135deg, #E91E63, #FF9800)',
      onClick: () => onSelectCategory(3)
    },
    {
      id: 'coffee',
      emoji: '☕',
      title: 'Cà Phê Muối',
      subtitle: 'Đậm Vị Phin',
      bg: 'linear-gradient(135deg, #4E342E, #8D6E63)',
      onClick: () => onSelectCategory(2)
    },
    {
      id: 'freeze',
      emoji: '🍧',
      title: 'Đá Xay',
      subtitle: 'Kem Cheese',
      bg: 'linear-gradient(135deg, #2E7D32, #81C784)',
      onClick: () => onSelectCategory(4)
    },
    {
      id: 'club',
      emoji: '🎁',
      title: 'Tích 10 Ly',
      subtitle: 'Tặng 1 Ly',
      bg: 'linear-gradient(135deg, #FFB300, #FF7043)',
      onClick: onOpenLogin
    }
  ];

  return (
    <div style={{
      marginBottom: '26px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        overflowX: 'auto',
        padding: '6px 4px 10px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {stories.map((st) => (
          <div
            key={st.id}
            onClick={st.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Vòng tròn viền gradient */}
            <div style={{
              padding: '3px',
              borderRadius: '50%',
              background: st.bg,
              boxShadow: '0 4px 12px rgba(121, 85, 72, 0.15)'
            }}>
              <div style={{
                width: '62px',
                height: '62px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                border: '2px solid #fff'
              }}>
                {st.emoji}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)', whiteSpace: 'nowrap' }}>
                {st.title}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {st.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
