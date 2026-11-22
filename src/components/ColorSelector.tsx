import React from 'react';
import { motion } from 'motion/react';
import { M4Color } from '../types';

interface ColorSelectorProps {
  colors: M4Color[];
  activeColor: M4Color;
  onChangeColor: (color: M4Color) => void;
  className?: string;
}

export default function ColorSelector({
  colors,
  activeColor,
  onChangeColor,
  className = '',
}: ColorSelectorProps) {
  return (
    <div id="color-selector-wrapper" className={`flex flex-col gap-3 ${className}`}>
      {/* Title */}
      <h4
        id="color-selector-label"
        className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/40 uppercase"
      >
        Select Exterior Paint
      </h4>

      {/* Paint Swatches Row */}
      <div id="swatches-container" className="flex items-center gap-3">
        {colors.map((color) => {
          const isActive = color.id === activeColor.id;
          return (
            <div id={`swatch-wrapper-${color.id}`} key={color.id} className="relative group">
              {/* Swatch circle */}
              <motion.button
                id={`swatch-button-${color.id}`}
                onClick={() => onChangeColor(color)}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.93 }}
                className={`w-8 h-8 rounded-full border-2 relative transition-all ${
                  isActive ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-white/10'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {/* Visual marker inside active white swatch */}
                {isActive && color.hex === '#f7f9fa' && (
                  <span
                    id="active-swatch-dot-dark"
                    className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black"
                  />
                )}
                {/* Visual marker inside other swatches */}
                {isActive && color.hex !== '#f7f9fa' && (
                  <span
                    id="active-swatch-dot-light"
                    className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </motion.button>

              {/* Tooltip */}
              <div
                id={`swatch-tooltip-${color.id}`}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/90 border border-white/10 rounded text-[9px] font-bold text-white uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              >
                {color.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
