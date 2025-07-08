import { useEffect, useRef } from 'react';

interface AccessibilityOptions {
  announceChanges?: boolean;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export const useAccessibility = (options: AccessibilityOptions = {}) => {
  const { announceChanges = false, trapFocus = false, autoFocus = false } = options;
  const elementRef = useRef<HTMLElement>(null);
  const announcerRef = useRef<HTMLDivElement | null>(null);

  // Screen reader announcements
  const announce = (message: string) => {
    if (!announcerRef.current) {
      announcerRef.current = document.createElement('div');
      announcerRef.current.setAttribute('aria-live', 'polite');
      announcerRef.current.setAttribute('aria-atomic', 'true');
      announcerRef.current.className = 'sr-only';
      document.body.appendChild(announcerRef.current);
    }
    
    announcerRef.current.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    }, 1000);
  };

  // Focus management
  useEffect(() => {
    if (autoFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [autoFocus]);

  // Focus trap for modals/popups
  useEffect(() => {
    if (!trapFocus || !elementRef.current) return;

    const element = elementRef.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [trapFocus]);

  // Cleanup announcer
  useEffect(() => {
    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
      }
    };
  }, []);

  return {
    elementRef,
    announce,
  };
};