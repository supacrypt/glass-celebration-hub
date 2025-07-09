import React, { useEffect } from 'react';
import { useResponsiveDesign, getResponsiveClasses, getTouchTargetSize, getOptimalBlurValue } from '@/hooks/useResponsiveDesign';

interface MobileOptimizedComponentProps {
  children: React.ReactNode;
  className?: string;
  enableGlassEffect?: boolean;
  touchOptimized?: boolean;
}

const MobileOptimizedComponent: React.FC<MobileOptimizedComponentProps> = ({
  children,
  className = '',
  enableGlassEffect = true,
  touchOptimized = true
}) => {
  const device = useResponsiveDesign();

  useEffect(() => {
    // Apply mobile-specific CSS
    import('@/styles/mobile-optimizations.css');
  }, []);

  const responsiveClasses = getResponsiveClasses(device);
  const touchTargetSize = getTouchTargetSize(device);
  const blurValue = getOptimalBlurValue(device);

  const baseClasses = [
    responsiveClasses,
    className,
    enableGlassEffect && device.supportsBackdropFilter ? 'glass-mobile-optimized' : '',
    touchOptimized ? 'mobile-touch-optimized' : '',
    device.hasTouch ? 'touch-device' : 'no-touch',
    device.prefersReducedMotion ? 'reduced-motion' : '',
    device.prefersDarkMode ? 'dark-mode-preferred' : '',
    device.prefersHighContrast ? 'high-contrast-preferred' : ''
  ].filter(Boolean).join(' ');

  const styles: React.CSSProperties = {
    ...touchOptimized && {
      minHeight: touchTargetSize,
      minWidth: touchTargetSize,
    },
    ...enableGlassEffect && device.supportsBackdropFilter && {
      backdropFilter: `blur(${blurValue}px)`,
      WebkitBackdropFilter: `blur(${blurValue}px)`,
    }
  };

  return (
    <div 
      className={baseClasses}
      style={styles}
      data-device-type={device.deviceType}
      data-screen-width={device.screenWidth}
      data-critical-viewport={device.isCriticalViewport}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedComponent;