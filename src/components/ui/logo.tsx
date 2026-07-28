import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  // Height classes increased by 20%
  const heightClasses = {
    sm: 'h-20 max-h-20', // 80px
    md: 'h-28 sm:h-32 max-h-[122px]', // 112px on mobile, 122px on desktop (+20%)
    lg: 'h-36 max-h-36', // 144px
    xl: 'h-48 max-h-48', // 192px
  };

  return (
    <div className={`flex items-center justify-center p-0 m-0 ${className}`}>
      <img
        src="/logo.png"
        alt="Onchaiin"
        className={`${heightClasses[size]} w-auto object-contain block p-0 m-0 transition-transform hover:scale-[1.02]`}
      />
    </div>
  );
};
