import React from 'react';

interface ShopInHandIllustrationProps {
  className?: string;
}

export const ShopInHandIllustration: React.FC<ShopInHandIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 340 430"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[380px] sm:max-w-[420px] drop-shadow-xl"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="goldCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A1" />
            <stop offset="50%" stopColor="#FED269" />
            <stop offset="100%" stopColor="#E5A838" />
          </linearGradient>

          <linearGradient id="goldCoinRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D89426" />
            <stop offset="100%" stopColor="#AE6E11" />
          </linearGradient>

          <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB3B5" />
            <stop offset="60%" stopColor="#FFA1A4" />
            <stop offset="100%" stopColor="#F9898D" />
          </linearGradient>

          <linearGradient id="sleeveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E1EEFB" />
          </linearGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. BACKGROUND BOTANICAL LEAF BRANCH (Right side) */}
        <g id="botanical-branch" opacity="0.95">
          {/* Main stem */}
          <path
            d="M 265,300 C 275,250 280,210 270,140 C 265,120 260,110 255,100"
            stroke="#638853"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaves */}
          {/* Top leaf */}
          <path
            d="M 255,100 C 265,85 285,95 280,110 C 275,120 260,115 255,100 Z"
            fill="#719A5F"
          />
          {/* Right leaf 1 */}
          <path
            d="M 270,140 C 290,135 305,150 295,165 C 285,175 272,160 270,140 Z"
            fill="#658F54"
          />
          {/* Left leaf 1 */}
          <path
            d="M 268,175 C 250,170 240,185 248,198 C 255,205 266,195 268,175 Z"
            fill="#78A366"
          />
          {/* Right leaf 2 */}
          <path
            d="M 275,205 C 298,200 310,218 300,232 C 290,242 278,225 275,205 Z"
            fill="#5E874D"
          />
          {/* Right leaf 3 */}
          <path
            d="M 278,255 C 295,250 305,265 295,275 C 285,282 278,270 278,255 Z"
            fill="#6D955B"
          />
        </g>

        {/* 2. BACKGROUND 4-POINT SPARKLE STARS */}
        <g id="sparkles" filter="url(#sparkleGlow)">
          {/* Top Left Large Sparkle */}
          <path
            d="M 68,55 Q 68,70 53,70 Q 68,70 68,85 Q 68,70 83,70 Q 68,70 68,55 Z"
            fill="#FFE885"
          />
          {/* Top Right Medium Sparkle */}
          <path
            d="M 270,65 Q 270,76 259,76 Q 270,76 270,87 Q 270,76 281,76 Q 270,76 270,65 Z"
            fill="#FFE885"
          />
          {/* Middle Right Small Sparkle */}
          <path
            d="M 285,115 Q 285,123 277,123 Q 285,123 285,131 Q 285,123 293,123 Q 285,123 285,115 Z"
            fill="#FFE885"
          />
        </g>

        {/* 3. SHIRT CUFF AT BASE */}
        <g id="shirt-cuff">
          {/* Cuff body */}
          <rect
            x="148"
            y="358"
            width="142"
            height="48"
            rx="12"
            fill="url(#sleeveGrad)"
            stroke="#1E1B18"
            strokeWidth="3.5"
          />
          {/* Cuff bottom curve contour */}
          <path
            d="M 152,390 Q 219,404 286,390"
            stroke="#C5DCF2"
            strokeWidth="2.5"
            fill="none"
          />
          {/* Cuff button */}
          <circle
            cx="262"
            cy="382"
            r="7"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="1.5"
          />
          {/* Button 'x' stitch */}
          <path
            d="M 259,379 L 265,385 M 265,379 L 259,385"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* 4. THE SUPPORTING HAND */}
        <g id="supporting-hand">
          {/* Main Hand Silhouette */}
          <path
            d="
              M 154,358
              L 154,320
              C 154,285 130,265 95,248
              C 68,235 48,205 45,170
              C 43,145 46,120 54,105
              C 62,90 73,95 72,115
              C 71,128 68,148 68,155
              C 68,140 72,125 79,120
              C 87,114 94,122 93,138
              C 92,150 88,168 88,175
              C 88,160 93,148 101,145
              C 109,142 114,150 113,165
              C 112,180 108,205 110,215
              C 125,230 160,240 215,240
              C 255,240 275,255 278,285
              L 282,358
              Z
            "
            fill="url(#handGrad)"
            stroke="#1E1B18"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* White Fingernails */}
          {/* Finger 1 (Index / Pinky stack) */}
          <ellipse
            cx="57"
            cy="104"
            rx="5.5"
            ry="7.5"
            transform="rotate(15 57 104)"
            fill="#FFFFFF"
            stroke="#1E1B18"
            strokeWidth="2"
          />
          {/* Finger 2 */}
          <ellipse
            cx="75"
            cy="125"
            rx="5"
            ry="7"
            transform="rotate(10 75 125)"
            fill="#FFFFFF"
            stroke="#1E1B18"
            strokeWidth="2"
          />
          {/* Finger 3 */}
          <ellipse
            cx="93"
            cy="148"
            rx="4.5"
            ry="6.5"
            transform="rotate(8 93 148)"
            fill="#FFFFFF"
            stroke="#1E1B18"
            strokeWidth="2"
          />

          {/* Finger Separation Creases */}
          <path
            d="M 68,155 C 68,180 75,200 90,218"
            stroke="#E8767A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 88,175 C 90,195 98,212 110,225"
            stroke="#E8767A"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Palm subtle crease line */}
          <path
            d="M 125,240 C 150,252 185,255 220,250"
            stroke="#E8767A"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* 5. THE SHOP BUILDING */}
        <g id="shop-building">
          {/* Main Building Wall Background */}
          <rect
            x="96"
            y="70"
            width="162"
            height="182"
            rx="4"
            fill="#D5B89F"
            stroke="#1E1B18"
            strokeWidth="3.5"
          />

          {/* Roof Pediment / Header Top */}
          <path
            d="
              M 94,72
              L 115,72
              C 118,54 125,40 145,34
              C 160,29 194,29 209,34
              C 229,40 236,54 239,72
              L 260,72
              Z
            "
            fill="#D5B89F"
            stroke="#1E1B18"
            strokeWidth="3.5"
          />

          {/* "SHOP" Signboard Badge */}
          <g id="shop-signboard">
            <rect
              x="130"
              y="40"
              width="94"
              height="30"
              rx="6"
              fill="#FFFFFF"
              stroke="#1E1B18"
              strokeWidth="2.5"
            />
            {/* Inner Border */}
            <rect
              x="133"
              y="43"
              width="88"
              height="24"
              rx="4"
              fill="none"
              stroke="#1E1B18"
              strokeWidth="1"
            />
            {/* Bold Typography */}
            <text
              x="177"
              y="60"
              textAnchor="middle"
              fill="#1E1B18"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="16"
              fontWeight="900"
              letterSpacing="2"
            >
              SHOP
            </text>
          </g>

          {/* Awning Striped Canopy */}
          <g id="awning">
            {/* Base Awning Shape */}
            <path
              d="
                M 78,82
                L 276,82
                L 266,118
                L 88,118
                Z
              "
              fill="#F9ECE1"
              stroke="#1E1B18"
              strokeWidth="3"
            />

            {/* Awning Stripes (Red/Coral + Cream alternating) */}
            {/* Stripe 1 (Red) */}
            <path d="M 78,82 L 103,82 L 110,118 L 88,118 Z" fill="#F05A54" />
            {/* Stripe 2 (Cream) */}
            <path d="M 103,82 L 128,82 L 132,118 L 110,118 Z" fill="#F9ECE1" />
            {/* Stripe 3 (Red) */}
            <path d="M 128,82 L 153,82 L 154,118 L 132,118 Z" fill="#F05A54" />
            {/* Stripe 4 (Cream) */}
            <path d="M 153,82 L 178,82 L 176,118 L 154,118 Z" fill="#F9ECE1" />
            {/* Stripe 5 (Red) */}
            <path d="M 178,82 L 203,82 L 198,118 L 176,118 Z" fill="#F05A54" />
            {/* Stripe 6 (Cream) */}
            <path d="M 203,82 L 228,82 L 220,118 L 198,118 Z" fill="#F9ECE1" />
            {/* Stripe 7 (Red) */}
            <path d="M 228,82 L 253,82 L 243,118 L 220,118 Z" fill="#F05A54" />
            {/* Stripe 8 (Cream) */}
            <path d="M 253,82 L 276,82 L 266,118 L 243,118 Z" fill="#F9ECE1" />

            {/* Awning Scalloped Bottom Edge Pelmet */}
            <g id="awning-scallops">
              <path
                d="
                  M 88,118 Q 99,130 110,118
                  Q 121,130 132,118
                  Q 143,130 154,118
                  Q 165,130 176,118
                  Q 187,130 198,118
                  Q 209,130 220,118
                  Q 231,130 242,118
                  Q 254,130 266,118
                "
                fill="#F05A54"
                stroke="#1E1B18"
                strokeWidth="2.5"
              />
            </g>

            {/* Awning top highlight line */}
            <line x1="79" y1="83" x2="275" y2="83" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
          </g>

          {/* LEFT WINDOW */}
          <g id="store-window">
            {/* Window Outer Frame */}
            <rect
              x="108"
              y="142"
              width="84"
              height="88"
              rx="4"
              fill="#FFFFFF"
              stroke="#1E1B18"
              strokeWidth="3"
            />
            {/* Window Glass / Interior Slate-Blue */}
            <rect
              x="112"
              y="146"
              width="76"
              height="80"
              fill="#42588F"
            />

            {/* Glass light reflections */}
            <path
              d="M 112,185 L 140,146 L 148,146 L 120,185 Z"
              fill="#FFFFFF"
              opacity="0.15"
            />
            <path
              d="M 130,195 L 165,146 L 175,146 L 140,195 Z"
              fill="#FFFFFF"
              opacity="0.1"
            />

            {/* Festive Hanging Fairy Lights inside window */}
            <g id="fairy-lights">
              {/* String 1 */}
              <path
                d="M 113,158 Q 130,172 148,160 Q 166,172 186,158"
                stroke="#1E1B18"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Glowing light bulbs 1 */}
              <circle cx="120" cy="165" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="130" cy="167" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="140" cy="165" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="157" cy="166" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="167" cy="167" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="177" cy="164" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />

              {/* String 2 */}
              <path
                d="M 114,175 Q 131,188 150,178 Q 168,188 186,175"
                stroke="#1E1B18"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Glowing light bulbs 2 */}
              <circle cx="123" cy="182" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="138" cy="183" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="160" cy="183" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
              <circle cx="174" cy="182" r="2.5" fill="#FFE57F" filter="url(#softGlow)" />
            </g>

            {/* Window Sill Potted Plant */}
            <g id="window-plant">
              {/* Orange Pot */}
              <path
                d="M 142,212 L 144,224 L 158,224 L 160,212 Z"
                fill="#F39C38"
                stroke="#1E1B18"
                strokeWidth="1.5"
              />
              {/* Pot rim */}
              <rect
                x="141"
                y="210"
                width="20"
                height="3"
                rx="1"
                fill="#F39C38"
                stroke="#1E1B18"
                strokeWidth="1.2"
              />
              {/* Sprouting Plant Leaves */}
              <path
                d="M 151,210 C 145,198 138,205 146,211 Z"
                fill="#54C571"
                stroke="#1E1B18"
                strokeWidth="1.2"
              />
              <path
                d="M 151,210 C 157,198 164,205 156,211 Z"
                fill="#54C571"
                stroke="#1E1B18"
                strokeWidth="1.2"
              />
              <path
                d="M 151,210 C 148,192 154,192 151,210 Z"
                fill="#43A047"
                stroke="#1E1B18"
                strokeWidth="1.2"
              />
            </g>
          </g>

          {/* RIGHT DOOR */}
          <g id="store-door">
            {/* Door Frame */}
            <rect
              x="200"
              y="142"
              width="46"
              height="108"
              rx="3"
              fill="#FFFFFF"
              stroke="#1E1B18"
              strokeWidth="3"
            />
            {/* Door Glass Interior */}
            <rect
              x="204"
              y="146"
              width="38"
              height="100"
              fill="#42588F"
            />

            {/* "OPEN" Hanging Sign */}
            <g id="open-sign">
              {/* Sign String */}
              <path
                d="M 213,172 L 223,165 L 233,172"
                stroke="#FFFFFF"
                strokeWidth="1"
                fill="none"
              />
              {/* Sign Plate */}
              <rect
                x="211"
                y="172"
                width="24"
                height="12"
                rx="2"
                fill="#F9ECE1"
                stroke="#1E1B18"
                strokeWidth="1.2"
              />
              <text
                x="223"
                y="180"
                textAnchor="middle"
                fill="#1E1B18"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="6"
                fontWeight="900"
                letterSpacing="0.5"
              >
                OPEN
              </text>
            </g>

            {/* Door Handles / Rails */}
            <g id="door-handles">
              {/* Upper Handle */}
              <rect
                x="205"
                y="190"
                width="14"
                height="10"
                rx="2"
                fill="#FFFFFF"
                stroke="#1E1B18"
                strokeWidth="1.5"
              />
              <line x1="205" y1="195" x2="219" y2="195" stroke="#1E1B18" strokeWidth="1.5" />

              {/* Lower Handle */}
              <rect
                x="205"
                y="204"
                width="14"
                height="10"
                rx="2"
                fill="#FFFFFF"
                stroke="#1E1B18"
                strokeWidth="1.5"
              />
              <line x1="205" y1="209" x2="219" y2="209" stroke="#1E1B18" strokeWidth="1.5" />
            </g>
          </g>
        </g>

        {/* 6. FLOATING GOLD COINS */}
        <g id="gold-coins">
          {/* Large Front Facing Coin (Bottom Left) */}
          <g id="coin-main" className="transition-transform duration-300 hover:scale-105">
            {/* Outer Coin Base / 3D Shadow Rim */}
            <circle
              cx="106"
              cy="372"
              r="26"
              fill="url(#goldCoinRimGrad)"
              stroke="#1E1B18"
              strokeWidth="3"
            />
            {/* Inner Coin Face */}
            <circle
              cx="104"
              cy="370"
              r="24"
              fill="url(#goldCoinGrad)"
              stroke="#1E1B18"
              strokeWidth="2.5"
            />
            {/* Inner Border Ring */}
            <circle
              cx="104"
              cy="370"
              r="19"
              fill="none"
              stroke="#DF9820"
              strokeWidth="2"
              strokeDasharray="2.5 2"
            />
            {/* Dollar Sign "$" */}
            <text
              x="104"
              y="379"
              textAnchor="middle"
              fill="#D98218"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontSize="24"
              fontWeight="900"
            >
              $
            </text>
          </g>

          {/* Tilted Coin 2 (Left Edge) */}
          <g id="coin-left" transform="rotate(-25 50 310)">
            {/* Coin 3D Side Rim */}
            <ellipse
              cx="50"
              cy="312"
              rx="18"
              ry="10"
              fill="url(#goldCoinRimGrad)"
              stroke="#1E1B18"
              strokeWidth="2.5"
            />
            {/* Coin Top Face */}
            <ellipse
              cx="48"
              cy="309"
              rx="17"
              ry="9"
              fill="url(#goldCoinGrad)"
              stroke="#1E1B18"
              strokeWidth="2"
            />
            {/* Coin Serrations / Milled Edge */}
            <line x1="36" y1="312" x2="36" y2="315" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="42" y1="314" x2="42" y2="317" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="48" y1="315" x2="48" y2="318" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="54" y1="314" x2="54" y2="317" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="60" y1="312" x2="60" y2="315" stroke="#AE6E11" strokeWidth="1.5" />
          </g>

          {/* Tilted Coin 3 (Right Edge) */}
          <g id="coin-right" transform="rotate(30 290 310)">
            {/* Coin 3D Side Rim */}
            <ellipse
              cx="290"
              cy="312"
              rx="20"
              ry="11"
              fill="url(#goldCoinRimGrad)"
              stroke="#1E1B18"
              strokeWidth="2.5"
            />
            {/* Coin Top Face */}
            <ellipse
              cx="288"
              cy="309"
              rx="19"
              ry="10"
              fill="url(#goldCoinGrad)"
              stroke="#1E1B18"
              strokeWidth="2"
            />
            {/* Coin Serrations / Milled Edge */}
            <line x1="274" y1="312" x2="274" y2="315" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="281" y1="314" x2="281" y2="317" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="288" y1="315" x2="288" y2="318" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="295" y1="314" x2="295" y2="317" stroke="#AE6E11" strokeWidth="1.5" />
            <line x1="302" y1="312" x2="302" y2="315" stroke="#AE6E11" strokeWidth="1.5" />
          </g>
        </g>
      </svg>
    </div>
  );
};
