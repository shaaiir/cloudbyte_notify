import React, { useEffect, useState } from 'react';

// 4 Unique 3D Shattered Corner SVG Overlays (Big Broken Corner Cutout Slicing Card + Shadow Lip)
function CrackOverlay({ variant }) {
  if (variant === 0) {
    // DAYS (Cyan / Sky Blue): Top-left corner completely broken off + floating fragment
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible" viewBox="0 0 100 65" fill="none">
        {/* Missing Top-Left Corner Cutout */}
        <polygon points="-5,-5 22,-5 14,16 -5,24" fill="#000000" />
        
        {/* Inner edge border highlight */}
        <path d="M 22 -5 L 14 16 L -5 24" stroke="#082f49" strokeWidth="1.8" />
        <path d="M 22.5 -5 L 14.5 16.5 L -5 24.5" stroke="#bae6fd" strokeWidth="0.8" opacity="0.8" />

        {/* Floating Broken Cyan Fragment Chip */}
        <polygon points="-8,-4 4,-9 8,1 -4,5" fill="url(#cyanGrad0)" stroke="#0369a1" strokeWidth="0.8" filter="drop-shadow(-2px 4px 6px rgba(0,0,0,0.9))" />

        <defs>
          <linearGradient id="cyanGrad0" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 1) {
    // HOURS (Warm Brown): Top-right corner completely broken off + floating fragment
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible" viewBox="0 0 100 65" fill="none">
        {/* Missing Top-Right Corner Cutout */}
        <polygon points="78,-5 105,-5 105,24 86,16" fill="#000000" />
        
        {/* Gap fracture border */}
        <path d="M 78 -5 L 86 16 L 105 24" stroke="#2e1104" strokeWidth="1.8" />
        <path d="M 77.5 -5 L 85.5 16.5 L 105 24.5" stroke="#fde68a" strokeWidth="0.8" opacity="0.8" />

        {/* Floating Broken Brown Fragment Chip */}
        <polygon points="92,-9 106,-4 102,6 90,2" fill="url(#brownGrad1)" stroke="#451a03" strokeWidth="0.8" filter="drop-shadow(3px 4px 6px rgba(0,0,0,0.9))" />

        <defs>
          <linearGradient id="brownGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b56335" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 2) {
    // MINUTES (Vibrant Orange): Bottom-left corner completely broken off
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible" viewBox="0 0 100 65" fill="none">
        {/* Missing Bottom-Left Corner Cutout */}
        <polygon points="-5,40 16,48 25,72 -5,72" fill="#000000" />
        
        {/* Gap fracture border */}
        <path d="M -5 40 L 16 48 L 25 72" stroke="#431407" strokeWidth="1.8" />
        <path d="M -4.5 39.5 L 16.5 47.5 L 25.5 72" stroke="#fed7aa" strokeWidth="0.8" opacity="0.8" />

        {/* Floating Broken Orange Fragment Chip */}
        <polygon points="-9,58 3,54 7,68 -5,70" fill="url(#orangeGrad2)" stroke="#c2410c" strokeWidth="0.8" filter="drop-shadow(-3px 5px 6px rgba(0,0,0,0.9))" />

        <defs>
          <linearGradient id="orangeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // SECONDS (Royal Blue): Bottom-right corner completely broken off
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible" viewBox="0 0 100 65" fill="none">
      {/* Missing Bottom-Right Corner Cutout */}
      <polygon points="75,72 84,48 105,40 105,72" fill="#000000" />
      
      {/* Gap fracture border */}
      <path d="M 75 72 L 84 48 L 105 40" stroke="#172554" strokeWidth="1.8" />
      <path d="M 74.5 72 L 83.5 47.5 L 104.5 39.5" stroke="#bfdbfe" strokeWidth="0.8" opacity="0.8" />

      {/* Floating Broken Blue Fragment Chip */}
      <polygon points="92,54 104,50 108,64 96,68" fill="url(#blueGrad3)" stroke="#1e40af" strokeWidth="0.8" filter="drop-shadow(3px 5px 6px rgba(0,0,0,0.9))" />

      <defs>
        <linearGradient id="blueGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FlipDigit({ digit, label, crackVariant }) {
  const [currentVal, setCurrentVal] = useState(digit);
  const [prevVal, setPrevVal] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);
  const [spinKey, setSpinKey] = useState(0);

  // Derive crack variant index (0, 1, 2, 3) from prop or label
  const variantIndex = crackVariant ?? (
    label === 'DAYS' ? 0 :
    label === 'HOURS' ? 1 :
    label === 'MINUTES' ? 2 : 3
  );

  // Styling theme definitions per box variant index
  const cardThemes = [
    { cardClass: 'cyan-pill-card', borderClass: 'border-sky-300/40', textClass: 'text-black', labelColor: 'text-[#38bdf8]' },
    { cardClass: 'brown-pill-card', borderClass: 'border-amber-300/40', textClass: 'text-black', labelColor: 'text-[#f59e0b]' },
    { cardClass: 'orange-pill-card', borderClass: 'border-orange-300/40', textClass: 'text-black', labelColor: 'text-[#f97316]' },
    { cardClass: 'blue-pill-card', borderClass: 'border-blue-300/40', textClass: 'text-black', labelColor: 'text-[#60a5fa]' },
  ];

  const theme = cardThemes[variantIndex] || cardThemes[0];

  useEffect(() => {
    if (digit !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(digit);
      setIsFlipping(true);
      setSpinKey(prev => prev + 1);

      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [digit, currentVal]);

  const formatTwoDigits = (val) => String(val).padStart(2, '0');
  const formattedCurrent = formatTwoDigits(currentVal);

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2.5 md:gap-3">
      {/* 8px Border Radius Card with 360 Degree Rotation */}
      <div className="relative w-[70px] min-[400px]:w-[82px] sm:w-36 md:w-44 lg:w-48 h-[48px] min-[400px]:h-[56px] sm:h-24 md:h-28 lg:h-32 perspective-stage select-none shrink-0">
        <div
          key={spinKey}
          className={`w-full h-full relative rounded-[8px] ${theme.cardClass} flex items-center justify-center border ${theme.borderClass} ${isFlipping ? 'animate-rotate-360' : ''}`}
        >
          {/* INNER DIGIT CONTAINER (Clipped to 8px rounded card boundary) */}
          <div className="absolute inset-0 rounded-[8px] overflow-hidden flex items-center justify-center">
            {/* SEAMLESS SOLID DIGIT */}
            <span className={`text-2xl min-[400px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display ${theme.textClass} tracking-tight z-10`}>
              {formattedCurrent}
            </span>
          </div>

          {/* UNIQUE BROKEN CORNER OVERLAY */}
          <CrackOverlay variant={variantIndex} />
        </div>
      </div>

      {/* Label (Days / Hours / Minutes / Seconds matching heading font) */}
      <span className={`text-[11px] sm:text-sm md:text-base font-display font-extrabold tracking-tight ${theme.labelColor}`}>
        {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}
      </span>
    </div>
  );
}





