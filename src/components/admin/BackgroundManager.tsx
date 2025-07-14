import React, { useState, useEffect } from 'react';
import { Image, Upload, Eye, Save, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackgroundSettings {
  type: 'gradient' | 'image' | 'pattern';
  imageUrl: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: string;
  opacity: number;
}

const BackgroundManager: React.FC = () => {
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'gradient',
    imageUrl: 'https://i.ibb.co/0VQTdZfF/Chat-GPT-Image-Jul-8-2025-01-32-20-AM.png',
    gradientStart: 'hsl(40, 33%, 96%)',
    gradientEnd: 'hsl(40, 20%, 92%)',
    gradientDirection: '135deg',
    opacity: 1.0,
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const gradientPresets = [
    {
      name: 'Warm Wedding',
      start: 'hsl(40, 33%, 96%)',
      end: 'hsl(40, 20%, 92%)',
      direction: '135deg'
    },
    {
      name: 'Romantic Blush',
      start: 'hsl(330, 68%, 95%)',
      end: 'hsl(25, 45%, 92%)',
      direction: '135deg'
    },
    {
      name: 'Ocean Breeze',
      start: 'hsl(220, 68%, 95%)',
      end: 'hsl(200, 50%, 90%)',
      direction: '135deg'
    },
    {
      name: 'Forest Mist',
      start: 'hsl(142, 76%, 95%)',
      end: 'hsl(120, 20%, 88%)',
      direction: '135deg'
    },
    {
      name: 'Royal Evening',
      start: 'hsl(256, 68%, 95%)',
      end: 'hsl(280, 20%, 90%)',
      direction: '135deg'
    },
    {
      name: 'Golden Hour',
      start: 'hsl(45, 80%, 95%)',
      end: 'hsl(30, 60%, 88%)',
      direction: '135deg'
    }
  ];

  useEffect(() => {
    loadBackgroundSettings();
  }, []);

  const loadBackgroundSettings = async () => {
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
        
        setBackgroundSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error loading background settings:', error);
    }
  };

  const applyBackgroundPreview = (settings: BackgroundSettings) => {
    if (!previewMode) return;
    
    const body = document.body;
    
    if (settings.type === 'image' && settings.imageUrl) {
      body.style.backgroundImage = `url(${settings.imageUrl})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
      body.style.backgroundAttachment = 'fixed';
    } else if (settings.type === 'gradient') {
      body.style.backgroundImage = `linear-gradient(${settings.gradientDirection}, ${settings.gradientStart} 0%, ${settings.gradientEnd} 100%)`;
      body.style.backgroundSize = 'auto';
      body.style.backgroundPosition = 'auto';
      body.style.backgroundRepeat = 'auto';
      body.style.backgroundAttachment = 'auto';
    }
  };

  const uploadBackgroundImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `background-${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

      const newSettings = { ...backgroundSettings, imageUrl: publicUrl, type: 'image' as const };
      setBackgroundSettings(newSettings);
      applyBackgroundPreview(newSettings);

      toast({
        title: "Image Uploaded",
        description: "Background image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const saveBackgroundSettings = async () => {
    setSaving(true);
    try {
      const settingsToSave = [
        { setting_key: 'bg_type', setting_value: backgroundSettings.type },
        { setting_key: 'bg_image_url', setting_value: backgroundSettings.imageUrl },
        { setting_key: 'bg_gradient_start', setting_value: backgroundSettings.gradientStart },
        { setting_key: 'bg_gradient_end', setting_value: backgroundSettings.gradientEnd },
        { setting_key: 'bg_gradient_direction', setting_value: backgroundSettings.gradientDirection },
        { setting_key: 'bg_opacity', setting_value: backgroundSettings.opacity.toString() },
      ];

      for (const setting of settingsToSave) {
        await supabase
          .from('app_settings')
          .upsert(setting, { onConflict: 'setting_key' });
      }

      applyBackgroundPreview(backgroundSettings);
      
      toast({
        title: "Background Saved",
        description: "Background settings have been applied",
      });
    } catch (error) {
      console.error('Error saving background settings:', error);
      toast({
        title: "Error",
        description: "Failed to save background settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof BackgroundSettings, value: any) => {
    const newSettings = { ...backgroundSettings, [key]: value };
    setBackgroundSettings(newSettings);
    applyBackgroundPreview(newSettings);
  };

  return (
    <div className="space-y-4">
      {/* Background Manager Header */}
      <div className="flex items-center justify-between glass-card p-3">
        <div className="flex items-center gap-2">
          <Image className="w-4 h-4 text-glass-pink" />
          <span className="text-sm font-medium">Background Manager</span>
        </div>
        <Button
          size="sm"
          variant={previewMode ? "default" : "outline"}
          onClick={() => setPreviewMode(!previewMode)}
          className="text-xs"
        >
          <Eye className="w-3 h-3 mr-1" />
          {previewMode ? 'Exit Preview' : 'Live Preview'}
        </Button>
      </div>

      {/* Background Type Selection */}
      <div className="glass-card p-3 space-y-3">
        <Label className="text-sm font-medium text-wedding-navy">Background Type</Label>
        <RadioGroup
          value={backgroundSettings.type}
          onValueChange={(value: 'gradient' | 'image' | 'pattern') => 
            handleSettingChange('type', value)
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gradient" id="gradient" />
            <Label htmlFor="gradient" className="text-xs">Gradient</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="image" />
            <Label htmlFor="image" className="text-xs">Image</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pattern" id="pattern" />
            <Label htmlFor="pattern" className="text-xs">Pattern</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Gradient Settings */}
      {backgroundSettings.type === 'gradient' && (
        <div className="space-y-3">
          <div className="glass-card p-3 space-y-3">
            <Label className="text-sm font-medium text-wedding-navy">Gradient Settings</Label>
            
            {/* Gradient Colors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Start Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: backgroundSettings.gradientStart }}
                  />
                  <Input
                    type="text"
                    value={backgroundSettings.gradientStart}
                    onChange={(e) => handleSettingChange('gradientStart', e.target.value)}
                    className="flex-1 text-xs font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">End Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: backgroundSettings.gradientEnd }}
                  />
                  <Input
                    type="text"
                    value={backgroundSettings.gradientEnd}
                    onChange={(e) => handleSettingChange('gradientEnd', e.target.value)}
                    className="flex-1 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Preview */}
            <div 
              className="h-16 rounded-lg border"
              style={{
                background: `linear-gradient(${backgroundSettings.gradientDirection}, ${backgroundSettings.gradientStart} 0%, ${backgroundSettings.gradientEnd} 100%)`
              }}
            />
          </div>

          {/* Gradient Presets */}
          <div className="glass-card p-3 space-y-3">
            <Label className="text-sm font-medium text-wedding-navy">Gradient Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    handleSettingChange('gradientStart', preset.start);
                    handleSettingChange('gradientEnd', preset.end);
                    handleSettingChange('gradientDirection', preset.direction);
                  }}
                  className="glass-card p-2 text-left hover:bg-muted/50 transition-colors"
                >
                  <div 
                    className="h-6 rounded mb-1"
                    style={{
                      background: `linear-gradient(${preset.direction}, ${preset.start} 0%, ${preset.end} 100%)`
                    }}
                  />
                  <div className="text-xs font-medium">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Settings */}
      {backgroundSettings.type === 'image' && (
        <div className="space-y-3">
          <div className="glass-card p-3 space-y-3">
            <Label className="text-sm font-medium text-wedding-navy">Image Settings</Label>
            
            {/* Current Image */}
            {backgroundSettings.imageUrl && (
              <div className="space-y-2">
                <Label className="text-xs">Current Background</Label>
                <div className="relative h-24 rounded-lg overflow-hidden border">
                  <img 
                    src={backgroundSettings.imageUrl} 
                    alt="Background preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Upload New Image */}
            <div className="space-y-2">
              <Label className="text-xs">Upload New Image</Label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadBackgroundImage(file);
                  }}
                  className="flex-1 text-xs"
                  disabled={uploading}
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={uploading}
                  className="text-xs"
                >
                  {uploading ? (
                    <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Image URL Input */}
            <div className="space-y-2">
              <Label className="text-xs">Or Enter Image URL</Label>
              <Input
                type="url"
                value={backgroundSettings.imageUrl}
                onChange={(e) => handleSettingChange('imageUrl', e.target.value)}
                className="text-xs"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Save Actions */}
      <div className="flex gap-2">
        <Button
          onClick={saveBackgroundSettings}
          disabled={saving}
          className="flex-1 text-xs"
        >
          {saving ? (
            <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent mr-1" />
          ) : (
            <Save className="w-3 h-3 mr-1" />
          )}
          Save Background
        </Button>
        <Button
          onClick={() => {
            const defaultSettings: BackgroundSettings = {
              type: 'gradient',
              imageUrl: 'https://i.ibb.co/0VQTdZfF/Chat-GPT-Image-Jul-8-2025-01-32-20-AM.png',
              gradientStart: 'hsl(40, 33%, 96%)',
              gradientEnd: 'hsl(40, 20%, 92%)',
              gradientDirection: '135deg',
              opacity: 1.0,
            };
            setBackgroundSettings(defaultSettings);
            applyBackgroundPreview(defaultSettings);
          }}
          variant="outline"
          className="text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default BackgroundManager;