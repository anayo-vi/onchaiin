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
    sm: 'h-8 max-h-8',
    md: 'h-10 sm:h-12 max-h-12',
    lg: 'h-16 max-h-16',
    xl: 'h-24 max-h-24',
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
