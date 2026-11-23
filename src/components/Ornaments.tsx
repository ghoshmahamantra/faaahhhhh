import React from 'react';
import { COUPLE_INFO } from '../data/weddingData';

interface BismillahMedallionProps {
  variant?: 'gold' | 'ivory-on-wine';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BismillahMedallion: React.FC<BismillahMedallionProps> = ({
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const isLight = variant === 'ivory-on-wine';
  const strokeColor = isLight ? '#e8cf95' : '#b28236';
  const textColor = isLight ? '#f7e4bc' : '#734818';
  const accentColor = isLight ? '#f4dca6' : '#c49746';

  const dimensions =
    size === 'sm'
      ? 'w-[216px] h-[62px]'
      : size === 'lg'
        ? 'w-[268px] h-[82px]'
        : 'w-[248px] h-[72px]';

  const textSize =
    size === 'sm'
      ? 'text-[15px]'
      : size === 'lg'
        ? 'text-[21px]'
        : 'text-[18px] sm:text-[19px]';

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className={`relative flex items-center justify-center ${dimensions}`}>
        <svg
          viewBox="0 0 260 92"
          fill="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <path
            d="M130 6 C158 6 178 16 205 18 C226 20 248 31 248 46 C248 61 226 72 205 74 C178 76 158 86 130 86 C102 86 82 76 55 74 C34 72 12 61 12 46 C12 31 34 20 55 18 C82 16 102 6 130 6 Z"
            stroke={strokeColor}
            strokeWidth="1.25"
            strokeOpacity="0.88"
          />
          <path
            d="M130 12 C155 12 174 20 199 22 C217 24 238 33 238 46 C238 59 217 68 199 70 C174 72 155 80 130 80 C105 80 86 72 61 70 C43 68 22 59 22 46 C22 33 43 24 61 22 C86 20 105 12 130 12 Z"
            stroke={strokeColor}
            strokeWidth="0.7"
            strokeOpacity="0.55"
            strokeDasharray="3 2.5"
          />
          <circle cx="130" cy="6" r="2.6" fill={accentColor} />
          <circle cx="130" cy="86" r="2.3" fill={accentColor} />
          <path
            d="M5 46 L16 42 L20 46 L16 50 Z M255 46 L244 42 L240 46 L244 50 Z"
            fill={accentColor}
            fillOpacity="0.9"
          />
        </svg>
        <span
          dir="rtl"
          lang="ar"
          style={{ fontFamily: 'var(--font-arabic)', color: textColor }}
          className={`relative z-10 ${textSize} leading-normal whitespace-nowrap tracking-normal px-6 pt-0.5 select-none`}
        >
          {COUPLE_INFO.arabicInvocation}
        </span>
      </div>
    </div>
  );
};

interface FloralDividerProps {
  variant?: 'gold' | 'light';
  className?: string;
}

export const FloralDivider: React.FC<FloralDividerProps> = ({
  variant = 'gold',
  className = '',
}) => {
  const stemColor = variant === 'light' ? '#dfb66a' : '#c19040';
  const leafColor = variant === 'light' ? '#6d8a64' : '#58744f';
  const lotusOuter = variant === 'light' ? '#d86c79' : '#c85a6a';
  const lotusInner = variant === 'light' ? '#f6c3c6' : '#f2b8bc';
  const jewelFill = variant === 'light' ? '#8c1736' : '#680d26';

  return (
    <div
      className={`flex items-center justify-center w-full max-w-[300px] mx-auto ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 320 42" fill="none" className="w-full h-9 overflow-visible">
        <line x1="16" y1="21" x2="112" y2="21" stroke={stemColor} strokeWidth="1.2" strokeOpacity="0.85" />
        <line x1="208" y1="21" x2="304" y2="21" stroke={stemColor} strokeWidth="1.2" strokeOpacity="0.85" />
        <path d="M4 21 C10 16 16 17 20 21 C16 25 10 26 4 21 Z" fill={lotusOuter} stroke={stemColor} strokeWidth="0.8" />
        <path d="M316 21 C310 16 304 17 300 21 C304 25 310 26 316 21 Z" fill={lotusOuter} stroke={stemColor} strokeWidth="0.8" />
        <path d="M112 21 Q124 11 136 16 Q125 22 112 21 Z" fill={leafColor} fillOpacity="0.9" />
        <path d="M112 21 Q124 31 136 26 Q125 20 112 21 Z" fill={leafColor} fillOpacity="0.85" />
        <circle cx="132" cy="21" r="5.5" fill={lotusOuter} stroke={stemColor} strokeWidth="0.9" />
        <circle cx="132" cy="21" r="2.6" fill={lotusInner} />
        <path d="M208 21 Q196 11 184 16 Q195 22 208 21 Z" fill={leafColor} fillOpacity="0.9" />
        <path d="M208 21 Q196 31 184 26 Q195 20 208 21 Z" fill={leafColor} fillOpacity="0.85" />
        <circle cx="188" cy="21" r="5.5" fill={lotusOuter} stroke={stemColor} strokeWidth="0.9" />
        <circle cx="188" cy="21" r="2.6" fill={lotusInner} />
        <path
          d="M160 4 L175 21 L160 38 L145 21 Z"
          fill={jewelFill}
          stroke={stemColor}
          strokeWidth="1.2"
        />
        <path
          d="M160 8 C166 14 169 20 160 32 C151 20 154 14 160 8 Z"
          fill={lotusInner}
          stroke={stemColor}
          strokeWidth="0.7"
        />
        <path
          d="M160 13 C164 17 166 21 160 28 C154 21 156 17 160 13 Z"
          fill={lotusOuter}
        />
        <circle cx="160" cy="21" r="2.2" fill="#f6e0aa" />
      </svg>
    </div>
  );
};

/**
 * Full-width Sandstone & Gold Mughal Diamond Border Strip (matching Screenshot 3 & 4)
 */
export const ShahiGeometricBand: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`w-full py-2 border-y border-[#d6ab5a] bg-[#f7e7cf] overflow-hidden ${className}`}
    >
      <div
        className="w-full h-3.5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='14' viewBox='0 0 36 14'%3E%3Cpath d='M18 1 L20.5 5.5 L25 7 L20.5 8.5 L18 13 L15.5 8.5 L11 7 L15.5 5.5 Z' fill='%23c49746' fill-opacity='0.82'/%3E%3Ccircle cx='18' cy='7' r='1.3' fill='%2372122b' fill-opacity='0.75'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
        }}
      />
    </div>
  );
};

export const ShahiDeckleEdge: React.FC<{ fill?: string; className?: string }> = ({
  fill = '#f6e7d0',
  className = '',
}) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 22"
      preserveAspectRatio="none"
      className={`block w-full h-5 -mt-4 relative z-20 pointer-events-none ${className}`}
    >
      <path
        d="M0 10 Q14 4 28 11 T58 9 T88 12 T120 7 T154 11 T188 8 T222 12 T256 7 T290 11 T324 8 T360 11 T400 8 L400 22 L0 22 Z"
        fill={fill}
      />
    </svg>
  );
};

/**
 * Richly Painted Maroon Lotus & Symmetrical Rosebud Garland Crest (Screenshot 3 top ornament)
 */
export const MughalLotusCrest: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 420 155"
      fill="none"
      className={`w-[290px] sm:w-[370px] h-auto select-none pointer-events-none ${className}`}
    >
      <defs>
        <linearGradient id="lotusDeep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#941835" />
          <stop offset="55%" stopColor="#650920" />
          <stop offset="100%" stopColor="#3c0311" />
        </linearGradient>
        <linearGradient id="lotusMid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b52d4b" />
          <stop offset="100%" stopColor="#5e081d" />
        </linearGradient>
        <linearGradient id="budPink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5b8bc" />
          <stop offset="65%" stopColor="#c95b6a" />
          <stop offset="100%" stopColor="#7a152a" />
        </linearGradient>
        <linearGradient id="leafSage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#758f65" />
          <stop offset="100%" stopColor="#465b3c" />
        </linearGradient>
      </defs>

      {/* Left & Right Symmetrical Vine Tendrils */}
      <g>
        {/* Left vine stem */}
        <path
          d="M210 120 C165 124 134 102 108 76 C88 55 76 34 74 22"
          stroke="#4f6343"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M150 114 C118 118 82 104 54 78"
          stroke="#4f6343"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M116 86 C86 92 60 110 42 126"
          stroke="#4f6343"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Left leaves */}
        <path d="M168 110 C150 92 126 94 122 108 C140 116 156 116 168 110 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M142 94 C132 70 112 62 100 72 C110 88 126 96 142 94 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M114 76 C96 54 78 52 70 64 C84 78 100 80 114 76 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M98 106 C76 98 58 104 54 116 C70 122 86 118 98 106 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M74 68 C58 56 44 60 40 72 C52 78 64 76 74 68 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        {/* Left pink rosebuds */}
        <g transform="translate(74 24) rotate(-25)">
          <path d="M0 -14 C7 -8 8 4 0 10 C-8 4 -7 -8 0 -14 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.9" />
          <path d="M-5 6 Q0 12 5 6 L0 12 Z" fill="#4f6343" />
        </g>
        <g transform="translate(46 72) rotate(-52)">
          <path d="M0 -13 C7 -7 8 4 0 10 C-8 4 -7 -7 0 -13 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.9" />
          <path d="M-5 6 Q0 12 5 6 L0 12 Z" fill="#4f6343" />
        </g>
        <g transform="translate(36 124) rotate(-110)">
          <path d="M0 -12 C6 -6 7 4 0 9 C-7 4 -6 -6 0 -12 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.9" />
          <path d="M-4 5 Q0 10 4 5 L0 10 Z" fill="#4f6343" />
        </g>
        <g transform="translate(114 38) rotate(-12)">
          <path d="M0 -11 C6 -6 6 3 0 8 C-6 3 -6 -6 0 -11 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.8" />
        </g>
      </g>

      {/* Right mirrored vine */}
      <g transform="translate(420 0) scale(-1 1)">
        <path
          d="M210 120 C165 124 134 102 108 76 C88 55 76 34 74 22"
          stroke="#4f6343"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M150 114 C118 118 82 104 54 78"
          stroke="#4f6343"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M116 86 C86 92 60 110 42 126"
          stroke="#4f6343"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M168 110 C150 92 126 94 122 108 C140 116 156 116 168 110 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M142 94 C132 70 112 62 100 72 C110 88 126 96 142 94 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M114 76 C96 54 78 52 70 64 C84 78 100 80 114 76 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M98 106 C76 98 58 104 54 116 C70 122 86 118 98 106 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <path d="M74 68 C58 56 44 60 40 72 C52 78 64 76 74 68 Z" fill="url(#leafSage)" stroke="#c49746" strokeWidth="0.8" />
        <g transform="translate(74 24) rotate(-25)">
          <path d="M0 -14 C7 -8 8 4 0 10 C-8 4 -7 -8 0 -14 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.9" />
          <path d="M-5 6 Q0 12 5 6 L0 12 Z" fill="#4f6343" />
        </g>
        <g transform="translate(46 72) rotate(-52)">
          <path d="M0 -13 C7 -7 8 4 0 10 C-8 4 -7 -7 0 -13 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.9" />
          <path d="M-5 6 Q0 12 5 6 L0 12 Z" fill="#4f6343" />
        </g>
        <g transform="translate(36 124) rotate(-110)">
          <path d="M0 -12 C6 -6 7 4 0 9 C-7 4 -6 -6 0 -12 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.9" />
          <path d="M-4 5 Q0 10 4 5 L0 10 Z" fill="#4f6343" />
        </g>
        <g transform="translate(114 38) rotate(-12)">
          <path d="M0 -11 C6 -6 6 3 0 8 C-6 3 -6 -6 0 -11 Z" fill="url(#budPink)" stroke="#5b0d20" strokeWidth="0.8" />
        </g>
      </g>

      {/* Center Grand Imperial Maroon Lotus Blossom */}
      <g>
        {/* Outer sweeping petals */}
        <path d="M210 118 C175 112 146 92 140 62 C164 68 188 86 210 118 Z" fill="url(#lotusDeep)" stroke="#dfb462" strokeWidth="1.2" />
        <path d="M210 118 C245 112 274 92 280 62 C256 68 232 86 210 118 Z" fill="url(#lotusDeep)" stroke="#dfb462" strokeWidth="1.2" />
        {/* Mid-layer petals */}
        <path d="M210 116 C180 100 162 66 168 34 C188 50 202 78 210 116 Z" fill="url(#lotusMid)" stroke="#dfb462" strokeWidth="1.2" />
        <path d="M210 116 C240 100 258 66 252 34 C232 50 218 78 210 116 Z" fill="url(#lotusMid)" stroke="#dfb462" strokeWidth="1.2" />
        {/* Inner crown petals */}
        <path d="M210 114 C192 92 186 54 192 22 C202 42 208 76 210 114 Z" fill="url(#lotusDeep)" stroke="#e7c379" strokeWidth="1.1" />
        <path d="M210 114 C228 92 234 54 228 22 C218 42 212 76 210 114 Z" fill="url(#lotusDeep)" stroke="#e7c379" strokeWidth="1.1" />
        {/* Central vertical lotus heart petal */}
        <path d="M210 12 C226 42 228 84 210 116 C192 84 194 42 210 12 Z" fill="url(#lotusMid)" stroke="#f0d394" strokeWidth="1.3" />
        {/* Golden stamen veins */}
        <path d="M210 34 L210 104" stroke="#f0d394" strokeWidth="1.1" strokeOpacity="0.7" />
        <path d="M180 58 Q196 86 208 110" stroke="#f0d394" strokeWidth="0.9" strokeOpacity="0.55" />
        <path d="M240 58 Q224 86 212 110" stroke="#f0d394" strokeWidth="0.9" strokeOpacity="0.55" />
        {/* Base gold calyx & drop pendant */}
        <path d="M194 116 Q210 128 226 116 Q210 122 194 116 Z" fill="#c49746" />
        <circle cx="210" cy="134" r="4" fill="#d9b061" stroke="#680d26" strokeWidth="1" />
        <path d="M210 138 L215 148 L210 153 L205 148 Z" fill="#c49746" />
      </g>
    </svg>
  );
};

