'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', animated = true }) => {
  const heightClasses = {
    sm: 'h-20 max-h-20', // 80px
    md: 'h-28 sm:h-32 max-h-[122px]', // 112px on mobile, 122px on desktop (+20%)
    lg: 'h-36 max-h-36', // 144px
    xl: 'h-48 max-h-48', // 192px
  };

  const imgElement = (
    <img
      src="/new_logo.png"
      alt="Onchaiin"
      className={`${heightClasses[size]} w-auto object-contain block p-0 m-0 transition-transform hover:scale-[1.03] drop-shadow-md`}
    />
  );

  if (!animated) {
    return (
      <div className={`flex items-center justify-center p-0 m-0 ${className}`}>
        {imgElement}
      </div>
    );
  }

  return (
    <motion.div
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: 3.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`flex items-center justify-center p-0 m-0 ${className}`}
    >
      {imgElement}
    </motion.div>
  );
};
