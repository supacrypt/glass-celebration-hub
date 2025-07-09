import { useState, useEffect } from 'react';

interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean; // Galaxy S25 (360px)
  isTinyMobile: boolean;  // iPhone 13 Mini (375px)
  isLargeMobile: boolean; // iPhone 16 Pro Max (440px)
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  pixelRatio: number;
  isCriticalViewport: boolean;
}

interface DeviceCapabilities {
  hasTouch: boolean;
  supportsBackdropFilter: boolean;
  supportsWebP: boolean;
  isHighDPI: boolean;
  prefersReducedMotion: boolean;
  prefersDarkMode: boolean;
  prefersHighContrast: boolean;
}

export const useResponsiveDesign = (): ResponsiveBreakpoints & DeviceCapabilities => {
  const [state, setState] = useState<ResponsiveBreakpoints & DeviceCapabilities>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isSmallMobile: false,
    isTinyMobile: false,
    isLargeMobile: false,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    orientation: 'portrait',
    deviceType: 'desktop',
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    isCriticalViewport: false,
    hasTouch: false,
    supportsBackdropFilter: false,
    supportsWebP: false,
    isHighDPI: false,
    prefersReducedMotion: false,
    prefersDarkMode: false,
    prefersHighContrast: false,
  });

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      // Device type detection
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      // Critical viewport detection
      const isSmallMobile = width <= 360; // Galaxy S25
      const isTinyMobile = width <= 375 && width > 360; // iPhone 13 Mini
      const isLargeMobile = width >= 440 && width < 768; // iPhone 16 Pro Max
      const isCriticalViewport = width <= 375 || width >= 440;

      // Orientation detection
      const orientation = height > width ? 'portrait' : 'landscape';

      // Device type determination
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      // Capability detection
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') || 
                                    CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
      
      // WebP support detection
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

      const isHighDPI = pixelRatio > 1.5;

      // Media query preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

      setState({
        isMobile,
        isTablet,
        isDesktop,
        isSmallMobile,
        isTinyMobile,
        isLargeMobile,
        screenWidth: width,
        screenHeight: height,
        orientation,
        deviceType,
        pixelRatio,
        isCriticalViewport,
        hasTouch,
        supportsBackdropFilter,
        supportsWebP,
        isHighDPI,
        prefersReducedMotion,
        prefersDarkMode,
        prefersHighContrast,
      });
    };

    // Initial update
    updateState();

    // Event listeners
    const handleResize = () => updateState();
    const handleOrientationChange = () => setTimeout(updateState, 100);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Media query listeners
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMediaQueryChange = () => updateState();

    reducedMotionQuery.addEventListener('change', handleMediaQueryChange);
    darkModeQuery.addEventListener('change', handleMediaQueryChange);
    highContrastQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      reducedMotionQuery.removeEventListener('change', handleMediaQueryChange);
      darkModeQuery.removeEventListener('change', handleMediaQueryChange);
      highContrastQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return state;
};

// Helper functions for responsive design
export const getResponsiveClasses = (device: ResponsiveBreakpoints) => {
  const classes: string[] = [];

  if (device.isMobile) classes.push('mobile-device');
  if (device.isTablet) classes.push('tablet-device');
  if (device.isDesktop) classes.push('desktop-device');
  if (device.isSmallMobile) classes.push('small-mobile');
  if (device.isTinyMobile) classes.push('tiny-mobile');
  if (device.isLargeMobile) classes.push('large-mobile');
  if (device.isCriticalViewport) classes.push('critical-viewport');
  if (device.orientation === 'landscape') classes.push('landscape-orientation');

  return classes.join(' ');
};

export const getTouchTargetSize = (device: ResponsiveBreakpoints & DeviceCapabilities) => {
  if (device.hasTouch) {
    if (device.isSmallMobile) return '48px'; // Larger for small screens
    if (device.isMobile) return '44px';
    return '40px';
  }
  return '36px'; // Desktop
};

export const getOptimalBlurValue = (device: ResponsiveBreakpoints & DeviceCapabilities) => {
  if (!device.supportsBackdropFilter) return 0;
  if (device.isSmallMobile) return 8; // Reduced for performance
  if (device.isMobile) return 12;
  return 20; // Full blur for desktop
};

export const getOptimalImageFormat = (device: DeviceCapabilities) => {
  if (device.supportsWebP) return 'webp';
  return 'jpg';
};

// Performance optimization helpers
export const shouldReduceAnimations = (device: DeviceCapabilities) => {
  return device.prefersReducedMotion || device.isHighDPI;
};

export const getOptimalFontSize = (device: ResponsiveBreakpoints) => {
  if (device.isSmallMobile) return '14px';
  if (device.isTinyMobile) return '15px';
  if (device.isMobile) return '16px';
  return '16px';
};