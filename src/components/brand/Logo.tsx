import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  variant = 'dark',
  size = 'md',
}) => {
  const isLight = variant === 'light';

  const sizeClasses: Record<string, string> = {
    sm: 'h-8 sm:h-9',
    md: 'h-[48px]',
    lg: 'h-16 sm:h-20',
    xl: 'h-20 sm:h-24',
  };

  const currentSizeClass = sizeClasses[size] || 'h-[48px]';

  return (
    <img 
      src="/este-logo.svg" 
      alt="Velvet Bloom" 
      className={`w-auto object-contain transition-transform duration-200 select-none ${currentSizeClass} ${className} ${
        isLight ? 'brightness-0 invert opacity-95' : ''
      }`}
    />
  );
};

export default Logo;
