import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BackgroundSettings {
  type: 'gradient' | 'image' | 'pattern';
  imageUrl: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: string;
  opacity: number;
}

const DEFAULT_BACKGROUND: BackgroundSettings = {
  type: 'gradient',
  imageUrl: 'https://i.ibb.co/0VQTdZfF/Chat-GPT-Image-Jul-8-2025-01-32-20-AM.png',
  gradientStart: 'hsl(40, 33%, 96%)',
  gradientEnd: 'hsl(40, 20%, 92%)',
  gradientDirection: '135deg',
  opacity: 1.0,
};

export const useGlobalBackground = () => {
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUND);
  const [loading, setLoading] = useState(true);

  const loadAndApplyBackground = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'bg_type', 'bg_image_url', 'bg_gradient_start', 
          'bg_gradient_end', 'bg_gradient_direction', 'bg_opacity'
        ]);

      if (data && data.length > 0) {
        const settings: Partial<BackgroundSettings> = {};
        data.forEach(setting => {
          switch (setting.setting_key) {
            case 'bg_type':
              settings.type = (setting.setting_value as 'gradient' | 'image' | 'pattern') || 'gradient';
              break;
            case 'bg_image_url':
              settings.imageUrl = setting.setting_value || '';
              break;
            case 'bg_gradient_start':
              settings.gradientStart = setting.setting_value || 'hsl(40, 33%, 96%)';
              break;
            case 'bg_gradient_end':
              settings.gradientEnd = setting.setting_value || 'hsl(40, 20%, 92%)';
              break;
            case 'bg_gradient_direction':
              settings.gradientDirection = setting.setting_value || '135deg';
              break;
            case 'bg_opacity':
              settings.opacity = parseFloat(setting.setting_value || '1.0');
              break;
          }
        });
        
        const finalSettings = { ...DEFAULT_BACKGROUND, ...settings };
        setBackgroundSettings(finalSettings);
        applyBackgroundToBody(finalSettings);
      } else {
        // No saved settings, apply default
        applyBackgroundToBody(DEFAULT_BACKGROUND);
      }
    } catch (error) {
      console.error('Error loading background settings:', error);
      // Apply default on error
      applyBackgroundToBody(DEFAULT_BACKGROUND);
    } finally {
      setLoading(false);
    }
  };

  const applyBackgroundToBody = (settings: BackgroundSettings) => {
    const body = document.body;
    
    // Remove any Tailwind background classes
    body.classList.remove('bg-background');
    
    // Clear any existing background styles
    body.style.backgroundColor = '';
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    
    if (settings.type === 'image' && settings.imageUrl) {
      body.style.setProperty('background-image', `url(${settings.imageUrl})`, 'important');
      body.style.setProperty('background-size', 'cover', 'important');
      body.style.setProperty('background-position', 'center', 'important');
      body.style.setProperty('background-repeat', 'no-repeat', 'important');
      body.style.setProperty('background-attachment', 'fixed', 'important');
      body.style.setProperty('background-color', 'hsl(40 33% 94%)', 'important'); // Fallback color
    } else if (settings.type === 'gradient') {
      body.style.setProperty('background-image', `linear-gradient(${settings.gradientDirection}, ${settings.gradientStart} 0%, ${settings.gradientEnd} 100%)`, 'important');
      body.style.setProperty('background-size', 'auto', 'important');
      body.style.setProperty('background-position', 'auto', 'important');
      body.style.setProperty('background-repeat', 'auto', 'important');
      body.style.setProperty('background-attachment', 'auto', 'important');
      body.style.setProperty('background-color', 'transparent', 'important');
    } else {
      // Default background color
      body.style.setProperty('background-color', 'hsl(40 33% 94%)', 'important');
    }
    
    // Apply opacity through a pseudo-element approach or filter if needed
    if (settings.opacity < 1.0) {
      body.style.setProperty('opacity', settings.opacity.toString(), 'important');
    } else {
      body.style.opacity = '';
    }
  };

  // Listen for background changes from BackgroundManager
  const handleBackgroundUpdate = (newSettings: BackgroundSettings) => {
    setBackgroundSettings(newSettings);
    applyBackgroundToBody(newSettings);
  };

  useEffect(() => {
    loadAndApplyBackground();

    // Listen for background changes from BackgroundManager
    const handleBackgroundChanged = () => {
      loadAndApplyBackground();
    };

    window.addEventListener('backgroundChanged', handleBackgroundChanged);

    return () => {
      window.removeEventListener('backgroundChanged', handleBackgroundChanged);
    };
  }, []);

  return {
    backgroundSettings,
    loading,
    applyBackground: handleBackgroundUpdate,
    reloadBackground: loadAndApplyBackground
  };
};