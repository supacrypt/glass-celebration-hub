import React, { ReactNode, CSSProperties, memo } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'frosted';
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = memo(({ 
  children, 
  variant = 'primary', 
  className, 
  animate = true,
  onClick,
  style 
}) => {
  const baseClasses = `
    rounded-glass-lg transition-all duration-300 ease-out
    ${animate ? 'glass-animated hover:scale-[1.02] hover:shadow-glass-lg' : ''}
    ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
  `;
  
  const variantClasses = {
    primary: 'glass-primary',
    secondary: 'glass-secondary', 
    frosted: 'glass-frosted'
  };

  return (
    <div 
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
});

// Display name for better debugging
GlassCard.displayName = 'GlassCard';

export default GlassCard;