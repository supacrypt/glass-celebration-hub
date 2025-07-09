import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Volume2, VolumeX, Keyboard, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  keyboardNavigation: boolean;
  voiceAnnouncements: boolean;
  fontSize: number;
  focusVisible: boolean;
}

export const AccessibilityManager: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReaderMode: false,
    keyboardNavigation: true,
    voiceAnnouncements: false,
    fontSize: 16,
    focusVisible: true
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion || prefersHighContrast) {
      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion,
        highContrast: prefersHighContrast
      }));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText || settings.fontSize > 16) {
      root.style.setProperty('--base-font-size', `${settings.fontSize}px`);
    } else {
      root.style.removeProperty('--base-font-size');
    }

    // Focus visible
    if (settings.focusVisible) {
      document.body.classList.add('focus-visible');
    } else {
      document.body.classList.remove('focus-visible');
    }

    // Screen reader mode
    if (settings.screenReaderMode) {
      document.body.classList.add('screen-reader-mode');
    } else {
      document.body.classList.remove('screen-reader-mode');
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce changes for screen readers
    if (settings.voiceAnnouncements && 'speechSynthesis' in window) {
      const message = `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`;
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      screenReaderMode: false,
      keyboardNavigation: true,
      voiceAnnouncements: false,
      fontSize: 16,
      focusVisible: true
    };
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Menu Toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full glass-card"
        aria-label="Open accessibility menu"
      >
        <Eye className="w-5 h-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Accessibility Settings
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close accessibility menu"
                >
                  <EyeOff className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Visual Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Visual</h3>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="high-contrast" className="text-sm font-medium">
                    High Contrast
                  </label>
                  <Switch
                    id="high-contrast"
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small</span>
                    <span>{settings.fontSize}px</span>
                    <span>Large</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="focus-visible" className="text-sm font-medium">
                    Enhanced Focus Indicators
                  </label>
                  <Switch
                    id="focus-visible"
                    checked={settings.focusVisible}
                    onCheckedChange={(checked) => updateSetting('focusVisible', checked)}
                  />
                </div>
              </div>

              {/* Motion Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Motion</h3>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="reduced-motion" className="text-sm font-medium">
                    Reduce Motion
                  </label>
                  <Switch
                    id="reduced-motion"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                  />
                </div>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Audio</h3>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="voice-announcements" className="text-sm font-medium">
                    Voice Announcements
                  </label>
                  <Switch
                    id="voice-announcements"
                    checked={settings.voiceAnnouncements}
                    onCheckedChange={(checked) => updateSetting('voiceAnnouncements', checked)}
                  />
                </div>
              </div>

              {/* Navigation Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Navigation</h3>
                
                <div className="flex items-center justify-between">
                  <label htmlFor="keyboard-nav" className="text-sm font-medium">
                    Enhanced Keyboard Navigation
                  </label>
                  <Switch
                    id="keyboard-nav"
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="screen-reader" className="text-sm font-medium">
                    Screen Reader Optimizations
                  </label>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReaderMode}
                    onCheckedChange={(checked) => updateSetting('screenReaderMode', checked)}
                  />
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={resetSettings}
                className="w-full"
              >
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-wedding-navy text-white rounded"
      >
        Skip to main content
      </a>
    </>
  );
};