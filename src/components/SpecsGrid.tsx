import React from 'react';
import { motion } from 'motion/react';
import { SpecItem } from '../types';

interface SpecsGridProps {
  specs: SpecItem[];
  className?: string;
}

export default function SpecsGrid({ specs, className = '' }: SpecsGridProps) {
  return (
    <div
      id="specs-grid-wrapper"
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 ${className}`}
    >
      {specs.map((spec, idx) => (
        <motion.div
          id={`spec-card-${spec.label.toLowerCase().replace(/\s+/g, '-')}`}
          key={spec.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.08 }}
          whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.4)' }}
          className="border border-white/20 rounded-none p-4 bg-black/60 backdrop-blur-md flex flex-col justify-between h-28 transition-all"
        >
          {/* Label */}
          <span
            id={`spec-label-${idx}`}
            className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-semibold"
          >
            {spec.label}
          </span>

          {/* Value + Unit */}
          <div id={`spec-value-container-${idx}`} className="flex items-baseline gap-1 mt-2">
            <span
              id={`spec-value-${idx}`}
              className="text-3xl md:text-4xl font-black italic tracking-tighter text-white leading-none font-sans"
            >
              {spec.value}
            </span>
            {spec.unit && (
              <span
                id={`spec-unit-${idx}`}
                className="text-xs font-semibold text-white/60 tracking-wider font-sans not-italic ml-1"
              >
                {spec.unit}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
