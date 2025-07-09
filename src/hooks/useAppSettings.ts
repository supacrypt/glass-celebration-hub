import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSettings {
  app_name: string;
  wedding_date: string;
  welcome_message: string;
  footer_message: string;
  bride_name: string;
  groom_name: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  app_name: 'Tim & Kirsten',
  wedding_date: '2025-10-05T16:00:00',
  welcome_message: 'Yes, we are that couple stuffing up your long weekend plans! Why spend it somewhere relaxing when you can watch two people who have been together for well over a decade tell you that they still love each other and are going to continue living pretty much as they have but under a legally binding contract?',
  footer_message: 'We can\'t wait to celebrate with you!',
  bride_name: 'Kirsten',
  groom_name: 'Tim'
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap = data?.reduce((acc, item) => {
        acc[item.setting_key] = item.setting_value || '';
        return acc;
      }, {} as Record<string, string>) || {};

      setSettings({
        app_name: settingsMap.app_name || DEFAULT_SETTINGS.app_name,
        wedding_date: settingsMap.wedding_date || DEFAULT_SETTINGS.wedding_date,
        welcome_message: settingsMap.welcome_message || DEFAULT_SETTINGS.welcome_message,
        footer_message: settingsMap.footer_message || DEFAULT_SETTINGS.footer_message,
        bride_name: settingsMap.bride_name || DEFAULT_SETTINGS.bride_name,
        groom_name: settingsMap.groom_name || DEFAULT_SETTINGS.groom_name,
      });
    } catch (error) {
      console.error('Error loading app settings:', error);
      toast({
        title: "Error",
        description: "Failed to load app settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: string) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value 
        }, { 
          onConflict: 'setting_key' 
        });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
      
      toast({
        title: "Setting Updated",
        description: `${key.replace('_', ' ')} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    updateSetting,
    loadSettings
  };
};