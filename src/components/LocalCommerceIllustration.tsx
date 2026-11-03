import React from 'react';

interface LocalCommerceIllustrationProps {
  className?: string;
}

export const LocalCommerceIllustration: React.FC<LocalCommerceIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-2xl mx-auto flex items-center justify-center p-2 ${className}`}>
      <svg
        viewBox="0 0 900 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-full rounded-2xl drop-shadow-sm bg-white"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="awningRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E65100" />
            <stop offset="100%" stopColor="#D84315" />
          </linearGradient>
          <linearGradient id="woodBeige" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DEB887" />
            <stop offset="100%" stopColor="#C89666" />
          </linearGradient>
          <linearGradient id="woodDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B36B39" />
            <stop offset="100%" stopColor="#8D4925" />
          </linearGradient>
        </defs>

        {/* Flying Pigeons */}
        <g id="flying-pigeons" stroke="#2D3748" strokeWidth="2.5" strokeLinecap="round" fill="#E2E8F0">
          <path d="M170 120 Q190 95 215 110 Q200 135 170 120 Z" />
          <path d="M190 95 Q205 75 220 90" />
          <path d="M125 195 Q145 170 170 185 Q155 210 125 195 Z" />
          <path d="M145 170 Q160 150 175 165" />
        </g>

        {/* MARKET STALL STRUCTURE */}
        <g id="market-stall">
          {/* Wooden back wall and shelf */}
          <rect x="220" y="170" width="280" height="340" fill="#FCEFD7" stroke="#2D3748" strokeWidth="3" />
          
          {/* Interior wood planks */}
          <line x1="220" y1="230" x2="500" y2="230" stroke="#E2C9A5" strokeWidth="2" />
          <line x1="220" y1="300" x2="500" y2="300" stroke="#E2C9A5" strokeWidth="2" />

          {/* Upper Shelf Wooden Crates */}
          <rect x="240" y="240" width="85" height="45" rx="3" fill="#D7A15C" stroke="#2D3748" strokeWidth="2.5" />
          {/* Apples in crate */}
          <circle cx="255" cy="255" r="7" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="270" cy="255" r="7" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="285" cy="255" r="7" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="300" cy="255" r="7" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="262" cy="246" r="6" fill="#FF8A65" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="278" cy="246" r="6" fill="#FF8A65" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="292" cy="246" r="6" fill="#FF8A65" stroke="#2D3748" strokeWidth="1.5" />

          {/* Bread/Cheese Crate */}
          <rect x="335" y="240" width="85" height="45" rx="3" fill="#ECC94B" stroke="#2D3748" strokeWidth="2.5" />
          <circle cx="350" cy="258" r="3" fill="#B7791F" />
          <circle cx="370" cy="252" r="4" fill="#B7791F" />
          <circle cx="395" cy="260" r="3" fill="#B7791F" />

          {/* Middle Shelf Crates */}
          <rect x="235" y="320" width="65" height="35" rx="3" fill="#E28743" stroke="#2D3748" strokeWidth="2" />
          <rect x="305" y="320" width="65" height="35" rx="3" fill="#E28743" stroke="#2D3748" strokeWidth="2" />

          {/* Main Counter Table Front */}
          <polygon points="260,430 490,490 490,690 260,690" fill="#E65100" />
          {/* Vertical white stripes on stall base */}
          <line x1="285" y1="437" x2="285" y2="690" stroke="#FFF" strokeWidth="16" />
          <line x1="330" y1="448" x2="330" y2="690" stroke="#FFF" strokeWidth="16" />
          <line x1="375" y1="460" x2="375" y2="690" stroke="#FFF" strokeWidth="16" />
          <line x1="420" y1="472" x2="420" y2="690" stroke="#FFF" strokeWidth="16" />
          <line x1="465" y1="484" x2="465" y2="690" stroke="#FFF" strokeWidth="16" />
          <polygon points="260,430 490,490 490,690 260,690" fill="none" stroke="#2D3748" strokeWidth="3" />

          {/* Slanted Display Tray of Produce */}
          <polygon points="175,490 490,560 490,670 175,540" fill="#D7A15C" stroke="#2D3748" strokeWidth="3" />
          
          {/* Produce Dividers & Items */}
          {/* Section 1: Yellow lemons / melons */}
          <ellipse cx="270" cy="535" rx="10" ry="8" fill="#F6E05E" stroke="#2D3748" strokeWidth="1.5" />
          <ellipse cx="290" cy="530" rx="10" ry="8" fill="#ECC94B" stroke="#2D3748" strokeWidth="1.5" />
          <ellipse cx="310" cy="525" rx="10" ry="8" fill="#F6E05E" stroke="#2D3748" strokeWidth="1.5" />
          <ellipse cx="280" cy="550" rx="11" ry="8" fill="#ECC94B" stroke="#2D3748" strokeWidth="1.5" />
          <ellipse cx="300" cy="545" rx="10" ry="8" fill="#F6E05E" stroke="#2D3748" strokeWidth="1.5" />

          {/* Section 2: Orange Carrots / Peaches */}
          <circle cx="345" cy="565" r="9" fill="#ED8936" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="365" cy="560" r="9" fill="#DD6B20" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="385" cy="555" r="9" fill="#ED8936" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="355" cy="585" r="10" fill="#DD6B20" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="375" cy="580" r="10" fill="#ED8936" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="395" cy="575" r="10" fill="#DD6B20" stroke="#2D3748" strokeWidth="1.5" />

          {/* Section 3: Red Tomatoes / Apples */}
          <circle cx="425" cy="595" r="11" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="445" cy="590" r="11" fill="#C53030" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="465" cy="585" r="11" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="415" cy="625" r="12" fill="#C53030" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="440" cy="620" r="12" fill="#E53E3E" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="465" cy="615" r="12" fill="#C53030" stroke="#2D3748" strokeWidth="1.5" />

          {/* Right Side Watermelons and Greens Display */}
          {/* Watermelons */}
          <g id="watermelons">
            <circle cx="560" cy="430" r="19" fill="#38A169" stroke="#2D3748" strokeWidth="2" />
            <path d="M545 420 Q560 430 575 420" stroke="#1C4532" strokeWidth="2" fill="none" />
            <path d="M548 435 Q560 445 572 435" stroke="#1C4532" strokeWidth="2" fill="none" />

            <circle cx="595" cy="435" r="19" fill="#2F855A" stroke="#2D3748" strokeWidth="2" />
            <path d="M580 425 Q595 435 610 425" stroke="#1C4532" strokeWidth="2" fill="none" />

            <circle cx="630" cy="440" r="19" fill="#38A169" stroke="#2D3748" strokeWidth="2" />
            <path d="M615 430 Q630 440 645 430" stroke="#1C4532" strokeWidth="2" fill="none" />

            <circle cx="575" cy="460" r="20" fill="#276749" stroke="#2D3748" strokeWidth="2" />
            <circle cx="615" cy="465" r="20" fill="#38A169" stroke="#2D3748" strokeWidth="2" />
            <circle cx="655" cy="450" r="18" fill="#2F855A" stroke="#2D3748" strokeWidth="2" />
          </g>

          {/* Crates with Greens / Cabbages on Right */}
          <polygon points="575,475 745,475 725,550 550,550" fill="#D7A15C" stroke="#2D3748" strokeWidth="2.5" />
          {/* Cabbages in crate */}
          <circle cx="590" cy="510" r="14" fill="#68D391" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="620" cy="515" r="15" fill="#48BB78" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="650" cy="510" r="14" fill="#68D391" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="680" cy="505" r="14" fill="#48BB78" stroke="#2D3748" strokeWidth="1.5" />

          {/* Lower Crates */}
          <polygon points="590,560 770,540 760,640 580,660" fill="#B36B39" stroke="#2D3748" strokeWidth="2.5" />
          <polygon points="610,640 780,620 770,720 600,740" fill="#8D4925" stroke="#2D3748" strokeWidth="2.5" />
        </g>

        {/* VENDOR (FEMALE) BEHIND COUNTER */}
        <g id="vendor">
          {/* Head & Hair */}
          <ellipse cx="385" cy="310" rx="20" ry="24" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          {/* Blue Bandana / Headscarf */}
          <path d="M365 300 Q385 280 405 300 Q395 285 365 300 Z" fill="#63B3ED" stroke="#2D3748" strokeWidth="2" />
          <circle cx="395" cy="270" r="14" fill="#D69E2E" stroke="#2D3748" strokeWidth="2" />
          {/* Face details */}
          <circle cx="377" cy="308" r="2" fill="#2D3748" />
          <circle cx="389" cy="308" r="2" fill="#2D3748" />
          <path d="M378 318 Q384 324 390 318" stroke="#2D3748" strokeWidth="1.5" fill="none" />
          
          {/* Body & Apron */}
          <path d="M360 334 L350 450 L435 450 L420 334 Z" fill="#E2E8F0" stroke="#2D3748" strokeWidth="2" />
          <path d="M370 338 L360 450 L420 450 L410 338 Z" fill="#4299E1" stroke="#2D3748" strokeWidth="2" />
          
          {/* Arms leaning on counter */}
          <path d="M360 340 L305 450 L345 460 L375 370" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          <path d="M415 340 L465 470 L430 480 L395 370" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          {/* Apron ribbon pattern */}
          <path d="M420 420 Q440 450 445 490" stroke="#E53E3E" strokeWidth="6" strokeDasharray="3 3" fill="none" />
        </g>

        {/* MARKET ROOF AWNING */}
        <g id="awning">
          {/* Main angled canopy roof */}
          <polygon points="215,190 490,55 770,225 490,360" fill="#FFF" />
          
          {/* Red and Orange Stripes */}
          <polygon points="215,190 250,172 525,340 490,360" fill="url(#awningRed)" />
          <polygon points="280,155 315,138 590,305 555,322" fill="url(#awningRed)" />
          <polygon points="350,120 385,102 660,270 625,288" fill="url(#awningRed)" />
          <polygon points="420,85 455,68 730,235 695,252" fill="url(#awningRed)" />
          <polygon points="475,60 490,55 765,220 750,225" fill="url(#awningRed)" />

          {/* Canopy Outline & Overhang */}
          <polygon points="215,190 490,55 770,225 490,360" fill="none" stroke="#2D3748" strokeWidth="3.5" />
          
          {/* Front Scalloped Awning Flap */}
          <polygon points="490,360 770,225 790,265 510,400" fill="#FFF" stroke="#2D3748" strokeWidth="3" />
          <polygon points="510,400 550,380 535,340 495,360" fill="url(#awningRed)" />
          <polygon points="590,360 630,340 615,300 575,320" fill="url(#awningRed)" />
          <polygon points="670,320 710,300 695,260 655,280" fill="url(#awningRed)" />
          <polygon points="750,280 790,260 775,220 735,240" fill="url(#awningRed)" />

          {/* Awning Support Poles */}
          <line x1="225" y1="190" x2="225" y2="480" stroke="#718096" strokeWidth="4" />
          <line x1="490" y1="360" x2="490" y2="490" stroke="#718096" strokeWidth="4" />
          <line x1="710" y1="280" x2="710" y2="450" stroke="#718096" strokeWidth="4" />

          {/* Birds Perched on Roof Awning */}
          <g id="perched-birds" stroke="#2D3748" strokeWidth="2" fill="#CBD5E0">
            <ellipse cx="440" cy="160" rx="14" ry="10" />
            <circle cx="452" cy="155" r="5" fill="#CBD5E0" />
            <polygon points="457,155 463,157 457,159" fill="#ED8936" />

            <ellipse cx="490" cy="195" rx="14" ry="10" />
            <circle cx="502" cy="190" r="5" fill="#CBD5E0" />
            <polygon points="507,190 513,192 507,194" fill="#ED8936" />

            <ellipse cx="535" cy="195" rx="14" ry="10" />
            <circle cx="547" cy="190" r="5" fill="#CBD5E0" />
            <polygon points="552,190 558,192 552,194" fill="#ED8936" />

            <ellipse cx="575" cy="315" rx="14" ry="10" />
            <circle cx="587" cy="310" r="5" fill="#CBD5E0" />
            <polygon points="592,310 598,312 592,314" fill="#ED8936" />

            <ellipse cx="615" cy="310" rx="14" ry="10" />
            <circle cx="627" cy="305" r="5" fill="#CBD5E0" />
            <polygon points="632,305 638,307 632,309" fill="#ED8936" />
          </g>

          {/* Sleeping Cat on the Awning Edge */}
          <g id="sleeping-cat">
            <path d="M660 270 Q710 215 745 270 Q710 290 660 270 Z" fill="#CBD5E0" stroke="#2D3748" strokeWidth="2" />
            <path d="M720 230 Q740 240 735 260" stroke="#718096" strokeWidth="3" fill="none" />
            <path d="M690 240 Q710 250 705 270" stroke="#718096" strokeWidth="3" fill="none" />
            {/* Tail hanging down */}
            <path d="M665 270 Q660 305 675 315" stroke="#CBD5E0" strokeWidth="8" strokeLinecap="round" />
            <path d="M665 270 Q660 305 675 315" stroke="#2D3748" strokeWidth="2" fill="none" />
          </g>
        </g>

        {/* CUSTOMERS & CHARACTERS */}

        {/* Character 1: Mother in green shirt & boy pointing */}
        <g id="mother-and-boy">
          {/* Mother */}
          <ellipse cx="265" cy="405" rx="18" ry="22" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          {/* Blonde hair */}
          <path d="M245 400 Q265 375 285 395 Q280 435 245 400 Z" fill="#ECC94B" stroke="#2D3748" strokeWidth="2" />
          <circle cx="280" cy="385" r="10" fill="#ECC94B" stroke="#2D3748" strokeWidth="2" />
          {/* Green sweater */}
          <path d="M245 425 L215 540 L260 540 L285 425 Z" fill="#38A169" stroke="#2D3748" strokeWidth="2" />
          {/* Arm pointing forward at produce */}
          <path d="M260 440 L315 500" stroke="#38A169" strokeWidth="12" strokeLinecap="round" />
          <path d="M260 440 L315 500" stroke="#2D3748" strokeWidth="2" fill="none" />
          <circle cx="317" cy="502" r="5" fill="#FBD38D" stroke="#2D3748" strokeWidth="1.5" />
          {/* Jeans */}
          <path d="M215 540 L200 680 L220 680 L235 570 L250 680 L270 680 L260 540 Z" fill="#3182CE" stroke="#2D3748" strokeWidth="2" />
          {/* Yellow purse */}
          <rect x="235" y="525" width="28" height="24" rx="4" fill="#D69E2E" stroke="#2D3748" strokeWidth="2" />

          {/* Little Boy reaching up */}
          <circle cx="320" cy="640" r="16" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          <path d="M305 635 Q320 615 335 635" fill="#D69E2E" stroke="#2D3748" strokeWidth="2" />
          {/* Yellow shirt */}
          <rect x="305" y="655" width="30" height="35" rx="3" fill="#ECC94B" stroke="#2D3748" strokeWidth="2" />
          {/* Blue pants */}
          <rect x="308" y="690" width="12" height="40" fill="#3182CE" stroke="#2D3748" strokeWidth="2" />
          <rect x="323" y="690" width="12" height="40" fill="#3182CE" stroke="#2D3748" strokeWidth="2" />
          {/* Arms reaching */}
          <path d="M330 660 L360 635" stroke="#ECC94B" strokeWidth="8" strokeLinecap="round" />
        </g>

        {/* Character 2: Woman with straw hat, pink pants and dog on leash */}
        <g id="woman-and-dog">
          {/* Woman with hat */}
          <ellipse cx="108" cy="460" rx="16" ry="18" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          {/* Straw Hat */}
          <ellipse cx="105" cy="445" rx="40" ry="25" fill="#D69E2E" stroke="#2D3748" strokeWidth="2.5" />
          <ellipse cx="105" cy="440" rx="20" ry="12" fill="#ECC94B" stroke="#2D3748" strokeWidth="2" />
          {/* Brown curly hair */}
          <path d="M85 460 Q70 480 90 490 Q110 500 125 480" fill="#C53030" stroke="#2D3748" strokeWidth="2" />
          {/* Blue top */}
          <path d="M90 490 L75 600 L145 600 L130 490 Z" fill="#63B3ED" stroke="#2D3748" strokeWidth="2" />
          {/* Pink Pants */}
          <path d="M75 600 L65 770 L90 770 L105 640 L120 770 L145 770 L145 600 Z" fill="#F687B3" stroke="#2D3748" strokeWidth="2" />
          
          {/* Dog Leash */}
          <path d="M145 660 Q180 720 220 770" stroke="#2D3748" strokeWidth="2" fill="none" strokeDasharray="3 2" />

          {/* Cute Pug Dog */}
          <ellipse cx="235" cy="780" rx="22" ry="16" fill="#D69E2E" stroke="#2D3748" strokeWidth="2" />
          <circle cx="250" cy="770" r="12" fill="#D69E2E" stroke="#2D3748" strokeWidth="2" />
          {/* Dog face */}
          <ellipse cx="256" cy="775" rx="6" ry="5" fill="#2D3748" />
          <circle cx="248" cy="766" r="2.5" fill="#2D3748" />
          <circle cx="256" cy="766" r="2.5" fill="#2D3748" />
          {/* Dog ears */}
          <polygon points="242,758 248,764 240,766" fill="#744210" stroke="#2D3748" strokeWidth="1.5" />
          <polygon points="256,758 262,764 258,768" fill="#744210" stroke="#2D3748" strokeWidth="1.5" />
          {/* Dog collar & legs */}
          <ellipse cx="244" cy="778" rx="3" ry="8" fill="#3182CE" />
          <line x1="222" y1="790" x2="222" y2="810" stroke="#2D3748" strokeWidth="3" />
          <line x1="245" y1="790" x2="245" y2="810" stroke="#2D3748" strokeWidth="3" />
        </g>

        {/* Character 3: Older Man in Yellow Turtleneck viewing stall */}
        <g id="older-man">
          {/* Head & Grey Hair */}
          <ellipse cx="500" cy="495" rx="18" ry="22" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          <path d="M485 485 Q500 465 515 480 Q515 505 485 485 Z" fill="#E2E8F0" stroke="#2D3748" strokeWidth="2" />
          <path d="M480 505 Q490 525 505 520" fill="#E2E8F0" stroke="#2D3748" strokeWidth="2" />
          {/* Yellow knit turtleneck sweater */}
          <path d="M470 515 L450 670 L550 670 L535 515 Z" fill="#ECC94B" stroke="#2D3748" strokeWidth="2.5" />
          {/* Knit ribs */}
          <line x1="475" y1="535" x2="470" y2="665" stroke="#D69E2E" strokeWidth="2" />
          <line x1="495" y1="535" x2="490" y2="665" stroke="#D69E2E" strokeWidth="2" />
          <line x1="515" y1="535" x2="510" y2="665" stroke="#D69E2E" strokeWidth="2" />
          {/* Brown pants */}
          <path d="M465 670 L455 830 L480 830 L495 720 L515 830 L545 830 L545 670 Z" fill="#744210" stroke="#2D3748" strokeWidth="2.5" />
        </g>

        {/* Character 4: Older Lady with grey bun, glasses, pink sweater & shoulder bag */}
        <g id="older-lady">
          {/* Head, Bun & Glasses */}
          <ellipse cx="625" cy="535" rx="16" ry="20" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          <circle cx="635" cy="510" r="10" fill="#CBD5E0" stroke="#2D3748" strokeWidth="2" />
          <circle cx="618" cy="532" r="5" fill="none" stroke="#2D3748" strokeWidth="1.5" />
          <circle cx="630" cy="532" r="5" fill="none" stroke="#2D3748" strokeWidth="1.5" />
          <line x1="623" y1="532" x2="625" y2="532" stroke="#2D3748" strokeWidth="1.5" />
          {/* Pink sweater */}
          <path d="M605 555 L590 670 L660 670 L645 555 Z" fill="#F687B3" stroke="#2D3748" strokeWidth="2" />
          {/* Blue pants */}
          <path d="M600 670 L595 790 L615 790 L625 710 L635 790 L655 790 L655 670 Z" fill="#63B3ED" stroke="#2D3748" strokeWidth="2" />
          {/* Brown handbag */}
          <rect x="640" y="640" width="30" height="26" rx="4" fill="#C05621" stroke="#2D3748" strokeWidth="2" />
        </g>

        {/* Character 5: Tall Man on the right in Orange Sweater walking with produce bag */}
        <g id="man-with-bag">
          {/* Head & dark hair / beard */}
          <ellipse cx="765" cy="425" rx="18" ry="22" fill="#FBD38D" stroke="#2D3748" strokeWidth="2" />
          <path d="M750 415 Q765 385 785 410 Q780 435 750 415 Z" fill="#744210" stroke="#2D3748" strokeWidth="2" />
          <path d="M755 435 Q765 448 775 435" fill="#744210" stroke="#2D3748" strokeWidth="1.5" />
          {/* Orange sweater */}
          <path d="M740 445 L720 590 L800 590 L785 445 Z" fill="#ED8936" stroke="#2D3748" strokeWidth="2.5" />
          {/* Striped bag with fresh carrots/baguette */}
          <rect x="730" y="525" width="45" height="42" rx="3" fill="#FFF" stroke="#2D3748" strokeWidth="2" />
          <line x1="740" y1="525" x2="740" y2="567" stroke="#3182CE" strokeWidth="3" />
          <line x1="755" y1="525" x2="755" y2="567" stroke="#3182CE" strokeWidth="3" />
          <line x1="770" y1="525" x2="770" y2="567" stroke="#3182CE" strokeWidth="3" />
          {/* Leeks / carrots sticking out */}
          <path d="M735 525 L725 485" stroke="#38A169" strokeWidth="6" strokeLinecap="round" />
          <path d="M745 525 L740 480" stroke="#38A169" strokeWidth="6" strokeLinecap="round" />
          <path d="M760 525 L770 490" stroke="#DD6B20" strokeWidth="6" strokeLinecap="round" />
          {/* Blue jeans */}
          <path d="M735 590 L715 790 L745 790 L760 670 L775 790 L805 790 L795 590 Z" fill="#2B6CB0" stroke="#2D3748" strokeWidth="2.5" />
          {/* Shoulder bag */}
          <rect x="785" y="580" width="38" height="34" rx="4" fill="#9C4221" stroke="#2D3748" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
};
