import React from 'react';

interface M4LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function M4Logo({ className = '', size = 'md' }: M4LogoProps) {
  const barHeights = {
    sm: 'h-4 w-1',
    md: 'h-6 w-1.5',
    lg: 'h-8 w-2',
  };

  const textSizes = {
    sm: 'text-sm font-bold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-3xl font-black tracking-tight',
  };

  const gapSizes = {
    sm: 'gap-0.5 ml-1.5',
    md: 'gap-1 ml-2.5',
    lg: 'gap-1.5 ml-3.5',
  };

  return (
    <div id="bmw-m-logo-container" className={`flex items-center ${className}`}>
      {/* Three Colored Diagonal Bars */}
      <div id="m-stripes" className="flex items-center -space-x-px">
        {/* Light Blue Stripe */}
        <div
          id="m-stripe-lightblue"
          className={`${barHeights[size]} bg-[#0092c7] transform -skew-x-[24deg]`}
        />
        {/* Dark Blue Stripe */}
        <div
          id="m-stripe-darkblue"
          className={`${barHeights[size]} bg-[#001d51] transform -skew-x-[24deg]`}
        />
        {/* Red Stripe */}
        <div
          id="m-stripe-red"
          className={`${barHeights[size]} bg-[#e50013] transform -skew-x-[24deg]`}
        />
      </div>

      {/* The White "M" Letter */}
      <span
        id="m-letter-white"
        className={`${textSizes[size]} ${gapSizes[size]} text-white italic font-sans leading-none`}
        style={{ fontFamily: '"DM Sans", sans-serif' }}
      >
        M
      </span>
    </div>
  );
}
