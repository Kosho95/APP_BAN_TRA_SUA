import React from 'react';

/**
 * Component tạo hiệu ứng lớp kem tuyết trắng tinh khiết / kem matcha / kem socola chảy
 * Tương phản cao, sắc nét, có bóng đổ 3D để không bị chìm vào nền màu be.
 */
export default function CreamDrip({ height = 45, theme = 'white', style = {}, className = '' }) {
  // Bảng phối màu cho từng loại kem
  const getThemeColors = () => {
    switch (theme) {
      case 'matcha':
        return {
          gradientId: 'creamMatchaGrad',
          stop1: '#E8F5E9',
          stop2: '#C8E6C9',
          stop3: '#A5D6A7',
          shadow: 'rgba(46, 125, 50, 0.25)',
          backColor: 'rgba(165, 214, 167, 0.5)'
        };
      case 'chocolate':
        return {
          gradientId: 'creamChocoGrad',
          stop1: '#6D4C41',
          stop2: '#4E342E',
          stop3: '#3E2723',
          shadow: 'rgba(62, 39, 35, 0.35)',
          backColor: 'rgba(93, 64, 55, 0.5)'
        };
      case 'white':
      default:
        // Kem Cheese / Bọt sữa tươi Trắng tinh khôi sắc nét
        return {
          gradientId: 'creamWhiteGrad',
          stop1: '#FFFFFF',
          stop2: '#FFFFFF',
          stop3: '#F8F9FA',
          shadow: 'rgba(62, 39, 35, 0.16)',
          backColor: 'rgba(230, 230, 230, 0.6)'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div
      className={`cream-drip-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        pointerEvents: 'none',
        zIndex: 10,
        ...style
      }}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'block',
          filter: `drop-shadow(0 8px 14px ${colors.shadow})`
        }}
      >
        <defs>
          {/* Gradient màu kem */}
          <linearGradient id={colors.gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.stop1} />
            <stop offset="65%" stopColor={colors.stop2} />
            <stop offset="100%" stopColor={colors.stop3} />
          </linearGradient>

          {/* Vệt sáng bóng bề mặt */}
          <linearGradient id="creamSpecular" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.85)" />
          </linearGradient>
        </defs>

        {/* Lớp bóng đổ phụ viền kem */}
        <path
          d="M0,0 L1200,0 L1200,36 Q1140,84 1080,44 Q1020,12 960,67 Q910,118 860,52 Q800,12 740,57 Q680,102 620,42 Q570,12 510,77 Q460,120 410,52 Q360,14 300,57 Q240,97 180,47 Q120,12 60,62 Q30,87 0,40 Z"
          fill={colors.backColor}
          transform="translate(0, 3)"
        />

        {/* Lớp Kem chính - Trắng tuyết tinh khôi hoặc theo theme */}
        <path
          d="M0,0 L1200,0 L1200,32 Q1140,78 1080,38 Q1020,8 960,60 Q910,108 860,45 Q800,8 740,50 Q680,95 620,35 Q570,8 510,70 Q460,112 410,45 Q360,10 300,50 Q240,90 180,40 Q120,8 60,55 Q30,80 0,35 Z"
          fill={`url(#${colors.gradientId})`}
        />

        {/* Giọt kem 1 đang nhỏ giọt */}
        <g className="cream-drop-drip" style={{ transformOrigin: '485px 70px' }}>
          <ellipse cx="485" cy="86" rx="14" ry="19" fill={`url(#${colors.gradientId})`} />
          <ellipse cx="482" cy="80" rx="4.5" ry="7.5" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Giọt kem 2 đang kéo dài */}
        <g className="cream-drop-drip-delayed" style={{ transformOrigin: '885px 65px' }}>
          <ellipse cx="885" cy="82" rx="13" ry="17" fill={`url(#${colors.gradientId})`} />
          <ellipse cx="882" cy="77" rx="4" ry="6.5" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Giọt kem 3 */}
        <g className="cream-drop-drip" style={{ transformOrigin: '150px 55px' }}>
          <ellipse cx="150" cy="67" rx="10" ry="14" fill={`url(#${colors.gradientId})`} />
          <ellipse cx="148" cy="63" rx="3" ry="5" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Vệt sáng bóng ngang */}
        <path
          d="M20,12 Q300,20 600,14 Q900,20 1180,12"
          stroke="url(#creamSpecular)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}