/**
 * Ornate Cream & Gold Scalloped Mughal Corner Arch Valance with Hanging Tassels (Screenshot 5)
 */
export const CeremonyCornerValance: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 260 220"
      fill="none"
      className={`pointer-events-none select-none w-36 sm:w-52 md:w-64 h-auto absolute top-0 ${
        side === 'left' ? 'left-0' : 'right-0 -scale-x-100'
      }`}
    >
      {/* Cream scalloped Mughal arch drape */}
      <path
        d="M0 0 L248 0 C226 16 206 18 190 36 C174 52 152 50 138 68 C122 86 98 86 84 106 C70 126 48 128 36 150 C24 170 14 188 0 202 Z"
        fill="#f6e7d0"
        stroke="#c49746"
        strokeWidth="2.5"
      />
      <path
        d="M0 0 L224 0 C206 14 188 15 174 30 C160 44 140 44 128 60 C114 76 92 76 80 94 C68 112 46 114 36 134 C26 152 14 166 0 180 Z"
        fill="#edd7b7"
        stroke="#8d1b38"
        strokeWidth="1.2"
        strokeOpacity="0.65"
      />
      {/* Stylized lotus & rose blossoms along the valance */}
      <g>
        <circle cx="54" cy="48" r="18" fill="#d9757e" stroke="#680d26" strokeWidth="1" />
        <circle cx="54" cy="48" r="10" fill="#f4b7bb" />
        <circle cx="54" cy="48" r="4" fill="#d49e46" />
        <circle cx="116" cy="26" r="13" fill="#c95a69" stroke="#680d26" strokeWidth="0.9" />
        <circle cx="116" cy="26" r="6" fill="#f4c5c8" />
        <circle cx="24" cy="108" r="12" fill="#c95a69" stroke="#680d26" strokeWidth="0.9" />
        <circle cx="24" cy="108" r="5" fill="#f4c5c8" />
        <path d="M74 40 Q90 28 102 36 Q86 48 74 40 Z" fill="#5e7852" />
        <path d="M36 70 Q24 84 32 94 Q46 80 36 70 Z" fill="#5e7852" />
      </g>
      {/* Dangling golden tassels */}
      {[
        { x: 186, y: 40, h: 30 },
        { x: 132, y: 74, h: 36 },
        { x: 80, y: 112, h: 40 },
        { x: 34, y: 156, h: 36 },
      ].map((t, i) => (
        <g key={i} transform={`translate(${t.x}, ${t.y})`}>
          <line x1="0" y1="0" x2="0" y2={t.h - 12} stroke="#d9b061" strokeWidth="1.6" />
          <circle cx="0" cy={t.h - 12} r="3.2" fill="#d9b061" />
          <path
            d={`M-4 ${t.h - 9} L4 ${t.h - 9} L6 ${t.h + 4} L-6 ${t.h + 4} Z`}
            fill="#b98633"
            stroke="#f4d898"
            strokeWidth="0.6"
          />
        </g>
      ))}
    </svg>
  );
};
