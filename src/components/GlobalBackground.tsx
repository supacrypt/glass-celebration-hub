
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const GlobalBackground: React.FC = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchActiveBackground = async () => {
    try {
      console.log('GlobalBackground: Fetching active background...');
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'active_background')
        .single();

      console.log('GlobalBackground: Database query result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching active background:', error);
        return;
      }

      if (data?.setting_value) {
        console.log('GlobalBackground: Using background from database:', data.setting_value);
        const publicUrl = supabase.storage
          .from('backgrounds')
          .getPublicUrl(data.setting_value).data.publicUrl;
        console.log('GlobalBackground: Generated URL:', publicUrl);
        setBackgroundUrl(publicUrl);
      } else {
        console.log('GlobalBackground: No active background found, using empty background');
        setBackgroundUrl('');
      }
    } catch (error) {
      console.error('Error in fetchActiveBackground:', error);
      setBackgroundUrl('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBackground();

    // Listen for background changes
    const handleBackgroundChange = (event: CustomEvent) => {
      const { backgroundName } = event.detail;
      if (backgroundName) {
        const publicUrl = supabase.storage
          .from('backgrounds')
          .getPublicUrl(backgroundName).data.publicUrl;
        console.log('GlobalBackground: Background changed to:', backgroundName, 'URL:', publicUrl);
        setBackgroundUrl(publicUrl);
      } else {
        console.log('GlobalBackground: Background cleared');
        setBackgroundUrl('');
      }
    };

    window.addEventListener('backgroundChanged', handleBackgroundChange as EventListener);

    // Listen for real-time changes to app_settings
    const channel = supabase
      .channel('app-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_settings',
          filter: 'setting_key=eq.active_background'
        },
        () => {
          fetchActiveBackground();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('backgroundChanged', handleBackgroundChange as EventListener);
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return null;
  }

  console.log('GlobalBackground: Rendering with URL:', backgroundUrl);
  
  return (
    <div
      className="fixed inset-0 z-[-10] w-full h-full"
      style={{
        backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        minWidth: '100vw',
        // Temporary debugging: light gray background to verify div is rendering
        backgroundColor: backgroundUrl ? 'transparent' : '#f5f5f5',
      }}
    />
  );
};

export default GlobalBackground;
